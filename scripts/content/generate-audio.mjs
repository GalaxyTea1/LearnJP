// Generates the dialogue and listening audio of published lessons with Azure Speech, uploads it to
// the environment's R2 bucket and points the lesson rows at it.
//
//   node scripts/content/generate-audio.mjs --level N5 --unit 1          plan only, no key needed
//   node scripts/content/generate-audio.mjs --all --synthesize           write .local/audio/*.mp3
//   node scripts/content/generate-audio.mjs --all --apply local          + upload, update local D1
//   node scripts/content/generate-audio.mjs --all --apply staging        + upload, update staging D1
//   node scripts/content/generate-audio.mjs --all --apply production --confirm-production
//
// Lessons are read from that environment's Worker (override with --api). Clips are named by a hash
// of their SSML, so re-running only synthesizes and uploads what changed. The Azure key and region
// come from .env.tts (AZURE_SPEECH_KEY, AZURE_SPEECH_REGION), which is gitignored.
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { planLessonAudio, audioUpdates, OUTPUT_FORMAT } from './lib/lesson-audio.mjs';

const run = promisify(execFile);
const root = fileURLToPath(new URL('../../', import.meta.url));
const { values: args } = parseArgs({
  options: {
    level: { type: 'string' },
    unit: { type: 'string' },
    all: { type: 'boolean', default: false },
    api: { type: 'string' },
    synthesize: { type: 'boolean', default: false },
    apply: { type: 'string' },
    'confirm-production': { type: 'boolean', default: false },
    voices: { type: 'boolean', default: false },
  },
});
try {
  process.loadEnvFile(`${root}.env.tts`);
} catch {
  /* optional until synthesis */
}
const { AZURE_SPEECH_KEY: key, AZURE_SPEECH_REGION: region } = process.env;
const needKey = () => {
  if (!key || !region) throw new Error('Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in .env.tts first.');
};

