import { HttpError } from './http';

export const PUBLIC_MODULES="SELECT m.id FROM learning_modules m JOIN jlpt_levels l ON l.id=m.level_id WHERE m.content_status='PUBLISHED' AND l.level='N5'";
export const utcNow=()=>new Date().toISOString();
export type Row=Record<string,any>;
export class LearningDB {
  constructor(public db:D1Database, public userId:number) {}
  sql(query:string,...args:any[]) {return this.db.prepare(query).bind(...args);}
  guard(condition:string,...args:any[]) {
    return this.sql(`INSERT INTO mutation_guards(id,ok) VALUES (?,CASE WHEN (${condition}) THEN 1 ELSE 0 END)`,crypto.randomUUID(),...args);
  }
  moduleGuard(id:number) {return this.guard(`? IN (${PUBLIC_MODULES})`,id);}
  async batch(statements:D1PreparedStatement[]) {
    // Every caller's guards and writes execute in the same SQLite transaction.
    return this.db.batch<Row>([
      this.guard('EXISTS(SELECT 1 FROM users WHERE id=? AND is_active=1)',this.userId),
      ...statements,this.sql('DELETE FROM mutation_guards'),
    ]);
  }
  async module(id:number) {
    if(!await this.sql(`SELECT id FROM learning_modules WHERE id=? AND id IN (${PUBLIC_MODULES})`,id).first())throw new HttpError(404,'Module not found');
  }
  async revision() {return Number((await this.sql('SELECT version FROM assessment_revision WHERE id=1').first<Row>())!.version);}
  revisionGuard(version:number) {return this.guard('(SELECT version FROM assessment_revision WHERE id=1)=?',version);}
  xp(key:string,operation:string,amount:number,kind:string,condition='1',args:any[]=[]) {
    return this.sql(`INSERT INTO xp_events(event_key,operation_id,user_id,amount,kind) SELECT ?,?,?,?,? WHERE ${condition} ON CONFLICT(event_key) DO NOTHING`,key,operation,this.userId,amount,kind,...args);
  }
}
export function isGuardError(error:unknown) {return String(error).includes('mutation_check');}
