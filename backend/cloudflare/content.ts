import columns from './columns.json';
import { HttpError } from './http';
import { requireRole, type AuthUser } from './auth';
export { HttpError } from './http';

type Row = Record<string, any>;
type Field = { name: string; column: string; type: string };
const schema: Record<string, Field[]> = columns;
const guest = () => ({ status: 'NOT_STARTED', progressPercent: 0 });
export async function quizRevision(id:number,questions:Row[],secret:string) {
  if(!secret || secret.length<32)throw new HttpError(503,'Quiz revision secret is not configured');
  const content=questions.map(q=>[q.id,q.question,q.options,q.correctIndex,q.explanation,q.questionType,q.points]);
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const digest=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(JSON.stringify(['quiz-v1',id,content])));
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
export function decode(table: string, row: Row): Row {
  return Object.fromEntries(schema[table].map(f => [f.name, row[f.column] == null ? null :
    f.type === 'Json' ? JSON.parse(row[f.column]) : f.type === 'Boolean' ? Boolean(row[f.column]) : row[f.column]]));
}
export function positive(value: string | null, fallback?: number, max = 2147483647): number {
  if (value === null && fallback !== undefined) return fallback;
  if (!value || !/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1 || Number(value) > max) throw new HttpError(400, 'Invalid positive integer');
  return Number(value);
}
export class Content {
  constructor(private db: D1Database, private revisionKey: string, private userId?: number, private preview = false) {}
  private get modulesWhere() { return this.preview ? '1=1' : "content_status='PUBLISHED' AND level_id IN (SELECT id FROM jlpt_levels WHERE level='N5')"; }
  async progress(moduleId: number) {
    if (!this.userId) return guest();
    const rows = await this.rows('user_module_progress', 'user_id=? AND module_id=?', [this.userId,moduleId]);
    return rows[0] || guest();
  }
  async rows(table: string, where = '1=1', values: any[] = [], order = 'id', limit?: [number, number]): Promise<Row[]> {
    if (!schema[table]) throw new Error('Unknown table');
    const sql = `SELECT * FROM "${table}" WHERE ${where} ORDER BY ${order}` + (limit ? ' LIMIT ? OFFSET ?' : '');
    const result = await this.db.prepare(sql).bind(...values, ...(limit || [])).all();
    return result.results.map(row => decode(table, row));
  }
  async module(id: number): Promise<Row> {
    const [module] = await this.rows('learning_modules', `id=? AND ${this.modulesWhere}`, [id]);
    if (!module) throw new HttpError(404, 'Learning module not found');
    return module;
  }
  async counts(id: number) {
    const row = await this.db.prepare(`SELECT
      (SELECT count(*) FROM vocabulary WHERE module_id=?) AS vocabulary,
      (SELECT count(*) FROM kanji WHERE module_id=?) AS kanji,
      (SELECT count(*) FROM grammar_patterns WHERE module_id=?) AS grammarPatterns,
      (SELECT count(*) FROM quiz_questions WHERE module_id=?) AS quizQuestions`).bind(id,id,id,id).first();
    return row;
  }
  async modules(params: URLSearchParams): Promise<Row[]> {
    let where = this.modulesWhere;
    const values: any[] = [];
    if (params.has('levelId')) { where += ' AND level_id=?'; values.push(positive(params.get('levelId'))); }
    if (params.has('level')) { where += ' AND level_id IN (SELECT id FROM jlpt_levels WHERE level=?)'; values.push(params.get('level')!.toUpperCase()); }
    const modules = await this.rows('learning_modules', where, values, 'level_id,unit_number');
    const levels = await this.rows('jlpt_levels');
    const progresses = this.userId ? await this.rows('user_module_progress','user_id=?',[this.userId]) : [];
    return Promise.all(modules.map(async m => {
      const l = levels.find(l => l.id === m.levelId)!;
      const p = progresses.find(p=>p.moduleId===m.id) || guest();
      return { ...m, level: { level: l.level, title: l.title, color: l.color }, _count: await this.counts(m.id), status:p.status, progressPercent:p.progressPercent };
    }));
  }
  async levels(code?: string) {
    const levels = await this.rows('jlpt_levels', code ? 'level=?' : '1=1', code ? [code.toUpperCase()] : [], 'sort_order');
    if (code) {
      if (!levels[0]) throw new HttpError(404, 'Level not found');
      const modules = await this.modules(new URLSearchParams({ levelId: String(levels[0].id) }));
      return { ...levels[0], modules: modules.map(({ level, ...m }) => m) };
    }
    const modules = await this.modules(new URLSearchParams());
    return levels.map(l => {
      const items=modules.filter(m=>m.levelId===l.id);
      return {...l,_count:{modules:items.length},userProgressPercent:items.length?Math.round(items.reduce((sum,m)=>sum+m.progressPercent,0)/items.length):0};
    });
  }
  async questions(id: number) {
    await this.module(id);
    const questions = await this.rows('quiz_questions', 'module_id=?', [id]);
    // Whitelist the public fields. Never expose correctIndex or explanation.
    return { questions: this.preview ? questions : questions.map(q => ({ id:q.id, moduleId:q.moduleId, question:q.question, options:q.options, questionType:q.questionType, points:q.points })), quizRevision:await quizRevision(id,questions,this.revisionKey) };
  }
  async full(id: number, full: boolean) {
    const module = await this.module(id);
    const [level] = await this.rows('jlpt_levels', 'id=?', [module.levelId]);
    const userProgress=await this.progress(id);
    if (!full) return { ...module, level, _count: await this.counts(id), userProgress };
    // Each child query constrains its own ancestry; draft parents can never leak through IDs.
    const published = this.preview ? '1=1' : "status='PUBLISHED'";
    const sectionIds = `SELECT id FROM lesson_sections WHERE module_id=? AND ${published}`;
    const child = `section_id IN (${sectionIds}) AND ${published}`;
    const definitions = [
      ['lesson_sections', `module_id=? AND ${published}`, 'sort_order,id'],
      ['conversations', child, 'sort_order,id'],
      ['conversation_lines', `conversation_id IN (SELECT id FROM conversations WHERE ${child})`, 'sort_order,id'],
      ['listening_content', child, 'sort_order,id'], ['reading_passages', child, 'sort_order,id'],
      ['writing_tasks', child, 'sort_order,id'],
      ['lesson_exercises', `${child} AND (reading_passage_id IS NULL OR reading_passage_id IN (SELECT id FROM reading_passages WHERE ${published} AND section_id IN (${sectionIds}))) AND (listening_id IS NULL OR listening_id IN (SELECT id FROM listening_content WHERE ${published} AND section_id IN (${sectionIds})))`, 'sort_order,id'],
      ['vocabulary', 'module_id=?', 'id'], ['kanji', 'module_id=?', 'id'],
      ['grammar_patterns', 'module_id=?', 'id'],
      ['grammar_examples', 'grammar_pattern_id IN (SELECT id FROM grammar_patterns WHERE module_id=?)', 'sort_order,id'],
    ];
    const results = await this.db.batch(definitions.map(([table, where, order]) =>
      this.db.prepare(`SELECT * FROM ${table} WHERE ${where} ORDER BY ${order}`).bind(...Array((where.match(/\?/g) || []).length).fill(id))));
    const data: Record<string, Row[]> = Object.fromEntries(definitions.map(([t], i) => [t, results[i].results.map(r => decode(t,r as Row))]));
    const sections = data.lesson_sections.map(s => ({ ...s,
      conversations: data.conversations.filter(c => c.sectionId === s.id).map(c => ({ ...c, lines: data.conversation_lines.filter(l => l.conversationId === c.id) })),
      listeningContent: data.listening_content.filter(l => l.sectionId === s.id),
      readingPassages: data.reading_passages.filter(r => r.sectionId === s.id).map(r => ({ ...r, exercises: data.lesson_exercises.filter(e => e.readingPassageId === r.id) })),
      writingTasks: data.writing_tasks.filter(w => w.sectionId === s.id),
      exercises: data.lesson_exercises.filter(e => e.sectionId === s.id),
    }));
    const quiz = await this.questions(id);
    return { ...module, level, sections, vocabulary: data.vocabulary, kanji: data.kanji,
      grammarPatterns: data.grammar_patterns.map(g => ({ ...g, examples: data.grammar_examples.filter(e => e.grammarPatternId === g.id) })),
      quizQuestions: quiz.questions.map(({moduleId,...q}) => q), quizRevision: quiz.quizRevision, userProgress };
  }
  async items(kind: string, params: URLSearchParams, id?: number, character?: string) {
    const table = { vocabulary: 'vocabulary', kanji: 'kanji', grammar: 'grammar_patterns' }[kind]!;
    let where = this.preview ? '1=1' : `module_id IN (SELECT id FROM learning_modules WHERE ${this.modulesWhere})`;
    const args: any[] = [];
    if (id !== undefined) { where += ' AND id=?'; args.push(id); }
    if (character !== undefined) { where += ' AND character=?'; args.push(character); }
    for (const [query,column] of [['moduleId','module_id'],['level','level'], ...(kind === 'vocabulary' ? [['type','type']] : [])]) {
      if (params.has(query)) { where += ` AND ${column}=?`; args.push(query === 'moduleId' ? positive(params.get(query)) : params.get(query)); }
    }
    const search = params.get('q') ?? params.get('search');
    if (search) {
      if (search.length > 100) throw new HttpError(400, 'Search is too long');
      where += ' AND id IN (SELECT item_id FROM content_search WHERE kind=? AND instr(search_text,?)>0)';
      args.push(kind, search.toLowerCase());
    }
    const single = id !== undefined || character !== undefined;
    const page = positive(params.get('page'), 1, 100000), limit = positive(params.get('limit'), 20, 100);
    const rows = await this.rows(table, where, args, 'id', single ? [1,0] : [limit,(page-1)*limit]);
    if (single && !rows.length) throw new HttpError(404,'Content not found');
    const modules = await this.rows('learning_modules', this.modulesWhere);
    const examples = kind === 'grammar' && rows.length ? await this.rows('grammar_examples', `grammar_pattern_id IN (${rows.map(()=>'?').join(',')})`, rows.map(r=>r.id),'sort_order,id') : [];
    const items = rows.map(r => {
      const m = modules.find(m=>m.id===r.moduleId)!;
      return { ...r, module: !m ? null : single ? m : { id:m.id,title:m.title,unitNumber:m.unitNumber },
        ...(kind === 'grammar' ? { examples: examples.filter(e=>e.grammarPatternId===r.id) } : {}) };
    });
    if (single) return { data: items[0] };
    const total = Number((await this.db.prepare(`SELECT count(*) AS n FROM ${table} WHERE ${where}`).bind(...args).first<{n:number}>())!.n);
    return { data:items, meta:{page,limit,total,totalPages:Math.ceil(total/limit)} };
  }
  async templates(params: URLSearchParams, id?: number) {
    const args: any[] = [];
    let where = "is_published=1 AND level='N5'";
    if (id !== undefined) { where += ' AND id=?'; args.push(id); }
    if (params.has('level')) { where += ' AND level=?'; args.push(params.get('level')!.toUpperCase()); }
    const templates = await this.rows('test_templates',where,args,'created_at DESC,id');
    if (id !== undefined && !templates.length) throw new HttpError(404,'Published test template not found');
    const result = await Promise.all(templates.map(async t => {
      const sections = await this.rows('test_sections','template_id=?',[t.id],'sort_order,id');
      // Preserve the legacy aggregate count; no learner identities or answers are returned.
      const attempts=id===undefined ? Number((await this.db.prepare('SELECT count(*) n FROM user_test_attempts WHERE template_id=?').bind(t.id).first<{n:number}>())?.n || 0) : 0;
      return { ...t, sections: await Promise.all(sections.map(async s => {
        if (id === undefined) return {id:s.id,sectionType:s.sectionType,title:s.title,durationMinutes:s.durationMinutes,sortOrder:s.sortOrder};
        const questions = await this.rows('test_questions','section_id=?',[s.id],'sort_order,id');
        return {...s,questions:questions.map(q=>({id:q.id,questionType:q.questionType,passage:q.passage,questionText:q.questionText,options:q.options,points:q.points,sortOrder:q.sortOrder}))};
      })), ...(id === undefined ? {_count:{attempts}} : {}) };
    }));
    return id === undefined ? result : result[0];
  }
}

