import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-01.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-01 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 1);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-01', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '明るい（　）',
    'ケーキを（　）',
    '買い物に便利',
    '少し家賃が',
    '日曜日（　）',
    'もしかしたら',
    '指定した',
    'hợp với はずだ',
    '届く（　）',
    'もっと早く',
    '買ってしまった',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～はずだ').explanation.includes('かもしれない'),
    'はずだ must contrast with かもしれない',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
