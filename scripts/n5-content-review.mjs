import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {sentenceAnswers,listeningLinks,readingLinks,editorialChanges,quizChanges} from './n5-review-corrections.mjs';
import {exerciseChanges,readingCorrections} from './n5-exercise-corrections.mjs';
import {unit1Changes} from './n5-unit1-corrections.mjs';
import {unit2Changes} from './n5-unit2-corrections.mjs';
import {unit3Changes} from './n5-unit3-corrections.mjs';
import {unit4Changes} from './n5-unit4-corrections.mjs';
import {unit5Changes} from './n5-unit5-corrections.mjs';
import {unit6Changes} from './n5-unit6-corrections.mjs';
import {unit7Changes} from './n5-unit7-corrections.mjs';
import {unit8Changes} from './n5-unit8-corrections.mjs';
import {unit9Changes} from './n5-unit9-corrections.mjs';
import {unit10Changes} from './n5-unit10-corrections.mjs';
import {unit11Changes} from './n5-unit11-corrections.mjs';
import {unit12Changes} from './n5-unit12-corrections.mjs';

export const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function reviewSnapshot(source,{exerciseReview=true,unit1Review=exerciseReview,unit2Review=unit1Review,unit3Review=unit2Review,unit4Review=unit3Review,unit5Review=unit4Review,unit6Review=unit5Review,unit7Review=unit6Review,unit8Review=unit7Review,unit9Review=unit8Review,unit10Review=unit9Review,unit11Review=unit10Review,unit12Review=unit11Review}={}) {
  const candidate=structuredClone(source),changes=[];
  let revisionBase=source,reviewedAt='2026-10-17T00:00:00.000Z';
  const levels=new Set(source.jlpt_levels.filter(l=>l.level==='N5').map(l=>l.id));
  const modules=source.learning_modules.filter(m=>m.contentStatus==='PUBLISHED'&&levels.has(m.levelId));
  const moduleIds=new Set(modules.map(m=>m.id));
  const sections=new Map(source.lesson_sections.map(s=>[s.id,s]));
  function change(table,id,after,reason) {
    const row=candidate[table].find(r=>r.id===id),original=revisionBase[table].find(r=>r.id===id);
    assert.ok(row,`${table}/${id} missing`);
    const parent=table==='conversation_lines'?candidate.conversations.find(c=>c.id===row.conversationId):table==='grammar_examples'?candidate.grammar_patterns.find(g=>g.id===row.grammarPatternId):row;
    assert.ok(moduleIds.has(table==='learning_modules'?row.id:parent?.moduleId??sections.get(parent?.sectionId)?.moduleId),'Do not change draft/mock modules');
    assert.ok(!('status' in after),'Review cannot publish');
    if(table==='quiz_questions')assert.ok(Object.keys(after).every(k=>['question','options','correctIndex','explanation'].includes(k)),'Only edit quiz content');
    const before=Object.fromEntries(Object.keys(after).map(k=>[k,structuredClone(row[k])]));
    Object.assign(row,after);
    changes.push({table,id,before,after,reason});
    // Bump each edited entity only once; base snapshot remains untouched.
    if('version' in original)row.version=original.version+1;
    if('updatedAt' in original)row.updatedAt=reviewedAt;
  }
  for(const [id,correctAnswer] of Object.entries(sentenceAnswers)) {
    const row=candidate.lesson_exercises.find(r=>r.id===Number(id));
    assert.equal(row?.exerciseType,'SENTENCE_ORDERING');
    change('lesson_exercises',Number(id),{correctAnswer},'Đáp án sắp xếp phải là câu đầy đủ, không phải chỉ số một mảnh câu.');
  }
  for(const [field,table,mapping] of [['listeningId','listening_content',listeningLinks],['readingPassageId','reading_passages',readingLinks]]) {
    for(const [parentId,ids] of Object.entries(mapping)) for(const id of ids) {
      const parent=candidate[table].find(r=>r.id===Number(parentId));
      const row=candidate.lesson_exercises.find(r=>r.id===id);
      assert.equal(row[field],null,'Refuse to overwrite an existing relationship');
      assert.equal(sections.get(row.sectionId)?.moduleId,sections.get(parent.sectionId)?.moduleId);
      change('lesson_exercises',id,{[field]:Number(parentId)},'Gắn câu hỏi với ngữ cảnh đã đối chiếu; publication filter theo bài nguồn.');
    }
  }
  for(const [table,id,after,reason] of editorialChanges)change(table,id,after,reason);
  for(const [id,after,reason] of quizChanges)change('quiz_questions',id,after,reason);
  for(const item of candidate.listening_content.filter(l=>moduleIds.has(sections.get(l.sectionId)?.moduleId))) {
    assert.ok(item.transcript?.trim(),'TTS requires a transcript');
    assert.ok(item.audioUrl?.startsWith('PENDING_AUDIO'),'Do not replace an existing recording');
    change('listening_content',item.id,{audioUrl:'TTS:ja-JP',durationSeconds:null},'Người dùng chọn TTS cho beta; không giả thời lượng hoặc bản thu người thật.');
  }
  const previousCandidate=structuredClone(candidate);
  if(exerciseReview) {
    revisionBase=previousCandidate;reviewedAt='2026-10-18T00:00:00.000Z';
    for(const [id,after] of exerciseChanges)change('lesson_exercises',id,after,'Đợt 2: làm rõ nghĩa/mẫu câu và đáp án bài tập.');
    for(const [table,id,field,wrong,right] of readingCorrections) {
      const row=candidate[table].find(r=>r.id===id);
      assert.equal(row[field].split(wrong).length,2,'Expected exactly one reviewed reading typo');
      change(table,id,{[field]:row[field].replace(wrong,right)},'Đợt 2: sửa phiên âm đã đối chiếu với câu gốc.');
    }
  }
  const exerciseCandidate=structuredClone(candidate);
  if(unit1Review) {
    assert.ok(exerciseReview,'Unit 1 review requires exercise review');
    revisionBase=exerciseCandidate;reviewedAt='2026-10-18T01:00:00.000Z';
    for(const [table,id,after] of unit1Changes)change(table,id,after,'Đợt 3 Unit 1: làm rõ ngữ cảnh và cách đọc, khớp thông tin nguồn.');
  }
  const unit1Candidate=structuredClone(candidate);
  if(unit2Review) {
    assert.ok(unit1Review,'Unit 2 review requires Unit 1 review');
    revisionBase=unit1Candidate;reviewedAt='2026-10-18T02:00:00.000Z';
    for(const [table,id,after,reason] of unit2Changes)change(table,id,after,'Đợt 4 Unit 2: '+reason);
  }
  const unit2Candidate=structuredClone(candidate);
  if(unit3Review) {
    assert.ok(unit2Review,'Unit 3 review requires Unit 2 review');
    revisionBase=unit2Candidate;reviewedAt='2026-10-18T03:00:00.000Z';
    for(const [table,id,after,reason] of unit3Changes)change(table,id,after,'Đợt 5 Unit 3: '+reason);
  }
  const unit3Candidate=structuredClone(candidate);
  if(unit4Review) {
    assert.ok(unit3Review,'Unit 4 review requires Unit 3 review');
    revisionBase=unit3Candidate;reviewedAt='2026-10-18T04:00:00.000Z';
    for(const [table,id,after,reason] of unit4Changes)change(table,id,after,'Đợt 6 Unit 4: '+reason);
  }
  const unit4Candidate=structuredClone(candidate);
  if(unit5Review) {
    assert.ok(unit4Review,'Unit 5 review requires Unit 4 review');
    revisionBase=unit4Candidate;reviewedAt='2026-10-18T05:00:00.000Z';
    for(const [table,id,after,reason] of unit5Changes)change(table,id,after,'Đợt 7 Unit 5: '+reason);
  }
  const unit5Candidate=structuredClone(candidate);
  if(unit6Review) {
    assert.ok(unit5Review,'Unit 6 review requires Unit 5 review');
    revisionBase=unit5Candidate;reviewedAt='2026-10-18T06:00:00.000Z';
    for(const [table,id,after,reason] of unit6Changes)change(table,id,after,'Đợt 8 Unit 6: '+reason);
  }
  const unit6Candidate=structuredClone(candidate);
  if(unit7Review) {
    assert.ok(unit6Review,'Unit 7 review requires Unit 6 review');
    revisionBase=unit6Candidate;reviewedAt='2026-10-18T07:00:00.000Z';
    for(const [table,id,after,reason] of unit7Changes)change(table,id,after,'Đợt 9 Unit 7: '+reason);
  }
  const unit7Candidate=structuredClone(candidate);
  if(unit8Review) {
    assert.ok(unit7Review,'Unit 8 review requires Unit 7 review');
    revisionBase=unit7Candidate;reviewedAt='2026-10-18T16:00:00.000Z';
    for(const [table,id,after,reason] of unit8Changes)change(table,id,after,'Đợt 10 Unit 8: '+reason);
  }
  const unit8Candidate=structuredClone(candidate);
  if(unit9Review) {
    assert.ok(unit8Review,'Unit 9 review requires Unit 8 review');
    revisionBase=unit8Candidate;reviewedAt='2026-10-18T17:00:00.000Z';
    for(const [table,id,after,reason] of unit9Changes)change(table,id,after,'Đợt 11 Unit 9: '+reason);
  }
  const unit9Candidate=structuredClone(candidate);
  if(unit10Review) {
    assert.ok(unit9Review,'Unit 10 review requires Unit 9 review');
    revisionBase=unit9Candidate;reviewedAt='2026-10-19T00:00:00.000Z';
    for(const [table,id,after,reason] of unit10Changes)change(table,id,after,'Đợt 12 Unit 10: '+reason);
  }
  const unit10Candidate=structuredClone(candidate);
  if(unit11Review) {
    assert.ok(unit10Review,'Unit 11 review requires Unit 10 review');
    revisionBase=unit10Candidate;reviewedAt='2026-10-19T01:00:00.000Z';
    for(const [table,id,after,reason] of unit11Changes)change(table,id,after,'Đợt 13 Unit 11: '+reason);
  }
  const unit11Candidate=structuredClone(candidate);
  if(unit12Review) {
    assert.ok(unit11Review,'Unit 12 review requires Unit 11 review');
    revisionBase=unit11Candidate;reviewedAt='2026-10-19T02:00:00.000Z';
    for(const [table,id,after,reason] of unit12Changes)change(table,id,after,'Đợt 14 Unit 12: '+reason);
  }
  return {candidate,unit11Candidate,unit10Candidate,previousCandidate,exerciseCandidate,unit1Candidate,unit2Candidate,unit3Candidate,unit4Candidate,unit5Candidate,unit6Candidate,unit7Candidate,unit8Candidate,unit9Candidate,changes,sourceChecksum:digest(source),candidateChecksum:digest(candidate)};
}