export async function readContent(request: Request, env: Env, user?: AuthUser): Promise<{data: unknown;meta?: unknown} | null> {
  if (request.method !== 'GET') return null;
  const url = new URL(request.url), path = url.pathname.replace(/\/$/, ''), p = url.searchParams;
  const isContent = /^\/api\/v1\/(levels|modules|vocabulary|kanji|grammar|quizzes\/module|tests\/templates|dictionary\/(search|jisho)|announcements\/(active|all))(\/|$)/.test(path);
  if (!isContent) return null;
  if (p.get('preview') === 'true') {
    if (!user) throw new HttpError(403,'Content preview requires administrator access');
    requireRole(user,['ADMIN','MODERATOR']);
  }
  const content = new Content(env.DB, env.QUIZ_REVISION_SECRET, user?.id, p.get('preview') === 'true');
  if (path === '/api/v1/announcements/all') {
    if (!user) throw new HttpError(401,'Authentication required');
    requireRole(user,['ADMIN','MODERATOR']);
    return {data:await content.rows('announcements','1=1',[],'created_at DESC,id')};
  }
  if (path === '/api/v1/announcements/active') {
    const rows = await content.rows('announcements','is_active=1 AND (expires_at IS NULL OR expires_at>?)',[new Date().toISOString()],'created_at DESC,id');
    // Account metadata is outside CF2; no user table data is returned here.
    return {data:rows.map(r=>({...r,creator:null}))};
  }
  if (path === '/api/v1/dictionary/search' || path === '/api/v1/dictionary/jisho') {
    const query=p.get('q')?.trim();
    if (!query || query.length>100) throw new HttpError(400,'Search keyword must contain 1–100 characters');
    if (path.endsWith('/jisho')) return {data:await searchJisho(query)};
    const rows=await content.rows('dictionary_entries', "level='N5' AND id IN (SELECT item_id FROM content_search WHERE kind='dictionary' AND instr(search_text,?)>0)",[query.toLowerCase()],'id',[positive(p.get('limit'),20,50),0]);
    if(user)await env.DB.prepare('INSERT INTO search_history(user_id,query,results_count) SELECT id,?,? FROM users WHERE id=? AND is_active=1').bind(query,rows.length,user.id).run();
    return {data:rows};
  }
  if (path === '/api/v1/tests/templates') return {data:await content.templates(p)};
  let templateMatch=path.match(/^\/api\/v1\/tests\/templates\/([^/]+)$/);
  if (templateMatch) return {data:await content.templates(p,positive(templateMatch[1]))};
  if (path === '/api/v1/levels') return {data:await content.levels()};
  if (path === '/api/v1/modules') return {data:await content.modules(p)};
  let match = path.match(/^\/api\/v1\/levels\/([^/]+)$/);
  if (match) return {data:await content.levels(decodeURIComponent(match[1]))};
  match = path.match(/^\/api\/v1\/modules\/([^/]+)(\/full)?$/);
  if (match) return {data:await content.full(positive(match[1]), Boolean(match[2]))};
  match = path.match(/^\/api\/v1\/quizzes\/module\/([^/]+)$/);
  if (match) { const quiz=await content.questions(positive(match[1])); return {data:quiz.questions,meta:{quizRevision:quiz.quizRevision}}; }
  match = path.match(/^\/api\/v1\/(vocabulary|kanji|grammar)(?:\/([^/]+))?$/);
  if (match) return content.items(match[1],p,match[2] ? positive(match[2]) : undefined);
  match = path.match(/^\/api\/v1\/kanji\/char\/([^/]+)$/);
  if (match) return content.items('kanji',p,undefined,decodeURIComponent(match[1]));
  return null;
}

