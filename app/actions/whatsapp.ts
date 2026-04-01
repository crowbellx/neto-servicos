'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function trackWhatsAppClick(message: string, source: string = 'Floating Button', phone?: string) {
  try {
    const lead = await prisma.lead.create({
      data: {
        name: phone ? `Lead WhatsApp (${phone})` : 'Interesse via WhatsApp',
        email: 'whatsapp@visita.site',
        whatsapp: phone || 'Não informado',
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
