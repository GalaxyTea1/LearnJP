// N5 Vietnamese localization: node scripts/content/n5/apply-vietnamese.mjs staging|production [--apply]
// The N5 course was imported with English meanings and translations. content/n5/vi-XX.mjs hold the
// Vietnamese text keyed by D1 row id; this script turns them into column updates for the 12 published
// N5 modules, refreshes content_search for changed rows, and refuses to run if any learner-facing
// English text would remain. Default: dry run. --apply backs up the database first and verifies that
// only the listed columns of the listed rows changed.
// The older N5 review pipeline (scripts/content/n5/package.mjs) still describes the English text; run this
// script again after any re-import from it.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {connect,literal} from '../lib/remote-d1.mjs';

const units=await Promise.all(Array.from({length:12},(_,i)=>import(`../../../content/n5/vi-${String(i+1).padStart(2,'0')}.mjs`).then(m=>m.default)));
const sectionTitles={OVERVIEW:'Tổng quan',VOCABULARY:'Từ vựng',KANJI:'Hán tự',GRAMMAR:'Ngữ pháp',KAIWA:'Hội thoại',LISTENING:'Luyện nghe',READING:'Đọc hiểu',WRITING:'Tự luyện viết',EXERCISE:'Bài tập',SUMMARY:'Tổng kết'};
const source='Nội dung do LearnJP biên soạn';
const vi=/[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;
// English if it has a Latin word and no Vietnamese letter (romaji in parentheses alone does not count).
export const isEnglish=s=>typeof s==='string'&&!vi.test(s)&&/[A-Za-z]{3,}/.test(s.replace(/\([a-z' ]+\)|TTS:ja-JP|IMC|ABC|[A-Z]:/g,''));

const target=process.argv[2];
assert.ok(['staging','production'].includes(target),'Usage: node scripts/content/n5/apply-vietnamese.mjs staging|production [--apply]');
const db=await connect(target);
const {query,rows:one}=db;

const modules=await one("SELECT m.id,m.unit_number FROM learning_modules m JOIN jlpt_levels l ON l.id=m.level_id WHERE l.level='N5' AND m.content_status='PUBLISHED' ORDER BY m.unit_number");
assert.deepEqual(modules.map(m=>m.unit_number),[1,2,3,4,5,6,7,8,9,10,11,12]);
const ids=modules.map(m=>m.id).join(','),secs=`SELECT id FROM lesson_sections WHERE module_id IN (${ids})`;
const where={
 lesson_sections:`module_id IN (${ids})`,vocabulary:`module_id IN (${ids})`,kanji:`module_id IN (${ids})`,grammar_patterns:`module_id IN (${ids})`,
 grammar_examples:`grammar_pattern_id IN (SELECT id FROM grammar_patterns WHERE module_id IN (${ids}))`,
 conversations:`section_id IN (${secs})`,conversation_lines:`conversation_id IN (SELECT id FROM conversations WHERE section_id IN (${secs}))`,
 listening_content:`section_id IN (${secs})`,reading_passages:`section_id IN (${secs})`,writing_tasks:`section_id IN (${secs})`,lesson_exercises:`section_id IN (${secs})`,
};
const snapshot=async()=>Object.fromEntries(await Promise.all(Object.entries(where).map(async([t,w])=>[t,await one(`SELECT * FROM ${t} WHERE ${w} ORDER BY id`)])));
const before=await snapshot();
const byId=Object.fromEntries(Object.entries(before).map(([t,rows])=>[t,new Map(rows.map(r=>[r.id,r]))]));
const changes=new Map(),intended=new Set();// "table:id" -> {table,id,set}; intended: "table:id:column" with a translated value
const set=(table,id,values)=>{const row=byId[table].get(Number(id));assert.ok(row,`${table} ${id} is not part of the published N5 course`);const key=`${table}:${id}`;const c=changes.get(key)??{table,id:row.id,set:{}};for(const [k,v] of Object.entries(values)){assert.ok(k in row,`${table}.${k}`);intended.add(`${key}:${k}`);if(row[k]!==v)c.set[k]=v;}if(Object.keys(c.set).length)changes.set(key,c);};

for(const u of units){
 for(const [id,[meaning,example]] of Object.entries(u.vocabulary??{}))set('vocabulary',id,{english:meaning,example_en:example});
 for(const [id,[meaning,examples]] of Object.entries(u.kanji??{})){
  const row=byId.kanji.get(Number(id));assert.ok(row,`kanji ${id}`);const words=JSON.parse(row.example_words);
  assert.equal(words.length,examples.length,`kanji ${id} example count`);
  const values={meaning,example_words:JSON.stringify(words.map((w,i)=>({...w,en:examples[i]})))};
  if(isEnglish(row.mnemonic))values.mnemonic=`Tập viết ${row.character}${row.radical?` theo bộ ${row.radical}`:''}; liên hệ nghĩa “${meaning.split(' — ')[1]}” với các từ ví dụ.`;
  set('kanji',id,values);
 }
 for(const [id,[meaning,explanation]] of Object.entries(u.grammar_patterns??{}))set('grammar_patterns',id,explanation?{meaning,explanation}:{meaning});
 for(const [id,pattern] of Object.entries(u.grammar_pattern_names??{}))set('grammar_patterns',id,{pattern});
 for(const [id,english] of Object.entries(u.grammar_examples??{}))set('grammar_examples',id,{english});
 for(const [id,title] of Object.entries(u.conversations??{}))set('conversations',id,{title});
 for(const [id,translation] of Object.entries(u.conversation_lines??{}))set('conversation_lines',id,{translation});
 for(const [id,[title,instructions,transcript_translation]] of Object.entries(u.listening_content??{}))set('listening_content',id,{title,instructions,transcript_translation});
 for(const [id,[title,translation]] of Object.entries(u.reading_passages??{}))set('reading_passages',id,translation?{title,translation}:{title});
 for(const [id,value] of Object.entries(u.writing_tasks??{})){const [title,prompt]=Array.isArray(value)?value:[byId.writing_tasks.get(Number(id))?.title.replace(/^Writing task (\d+)$/,'Bài viết $1'),value];set('writing_tasks',id,{title,prompt});}
}
for(const r of before.lesson_sections)if(sectionTitles[r.section_type])set('lesson_sections',r.id,{title:sectionTitles[r.section_type]});
for(const t of ['listening_content','reading_passages'])for(const r of before[t])if(r.source==='Original SumaryJapanese content')set(t,r.id,{source});
for(const r of before.writing_tasks)if(/^Writing task \d+$/.test(r.title)&&!changes.get(`writing_tasks:${r.id}`)?.set.title)set('writing_tasks',r.id,{title:r.title.replace(/^Writing task (\d+)$/,'Bài viết $1')});
const exerciseFixes=[['（total）',''],["(Let's go)",'(cùng đi nào)'],['Menu ghi','Thực đơn ghi']];
for(const r of before.lesson_exercises)for(const [from,to] of exerciseFixes)for(const k of ['prompt','explanation'])if(r[k]?.includes(from))set('lesson_exercises',r.id,{[k]:(changes.get(`lesson_exercises:${r.id}`)?.set[k]??r[k]).replace(from,to)});

// Every learner-facing text column left unchanged must already be Vietnamese (or Japanese); translated
// values are trusted, since short Vietnamese words without diacritics ("phim", "kem") look like English.
const checked={vocabulary:['english','example_en'],kanji:['meaning','example_words','mnemonic'],grammar_patterns:['pattern','meaning','explanation'],grammar_examples:['english'],conversations:['title','context'],conversation_lines:['translation'],listening_content:['title','instructions','transcript_translation','source'],reading_passages:['title','translation','source'],writing_tasks:['title','prompt','instructions'],lesson_sections:['title','instructions'],lesson_exercises:['prompt','explanation']};
const remaining=[];
for(const [t,cols] of Object.entries(checked))for(const r of before[t]){const next={...r,...(changes.get(`${t}:${r.id}`)?.set??{})};for(const c of cols)if(!intended.has(`${t}:${r.id}:${c}`)&&isEnglish(t==='kanji'&&c==='example_words'?JSON.parse(next[c]??'[]').map(w=>w.en).join(' / '):next[c]))remaining.push(`${t}.${c}#${r.id}: ${String(next[c]).slice(0,60)}`);}
assert.deepEqual(remaining,[],'English text would remain');

// content_search mirrors these columns (scripts/content/n5/search-index.mjs).
const searchFields={vocabulary:['vocabulary',['japanese','hiragana','romaji','english']],kanji:['kanji',['character','meaning','onyomi','kunyomi']],grammar_patterns:['grammar',['pattern','meaning','explanation']]};
const statements=[];
for(const {table,id,set:values} of changes.values()){
 statements.push(`UPDATE ${table} SET ${Object.entries(values).map(([k,v])=>`${k}=${literal(v)}`).join(',')} WHERE id=${id}`);
 const s=searchFields[table];
 if(s&&s[1].some(f=>f in values)){const row={...byId[table].get(id),...values};statements.push(`UPDATE content_search SET search_text=${literal(s[1].map(f=>row[f]||'').join('\u001f').toLowerCase())} WHERE kind='${s[0]}' AND item_id=${id}`);}
}
const summary=Object.fromEntries(Object.keys(where).map(t=>[t,[...changes.values()].filter(c=>c.table===t).length]));
const dir=resolve(`.local/n5-vietnamese-${target}`);await mkdir(dir,{recursive:true});
await writeFile(resolve(dir,'update.sql'),statements.join(';\n')+';\n');
if(!process.argv.includes('--apply')){console.log(JSON.stringify({mode:'check',target,statements:statements.length,rows:summary}));process.exit(0);}
if(!statements.length){console.log(JSON.stringify({mode:'apply',target,rows:summary}));process.exit(0);}

const searchBefore=await one(`SELECT * FROM content_search ORDER BY kind,item_id`);
const backup=db.backup(dir,'before');
for(let i=0;i<statements.length;i+=150)await query(statements.slice(i,i+150).join(';\n'));
const after=await snapshot();
for(const [t,rows] of Object.entries(before)){assert.equal(after[t].length,rows.length);for(const [i,row] of rows.entries())assert.deepEqual(after[t][i],{...row,...(changes.get(`${t}:${row.id}`)?.set??{})},`Unexpected change in ${t} ${row.id}`);}
const searchAfter=await one(`SELECT * FROM content_search ORDER BY kind,item_id`);
assert.equal(searchAfter.length,searchBefore.length);
const changedSearch=searchAfter.filter((r,i)=>r.search_text!==searchBefore[i].search_text).length;
const receipt={mode:'apply',target,backup,statements:statements.length,rows:summary,searchRowsUpdated:changedSearch,verified:true};
await writeFile(resolve(dir,'applied.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
