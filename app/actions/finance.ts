'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getTransactions(params?: { type?: 'INCOME' | 'EXPENSE', limit?: number, month?: number, year?: number }) {
  try {
    const whereClause: any = {};
    if (params?.type) whereClause.type = params.type;
    if (params?.month && params?.year) {
       const start = new Date(params.year, params.month - 1, 1);
       const end = new Date(params.year, params.month, 0, 23, 59, 59);
       whereClause.date = { gte: start, lte: end };
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: params?.limit || 100,
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

export async function getFinanceSummary(month?: number, year?: number) {
  try {
    const startOfMonth = new Date();
    const endOfMonth = new Date();
    
    if (month && year) {
       startOfMonth.setFullYear(year, month - 1, 1);
       startOfMonth.setHours(0, 0, 0, 0);
       
       endOfMonth.setFullYear(year, month, 0);
       endOfMonth.setHours(23, 59, 59, 999);
    } else {
       startOfMonth.setDate(1);
       startOfMonth.setHours(0, 0, 0, 0);
    }

    const txs = await prisma.transaction.findMany({
      where: {
        date: { gte: startOfMonth, lte: endOfMonth }
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

export async function updateTransactionStatus(id: string, status: string) {
  try {
    const tx = await prisma.transaction.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/admin/financeiro');
    return { success: true, data: tx };
  } catch (error) {
    console.error('Error updating status:', error);
    return { success: false, error: 'Failed to update transaction' };
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
