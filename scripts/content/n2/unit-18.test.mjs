import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnit, moduleId } from './unit-18.mjs';
import { earlierLessons, checkCurriculum, checkInDatabase } from '../lib/unit-checks.mjs';

test('N2-18 curriculum, publication, assessment and learner isolation', { timeout: 180000 }, async () => {
  const p = await buildUnit();
  const earlier = await earlierLessons('N2', 18);
  await checkCurriculum(p, {
    level: 'N2',
    code: 'N2-18',
    earlier,
    vocabulary: 150,
    grammar: 7,
    readingLength: [900, 1500],
  });
  assert.equal(p.jlpt_levels, undefined, 'only N2-01 carries the level row');

  // The quiz assesses every grammar point and the contrasts this lesson teaches.
  const quiz = p.quiz_questions.map(q => q.question).join('\n');
  for (const target of [
    '日本の夏（',
    '「山田さん」（',
    '景色の美しさ（',
    '「といえば」と「といったら」',
    '私（　）、まだまだ初心者',
    '「ゲームなんて」と「りんごなど」',
    '仕事（　）引っ越し（',
    '「やら～やら」と「とか～とか」',
    '息子は帰ってきた（',
    'ベルが鳴る（',
    '公園で楽し（',
  ])
    assert.ok(quiz.includes(target), `Quiz must assess ${target}`);
  const explanation = pattern => p.grammar_patterns.find(g => g.pattern === pattern).explanation;
  assert.match(explanation('～というと／～といえば'), /について/, 'といえば must contrast with について');
  assert.match(explanation('～といったら'), /といえば/, 'といったら must contrast with といえば');
  assert.match(explanation('～など／～なんか／～なんて'), /など \(N4\)/, 'なんか must contrast with plain など');
  assert.match(explanation('～やら～やら'), /とか～とか/, 'やら～やら must contrast with とか～とか');
  assert.match(explanation('～かと思うと／～かと思ったら'), /たとたん/, 'かと思うと must contrast with たとたん');
  assert.match(explanation('～か～ないかのうちに'), /たとたん/, 'か～ないかのうちに must contrast with たとたん');
  assert.match(explanation('～げ'), /そう \(N4\)/, 'げ must contrast with そう');

  await checkInDatabase(p, { level: 'N2', moduleId, earlier });
});
