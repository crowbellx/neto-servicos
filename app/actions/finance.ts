'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getTransactions(params?: { type?: 'INCOME' | 'EXPENSE', limit?: number }) {
  try {
    const whereClause = params?.type ? { type: params.type } : {};
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: params?.limit || 50,
      include: {
        quote: {
          select: { number: true, clientName: true }
        }
      }
    });

    return { success: true, data: transactions };
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return { success: false, error: 'Failed to fetch tracking data' };
  }
}

export async function getFinanceSummary() {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const txs = await prisma.transaction.findMany({
      where: {
        date: { gte: startOfMonth }
      }
    });

    const income = txs.filter((t: any) => t.type === 'INCOME').reduce((acc: number, t: any) => acc + t.amount, 0);
    const expense = txs.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, t: any) => acc + t.amount, 0);
    
    return { 
      success: true, 
      data: {
        income,
        expense,
        balance: income - expense
      }
    };
  } catch (error) {
    console.error('Error calculating summary:', error);
    return { success: false, error: 'Failed' };
  }
}

export async function createTransaction(data: any) {
  try {
    const tx = await prisma.transaction.create({
      data: {
        ...data,
      }
    });
    revalidatePath('/admin/financeiro');
    return { success: true, data: tx };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { success: false, error: 'Failed to create transaction' };
  }
}

export async function deleteTransaction(id: string) {
  try {
    await prisma.transaction.delete({ where: { id } });
    revalidatePath('/admin/financeiro');
    return { success: true };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { success: false, error: 'Failed to delete transaction' };
  }
}
