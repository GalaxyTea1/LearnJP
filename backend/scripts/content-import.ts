import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient, ContentStatus, LessonExerciseType, LessonSectionType, QuestionType, VocabType } from '@prisma/client';

type JsonObject = Record<string, any>;
const prisma = new PrismaClient();
const fileArg = process.argv.find((arg) => arg.endsWith('.json'));
const mode = process.argv.includes('--import') ? 'import' : 'validate';
const file = path.resolve(process.cwd(), fileArg ?? 'prisma/seed-data/n5/n5-01.json');

const expectedCounts: Record<string, number> = {
  sections: 10, vocabulary: 45, kanji: 8, grammar: 5, conversations: 2,
  listening: 2, reading: 2, writing: 2, exercises: 30, quiz: 15,
};
const errors: string[] = [];
const warnings: string[] = [];

function addError(message: string) { errors.push(message); }
function asArray(value: unknown): any[] { return Array.isArray(value) ? value : []; }
function status(value: unknown): ContentStatus { return Object.values(ContentStatus).includes(value as ContentStatus) ? value as ContentStatus : ContentStatus.DRAFT; }
function enumValue<T extends string>(values: readonly T[], value: unknown, fallback: T): T {
  return values.includes(value as T) ? value as T : fallback;
}

function validate(data: JsonObject) {
  if (!data.module?.code || (!/^N[1-5]-\d{2}$/.test(data.module.code) && !data.module.code.includes('MOCK'))) addError('module.code phải có dạng N5-01 hoặc N5-MOCK-01.');
  
  const isMock = data.module?.code && typeof data.module.code === 'string' && data.module.code.includes('MOCK');
  
  if (!isMock) {
    for (const [key, expected] of Object.entries(expectedCounts)) {
      const count = asArray(data[key]).length;
      if (count !== expected) addError(`${key}: cần ${expected}, hiện có ${count}.`);
    }
  }
  const sectionOrders = asArray(data.sections).map((s) => s.sortOrder);
  if (new Set(sectionOrders).size !== sectionOrders.length) addError('sections.sortOrder bị trùng.');
  const sectionTypes = new Set(asArray(data.sections).map((s) => s.type));
  for (const type of Object.values(LessonSectionType)) if (!sectionTypes.has(type)) addError(`Thiếu section ${type}.`);
  const vocabTypes = new Set(Object.values(VocabType));
  asArray(data.vocabulary).forEach((item, index) => {
    if (!item.japanese || !item.hiragana || !item.romaji || !item.english) addError(`vocabulary[${index}] thiếu trường bắt buộc.`);
    if (!vocabTypes.has(item.type)) addError(`vocabulary[${index}].type không hợp lệ: ${item.type}.`);
  });
  const kanji = asArray(data.kanji).map((item) => item.character);
  if (new Set(kanji).size !== kanji.length) addError('Kanji bị trùng trong module.');
  asArray(data.quiz).forEach((item, index) => {
    if (!Array.isArray(item.options) || item.correctIndex < 0 || item.correctIndex >= item.options.length) addError(`quiz[${index}] có correctIndex ngoài options.`);
  });
  asArray(data.exercises).forEach((item, index) => {
    if (!item.explanation) addError(`exercises[${index}] thiếu explanation.`);
    if (item.correctIndex !== undefined && (!Array.isArray(item.options) || item.correctIndex < 0 || item.correctIndex >= item.options.length)) addError(`exercises[${index}] có correctIndex ngoài options.`);
  });
  asArray(data.listening).forEach((item, index) => {
    if (!String(item.audioUrl ?? '').startsWith('PENDING_AUDIO:')) warnings.push(`listening[${index}] audioUrl chưa là placeholder hoặc audio thật.`);
    if (!item.transcriptJp || !item.transcriptRomaji || !item.transcriptEn) addError(`listening[${index}] thiếu transcript.`);
  });
  asArray(data.reading).forEach((item, index) => {
    if (asArray(item.questions).length < 3) addError(`reading[${index}] cần ít nhất 3 câu hỏi.`);
  });
  if (data.module?.status !== 'DRAFT') warnings.push('Module không ở trạng thái DRAFT. Import sẽ ép về DRAFT.');
}

