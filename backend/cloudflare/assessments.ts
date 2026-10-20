import { z } from 'zod';
import { digest } from './auth';
import { decode, quizRevision } from './content';
import { HttpError } from './http';
import { LearningDB, utcNow, isGuardError, type Row } from './learning-db';

const id=z.number().int().positive();
const choice=z.number().int().min(0);
const quizInput=z.object({moduleId:id,answers:z.array(z.object({questionId:id,selectedIndex:choice}).strict()).min(1).max(1000),timeTaken:z.number().int().min(0).max(86400).optional(),quizRevision:z.string().regex(/^[0-9a-f]{64}$/),requestId:z.string().uuid()}).strict();
function validateAnswers(answers:Row[],questions:Row[],choiceKey:string) {
  if(new Set(answers.map(a=>a.questionId)).size!==answers.length)throw new HttpError(400,'Each question may only be answered once');
  const map=new Map(questions.map(q=>[q.id,q]));
  for(const a of answers){const q=map.get(a.questionId);if(!q||!Array.isArray(q.options)||a[choiceKey]>=q.options.length)throw new HttpError(400,'Invalid question or selected option');}
}

export class Assessments extends LearningDB {
  constructor(db:D1Database,userId:number,private secret:string){super(db,userId);}
  async savedQuiz(requestId:string,hash:string) {
    const row=await this.sql('SELECT request_hash,response FROM user_quiz_attempts WHERE user_id=? AND request_id=?',this.userId,requestId).first<Row>();
    if(!row)return null;
    if(row.request_hash!==hash)throw new HttpError(409,'QUIZ_REQUEST_CONFLICT');
    if(!row.response)throw new HttpError(503,'Saved quiz response unavailable');
    return JSON.parse(row.response);
  }
  async quiz(input:unknown) {
    const parsed=quizInput.safeParse(input);if(!parsed.success)throw new HttpError(400,'Invalid quiz submission');
    const d=parsed.data,hash=await digest(JSON.stringify([d.moduleId,d.quizRevision,d.timeTaken??null,[...d.answers].sort((a,b)=>a.questionId-b.questionId)]));
    const saved=await this.savedQuiz(d.requestId,hash);if(saved)return saved;
    await this.module(d.moduleId);
    const snapshot=await this.db.batch<Row>([this.sql('SELECT version FROM assessment_revision WHERE id=1'),this.sql('SELECT * FROM quiz_questions WHERE module_id=? ORDER BY id',d.moduleId)]);
    const version=Number(snapshot[0].results[0].version),questions=snapshot[1].results.map(r=>decode('quiz_questions',r));
    if(!questions.length)throw new HttpError(404,'No quiz questions found');
    if(questions.some(q=>!Array.isArray(q.options)||q.options.length<2||!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>=q.options.length))throw new HttpError(409,'Quiz content needs correction');
    if(d.quizRevision!==await quizRevision(d.moduleId,questions,this.secret))throw new HttpError(409,'QUIZ_REVISION_CHANGED');
    validateAnswers(d.answers,questions,'selectedIndex');
    const submitted=new Map(d.answers.map(a=>[a.questionId,a.selectedIndex]));let score=0;
    const results=questions.map(q=>{const selected=submitted.get(q.id)??null,isCorrect=selected!==null&&selected===q.correctIndex;if(isCorrect)score++;return {questionId:q.id,selected,isCorrect,correctIndex:q.correctIndex,explanation:q.explanation??''};});
    const passed=score*100>=questions.length*70,scorePercent=Math.floor(score/questions.length*1000)/10;
    const response={attemptId:0,score,totalQuestions:questions.length,scorePercent,xpEarned:0,passed,results};
    const stamp=utcNow(),event=`quiz:${this.userId}:${d.moduleId}`;
    try {
      const batch=await this.batch([
        this.moduleGuard(d.moduleId),this.revisionGuard(version),
        this.sql('INSERT INTO user_quiz_attempts(user_id,module_id,request_id,request_hash,score,total_questions,answers,time_taken) VALUES (?,?,?,?,?,?,?,?)',this.userId,d.moduleId,d.requestId,hash,score,questions.length,JSON.stringify(results),d.timeTaken??null),
        this.xp(event,d.requestId,score*10,'quiz',"?=1 AND NOT EXISTS(SELECT 1 FROM user_module_progress WHERE user_id=? AND module_id=? AND status='COMPLETED')",[Number(passed),this.userId,d.moduleId]),
        this.sql(`INSERT INTO user_module_progress(user_id,module_id,status,progress_percent,started_at,completed_at) VALUES (?,?,?,?,?,?) ON CONFLICT(user_id,module_id) DO UPDATE SET
          status=CASE WHEN status='COMPLETED' OR excluded.status='COMPLETED' THEN 'COMPLETED' ELSE 'IN_PROGRESS' END,
          progress_percent=max(progress_percent,excluded.progress_percent),completed_at=coalesce(completed_at,excluded.completed_at),updated_at=excluded.started_at`,this.userId,d.moduleId,passed?'COMPLETED':'IN_PROGRESS',passed?100:Math.max(1,Math.floor(scorePercent)),stamp,passed?stamp:null),
        this.sql(`UPDATE user_quiz_attempts SET response=json_set(?,'$.attemptId',id,'$.xpEarned',coalesce((SELECT amount FROM xp_events WHERE event_key=? AND operation_id=?),0)) WHERE user_id=? AND request_id=? RETURNING response`,JSON.stringify(response),event,d.requestId,this.userId,d.requestId),
      ]);
      return JSON.parse(String(batch[6].results[0].response));
    }catch(e){
      if(isGuardError(e)||String(e).includes('UNIQUE constraint')){const previous=await this.savedQuiz(d.requestId,hash);if(previous)return previous;throw new HttpError(409,'QUIZ_REVISION_CHANGED');}
      throw e;
    }
  }
  async startTest(input:unknown):Promise<Row> {
    const parsed=z.object({templateId:id,requestId:z.string().uuid().optional()}).strict().safeParse(input);
    if(!parsed.success)throw new HttpError(400,'Invalid test request');
    const {templateId,requestId}=parsed.data;
    if(requestId){const previous=await this.sql('SELECT * FROM user_test_attempts WHERE user_id=? AND start_request_id=?',this.userId,requestId).first<Row>();if(previous){if(previous.template_id!==templateId)throw new HttpError(409,'TEST_REQUEST_CONFLICT');return decode('user_test_attempts',previous);}}
    const snapshot=await this.db.batch<Row>([this.sql('SELECT version FROM assessment_revision WHERE id=1'),this.sql("SELECT * FROM test_templates WHERE id=? AND is_published=1 AND level='N5'",templateId),this.sql('SELECT q.* FROM test_questions q JOIN test_sections s ON s.id=q.section_id WHERE s.template_id=? ORDER BY q.id',templateId)]);
    if(!snapshot[1].results.length)throw new HttpError(404,'Published test template not found');
    const questions=snapshot[2].results.map(r=>decode('test_questions',r));
    if(!questions.length)throw new HttpError(409,'Test has no questions');
    if(questions.some(q=>!Array.isArray(q.options)||q.options.length<2||!Number.isSafeInteger(q.points)||q.points<1||!Number.isInteger(q.correctAnswer)||q.correctAnswer<0||q.correctAnswer>=q.options.length))throw new HttpError(409,'Test content needs correction');
    const maxScore=questions.reduce((sum,q)=>sum+q.points,0);
    try {
      const r=await this.batch([this.revisionGuard(Number(snapshot[0].results[0].version)),this.guard("EXISTS(SELECT 1 FROM test_templates WHERE id=? AND is_published=1 AND level='N5')",templateId),
        this.sql('INSERT INTO user_test_attempts(user_id,template_id,max_score,question_snapshot,start_request_id) VALUES (?,?,?,?,?) RETURNING *',this.userId,templateId,maxScore,JSON.stringify(questions),requestId??null)]);
      return decode('user_test_attempts',r[3].results[0]);
    }catch(e){if(requestId&&String(e).includes('UNIQUE constraint'))return this.startTest(input);if(isGuardError(e))throw new HttpError(409,'Test content changed; reload');throw e;}
  }
  async submitTest(attemptId:number,input:unknown) {
    const parsed=z.object({answers:z.array(z.object({questionId:id,selectedAnswer:choice}).strict()).max(1000)}).strict().safeParse(input);
    if(!parsed.success)throw new HttpError(400,'Invalid test answers');
    const answers=[...parsed.data.answers].sort((a,b)=>a.questionId-b.questionId),hash=await digest(JSON.stringify(answers));
    const saved=await this.sql('SELECT * FROM user_test_attempts WHERE id=? AND user_id=?',attemptId,this.userId).first<Row>();
    if(!saved)throw new HttpError(404,'Attempt not found');
    if(saved.status==='COMPLETED'){
      if(saved.submission_hash!==hash||!saved.submission_response)throw new HttpError(409,'Attempt already submitted with different answers');
      return JSON.parse(saved.submission_response);
    }
    if(saved.status!=='IN_PROGRESS'||!saved.question_snapshot)throw new HttpError(409,'Attempt unavailable; start a new test');
    const questions=JSON.parse(saved.question_snapshot) as Row[];validateAnswers(answers,questions,'selectedAnswer');
    const snapshot=await this.db.batch<Row>([this.sql('SELECT version FROM assessment_revision WHERE id=1'),this.sql('SELECT q.* FROM test_questions q JOIN test_sections s ON s.id=q.section_id WHERE s.template_id=? ORDER BY q.id',saved.template_id)]);
    if(JSON.stringify(snapshot[1].results.map(r=>decode('test_questions',r)))!==saved.question_snapshot)throw new HttpError(409,'TEST_REVISION_CHANGED');
    let totalScore=0;
    const records=answers.map(a=>{const q=questions.find(q=>q.id===a.questionId)!;const correct=q.correctAnswer===a.selectedAnswer,points=correct?q.points:0;totalScore+=points;return {...a,isCorrect:Number(correct),pointsEarned:points};});
    const xpEarned=Math.min(150,Math.round(totalScore/Math.max(1,saved.max_score)*150));
    const stamp=utcNow(),attempt=decode('user_test_attempts',{...saved,status:'COMPLETED',finished_at:stamp,total_score:totalScore,answers:JSON.stringify(answers)});
    const response={attempt,totalScore,maxScore:saved.max_score,xpEarned};
    try {await this.batch([
      this.revisionGuard(Number(snapshot[0].results[0].version)),this.guard("EXISTS(SELECT 1 FROM test_templates WHERE id=? AND is_published=1 AND level='N5')",saved.template_id),
      this.guard("EXISTS(SELECT 1 FROM user_test_attempts WHERE id=? AND user_id=? AND status='IN_PROGRESS')",attemptId,this.userId),
      this.sql(`INSERT INTO user_test_answers(attempt_id,question_id,selected_answer,is_correct,points_earned) SELECT ?,json_extract(value,'$.questionId'),json_extract(value,'$.selectedAnswer'),json_extract(value,'$.isCorrect'),json_extract(value,'$.pointsEarned') FROM json_each(?)`,attemptId,JSON.stringify(records)),
      this.sql("UPDATE user_test_attempts SET status='COMPLETED',finished_at=?,total_score=?,answers=?,submission_hash=?,submission_response=? WHERE id=? AND user_id=?",stamp,totalScore,JSON.stringify(answers),hash,JSON.stringify(response),attemptId,this.userId),
      this.xp(`test:${attemptId}`,String(attemptId),xpEarned,'test'),
    ]);return response;}catch(e){
      if(isGuardError(e)){const current=await this.sql('SELECT submission_hash,submission_response FROM user_test_attempts WHERE id=? AND user_id=?',attemptId,this.userId).first<Row>();if(current?.submission_response&&current.submission_hash===hash)return JSON.parse(current.submission_response);throw new HttpError(409,'Test changed or already submitted');}throw e;
    }
  }
  async tests(templateId?:number) {
    const result=await this.sql(`SELECT a.*,t.title,t.level,t.duration_minutes FROM user_test_attempts a JOIN test_templates t ON t.id=a.template_id WHERE a.user_id=?${templateId?' AND a.template_id=?':''} ORDER BY a.started_at DESC,a.id DESC LIMIT 100`,this.userId,...(templateId?[templateId]:[])).all();
    return result.results.map(r=>({...decode('user_test_attempts',r),template:{id:r.template_id,title:r.title,level:r.level,durationMinutes:r.duration_minutes}}));
  }
}
