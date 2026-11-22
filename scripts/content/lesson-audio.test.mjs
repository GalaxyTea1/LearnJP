import test from 'node:test';
import assert from 'node:assert/strict';
import {
  planLessonAudio,
  audioUpdates,
  transcriptTurns,
  voiceCaster,
  ssml,
  clipKey,
  VOICES,
} from './lib/lesson-audio.mjs';

const lesson = {
  sections: [
    {
      conversations: [
        {
          lines: [
            { id: 1, speaker: 'A', japanese: 'はじめまして。私（わたし）はマイクです。' },
            { id: 2, speaker: 'B', japanese: 'はじめまして。' },
            { id: 3, speaker: 'A', japanese: 'よろしく & どうぞ' },
          ],
        },
      ],
      listeningContent: [
        { id: 9, title: 'Greetings', transcript: '男：おはよう。\n女：おはよう。\n今日はいい天気ね。' },
      ],
    },
  ],
};

test('dialogue speakers get distinct, stable voices', () => {
  const cast = voiceCaster();
  assert.equal(cast('A'), VOICES.male);
  assert.equal(cast('B'), VOICES.female);
  assert.equal(cast('A'), VOICES.male);
  assert.notEqual(cast('C'), cast('A'));
  const gendered = voiceCaster();
  assert.equal(gendered('女'), VOICES.female);
  assert.equal(gendered('A'), VOICES.male);
});

test('transcripts split by speaker; unlabeled lines continue the last speaker', () => {
  assert.deepEqual(transcriptTurns('A: こんにちは。\nB：はい（hai）。\n\nそうです。'), [
    ['A', 'こんにちは。'],
    ['B', 'はい。'],
    ['B', 'そうです。'],
  ]);
});

test('each line and each listening item becomes one clip; listening keeps both voices', () => {
  const clips = planLessonAudio(lesson, 'N5');
  assert.deepEqual(
    clips.map(c => [c.table, c.id]),
    [
      ['conversation_lines', 1],
      ['conversation_lines', 2],
      ['conversation_lines', 3],
      ['listening_content', 9],
    ],
  );
  assert.ok(!clips[0].ssml.includes('わたし'), 'bracketed readings are not spoken');
  assert.match(clips[0].ssml, /rate="-10%"/);
  assert.match(clips[2].ssml, /よろしく &amp; どうぞ/);
  const listening = clips[3].ssml;
  assert.ok(listening.includes(VOICES.male) && listening.includes(VOICES.female));
  assert.equal(listening.match(/<break/g).length, 2);
});

test('the key follows the sound: same text and voice share a file, any change makes a new one', () => {
  const a = ssml([[VOICES.male, 'はい']], '0%');
  assert.equal(clipKey(a), clipKey(ssml([[VOICES.male, 'はい']], '0%')));
  assert.notEqual(clipKey(a), clipKey(ssml([[VOICES.female, 'はい']], '0%')));
  assert.notEqual(clipKey(a), clipKey(ssml([[VOICES.male, 'はい']], '-10%')));
  assert.match(clipKey(a), /^[0-9a-f]{32}$/);
});

test('row updates leave real recordings alone', () => {
  const sql = audioUpdates(planLessonAudio(lesson, 'N3'));
  assert.equal(sql.split('\n').length, 4);
  assert.match(sql, /^UPDATE conversation_lines SET audio_url='\/audio\/[0-9a-f]{32}\.mp3' WHERE id=1 AND/);
  assert.match(sql, /audio_url NOT LIKE 'http%'/);
});
