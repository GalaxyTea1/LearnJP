import { z } from 'zod';
import { prisma } from '../config/prisma';
import { publishedModule } from './publication';

const tabs = ['vocab', 'kanji', 'grammar', 'dialogue', 'exercise'] as const;
const params = z.object({ moduleId: z.coerce.number().int().positive() });
export const readStudySchema = z.object({ params });
export const studyPatch = z.object({
  completedTabs: z.array(z.enum(tabs)).max(5).default([]),
  vocabulary: z.array(z.object({ id: z.number().int().positive(), mastered: z.boolean() }).strict()).max(1000).default([]),
}).strict();
export const writeStudySchema = z.object({ params, body: studyPatch });

export async function readStudyProgress(userId: number, moduleId: number) {
  const module = await prisma.learningModule.findFirst({ where: { id: moduleId, ...publishedModule }, select: { vocabulary: { select: { id: true } } } });
  if (!module) throw Object.assign(new Error('Module not found'), { statusCode: 404 });
  const progress = await prisma.userModuleProgress.findUnique({ where: { userId_moduleId: { userId, moduleId } } });
  const valid = new Set(module.vocabulary.map(v => v.id));
  return { completedTabs: (progress?.completedTabs || []).filter(t => tabs.includes(t as typeof tabs[number])),
    masteredVocabularyIds: (progress?.masteredVocabularyIds || []).filter(id => valid.has(id)),
    quizCompleted: progress?.status === 'COMPLETED' };
}

export async function writeStudyProgress(userId: number, moduleId: number, patch: z.infer<typeof studyPatch>) {
  return prisma.$transaction(async tx => {
    // Serialize patches for the same learner/module so different devices merge
    // completed tabs and update individual words without replacing other work.
    await tx.$queryRaw`SELECT 1 FROM (SELECT pg_advisory_xact_lock(${userId}::int, ${moduleId}::int)) AS lock`;
    const module = await tx.learningModule.findFirst({ where: { id: moduleId, ...publishedModule }, select: { vocabulary: { select: { id: true } } } });
    if (!module) throw Object.assign(new Error('Module not found'), { statusCode: 404 });
    const valid = new Set(module.vocabulary.map(v => v.id));
    if (patch.vocabulary.some(v => !valid.has(v.id))) throw Object.assign(new Error('Vocabulary does not belong to this module'), { statusCode: 400 });
    const previous = await tx.userModuleProgress.upsert({ where: { userId_moduleId: { userId, moduleId } },
      create: { userId, moduleId, status: 'IN_PROGRESS', startedAt: new Date() }, update: {} });
    const completed = new Set(previous.completedTabs.filter(t => tabs.includes(t as typeof tabs[number])));
    for (const tab of patch.completedTabs) completed.add(tab);
    const mastered = new Set(previous.masteredVocabularyIds.filter(id => valid.has(id)));
    for (const word of patch.vocabulary) word.mastered ? mastered.add(word.id) : mastered.delete(word.id);
    if (valid.size && mastered.size === valid.size) completed.add('vocab');
    const updated = await tx.userModuleProgress.update({ where: { id: previous.id }, data: {
      completedTabs: [...completed], masteredVocabularyIds: [...mastered],
    } });
    // Conditional update prevents a concurrent passed quiz from being downgraded.
    await tx.userModuleProgress.updateMany({ where: { id: previous.id, status: { not: 'COMPLETED' }, progressPercent: { lt: Math.round(completed.size / 6 * 100) } },
      data: { status: 'IN_PROGRESS', progressPercent: Math.round(completed.size / 6 * 100) } });
    return { completedTabs: updated.completedTabs, masteredVocabularyIds: updated.masteredVocabularyIds, quizCompleted: updated.status === 'COMPLETED' };
  });
}
