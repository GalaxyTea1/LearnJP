// Audit item 9: withdraw only the two known, incomplete N5 sample exams.
// Dry run by default. No content, attempts or learner progress is deleted.
const targets = [
  { unitNumber: 13, title: 'JLPT N5 Mock Test 01' },
  { unitNumber: 14, title: 'JLPT N5 Mock Test 02' },
];

async function hideN5SampleMocks(db, apply = false) {
  return db.$transaction(async tx => {
    const rows = await tx.learningModule.findMany({
      where: { level: { level: 'N5' }, OR: targets },
      select: { id: true, unitNumber: true, title: true, contentStatus: true, version: true, publishedAt: true,
        _count: { select: { quizQuestions: true, vocabulary: true, kanji: true, grammarPatterns: true } } },
      orderBy: { unitNumber: 'asc' },
    });
    // Fail closed if content has evolved: never withdraw a completed replacement.
    for (const row of rows.filter(row => row.contentStatus === 'PUBLISHED')) {
      if (row._count.quizQuestions > 2 || row._count.vocabulary || row._count.kanji || row._count.grammarPatterns) {
        throw new Error(`Module ${row.id} no longer matches the incomplete sample; review before withdrawing`);
      }
    }
    const candidates = rows.filter(row => row.contentStatus === 'PUBLISHED');
    if (apply) {
      for (const row of candidates) {
        const result = await tx.learningModule.updateMany({
          where: { id: row.id, version: row.version, contentStatus: 'PUBLISHED' },
          data: { contentStatus: 'DRAFT', publishedAt: null, version: { increment: 1 } },
        });
        if (result.count !== 1) throw new Error(`Module ${row.id} changed concurrently; no changes committed`);
      }
    }
    return { mode: apply ? 'apply' : 'dry-run', matched: rows, changedIds: apply ? candidates.map(row => row.id) : [],
      candidateIds: candidates.map(row => row.id) };
  }, { isolationLevel: 'Serializable' });
}

module.exports = { hideN5SampleMocks };
if (require.main === module) {
  require('dotenv').config({ quiet: true });
  const { PrismaClient } = require('@prisma/client');
  const db = new PrismaClient();
  hideN5SampleMocks(db, process.argv.includes('--apply'))
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(error => { console.error(error.message); process.exitCode = 1; })
    .finally(() => db.$disconnect());
}
