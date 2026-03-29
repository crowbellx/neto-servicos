'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
    return { success: true, data: services };
  } catch (error) {
    console.error('Error fetching services:', error);
    return { success: false, error: 'Failed to fetch services' };
  }
}

export async function getServiceById(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    if (!service) return { success: false, error: 'Service not found' };
    return { success: true, data: service };
  } catch (error) {
    console.error('Error fetching service:', error);
    return { success: false, error: 'Failed to fetch service' };
  }
}

export async function createService(data: any) {
  try {
    const service = await prisma.service.create({
      data: {
        ...data,
      },
    });
    revalidatePath('/admin/servicos');
    return { success: true, data: service };
  } catch (error) {
    console.error('Error creating service:', error);
    return { success: false, error: 'Failed to create service' };
  }
}

export async function updateService(id: string, data: any) {
  try {
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...data,
      },
    });
    revalidatePath('/admin/servicos');
    revalidatePath(`/admin/servicos/${id}`);
    return { success: true, data: service };
  } catch (error) {
    console.error('Error updating service:', error);
    return { success: false, error: 'Failed to update service' };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({
      where: { id },
    });
    revalidatePath('/admin/servicos');
    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: 'Failed to delete service' };
  }
}
