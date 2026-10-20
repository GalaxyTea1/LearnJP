import { publishedItem } from './publication';
import { prisma } from '../config/prisma';

export class GrammarService {
  async getGrammar(params: {
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
        { pattern: { contains: params.search, mode: 'insensitive' } },
        { meaning: { contains: params.search, mode: 'insensitive' } },
        { explanation: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.grammarPattern.count({ where }),
      prisma.grammarPattern.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        include: {
          examples: { orderBy: { sortOrder: 'asc' } },
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

  async getGrammarById(id: number, preview = false) {
    const grammar = await prisma.grammarPattern.findFirst({
      where: { id, ...(!preview ? publishedItem : {}) },
      include: {
        examples: { orderBy: { sortOrder: 'asc' } },
        module: true,
      },
    });
    if (!grammar) {
      const error: any = new Error(`Grammar Pattern #${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    return grammar;
  }

  async createGrammar(data: any) {
    const { examples, ...patternData } = data;
    return prisma.grammarPattern.create({
      data: {
        ...patternData,
        examples: examples
          ? {
              create: examples,
            }
          : undefined,
      },
      include: { examples: true },
    });
  }

  async updateGrammar(id: number, data: any) {
    const { examples, ...patternData } = data;
    if (examples) {
      await prisma.grammarExample.deleteMany({ where: { grammarPatternId: id } });
    }
    return prisma.grammarPattern.update({
      where: { id },
      data: {
        ...patternData,
        examples: examples ? { create: examples } : undefined,
      },
      include: { examples: true },
    });
  }

  async deleteGrammar(id: number) {
    return prisma.grammarPattern.delete({ where: { id } });
  }
}

export const grammarService = new GrammarService();
