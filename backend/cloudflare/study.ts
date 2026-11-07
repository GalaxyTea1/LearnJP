import { decode } from './content';
import { LearningDB, PUBLIC_MODULES, utcNow, isGuardError, type Row } from './learning-db';
import { HttpError } from './http';
import { z } from './validate';

const studyPatch = z
  .object({
    completedTabs: z
      .array(z.enum(['vocab', 'kanji', 'grammar', 'dialogue', 'exercise']))
      .max(5)
      .default([]),
    vocabulary: z
      .array(z.object({ id: z.number().int().positive(), mastered: z.boolean() }).strict())
      .max(1000)
      .default([]),
  })
  .strict();

export class Study extends LearningDB {
  async read(moduleId: number) {
    await this.module(moduleId);
    const [tabs, words, progress] = await this.db.batch<Row>([
      this.sql(
        'SELECT tab FROM study_completed_tabs WHERE progress_id IN (SELECT id FROM user_module_progress WHERE user_id=? AND module_id=?) ORDER BY tab',
        this.userId,
        moduleId,
      ),
      this.sql(
        'SELECT vocabulary_id FROM study_mastered_vocabulary WHERE progress_id IN (SELECT id FROM user_module_progress WHERE user_id=? AND module_id=?) AND vocabulary_id IN (SELECT id FROM vocabulary WHERE module_id=?) ORDER BY vocabulary_id',
        this.userId,
        moduleId,
        moduleId,
      ),
      this.sql('SELECT status FROM user_module_progress WHERE user_id=? AND module_id=?', this.userId, moduleId),
    ]);
    return {
      completedTabs: tabs.results.map(r => r.tab),
      masteredVocabularyIds: words.results.map(r => r.vocabulary_id),
      quizCompleted: progress.results[0]?.status === 'COMPLETED',
    };
  }
  async write(moduleId: number, input: unknown) {
    const patch = studyPatch.safeParse(input);
    if (!patch.success) throw new HttpError(400, 'Invalid study patch');
    await this.module(moduleId);
    const words = [...new Map(patch.data.vocabulary.map(w => [w.id, w])).values()];
    const encoded = JSON.stringify(words),
      stamp = utcNow();
    const valid = `NOT EXISTS(SELECT 1 FROM json_each(?) w WHERE json_extract(w.value,'$.id') NOT IN (SELECT id FROM vocabulary WHERE module_id=?))`;
    if (!(await this.sql(`SELECT 1 ok WHERE ${valid}`, encoded, moduleId).first()))
      throw new HttpError(400, 'Vocabulary does not belong to this module');
    const pid = 'SELECT id FROM user_module_progress WHERE user_id=? AND module_id=?';
    try {
      await this.batch([
        this.moduleGuard(moduleId),
        this.guard(valid, encoded, moduleId),
        this.sql(
          `INSERT INTO user_module_progress(user_id,module_id,status,started_at) VALUES (?,?,'IN_PROGRESS',?) ON CONFLICT(user_id,module_id) DO NOTHING`,
          this.userId,
          moduleId,
          stamp,
        ),
        this.sql(
          `INSERT INTO study_completed_tabs(progress_id,tab) SELECT (${pid}),value FROM json_each(?) WHERE 1 ON CONFLICT DO NOTHING`,
          this.userId,
          moduleId,
          JSON.stringify(patch.data.completedTabs),
        ),
        this.sql(
          `DELETE FROM study_mastered_vocabulary WHERE progress_id=(${pid}) AND vocabulary_id IN (SELECT json_extract(value,'$.id') FROM json_each(?) WHERE json_extract(value,'$.mastered')=0)`,
          this.userId,
          moduleId,
          encoded,
        ),
        this.sql(
          `INSERT INTO study_mastered_vocabulary(progress_id,vocabulary_id) SELECT (${pid}),json_extract(value,'$.id') FROM json_each(?) WHERE json_extract(value,'$.mastered')=1 ON CONFLICT DO NOTHING`,
          this.userId,
          moduleId,
          encoded,
        ),
        this.sql(
          `INSERT INTO study_completed_tabs(progress_id,tab) SELECT (${pid}),'vocab' WHERE EXISTS(SELECT 1 FROM vocabulary WHERE module_id=?) AND NOT EXISTS(SELECT 1 FROM vocabulary WHERE module_id=? AND id NOT IN (SELECT vocabulary_id FROM study_mastered_vocabulary WHERE progress_id=(${pid}))) ON CONFLICT DO NOTHING`,
          this.userId,
          moduleId,
          moduleId,
          moduleId,
          this.userId,
          moduleId,
        ),
        this.sql(
          `UPDATE user_module_progress SET status=CASE WHEN status='COMPLETED' THEN status ELSE 'IN_PROGRESS' END,progress_percent=CASE WHEN status='COMPLETED' THEN 100 ELSE max(progress_percent,CAST(round((SELECT count(*) FROM study_completed_tabs WHERE progress_id=user_module_progress.id)*100.0/6) AS INTEGER)) END,updated_at=? WHERE user_id=? AND module_id=?`,
          stamp,
          this.userId,
          moduleId,
        ),
      ]);
    } catch (e) {
      if (isGuardError(e)) throw new HttpError(409, 'Study content changed; reload and retry');
      throw e;
    }
    return this.read(moduleId);
  }
  async update(input: unknown) {
    const parsed = z
      .object({
        moduleId: z.number().int().positive(),
        status: z.enum(['NOT_STARTED', 'IN_PROGRESS']).optional(),
        progressPercent: z.number().int().min(0).max(99).optional(),
      })
      .strict()
      .safeParse(input);
    if (!parsed.success) throw new HttpError(400, 'Completion is determined by server-graded assessments');
    const d = parsed.data;
    await this.module(d.moduleId);
    const result = await this.batch([
      this.moduleGuard(d.moduleId),
      this.sql(
        `INSERT INTO user_module_progress(user_id,module_id,status,progress_percent,started_at) VALUES (?,?,?,?,?) ON CONFLICT(user_id,module_id) DO UPDATE SET
      status=CASE WHEN status='COMPLETED' THEN status WHEN excluded.progress_percent>0 OR status='IN_PROGRESS' THEN 'IN_PROGRESS' ELSE excluded.status END,
      progress_percent=max(progress_percent,excluded.progress_percent),updated_at=excluded.started_at RETURNING *`,
        this.userId,
        d.moduleId,
        d.status || 'IN_PROGRESS',
        d.progressPercent || 0,
        utcNow(),
      ),
    ]);
    return decode('user_module_progress', result[2].results[0]);
  }
  async summary() {
    // One D1 round trip reading only the columns the summary returns; decoding every
    // module row (and its JSON) dominated this endpoint's CPU on cold isolates.
    const [modules, levels, progress] = await this.db.batch<Row>([
      this
        .sql(`SELECT m.id,m.title,m.unit_number AS unitNumber,m.level_id AS levelId,l.level,l.title AS levelTitle,l.color
        FROM learning_modules m JOIN jlpt_levels l ON l.id=m.level_id WHERE m.id IN (${PUBLIC_MODULES})`),
      this.sql('SELECT id,level FROM jlpt_levels ORDER BY id'),
      this.sql(
        `SELECT * FROM user_module_progress WHERE user_id=? AND module_id IN (${PUBLIC_MODULES}) ORDER BY updated_at DESC,id DESC`,
        this.userId,
      ),
    ]);
    const byId = new Map(modules.results.map(m => [m.id, m]));
    const all: Row[] = progress.results.map(row => {
      const p = decode('user_module_progress', row),
        m = byId.get(p.moduleId)!;
      return {
        ...p,
        module: {
          id: m.id,
          title: m.title,
          unitNumber: m.unitNumber,
          levelId: m.levelId,
          level: { level: m.level, title: m.levelTitle, color: m.color },
        },
      };
    });
    const state = new Map(all.map(p => [p.moduleId, p])),
      total = modules.results.length;
    const completed = all.filter(p => p.status === 'COMPLETED').length;
    return {
      overview: {
        totalModules: total,
        completedModules: completed,
        overallPercent: total ? Math.round((completed / total) * 100) : 0,
      },
      levelStats: levels.results.map(l => {
        const ms = modules.results.filter(m => m.levelId === l.id);
        return {
          level: l.level,
          total_modules: ms.length,
          completed_modules: ms.filter(m => state.get(m.id)?.status === 'COMPLETED').length,
          avg_progress: ms.length
            ? Math.round(ms.reduce((n, m) => n + (state.get(m.id)?.progressPercent ?? 0), 0) / ms.length)
            : 0,
        };
      }),
      recentModules: all.slice(0, 5),
      allModuleProgress: all,
    };
  }
  async reviewItems(limit: number) {
    let ids = (
      await this.sql(
        `SELECT module_id FROM user_module_progress WHERE user_id=? AND module_id IN (${PUBLIC_MODULES})`,
        this.userId,
      ).all()
    ).results.map(r => r.module_id);
    if (!ids.length)
      ids = (
        await this.sql(
          `SELECT id FROM learning_modules WHERE id IN (${PUBLIC_MODULES}) ORDER BY sort_order,id LIMIT 3`,
        ).all()
      ).results.map(r => r.id);
    const where = `module_id IN (SELECT value FROM json_each(?)) AND module_id IN (${PUBLIC_MODULES})`;
    // Legacy review-items returns database column names; the current FE accepts these.
    const results = await this.db.batch(
      ['vocabulary', 'kanji'].map(t =>
        this.sql(`SELECT * FROM ${t} WHERE ${where} ORDER BY random() LIMIT ?`, JSON.stringify(ids), limit),
      ),
    );
    return { vocab: results[0].results, kanji: results[1].results };
  }
}