async function importContent(data: JsonObject) {
  const levelCode = data.module.level ?? data.module.code.slice(0, 2);
  const level = await prisma.jlptLevel.upsert({
    where: { level: levelCode },
    update: {},
    create: { level: levelCode, title: `${levelCode} Japanese`, titleJp: `日本語能力試験 ${levelCode}`, color: '#4ADE80', badge: '🌸', description: `${levelCode} curriculum`, totalVocab: 0, totalKanji: 0, totalGrammar: 0, sortOrder: 1 },
  });
  const existing = await prisma.learningModule.findUnique({ where: { levelId_unitNumber: { levelId: level.id, unitNumber: data.module.unit } } });
  if (existing) throw new Error(`Module ${data.module.code} đã tồn tại (id=${existing.id}). Dùng database sạch hoặc thêm --replace sau khi xác nhận.`);

  await prisma.$transaction(async (tx) => {
    const module = await tx.learningModule.create({ data: {
      levelId: level.id, unitNumber: data.module.unit, title: data.module.title,
      titleJp: data.module.titleJp, description: data.module.description ?? data.module.title,
      topics: data.module.topics ?? ['Greetings', 'Self-introduction'], sortOrder: data.module.unit,
      contentStatus: ContentStatus.DRAFT, version: 1,
    } });
    const sectionByType = new Map<string, number>();
    for (const section of asArray(data.sections)) {
      const created = await tx.lessonSection.create({ data: { moduleId: module.id, sectionType: enumValue(Object.values(LessonSectionType), section.type, LessonSectionType.OVERVIEW), title: section.title, titleJp: section.titleJp, instructions: section.instructions ?? section.content, sortOrder: section.sortOrder, isRequired: section.isRequired ?? true, status: ContentStatus.DRAFT, version: section.version ?? 1 } });
      sectionByType.set(section.type, created.id);
    }
    for (const item of asArray(data.vocabulary)) await tx.vocabulary.create({ data: { moduleId: module.id, japanese: item.japanese, hiragana: item.hiragana, romaji: item.romaji, english: item.english, type: enumValue(Object.values(VocabType), item.type, VocabType.NOUN), level: item.level ?? levelCode, lesson: item.lesson ?? data.module.code, exampleJp: item.exampleJp, exampleEn: item.exampleEn } });
    for (const item of asArray(data.kanji)) await tx.kanji.create({ data: { moduleId: module.id, character: item.character, meaning: item.meaning, onyomi: item.onyomi, kunyomi: item.kunyomi, level: item.level ?? levelCode, strokeCount: item.strokeCount, radical: item.radical, exampleWords: item.exampleWords, mnemonic: item.mnemonic } });
    for (const item of asArray(data.grammar)) await tx.grammarPattern.create({ data: { moduleId: module.id, pattern: item.pattern, meaning: item.meaningVi ?? item.meaningEn ?? item.meaning, explanation: item.explanation, level: item.level ?? levelCode, lesson: item.lesson ?? data.module.code, examples: { create: asArray(item.examples).map((example, index) => ({ japanese: example.jp ?? example.japanese, romaji: example.romaji, english: example.vi ?? example.en ?? example.english ?? '', sortOrder: index + 1 })) } } });
    const kaiwaSection = sectionByType.get('KAIWA');
    for (const [index, item] of asArray(data.conversations).entries()) if (kaiwaSection) await tx.conversation.create({ data: { sectionId: kaiwaSection, title: item.title, context: item.context, audioUrl: item.audioUrl, sortOrder: index + 1, status: ContentStatus.DRAFT, lines: { create: asArray(item.lines).map((line: any, lineIndex: number) => ({ speaker: line.speaker, japanese: line.japanese, hiragana: line.hiragana, romaji: line.romaji, translation: line.translation, audioUrl: line.audioUrl, sortOrder: line.sortOrder ?? lineIndex + 1 })) } } });
    const listeningSection = sectionByType.get('LISTENING');
    const listeningIds: number[] = [];
    for (const [index, item] of asArray(data.listening).entries()) if (listeningSection) { const created = await tx.listeningContent.create({ data: { sectionId: listeningSection, title: item.title, instructions: item.instructions, audioUrl: item.audioUrl, durationSeconds: item.durationSeconds, playbackSpeed: item.playbackSpeed, transcript: item.transcriptJp, transcriptReading: item.transcriptRomaji, transcriptTranslation: item.transcriptEn, source: item.source, sortOrder: index + 1, status: ContentStatus.DRAFT } }); listeningIds.push(created.id); }
    const readingSection = sectionByType.get('READING');
    for (const [index, item] of asArray(data.reading).entries()) if (readingSection) { const passage = await tx.readingPassage.create({ data: { sectionId: readingSection, title: item.title, content: item.passage, reading: item.reading, translation: item.translation, estimatedLevel: levelCode, source: 'Original SumaryJapanese content', sortOrder: index + 1, status: ContentStatus.DRAFT } }); for (const [qIndex, q] of asArray(item.questions).entries()) await tx.lessonExercise.create({ data: { sectionId: readingSection, readingPassageId: passage.id, exerciseType: LessonExerciseType.MULTIPLE_CHOICE, prompt: q.question, options: q.options, correctAnswer: q.correctIndex, explanation: q.explanation, points: 1, sortOrder: index * 10 + qIndex + 1, status: ContentStatus.DRAFT } }); }
    const writingSection = sectionByType.get('WRITING');
    for (const [index, item] of asArray(data.writing).entries()) if (writingSection) await tx.writingTask.create({ data: { sectionId: writingSection, title: item.title ?? `Writing task ${index + 1}`, prompt: item.prompt, instructions: item.instructions, sampleAnswer: item.sampleAnswer, rubric: item.rubric, minLength: item.minLength, maxLength: item.maxLength, sortOrder: index + 1, status: ContentStatus.DRAFT } });
    const exerciseSection = sectionByType.get('EXERCISE');
    for (const [index, item] of asArray(data.exercises).entries()) if (exerciseSection) await tx.lessonExercise.create({ data: { sectionId: exerciseSection, exerciseType: enumValue(Object.values(LessonExerciseType), item.exerciseType, LessonExerciseType.MULTIPLE_CHOICE), prompt: item.question ?? item.prompt, options: item.options, correctAnswer: item.correctIndex ?? item.correctAnswer, explanation: item.explanation, points: item.points ?? 1, sortOrder: index + 1, status: ContentStatus.DRAFT, metadata: { skill: item.skill } } });
    for (const item of asArray(data.quiz)) await tx.quizQuestion.create({ data: { moduleId: module.id, question: item.question, options: item.options, correctIndex: item.correctIndex, explanation: item.explanation, questionType: enumValue(Object.values(QuestionType), item.questionType, QuestionType.MULTIPLE_CHOICE), points: item.points ?? 10 } });
  });
}

async function main() {
  if (!fs.existsSync(file)) throw new Error(`Không tìm thấy file: ${file}`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as JsonObject;
  validate(data);
  console.log(`File: ${file}`);
  console.log(errors.length ? `\nERRORS (${errors.length}):\n- ${errors.join('\n- ')}` : 'Validation: PASS');
  if (warnings.length) console.log(`\nWARNINGS (${warnings.length}):\n- ${warnings.join('\n- ')}`);
  if (errors.length || mode !== 'import') return;
  await importContent(data);
  console.log(`Import: PASS (${data.module.code}, DRAFT)`);
}

main().catch((error) => { console.error(`Import failed: ${error instanceof Error ? error.message : error}`); process.exitCode = 1; }).finally(() => prisma.$disconnect());