export async function searchJisho(query: string, fetcher: typeof fetch = fetch) {
  const url=new URL('https://jisho.org/api/v1/search/words'); url.searchParams.set('keyword',query);
  const signal=AbortSignal.timeout(8000);
  try {
    const response=await fetcher(url,{signal,redirect:'error',headers:{Accept:'application/json'}});
    if (!response.ok) throw new Error('Upstream unavailable');
    const payload=await response.json() as any;
    if (!Array.isArray(payload?.data)) throw new Error('Invalid payload');
    return payload.data.slice(0,15).map((item:any)=>{
      if (!Array.isArray(item.japanese) || !item.japanese.length || !Array.isArray(item.senses) ||
        item.japanese.some((j:any)=>!j || (j.word!==undefined && typeof j.word!=='string') || (j.reading!==undefined && typeof j.reading!=='string')) ||
        item.senses.some((s:any)=>!Array.isArray(s?.english_definitions) || s.english_definitions.some((d:any)=>typeof d!=='string')) ||
        (item.jlpt!==undefined && (!Array.isArray(item.jlpt) || item.jlpt.some((l:any)=>typeof l!=='string')))) throw new Error('Invalid payload');
      return {jp:item.japanese[0].word||item.japanese[0].reading||query,rom:item.japanese[0].reading||'',en:item.senses[0]?.english_definitions.join(', ')||'',type:'vocab',level:item.jlpt?.[0]?.replace('jlpt-','').toUpperCase()||'Jisho',example:'',exampleEn:''};
    });
  } catch { throw new HttpError(signal.aborted?504:502,'Dictionary service temporarily unavailable'); }
}
