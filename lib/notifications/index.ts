import { prisma } from '@/lib/prisma';

/**
 * 🔔 CTO Architecture: Standardized Notification System
 * Unified utility to create in-app notifications for users.
 */

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

/**
 * Creates an in-app notification for a specific user or all admins.
 * 
 * @param userId - ID of the user to receive the notification.
 * @param title - Brief title of the notification.
 * @param message - Detailed message content.
 * @param type - Severity level (INFO, SUCCESS, WARNING, ERROR).
 * @param link - Optional link for the user to take action.
 */
export async function createNotification({
  userId,
  title,
  message,
  type = 'INFO',
  link,
}: {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    });
  } catch (error) {
    console.error('[Notification System] Failed to create notification:', error);
    return null;
  }
}

/**
 * Utility to notify all users with ADMIN or SUPER_ADMIN roles.
 */
export async function notifyAdmins({
  title,
  message,
  type = 'INFO',
  link,
}: {
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}) {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] },
        active: true,
      },
      select: { id: true },
    });

    if (admins.length === 0) return [];

    const notifications = await Promise.all(
      admins.map((admin) =>
        prisma.notification.create({
          data: {
            userId: admin.id,
            title,
            message,
            type,
            link,
          },
        })
      )
    );

    return notifications;
  } catch (error) {
    console.error('[Notification System] Failed to notify admins:', error);
    return [];
  }
}

/**
 * Marks a notification as read.
 */
export async function markAsRead(notificationId: string) {
  try {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  } catch (error) {
    console.error('[Notification System] Failed to mark as read:', error);
    return null;
  }
}