export function auditSnapshot(data) {
  const levels=new Set(data.jlpt_levels.filter(l=>l.level==='N5').map(l=>l.id));
  const findings=[],modules=data.learning_modules.filter(m=>m.contentStatus==='PUBLISHED'&&levels.has(m.levelId)).sort((a,b)=>a.unitNumber-b.unitNumber);
  const sections=new Map(data.lesson_sections.map(s=>[s.id,s]));
  const add=(code,table,id,message)=>findings.push({code,table,id,message});
  const moduleReports=modules.map(m=>{
    const ss=data.lesson_sections.filter(s=>s.moduleId===m.id),ids=new Set(ss.map(s=>s.id));
    const rows=t=>data[t].filter(r=>ids.has(r.sectionId));
    for(const s of ss) if(s.status!=='PUBLISHED')add('SECTION_NOT_PUBLIC','lesson_sections',s.id,'Section chưa xuất bản.');
    for(const e of rows('lesson_exercises')) {
      if(e.exerciseType==='SENTENCE_ORDERING') {
        if(typeof e.correctAnswer!=='string'||!e.correctAnswer.trim())add('ORDER_ANSWER','lesson_exercises',e.id,'Cần đáp án mẫu nguyên câu.');
      } else if(Array.isArray(e.options)&&(!Number.isInteger(e.correctAnswer)||e.correctAnswer<0||e.correctAnswer>=e.options.length))add('CHOICE_ANSWER','lesson_exercises',e.id,'Chỉ số đáp án không hợp lệ.');
      if(e.metadata?.skill==='LISTENING'&&!e.listeningId)add('MISSING_LISTENING_LINK','lesson_exercises',e.id,'Thiếu liên kết bài nghe.');
      if(e.metadata?.skill==='READING'&&!e.readingPassageId)add('MISSING_READING_LINK','lesson_exercises',e.id,'Thiếu liên kết bài đọc.');
      for(const [field,table] of [['listeningId','listening_content'],['readingPassageId','reading_passages']]) if(e[field]!=null) {
        const parent=data[table].find(r=>r.id===e[field]);
        if(!parent||sections.get(parent.sectionId)?.moduleId!==m.id)add('INVALID_CONTEXT','lesson_exercises',e.id,'Bài nguồn không tồn tại hoặc khác module.');
      }
    }
    for(const r of rows('reading_passages'))if(!r.translation?.trim())add('MISSING_TRANSLATION','reading_passages',r.id,'Chưa có bản dịch.');
    for(const l of rows('listening_content')) {
      if(l.audioUrl==='TTS:ja-JP'&&l.transcript?.trim())add('TTS_BETA','listening_content',l.id,'TTS đã chọn cho beta; chưa có bản thu người thật.');
      else if(!l.audioUrl?.trim()||l.audioUrl.startsWith('PENDING_AUDIO')||l.audioUrl.startsWith('TTS:'))add('MISSING_RECORDING','listening_content',l.id,'Chưa có âm thanh hoặc TTS hợp lệ.');
    }
    return {moduleId:m.id,unit:m.unitNumber,title:m.title,sectionIds:ss.map(s=>s.id),publicSections:ss.filter(s=>s.status==='PUBLISHED').length,conversations:rows('conversations').map(r=>r.id),listening:rows('listening_content').map(r=>r.id),reading:rows('reading_passages').map(r=>r.id),writing:rows('writing_tasks').map(r=>r.id),exercises:rows('lesson_exercises').map(r=>r.id),releaseStatus:'HOLD_FOR_REVIEW'};
  });
  return {modules:moduleReports,findings,counts:Object.fromEntries([...new Set(findings.map(f=>f.code))].map(code=>[code,findings.filter(f=>f.code===code).length]))};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  const source=JSON.parse(await readFile(new URL('../.local/content/n5.json',import.meta.url),'utf8'));
  const manifest=JSON.parse(await readFile(new URL('../docs/CF2-CONTENT-MANIFEST.json',import.meta.url),'utf8'));
  assert.equal(digest(source),manifest.sha256,'Source changed; re-review before generating');
  const {candidate,changes,sourceChecksum,candidateChecksum}=reviewSnapshot(source);
  const report={generatedAt:'2026-10-19',sourceChecksum,candidateChecksum,scope:'Review package generation only. Database application is tracked separately.',before:auditSnapshot(source),after:auditSnapshot(candidate),changes};
  await mkdir(new URL('../.local/content-review/',import.meta.url),{recursive:true});
  await writeFile(new URL('../.local/content-review/n5-candidate.json',import.meta.url),JSON.stringify(candidate,null,2)+'\n');
  await writeFile(new URL('../docs/N5-CONTENT-REVIEW.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({changes:changes.length,editedRows:new Set(changes.map(c=>c.table+'/'+c.id)).size,sourceChecksum,candidateChecksum,before:report.before.counts,after:report.after.counts},null,2));
}
