const assert = require('node:assert/strict');
module.exports = async function checkStudyProgress(db, request, module, userId, token, vocabId) {
  const path = `/progress/module/${module.id}/study`;
  await db.userModuleProgress.update({ where: { userId_moduleId: { userId, moduleId: module.id } }, data: { status: 'IN_PROGRESS', progressPercent: 0 } });
  assert.equal((await request(path)).status, 401);
  assert.equal((await request(path, { token, method: 'PATCH', body: { completedTabs: ['quiz'] } })).status, 400);
  assert.equal((await request(path, { token, method: 'PATCH', body: { quizCompleted: true } })).status, 400);
  const foreign = await db.vocabulary.findFirst({ where: { moduleId: { not: module.id } } });
  assert.equal((await request(path, { token, method: 'PATCH', body: { vocabulary: [{ id: foreign.id, mastered: true }] } })).status, 400);
  const otherWord = await db.vocabulary.create({ data: { moduleId: module.id, japanese: 'Second', romaji: 'second', english: 'second', type: 'NOUN' } });
  const replies = await Promise.all([
    request(path, { token, method: 'PATCH', body: { completedTabs: ['grammar'], vocabulary: [{ id: vocabId, mastered: true }] } }),
    request(path, { token, method: 'PATCH', body: { completedTabs: ['kanji'], vocabulary: [{ id: otherWord.id, mastered: true }] } }),
  ]);
  replies.forEach(r => assert.equal(r.status, 200));
  const restored = (await request(path, { token })).body.data;
  assert.deepEqual(new Set(restored.completedTabs), new Set(['grammar','kanji','vocab']));
  assert.deepEqual(new Set(restored.masteredVocabularyIds), new Set([vocabId, otherWord.id]));
  assert.equal(restored.quizCompleted, false);
  const repeated = await request(path, { token, method: 'PATCH', body: { completedTabs: ['grammar'], vocabulary: [{ id: vocabId, mastered: true }] } });
  assert.equal(repeated.body.data.completedTabs.length, 3);
  const removed = await request(path, { token, method: 'PATCH', body: { vocabulary: [{ id: vocabId, mastered: false }] } });
  assert.deepEqual(removed.body.data.masteredVocabularyIds, [otherWord.id]);
  await db.userModuleProgress.update({ where: { userId_moduleId: { userId, moduleId: module.id } }, data: { status: 'COMPLETED', progressPercent: 100 } });
  const completed = await request(path, { token, method: 'PATCH', body: { completedTabs: ['dialogue'] } });
  assert.equal(completed.body.data.quizCompleted, true);
  assert.equal((await db.userModuleProgress.findUnique({ where: { userId_moduleId: { userId, moduleId: module.id } } })).progressPercent, 100);
  const second = await request('/auth/register', { body: { email: 'second-study@example.test', username: 'study_second', password: 'test-password-123' } });
  assert.equal(second.status, 201);
  assert.deepEqual((await request(path, { token: second.body.data.accessToken })).body.data, { completedTabs: [], masteredVocabularyIds: [], quizCompleted: false });
  const hidden = await db.learningModule.findFirst({ where: { contentStatus: 'DRAFT' } });
  assert.equal((await request(`/progress/module/${hidden.id}/study`, { token })).status, 404);
  assert.equal((await request(`/progress/module/${hidden.id}/study`, { token, method: 'PATCH', body: { completedTabs: ['kanji'] } })).status, 404);
  console.log('PASS: study details persist across requests, parallel merge, word unmark, idempotence, user isolation, validation, draft protection and quiz completion preserved');
};
