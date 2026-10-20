import { Prisma } from '@prisma/client';
import type { Request } from 'express';
import { prisma } from '../config/prisma';

export const publishedModule = { contentStatus: 'PUBLISHED' as const };
// Vocabulary/kanji/grammar have no individual publication flag. They inherit
// their module's status; unassigned records stay private until assigned.
export const publishedItem = { module: { is: publishedModule } };
export const publishedExercise: Prisma.LessonExerciseWhereInput = {
  status: 'PUBLISHED',
  section: { status: 'PUBLISHED', module: publishedModule },
  AND: [
    { OR: [{ readingPassageId: null }, { readingPassage: { is: { status: 'PUBLISHED', section: { status: 'PUBLISHED', module: publishedModule } } } }] },
    { OR: [{ listeningId: null }, { listening: { is: { status: 'PUBLISHED', section: { status: 'PUBLISHED', module: publishedModule } } } }] },
  ],
};

export function contentPreview(req: Request): boolean {
  if (req.query.preview !== 'true') return false;
  if (!req.user || !['ADMIN', 'MODERATOR'].includes(req.user.role)) {
    throw Object.assign(new Error('Content preview requires administrator access'), { statusCode: 403 });
  }
  return true;
}

export async function requirePublishedModule(id: number) {
  const found = await prisma.learningModule.findFirst({ where: { id, ...publishedModule }, select: { id: true } });
  if (!found) throw Object.assign(new Error('Learning module not found'), { statusCode: 404 });
}
