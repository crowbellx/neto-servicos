'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function trackWhatsAppClick(message: string, source: string = 'Floating Button') {
  try {
    // Como no clique do botão não temos nome/email, criamos um lead "anônimo"
    // para que o admin possa ver o interesse e depois atualizar.
    const lead = await prisma.lead.create({
      data: {
        name: 'Interesse via WhatsApp',
        email: 'whatsapp@visita.site',
        whatsapp: 'Não informado',
        service: 'WhatsApp',
        message: `Clique no WhatsApp: "${message}"`,
        preferredContact: 'whatsapp',
        source: source,
        status: 'NEW',
      },
    });

    revalidatePath('/admin/leads');
    revalidatePath('/admin');
    
    return { success: true, id: lead.id };
  } catch (error) {
    console.error('Error tracking WhatsApp click:', error);
    return { success: false };
  }
}
