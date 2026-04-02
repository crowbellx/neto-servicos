'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { normalizeLeadStatus } from '@/lib/admin/leads';
import { z } from 'zod';

export async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      where: { deletedAt: null },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
    return { success: true, data: leads };
  } catch (error) {
    console.error('Error fetching leads:', error);
    return { success: false, error: 'Failed to fetch leads' };
  }
}

export async function getLeadById(id: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id, deletedAt: null },
      include: {
        notes: { orderBy: { createdAt: 'desc' } },
        interactions: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!lead) return { success: false, error: 'Lead not found' };
    return { success: true, data: lead };
  } catch (error) {
    console.error('Error fetching lead:', error);
    return { success: false, error: 'Failed to fetch lead' };
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const normalizedStatus = normalizeLeadStatus(status);
    const lead = await prisma.lead.update({
      where: { id },
      data: { status: normalizedStatus },
    });

    await prisma.interaction.create({
      data: {
        leadId: id,
        type: 'STATUS_CHANGE',
        details: `Status alterado para ${normalizedStatus}`,
      },
    });

    if (normalizedStatus === 'CLOSED') {
      const existingClient = await prisma.client.findUnique({ where: { leadId: id } });
      if (!existingClient) {
         await prisma.client.create({
           data: {
             name: lead.name,
             email: lead.email,
             phone: lead.whatsapp,
             company: lead.company,
             leadId: lead.id
           }
         });
         revalidatePath('/admin/clientes');
      }
    }

    revalidatePath('/admin/leads');
    revalidatePath(`/admin/leads/${id}`);
    return { success: true, data: lead };
  } catch (error) {
    console.error('Error updating lead status:', error);
    return { success: false, error: 'Failed to update lead status' };
  }
}

export async function addLeadNote(leadId: string, text: string) {
  try {
    const note = await prisma.note.create({
      data: {
        text,
        leadId,
      },
    });
    await prisma.interaction.create({
      data: {
        leadId,
        type: 'NOTE',
        details: text,
      },
    });
    revalidatePath('/admin/leads');
    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true, data: note };
  } catch (error) {
    console.error('Error adding note:', error);
    return { success: false, error: 'Failed to add note' };
  }
}

export async function deleteLead(id: string) {
  try {
    // Delete associated notes and interactions first (foreign key constraints)
    await prisma.note.deleteMany({ where: { leadId: id } });
    await prisma.interaction.deleteMany({ where: { leadId: id } });

    // Delete generated client if exists
    await prisma.client.deleteMany({ where: { leadId: id } });

    // Hard delete the lead
    await prisma.lead.delete({
      where: { id },
    });

    revalidatePath('/admin/leads');
    revalidatePath('/admin/clientes');
    return { success: true };
  } catch (error) {
    console.error('Error deleting lead:', error);
    return { success: false, error: 'Failed to delete lead' };
  }
}

const createLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().min(8),
  service: z.string().min(2),
  message: z.string().min(2),
  preferredContact: z.string().min(2),
  company: z.string().optional(),
  source: z.string().optional(),
});

export async function createManualLead(payload: unknown) {
  try {
    const parsed = createLeadSchema.safeParse(payload);
    if (!parsed.success) {
      return { success: false, error: 'Dados inválidos para criar lead' };
    }

    const lead = await prisma.lead.create({
      data: {
        ...parsed.data,
        company: parsed.data.company || null,
        source: parsed.data.source || 'Admin',
        status: 'NEW',
      },
    });

    revalidatePath('/admin/leads');
    revalidatePath('/admin');
    return { success: true, data: lead };
  } catch (error) {
    console.error('Error creating manual lead:', error);
    return { success: false, error: 'Falha ao criar lead manualmente' };
  }
}

export async function bulkUpdateLeadStatus(leadIds: string[], status: string) {
  try {
    if (!leadIds.length) return { success: true };
    const normalizedStatus = normalizeLeadStatus(status);

    await prisma.lead.updateMany({
      where: { id: { in: leadIds }, deletedAt: null },
      data: { status: normalizedStatus },
    });

    revalidatePath('/admin/leads');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error bulk updating leads:', error);
    return { success: false, error: 'Falha ao atualizar leads em lote' };
  }
}

