import { z } from 'zod';
import { type AuthUser } from './auth';
import { positive } from './content';
import { HttpError, json } from './http';
import { Study } from './study';
import { Assessments } from './assessments';
import { Srs, itemTypes } from './srs';
import { Learner, gameTypes, kanaTypes } from './learner';
import { isGuardError } from './learning-db';

export async function readJsonBody(request:Request) {
  if(request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='application/json')throw new HttpError(415,'JSON required');
  const reader=request.body?.getReader();if(!reader)return {};
  let size=0;const chunks:Uint8Array[]=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>131072){await reader.cancel();throw new HttpError(413,'Request body too large');}chunks.push(value);}
  const buffer=new Uint8Array(size);let offset=0;for(const c of chunks){buffer.set(c,offset);offset+=c.length;}
  try{return JSON.parse(new TextDecoder().decode(buffer)||'{}');}catch{throw new HttpError(400,'Invalid JSON');}
}
function filter(schema:z.ZodType<string>,value:string|null) {if(value===null)return undefined;const p=schema.safeParse(value);if(!p.success)throw new HttpError(400,'Invalid filter');return p.data;}
export async function handleLearning(request:Request,env:Env,user?:AuthUser):Promise<Response|null> {
  const u=new URL(request.url),path=u.pathname.replace(/\/$/,''),p=u.searchParams,method=request.method;
  const routes:[RegExp,string[]][]=[
    [/^\/api\/v1\/progress\/module\/[^/]+\/study$/,['GET','PATCH']],
    [/^\/api\/v1\/progress\/(me|review-items)$/,['GET']],
    [/^\/api\/v1\/progress\/module$/,['POST']],
    [/^\/api\/v1\/quizzes\/submit$/,['POST']],
    [/^\/api\/v1\/flashcards\/(due|stats)$/,['GET']],
    [/^\/api\/v1\/flashcards\/review$/,['POST']],
    [/^\/api\/v1\/tests\/attempts$/,['GET','POST']],
    [/^\/api\/v1\/tests\/attempts\/[^/]+\/submit$/,['POST']],
    [/^\/api\/v1\/(users\/dashboard|gamification\/me|gamification\/leaderboard|games\/leaderboard|games\/history|dictionary\/history)$/,['GET']],
    [/^\/api\/v1\/users\/settings$/,['GET','PUT']],
    [/^\/api\/v1\/gamification\/checkin$/,['POST']],
    [/^\/api\/v1\/kana\/progress$/,['GET','POST']],
    [/^\/api\/v1\/games\/score$/,['POST']],
    [/^\/api\/v1\/history\/search$/,['GET','DELETE']],
    [/^\/api\/v1\/history\/translation$/,['GET','POST','DELETE']],
  ];
  const route=routes.find(([r])=>r.test(path));if(!route)return null;
  if(!route[1].includes(method))throw new HttpError(405,'Method not allowed');
  const publicRoute=path.endsWith('/leaderboard');
  if(!publicRoute&&!user)throw new HttpError(401,'Authentication required');
  const learner=new Learner(env.DB,user?.id||0),study=new Study(env.DB,user?.id||0),assess=new Assessments(env.DB,user?.id||0,env.QUIZ_REVISION_SECRET),srs=new Srs(env.DB,user?.id||0);
  if(method!=='GET'){
    if(request.headers.get('X-Requested-With')!=='SumaryJP'||(request.headers.has('Origin')&&request.headers.get('Origin')!==env.FRONTEND_URL)||request.headers.get('Sec-Fetch-Site')==='cross-site')throw new HttpError(403,'Untrusted request');
  }
  const input=method!=='GET'&&method!=='DELETE'?await readJsonBody(request):undefined;
  const limit=()=>positive(p.get('limit'),20,100);
  let data:unknown,status=200,match;
  try {
    if((match=path.match(/\/progress\/module\/([^/]+)\/study$/)))data=method==='GET'?await study.read(positive(match[1])):await study.write(positive(match[1]),input);
    else if(path.endsWith('/progress/me'))data=await study.summary();
    else if(path.endsWith('/progress/review-items'))data=await study.reviewItems(limit());
    else if(path.endsWith('/progress/module'))data=await study.update(input);
    else if(path.endsWith('/quizzes/submit'))data=await assess.quiz(input);
    else if(path.endsWith('/flashcards/review'))data=await srs.review(input);
    else if(path.endsWith('/flashcards/due'))data=await srs.due(filter(itemTypes,p.get('itemType')),limit());
    else if(path.endsWith('/flashcards/stats'))data=await srs.stats();
    else if((match=path.match(/\/tests\/attempts\/([^/]+)\/submit$/)))data=await assess.submitTest(positive(match[1]),input);
    else if(path.endsWith('/tests/attempts')){data=method==='GET'?await assess.tests(p.has('templateId')?positive(p.get('templateId')):undefined):await assess.startTest(input);if(method==='POST')status=201;}
    else if(path.endsWith('/users/settings'))data=await learner.settings(input);
    else if(path.endsWith('/users/dashboard'))data=await learner.dashboard();
    else if(path.endsWith('/gamification/me'))data=await learner.stats();
    else if(path.endsWith('/gamification/checkin'))data=await learner.checkin();
    else if(path.endsWith('/leaderboard'))data=await learner.leaderboard(path.includes('/games/')?'games':'gamification',limit(),path.includes('/games/')?filter(gameTypes,p.get('gameType')):undefined);
    else if(path.endsWith('/games/score')){data=await learner.game(input);status=201;}
    else if(path.endsWith('/games/history'))data=await learner.games(filter(gameTypes,p.get('gameType')),limit());
    else if(path.endsWith('/kana/progress'))data=await learner.kana(filter(kanaTypes,p.get('kanaType')),input);
    else if(path.includes('/history/')||path.endsWith('/dictionary/history'))data=await learner.history(path.endsWith('/translation')?'translation':'search',limit(),method==='DELETE'?'delete':method==='POST'?'write':'read',input);
    return json({success:true,message:'Request completed',data},status);
  }catch(e){if(isGuardError(e))throw new HttpError(409,'Data changed; reload and retry');throw e;}
}
