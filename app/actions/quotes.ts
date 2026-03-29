'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getQuotes() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      include: { client: { select: { name: true } } },
    });
    return { success: true, data: quotes };
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return { success: false, error: 'Failed to fetch quotes' };
  }
}

export async function getQuoteById(id: string) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { client: true },
    });
    if (!quote) return { success: false, error: 'Quote not found' };
    return { success: true, data: quote };
  } catch (error) {
    console.error('Error fetching quote:', error);
    return { success: false, error: 'Failed to fetch quote' };
  }
}

export async function createQuote(data: any) {
  try {
    // Generate a unique quote number if not provided
    if (!data.number) {
      const count = await prisma.quote.count();
      data.number = `ORC-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    }

    const quote = await prisma.quote.create({
      data: {
        ...data,
      },
    });
    revalidatePath('/admin/orcamentos');
    return { success: true, data: quote };
  } catch (error) {
    console.error('Error creating quote:', error);
    return { success: false, error: 'Failed to create quote' };
  }
}

export async function updateQuote(id: string, data: any) {
  try {
    const quote = await prisma.quote.update({
      where: { id },
      data: {
        ...data,
      },
    });
    revalidatePath('/admin/orcamentos');
    revalidatePath(`/admin/orcamentos/${id}`);
    return { success: true, data: quote };
  } catch (error) {
    console.error('Error updating quote:', error);
    return { success: false, error: 'Failed to update quote' };
  }
}

export async function deleteQuote(id: string) {
  try {
    await prisma.quote.delete({
      where: { id },
    });
    revalidatePath('/admin/orcamentos');
    return { success: true };
  } catch (error) {
    console.error('Error deleting quote:', error);
    return { success: false, error: 'Failed to delete quote' };
  }
}