if (args.voices) {
  needKey();
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/voices/list`, {
    headers: { 'Ocp-Apim-Subscription-Key': key },
  });
  if (!res.ok) throw new Error(`Azure voices list: ${res.status} ${await res.text()}`);
  for (const v of (await res.json()).filter(v => v.Locale === 'ja-JP')) console.log(v.ShortName, v.Gender);
  process.exit(0);
}

// --- Target environment -------------------------------------------------------------------------
const targets = {
  local: { config: 'wrangler.local.jsonc', where: '--local' },
  staging: { config: 'wrangler.staging.json', where: '--remote' },
  production: { config: 'wrangler.production.json', where: '--remote' },
};
const envName = args.apply ?? 'local';
const target = targets[envName];
if (!target) throw new Error('--apply must be local, staging or production');
if (envName === 'production' && args.apply && !args['confirm-production'])
  throw new Error('Writing to production needs --confirm-production.');
const config =
  envName === 'local'
    ? {
        vars: { FRONTEND_URL: 'http://127.0.0.1:8787' },
        r2_buckets: [{ binding: 'AUDIO', bucket_name: 'learnjp-audio-local' }],
      }
    : JSON.parse(await readFile(`${root}${target.config}`, 'utf8'));
const bucket = config.r2_buckets?.find(b => b.binding === 'AUDIO')?.bucket_name;
if (args.apply && !bucket) throw new Error(`${target.config} has no AUDIO R2 bucket`);
const api = args.api ?? config.vars.FRONTEND_URL;

// --- Lessons ------------------------------------------------------------------------------------
const level = args.level?.toUpperCase();
const unit = args.unit === undefined ? undefined : Number(args.unit);
if (!args.all && !level) throw new Error('Pass --all, or --level N5 [--unit 1]');
if (level && !/^N[1-5]$/.test(level)) throw new Error(`Unknown level ${args.level}`);

const getJson = async path => {
  const res = await fetch(new URL(path, api));
  if (!res.ok) throw new Error(`${api}${path}: ${res.status}`);
  return (await res.json()).data;
};
const levelOf = m => m.level?.level ?? m.level;
const modules = (await getJson('/api/v1/modules'))
  .filter(m => (!level || levelOf(m) === level) && (unit === undefined || m.unitNumber === unit))
  .sort((a, b) => levelOf(b).localeCompare(levelOf(a)) || a.unitNumber - b.unitNumber);
if (!modules.length) throw new Error(`No published lesson matches at ${api}`);

const clips = [];
for (const m of modules) {
  const planned = planLessonAudio(await getJson(`/api/v1/modules/${m.id}/full`), levelOf(m));
  console.log(`${levelOf(m)}-${String(m.unitNumber).padStart(2, '0')}: ${planned.length} clips`);
  clips.push(...planned);
}
const unique = new Map(clips.map(c => [c.key, c]));
const characters = [...unique.values()].reduce((n, c) => n + c.ssml.replace(/<[^>]+>/g, '').length, 0);
console.log(`${modules.length} lesson(s), ${clips.length} clips, ${unique.size} files, ~${characters} characters.`);

const dir = `${root}.local/audio/`;
await mkdir(dir, { recursive: true });
const exists = path =>
  access(path).then(
    () => true,
    () => false,
  );

// --- Synthesis ----------------------------------------------------------------------------------
async function synthesize(document, attempt = 1) {
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': OUTPUT_FORMAT,
      'User-Agent': 'learnjp-audio',
    },
    body: document,
  });
  // The free tier allows a limited number of requests per minute; wait as long as Azure asks.
  if ((res.status === 429 || res.status >= 500) && attempt < 10) {
    const wait = Number(res.headers.get('retry-after')) || 5 * attempt;
    await new Promise(r => setTimeout(r, wait * 1000));
    return synthesize(document, attempt + 1);
  }
  if (!res.ok) throw new Error(`Azure TTS ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

if (args.synthesize || args.apply) {
  let made = 0;
  for (const clip of unique.values()) {
    const file = `${dir}${clip.key}.mp3`;
    if (await exists(file)) continue;
    needKey();
    await writeFile(file, await synthesize(clip.ssml));
    if (++made % 25 === 0) console.log(`  synthesized ${made}…`);
  }
  console.log(`Synthesized ${made} new clip(s); the rest were already in .local/audio/.`);
}

const sqlFile = `.local/audio/${envName}-updates.sql`;
await writeFile(`${root}${sqlFile}`, audioUpdates(clips) + '\n');
console.log(`Row updates written to ${sqlFile}`);

// --- Upload and point the rows at the files -----------------------------------------------------
if (args.apply) {
  const wrangler = (...rest) =>
    run('npx', ['wrangler', ...rest, '--config', target.config], {
      cwd: root,
      shell: process.platform === 'win32',
      maxBuffer: 16 * 1024 * 1024,
    });
  const ledgerFile = `${dir}uploaded-${envName}.json`;
  const uploaded = new Set((await exists(ledgerFile)) ? JSON.parse(await readFile(ledgerFile, 'utf8')) : []);
  const pending = [...unique.keys()].filter(k => !uploaded.has(k));
  let done = 0;
  const worker = async () => {
    for (let k = pending.shift(); k; k = pending.shift()) {
      await wrangler(
        'r2',
        'object',
        'put',
        `${bucket}/${k}.mp3`,
        '--file',
        `.local/audio/${k}.mp3`,
        '--content-type',
        'audio/mpeg',
        '--cache-control',
        'public, max-age=31536000, immutable',
        target.where,
      );
      uploaded.add(k);
      if (++done % 25 === 0) {
        await writeFile(ledgerFile, JSON.stringify([...uploaded]));
        console.log(`  uploaded ${done}…`);
      }
    }
  };
  try {
    await Promise.all(Array.from({ length: 4 }, worker));
  } finally {
    await writeFile(ledgerFile, JSON.stringify([...uploaded]));
  }
  console.log(`Uploaded ${done} file(s) to ${bucket}.`);
  // Rows change only after every file they point at is in the bucket.
  await wrangler('d1', 'execute', 'DB', target.where, '--file', sqlFile, '--yes');
  console.log(`Updated ${clips.length} lesson rows in the ${envName} database.`);
}
