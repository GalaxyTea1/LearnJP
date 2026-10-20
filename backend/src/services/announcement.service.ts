import { prisma } from '../config/prisma';
import { AnnouncementType } from '@prisma/client';

export class AnnouncementService {
  async getActiveAnnouncements() {
    const now = new Date();
    return prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, username: true, displayName: true } },
      },
    });
  }

  async getAllAnnouncements() {
    return prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, username: true, displayName: true } },
      },
    });
  }

  async createAnnouncement(data: {
    title: string;
    content: string;
    type?: AnnouncementType;
    isActive?: boolean;
    expiresAt?: string | Date;
    createdBy?: number;
  }) {
    return prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type || AnnouncementType.INFO,
        isActive: data.isActive !== undefined ? data.isActive : true,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        createdBy: data.createdBy || null,
      },
    });
  }

  async updateAnnouncement(id: number, data: any) {
    if (data.expiresAt) data.expiresAt = new Date(data.expiresAt);
    return prisma.announcement.update({
      where: { id },
      data,
    });
  }

  async deleteAnnouncement(id: number) {
    return prisma.announcement.delete({ where: { id } });
  }
}

export const announcementService = new AnnouncementService();
