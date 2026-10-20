// Read-only PostgreSQL export. Credentials stay in the source checkout.
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const source = path.resolve(process.argv[2] || '');
if (!process.argv[2]) throw new Error('Provide the existing backend checkout path');
const req = createRequire(path.join(source, 'package.json'));
const { Prisma, PrismaClient } = req('@prisma/client');
const config = req('dotenv').parse(fs.readFileSync(path.join(source, '.env')));
const url = new URL(config.DATABASE_URL);
if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new Error('Export is restricted to local PostgreSQL');
const schema = fs.readFileSync(path.join(root, 'backend/prisma/schema.prisma'), 'utf8');
if (schema !== fs.readFileSync(path.join(source, 'prisma/schema.prisma'), 'utf8')) throw new Error('Source schema differs from copied schema');
const { models, enums } = Prisma.dmmf.datamodel;
const quote = value => '"' + value.replaceAll('"', '""') + '"';
const literal = value => typeof value === 'boolean' ? (value ? '1' : '0') : typeof value === 'number' ? String(value) : "'" + String(value).replaceAll("'", "''") + "'";
const col = f => f.dbName || f.name;
const metadata = {};
const sql = ['-- D1 SQLite baseline. UTC dates are ISO-8601 TEXT; JSON is validated TEXT.', '-- updated_at must be set explicitly by future write repositories.'];
for (const model of models) {
  const table = model.dbName || model.name;
  const fields = model.fields.filter(f => f.kind !== 'object' && !f.isList);
  metadata[table] = fields.map(f => ({ name: f.name, column: col(f), type: f.type }));
  const columns = fields.map(f => {
    const c = quote(col(f));
    let spec = `${c} ${['Int', 'Boolean'].includes(f.type) ? 'INTEGER' : f.type === 'Float' ? 'REAL' : 'TEXT'}`;
    if (f.isId) spec += ' PRIMARY KEY' + (f.default?.name === 'autoincrement' ? ' AUTOINCREMENT' : '');
    if (f.isRequired) spec += ' NOT NULL';
    if (f.isUnique) spec += ' UNIQUE';
    if (f.isUpdatedAt || f.default?.name === 'now') spec += " DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))";
    else if (f.hasDefaultValue && typeof f.default !== 'object') spec += ' DEFAULT ' + literal(f.default);
    else if (f.hasDefaultValue && f.default?.name !== 'autoincrement') throw new Error('Unhandled default ' + model.name + '.' + f.name);
    if (f.type === 'Boolean') spec += ` CHECK (${c} IN (0,1))`;
    if (f.type === 'Json') spec += ` CHECK (${c} IS NULL OR json_valid(${c}))`;
    if (f.kind === 'enum') spec += ` CHECK (${c} IN (${enums.find(e => e.name === f.type).values.map(v => literal(v.name)).join(',')}))`;
    return spec;
  });
  for (const unique of model.uniqueFields) columns.push(`UNIQUE (${unique.map(n => quote(col(fields.find(f => f.name === n)))).join(',')})`);
  for (const relation of model.fields.filter(f => f.kind === 'object' && f.relationFromFields?.length)) {
    const parent = models.find(m => m.name === relation.type);
    const action = { Cascade: 'CASCADE', SetNull: 'SET NULL', Restrict: 'RESTRICT', NoAction: 'NO ACTION' }[relation.relationOnDelete] || (relation.isRequired ? 'RESTRICT' : 'SET NULL');
    columns.push(`FOREIGN KEY (${relation.relationFromFields.map(n => quote(col(fields.find(f => f.name === n)))).join(',')}) REFERENCES ${quote(parent.dbName || parent.name)} (${relation.relationToFields.map(n => quote(col(parent.fields.find(f => f.name === n)))).join(',')}) ON DELETE ${action} ON UPDATE CASCADE`);
  }
  sql.push(`CREATE TABLE ${quote(table)} (\n  ${columns.join(',\n  ')}\n);`);
  const body = schema.match(new RegExp('model ' + model.name + ' \\{([\\s\\S]*?)\\n\\}'))[1];
  const indexes = [...body.matchAll(/@@index\(\[([^\]]+)\]/g)].map(m => m[1].split(',').map(s => s.trim().replace(/\(.*\)/, '')));
  for (const relation of model.fields.filter(f => f.kind === 'object' && f.relationFromFields?.length)) indexes.push(relation.relationFromFields);
  for (const [i, names] of indexes.entries()) sql.push(`CREATE INDEX ${quote(table + '_lookup_' + i)} ON ${quote(table)} (${names.map(n => quote(col(fields.find(f => f.name === n)))).join(',')});`);
}
sql.push(`CREATE TABLE study_completed_tabs (
  progress_id INTEGER NOT NULL REFERENCES user_module_progress(id) ON DELETE CASCADE,
  tab TEXT NOT NULL CHECK(tab IN ('vocab','kanji','grammar','dialogue','exercise')),
  PRIMARY KEY(progress_id,tab)
);
CREATE TABLE study_mastered_vocabulary (
  progress_id INTEGER NOT NULL REFERENCES user_module_progress(id) ON DELETE CASCADE,
  vocabulary_id INTEGER NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  PRIMARY KEY(progress_id,vocabulary_id)
);
CREATE INDEX modules_public ON learning_modules(content_status,level_id,unit_number);
CREATE INDEX sections_public ON lesson_sections(module_id,status,sort_order);
CREATE INDEX quiz_module ON quiz_questions(module_id,id);`);
const migrationPath = path.join(root, 'backend/cloudflare/migrations/0001_initial.sql');
const generated = sql.join('\n\n') + '\n';
if (fs.existsSync(migrationPath) && fs.readFileSync(migrationPath, 'utf8') !== generated) throw new Error('Do not rewrite an existing migration; create a new one');
fs.writeFileSync(migrationPath, generated);
fs.writeFileSync(path.join(root, 'backend/cloudflare/columns.json'), JSON.stringify(metadata, null, 2) + '\n');