export async function bulkArchiveLeads(leadIds: string[]) {
  try {
    if (!leadIds.length) return { success: true };

    // Delete all dependencies in cascade order
    await prisma.note.deleteMany({ where: { leadId: { in: leadIds } } });
    await prisma.interaction.deleteMany({ where: { leadId: { in: leadIds } } });

    // Delete any clients auto-generated from these leads
    await prisma.client.deleteMany({ where: { leadId: { in: leadIds } } });

    // Hard delete the leads themselves
    await prisma.lead.deleteMany({ where: { id: { in: leadIds } } });

    revalidatePath('/admin/leads');
    revalidatePath('/admin/clientes');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error bulk archiving leads:', error);
    return { success: false, error: 'Falha ao excluir leads em lote' };
  }
}

/**
 * Retorna quantos leads LOST seriam excluídos permanentemente
 * com base na configuração de retenção atual (dry-run / pré-visualização).
 */
export async function getLeadsCleanupPreview() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: 'lead_cleanup' } });
    const config = setting?.data ? JSON.parse(setting.data) : {};
    const retentionDays: number = Number(config.retentionDays ?? 30);
    const enabled: boolean = config.enabled ?? false;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const count = await prisma.lead.count({
      where: {
        status: 'LOST',
        updatedAt: { lt: cutoffDate },
      },
    });

    return { success: true, data: { count, retentionDays, enabled, cutoffDate } };
  } catch (error) {
    console.error('Error previewing leads cleanup:', error);
    return { success: false, error: 'Falha ao pré-visualizar limpeza de leads' };
  }
}

/**
 * Exclui permanentemente (hard delete) leads com status LOST
 * cujo updatedAt seja mais antigo que o período de retenção configurado.
 * Também exclui Notes e Interactions relacionadas via cascata.
 */
export async function purgeOldLeads() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: 'lead_cleanup' } });
    const config = setting?.data ? JSON.parse(setting.data) : {};
    const retentionDays: number = Number(config.retentionDays ?? 30);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Busca IDs dos leads elegíveis
    const eligibleLeads = await prisma.lead.findMany({
      where: {
        status: 'LOST',
        updatedAt: { lt: cutoffDate },
      },
      select: { id: true },
    });

    if (eligibleLeads.length === 0) {
      return { success: true, data: { deleted: 0 } };
    }

    const ids = eligibleLeads.map((l) => l.id);

    // Remove dependências primeiro (Notes e Interactions)
    await prisma.note.deleteMany({ where: { leadId: { in: ids } } });
    await prisma.interaction.deleteMany({ where: { leadId: { in: ids } } });

    // Hard delete dos leads
    const { count } = await prisma.lead.deleteMany({ where: { id: { in: ids } } });

    // Salva timestamp da última limpeza
    await prisma.setting.upsert({
      where: { key: 'lead_cleanup' },
      update: { data: JSON.stringify({ ...config, lastPurgeAt: new Date().toISOString(), lastPurgeCount: count }) },
      create: { key: 'lead_cleanup', data: JSON.stringify({ retentionDays, enabled: config.enabled ?? false, lastPurgeAt: new Date().toISOString(), lastPurgeCount: count }) },
    });

    revalidatePath('/admin/leads');
    revalidatePath('/admin');
    revalidatePath('/admin/configuracoes/geral');
    return { success: true, data: { deleted: count } };
  } catch (error) {
    console.error('Error purging old leads:', error);
    return { success: false, error: 'Falha ao excluir leads permanentemente' };
  }
}

/**
 * Atualiza a configuração de retenção de leads.
 */
export async function updateLeadCleanupSettings(retentionDays: number, enabled: boolean) {
  try {
    const existing = await prisma.setting.findUnique({ where: { key: 'lead_cleanup' } });
    const prev = existing?.data ? JSON.parse(existing.data) : {};

    await prisma.setting.upsert({
      where: { key: 'lead_cleanup' },
      update: { data: JSON.stringify({ ...prev, retentionDays, enabled }) },
      create: { key: 'lead_cleanup', data: JSON.stringify({ retentionDays, enabled }) },
    });

    revalidatePath('/admin/configuracoes/geral');
    return { success: true };
  } catch (error) {
    console.error('Error updating lead cleanup settings:', error);
    return { success: false, error: 'Falha ao salvar configuração de limpeza' };
  }
}
