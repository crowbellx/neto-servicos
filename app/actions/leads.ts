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
    await prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath('/admin/leads');
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

    await prisma.lead.updateMany({
      where: { id: { in: leadIds }, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/admin/leads');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error bulk archiving leads:', error);
    return { success: false, error: 'Falha ao arquivar leads em lote' };
  }
}
