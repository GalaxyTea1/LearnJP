// Plans the audio clips for one lesson: which text, which voice, which file name.
// Pure functions only; generate-audio.mjs does the network and file work.
import { createHash } from 'node:crypto';

export const OUTPUT_FORMAT = 'audio-24khz-48kbitrate-mono-mp3';

// Azure neural voices for ja-JP. Two clearly different voices come first so A/B dialogues
// alternate male and female.
export const VOICES = {
  male: 'ja-JP-KeitaNeural',
  female: 'ja-JP-NanamiNeural',
  others: ['ja-JP-DaichiNeural', 'ja-JP-ShioriNeural', 'ja-JP-NaokiNeural', 'ja-JP-MayuNeural'],
};
const MALE = /^(?:男|男性|男の人)$/u;
const FEMALE = /^(?:女|女性|女の人)$/u;

// Beginners hear slower speech.
export const rateFor = level => ({ N5: '-10%', N4: '-5%' })[level] ?? '0%';

/** Gives each speaker of one conversation a stable voice: gendered labels first, then A/B alternation. */
export function voiceCaster() {
  const cast = new Map();
  const pool = [VOICES.male, VOICES.female, ...VOICES.others];
  return speaker => {
    const label = (speaker || '?').trim();
    if (!cast.has(label)) {
      const voice = MALE.test(label)
        ? VOICES.male
        : FEMALE.test(label)
          ? VOICES.female
          : (pool.find(v => ![...cast.values()].includes(v)) ?? pool[cast.size % pool.length]);
      cast.set(label, voice);
    }
    return cast.get(label);
  };
}

/** Same cleanup the browser reader uses: drop readings in brackets. */
export const speakable = text =>
  String(text ?? '')
    .replace(/\s*[(（][^)）]*[)）]/g, '')
    .trim();

const LABEL = /^\s*([A-ZＡ-Ｚ]|男性?|女性?|男の人|女の人|店員|客|警官|先生|学生)\s*[:：]\s*/u;
/** Splits a listening transcript into [speaker, text] turns; unlabeled lines keep the last speaker. */
export function transcriptTurns(transcript) {
  let speaker = 'A';
  return String(transcript ?? '')
    .split(/\r?\n/)
    .map(line => {
      const match = LABEL.exec(line);
      if (match) speaker = match[1];
      return [speaker, speakable(match ? line.slice(match[0].length) : line)];
    })
    .filter(([, text]) => text);
}

const escapeXml = text =>
  text.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

/** One SSML document; several turns become several <voice> blocks with a pause between them. */
export function ssml(turns, rate) {
  const body = turns
    .map(
      ([voice, text], i) =>
        `<voice name="${voice}"><prosody rate="${rate}">${escapeXml(text)}</prosody>${i < turns.length - 1 ? '<break time="600ms"/>' : ''}</voice>`,
    )
    .join('');
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ja-JP">${body}</speak>`;
}

/** The file name is a hash of everything that changes the sound, so edited text gets a new file. */
export const clipKey = document =>
  createHash('sha256').update(`${OUTPUT_FORMAT}\n${document}`).digest('hex').slice(0, 32);

/**
 * @param lesson the lesson as returned by GET /api/v1/modules/:id/full
 * @returns clips: { table, id, ssml, key, label }[]
 */
export function planLessonAudio(lesson, level) {
  const rate = rateFor(level);
  const clips = [];
  const add = (table, id, turns, label) => {
    if (!turns.length) return;
    const document = ssml(turns, rate);
    clips.push({ table, id, ssml: document, key: clipKey(document), label });
  };
  for (const section of lesson.sections ?? []) {
    for (const conversation of section.conversations ?? []) {
      const cast = voiceCaster();
      for (const line of conversation.lines ?? []) {
        const text = speakable(line.japanese);
        if (text) add('conversation_lines', line.id, [[cast(line.speaker), text]], `${line.speaker}: ${text}`);
      }
    }
    for (const item of section.listeningContent ?? []) {
      const cast = voiceCaster();
      add(
        'listening_content',
        item.id,
        transcriptTurns(item.transcript).map(([speaker, text]) => [cast(speaker), text]),
        item.title,
      );
    }
  }
  return clips;
}

/** SQL that points each row at its clip. Only rows still on browser speech or a placeholder change. */
export function audioUpdates(clips) {
  return clips
    .map(
      c =>
        `UPDATE ${c.table} SET audio_url='/audio/${c.key}.mp3' WHERE id=${Number(c.id)} AND (audio_url IS NULL OR audio_url NOT LIKE 'http%');`,
    )
    .join('\n');
}
