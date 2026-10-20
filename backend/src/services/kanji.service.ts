import { publishedItem } from './publication';
import { prisma } from '../config/prisma';

export class KanjiService {
  async getKanji(params: {
    page?: number;
    limit?: number;
    search?: string;
    moduleId?: number;
    level?: string;
  }, preview = false) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = preview ? {} : { ...publishedItem };
    if (params.moduleId) where.moduleId = params.moduleId;
    if (params.level) where.level = params.level;
    if (params.search) {
      where.OR = [
        { character: { contains: params.search } },
        { meaning: { contains: params.search, mode: 'insensitive' } },
        { onyomi: { contains: params.search } },
        { kunyomi: { contains: params.search } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.kanji.count({ where }),
      prisma.kanji.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        include: {
          module: { select: { id: true, title: true, unitNumber: true } },
        },
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getKanjiById(id: number, preview = false) {
    const kanji = await prisma.kanji.findFirst({
      where: { id, ...(!preview ? publishedItem : {}) },
      include: { module: true },
    });
    if (!kanji) {
      const error: any = new Error(`Kanji #${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    return kanji;
  }

  async getKanjiByChar(character: string, preview = false) {
    const kanji = await prisma.kanji.findFirst({
      where: { character, ...(!preview ? publishedItem : {}) },
      include: { module: true },
    });
    if (!kanji) {
      const error: any = new Error(`Kanji '${character}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return kanji;
  }

  async createKanji(data: any) {
    return prisma.kanji.create({ data });
  }

  async updateKanji(id: number, data: any) {
    return prisma.kanji.update({ where: { id }, data });
  }

  async deleteKanji(id: number) {
    return prisma.kanji.delete({ where: { id } });
  }
}

export const kanjiService = new KanjiService();
