const assert = require('node:assert/strict');
const { hideN5SampleMocks } = require('./hide-n5-sample-mocks.cjs');

// Runs only with fixtures owned by publication-smoke.cjs in its isolated schema.
module.exports = async function checkN5SampleMocks(db, request, level, userId, token) {
  await db.user.update({ where: { id: userId }, data: { isActive: true, role: 'USER' } });
  const mocks = [];
  for (const [unitNumber, title] of [[13, 'JLPT N5 Mock Test 01'], [14, 'JLPT N5 Mock Test 02']]) {
    const module = await db.learningModule.create({ data: { levelId: level.id, unitNumber, title, titleJp: 'Test', description: 'Test', topics: [], sortOrder: unitNumber, contentStatus: 'PUBLISHED', publishedAt: new Date() } });
    for (let i = 0; i < 2; i++) await db.quizQuestion.create({ data: { moduleId: module.id, question: 'Test', options: ['A','B'], correctIndex: 0, explanation: 'Test' } });
    await db.userModuleProgress.create({ data: { userId, moduleId: module.id, status: 'COMPLETED', progressPercent: 100 } });
    await db.userQuizAttempt.create({ data: { userId, moduleId: module.id, score: 2, totalQuestions: 2, answers: [] } });
    mocks.push(module);
  }
  const otherLevel = await db.jlptLevel.create({ data: { level: 'N4', title: 'Test', titleJp: 'Test', description: 'Test', color: '#000', badge: 'Test', totalVocab: 0, totalKanji: 0, totalGrammar: 0, sortOrder: 2 } });
  const other = await db.learningModule.create({ data: { levelId: otherLevel.id, unitNumber: 13, title: 'JLPT N5 Mock Test 01', titleJp: 'Test', description: 'Test', topics: [], sortOrder: 13, contentStatus: 'PUBLISHED' } });
  const before = await db.learningModule.findMany({ orderBy: { id: 'asc' } });
  assert.deepEqual((await hideN5SampleMocks(db)).candidateIds, mocks.map(m => m.id));
  assert.deepEqual(await db.learningModule.findMany({ orderBy: { id: 'asc' } }), before);
  const extra = await db.quizQuestion.create({ data: { moduleId: mocks[1].id, question: 'Replacement content', options: ['A','B'], correctIndex: 0, explanation: 'Test' } });
  await assert.rejects(hideN5SampleMocks(db, true), /no longer matches/);
  assert.deepEqual(await db.learningModule.findMany({ orderBy: { id: 'asc' } }), before);
  await db.quizQuestion.delete({ where: { id: extra.id } });
  assert.deepEqual((await hideN5SampleMocks(db, true)).changedIds, mocks.map(m => m.id));
  const after = await db.learningModule.findMany({ orderBy: { id: 'asc' } });
  assert.deepEqual(after.filter(m => !mocks.some(mock => mock.id === m.id)), before.filter(m => !mocks.some(mock => mock.id === m.id)));
  assert.deepEqual((await hideN5SampleMocks(db, true)).changedIds, []);
  assert.deepEqual(await db.learningModule.findMany({ orderBy: { id: 'asc' } }), after);
  assert.equal(await db.quizQuestion.count({ where: { moduleId: { in: mocks.map(m => m.id) } } }), 4);
  assert.equal(await db.userQuizAttempt.count({ where: { moduleId: { in: mocks.map(m => m.id) } } }), 2);
  assert.equal(await db.userModuleProgress.count({ where: { moduleId: { in: mocks.map(m => m.id) } } }), 2);
  for (const auth of [{}, { token }]) {
    const list = (await request('/modules', auth)).body.data;
    assert.ok(list.some(m => m.id === other.id));
    for (const mock of mocks) {
      assert.ok(!list.some(m => m.id === mock.id));
      assert.equal((await request(`/modules/${mock.id}/full`, auth)).status, 404);
      assert.deepEqual((await request(`/quizzes/module/${mock.id}`, auth)).body.data, []);
    }
    assert.equal((await request('/levels/N5', auth)).body.data.modules.length, 1);
  }
  const stats = (await request('/progress/me', { token })).body.data;
  assert.equal(stats.levelStats.find(s => s.level === 'N5').total_modules, 1);
  assert.equal(stats.allModuleProgress.length, 1);
  const question = await db.quizQuestion.findFirst({ where: { moduleId: mocks[0].id } });
  assert.equal((await request('/quizzes/submit', { token, body: { requestId: require("node:crypto").randomUUID(), moduleId: mocks[0].id, answers: [{ questionId: question.id, selectedIndex: 0 }] } })).status, 404);
  await db.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });
  const preview = await request(`/modules/${mocks[0].id}/full?preview=true`, { token });
  assert.equal(preview.status, 200); assert.equal(preview.body.data.quizQuestions.length, 2);
  console.log('PASS: N5 sample mocks dry-run, content-change guard, targeted withdrawal, idempotence, preserved history, public access and admin preview');
};