const prisma = new PrismaClient({ datasources: { db: { url: config.DATABASE_URL } } });
async function main() {
  const data = await prisma.$transaction(async tx => {
    await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');
    const levels = await tx.jlptLevel.findMany({ orderBy: { id: 'asc' } });
    const n5 = levels.find(l => l.level === 'N5');
    if (!n5) throw new Error('Missing N5 level');
    const modules = await tx.learningModule.findMany({ where: { levelId: n5.id }, orderBy: { id: 'asc' } });
    const ids = modules.map(m => m.id);
    const sections = await tx.lessonSection.findMany({ where: { moduleId: { in: ids } }, orderBy: { id: 'asc' } });
    const sid = sections.map(s => s.id);
    const conversations = await tx.conversation.findMany({ where: { sectionId: { in: sid } }, orderBy: { id: 'asc' } });
    const grammar = await tx.grammarPattern.findMany({ where: { moduleId: { in: ids } }, orderBy: { id: 'asc' } });
    const templates = await tx.testTemplate.findMany({ where: { level: 'N5' }, orderBy: { id: 'asc' } });
    const tests = await tx.testSection.findMany({ where: { templateId: { in: templates.map(t => t.id) } }, orderBy: { id: 'asc' } });
    const find = (name, where) => tx[name].findMany({ where, orderBy: { id: 'asc' } });
    return {
      jlpt_levels: levels, learning_modules: modules, lesson_sections: sections,
      conversations, conversation_lines: await find('conversationLine', { conversationId: { in: conversations.map(c => c.id) } }),
      listening_content: await find('listeningContent', { sectionId: { in: sid } }),
      reading_passages: await find('readingPassage', { sectionId: { in: sid } }),
      writing_tasks: await find('writingTask', { sectionId: { in: sid } }),
      lesson_exercises: await find('lessonExercise', { sectionId: { in: sid } }),
      vocabulary: await find('vocabulary', { moduleId: { in: ids } }),
      kanji: await find('kanji', { moduleId: { in: ids } }), grammar_patterns: grammar,
      grammar_examples: await find('grammarExample', { grammarPatternId: { in: grammar.map(g => g.id) } }),
      quiz_questions: await find('quizQuestion', { moduleId: { in: ids } }),
      dictionary_entries: await find('dictionaryEntry', { level: 'N5' }),
      test_templates: templates.map(t => ({ ...t, createdBy: null })),
      test_sections: tests, test_questions: await find('testQuestion', { sectionId: { in: tests.map(t => t.id) } }),
    };
  }, { isolationLevel: 'RepeatableRead', timeout: 60000 });
  const serialized = JSON.stringify(data);
  const digest = createHash('sha256').update(serialized).digest('hex');
  const out = path.join(root, '.local/content');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'n5.json'), serialized);
  const report = { exportedAt: new Date().toISOString(), scope: 'N5 content only; all level metadata; no accounts/sessions/progress',
    transforms: ['test_templates.createdBy=null (no account import)'], sha256: digest,
    counts: Object.fromEntries(Object.entries(data).map(([k,v]) => [k,v.length])) };
  fs.writeFileSync(path.join(root, 'docs/CF2-CONTENT-MANIFEST.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
}
main().catch(() => { console.error('Preparation failed. Check local PostgreSQL/schema access; credentials are not logged.'); process.exitCode = 1; }).finally(() => prisma.$disconnect());
