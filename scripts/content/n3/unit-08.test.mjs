import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildUnit, moduleId } from './unit-08.mjs';
import { n3Checks } from './format.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N3-08 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N3', 8);
  await checkCurriculum(p, { ...n3Checks, code: 'N3-08', earlier, readingLength: [400, 700] });
  const quizText = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '単語を（　）ように',
    'Câu nào dùng ĐÚNG',
    '合格する（　）',
    '毎日漢字を',
    '大学院を受験する',
    '大阪の学校で働く',
    'do được chọn',
    '単語を十個覚える',
    '日本語だけを使う',
    'ことにしている và ことになっている',
    '図書館へ（　）ついでに',
  ])
    assert.ok(quizText.includes(target), `Quiz must assess ${target}`);
  assert.doesNotMatch(
    await readFile(new URL('../../../content/n3/n3-08.mjs', import.meta.url), 'utf8'),
    /…(ではなく|じゃなくて|いいえ|ではない)|。だから…/,
  );
  assert.ok(
    p.grammar_patterns.find(g => g.pattern === '～ように（目的）').explanation.includes('ために'),
    'ように must contrast with ために',
  );

  await checkInDatabase(p, { level: 'N3', moduleId, earlier });
});
