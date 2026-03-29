'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getClients() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: clients };
  } catch (error) {
    console.error('Error fetching clients:', error);
    return { success: false, error: 'Failed to fetch clients' };
  }
}

export async function getClientById(id: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        quotes: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!client) return { success: false, error: 'Client not found' };
    return { success: true, data: client };
  } catch (error) {
    console.error('Error fetching client:', error);
    return { success: false, error: 'Failed to fetch client' };
  }
}

export async function createClient(data: any) {
  try {
    const client = await prisma.client.create({
      data: {
        ...data,
      },
    });
    revalidatePath('/admin/clientes');
    return { success: true, data: client };
  } catch (error) {
    console.error('Error creating client:', error);
    return { success: false, error: 'Failed to create client' };
  }
}

export async function updateClient(id: string, data: any) {
  try {
    const client = await prisma.client.update({
      where: { id },
      data: {
        ...data,
      },
    });
    revalidatePath('/admin/clientes');
    revalidatePath(`/admin/clientes/${id}`);
    return { success: true, data: client };
  } catch (error) {
    console.error('Error updating client:', error);
    return { success: false, error: 'Failed to update client' };
  }
}

export async function deleteClient(id: string) {
  try {
    await prisma.client.delete({
      where: { id },
    });
    revalidatePath('/admin/clientes');
    return { success: true };
  } catch (error) {
    console.error('Error deleting client:', error);
    return { success: false, error: 'Failed to delete client' };
  }
}
