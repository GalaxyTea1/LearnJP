import { publishedItem } from './publication';
import { prisma } from '../config/prisma';
import { VocabType } from '@prisma/client';

export class VocabularyService {
  async getVocabulary(params: {
    page?: number;
    limit?: number;
    search?: string;
    moduleId?: number;
    level?: string;
    type?: VocabType;
  }, preview = false) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = preview ? {} : { ...publishedItem };
    if (params.moduleId) where.moduleId = params.moduleId;
    if (params.level) where.level = params.level;
    if (params.type) where.type = params.type;
    if (params.search) {
      where.OR = [
        { japanese: { contains: params.search, mode: 'insensitive' } },
        { hiragana: { contains: params.search, mode: 'insensitive' } },
        { romaji: { contains: params.search, mode: 'insensitive' } },
        { english: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.vocabulary.count({ where }),
      prisma.vocabulary.findMany({
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

  async getVocabularyById(id: number, preview = false) {
    const vocab = await prisma.vocabulary.findFirst({
      where: { id, ...(!preview ? publishedItem : {}) },
      include: { module: true },
    });
    if (!vocab) {
      const error: any = new Error(`Vocabulary #${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    return vocab;
  }

  async createVocabulary(data: any) {
    return prisma.vocabulary.create({ data });
  }

  async updateVocabulary(id: number, data: any) {
    return prisma.vocabulary.update({ where: { id }, data });
  }

  async deleteVocabulary(id: number) {
    return prisma.vocabulary.delete({ where: { id } });
  }

  async bulkCreateVocabulary(items: any[]) {
    return prisma.vocabulary.createMany({ data: items, skipDuplicates: true });
  }
}

export const vocabularyService = new VocabularyService();
