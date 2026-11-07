import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildUnit, moduleId } from './unit-10.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-10 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 10);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-10', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '大事な会議があるので',
    'có thể làm nhưng không nên',
    '健康診断なので',
    '無理をしない（　）',
    'ことだ và ほうがいい',
    'いらいらする（　）',
    '人の体のことを',
    '毎日外で（　）',
    'SAI ～たものだ',
    '痛く（　）',
    '無理に出勤する',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.doesNotMatch(
    await readFile(new URL('../../../content/n3/n3-10.mjs', import.meta.url), 'utf8'),
    /…(ではなく|じゃなくて|いいえ|ではない)|。だから…/,
  );
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～ことだ（忠告）').explanation.includes('ほうがいい'),
    'ことだ must contrast with ほうがいい',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
