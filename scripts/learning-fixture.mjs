import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { unstable_splitSqlQuery } from 'wrangler';
import { build } from '../frontend/node_modules/esbuild/lib/main.js';

export async function migrate(db) {
  for(const name of (await readdir(new URL('../backend/cloudflare/migrations/',import.meta.url))).filter(n=>n.endsWith('.sql')).sort()) {
    const sql=await readFile(new URL('../backend/cloudflare/migrations/'+name,import.meta.url),'utf8');
    await db.batch(unstable_splitSqlQuery(sql).map(s=>db.prepare(s)));
  }
}
export async function load(name) {
  const output=await build({entryPoints:[fileURLToPath(new URL(`../backend/cloudflare/${name}.ts`,import.meta.url))],bundle:true,format:'esm',platform:'browser',write:false});
  return import('data:text/javascript;base64,'+Buffer.from(output.outputFiles[0].text+`\n//# sourceURL=cloudflare-test-${name}.mjs`).toString('base64'));
}
export async function fixtures(db) {
  const data=JSON.parse(await readFile(new URL('../.local/content/n5.json',import.meta.url),'utf8'));
  const fields=JSON.parse(await readFile(new URL('../backend/cloudflare/columns.json',import.meta.url),'utf8'));
  const add=async(table,row)=>db.prepare(`INSERT INTO ${table} (${fields[table].map(f=>f.column).join(',')}) VALUES (${fields[table].map(()=>'?').join(',')})`).bind(...fields[table].map(f=>row[f.name]==null?null:f.type==='Json'?JSON.stringify(row[f.name]):f.type==='Boolean'?Number(row[f.name]):row[f.name])).run();
  await add('jlpt_levels',data.jlpt_levels[0]);
  const module=data.learning_modules.find(m=>m.contentStatus==='PUBLISHED');
  await add('learning_modules',{...module,id:1});
  await add('learning_modules',{...module,id:2,unitNumber:99});
  await add('learning_modules',{...module,id:3,unitNumber:100,contentStatus:'DRAFT'});
  for(const [id,moduleId] of [[1,1],[2,1],[3,2],[4,3]])await add('vocabulary',{...data.vocabulary[0],id,moduleId});
  await db.prepare("INSERT INTO test_templates(id,title,level,duration_minutes,total_questions,is_published) VALUES (1,'Fixture','N5',10,2,1)").run();
  await db.prepare("INSERT INTO test_sections(id,template_id,section_type,title,sort_order) VALUES (1,1,'GRAMMAR','Fixture',1)").run();
  for(let i=1;i<=2;i++)await db.prepare("INSERT INTO test_questions(id,section_id,question_type,question_text,options,correct_answer,points,sort_order) VALUES (?,1,'MULTIPLE_CHOICE','Fixture','[\"a\",\"b\"]',0,?,?)").bind(i,i,i).run();
}
export async function quizQuestions(db,count=10) {
  await db.prepare('DELETE FROM quiz_questions').run();
  await db.batch(Array.from({length:count},(_,i)=>db.prepare("INSERT INTO quiz_questions(id,module_id,question,options,correct_index,explanation) VALUES (?,1,?,'[\"a\",\"b\"]',0,'Explanation')").bind(i+1,'Question '+(i+1))));
}
