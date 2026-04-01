'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const contactSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  whatsapp: z.string().min(10),
  empresa: z.string().optional(),
  servico: z.string(),
  preferencia: z.string(),
  mensagem: z.string(),
  origem: z.string().optional(),
});

export async function submitContact(payload: unknown) {
  try {
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      return { success: false, error: 'Dados inválidos.' };
    }

    const { nome, email, whatsapp, empresa, servico, preferencia, mensagem, origem } = parsed.data;

    // 1. Criar o Lead
    const lead = await prisma.lead.create({
      data: {
        name: nome,
        email,
        whatsapp,
        company: empresa || null,
        service: servico,
        message: mensagem,
        preferredContact: preferencia,
        source: origem || 'Site Form',
        status: 'NEW',
      },
    });

    // 2. Tentar encontrar ou criar o Cliente
    // Deduplicação básica por email ou telefone
    const existingClient = await prisma.client.findFirst({
      where: {
        OR: [
          { email },
          { phone: whatsapp }
        ]
      }
    });

    if (!existingClient) {
      await prisma.client.create({
        data: {
          name: nome,
          email,
          phone: whatsapp,
          company: empresa || null,
          status: 'ACTIVE',
        }
      });
    } else {
      // Opcionalmente atualizar dados do cliente se estiverem vazios
      await prisma.client.update({
        where: { id: existingClient.id },
        data: {
          company: existingClient.company || empresa || null,
          // Não sobrescrever email/phone para evitar bagunça
        }
      });
    }

    // 3. Revalidar caches do admin
    revalidatePath('/admin/leads');
    revalidatePath('/admin/clientes');
    revalidatePath('/admin');

    return { success: true, data: lead };
  } catch (error) {
    console.error('Error submitting contact:', error);
    return { success: false, error: 'Falha ao processar contato.' };
  }
}
