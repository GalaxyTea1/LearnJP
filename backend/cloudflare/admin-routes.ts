import { Admin } from './admin';
import { type Kind } from './admin-validation';
import { type AuthUser } from './auth';
import { decode, positive } from './content';
import { HttpError, json } from './http';
import { readJsonBody } from './learning-routes';

export async function handleAdmin(request:Request,env:Env,user?:AuthUser):Promise<Response|null> {
  const url=new URL(request.url),path=url.pathname.replace(/\/$/,''),method=request.method;
  const admin=path.match(/^\/api\/v1\/admin\/(dashboard|users|settings|logs)(?:\/([^/]+)\/status)?$/);
  const content=path.match(/^\/api\/v1\/(levels|modules|vocabulary|kanji|grammar|quizzes|announcements)(?:\/([^/]+))?$/);
  const allAnnouncements=path==='/api/v1/announcements/all' && method==='GET';
  if(!admin && !allAnnouncements && (!content || method==='GET' || (content[1]==='quizzes' && content[2]==='submit')))return null;
  if(!user)throw new HttpError(401,'Authentication required');
  const service=new Admin(env.DB,user);
  if(method!=='GET' && (request.headers.get('X-Requested-With')!=='SumaryJP' || (request.headers.has('Origin') && request.headers.get('Origin')!==env.FRONTEND_URL) || request.headers.get('Sec-Fetch-Site')==='cross-site'))throw new HttpError(403,'Untrusted request');
  const body=()=>readJsonBody(request);
  let data:unknown,status=200;
  if(admin) {
    const [,name,id]=admin;
    if(name==='users' && id && method==='PUT')data=await service.updateUser(positive(id),await body());
    else if(id)throw new HttpError(405,'Method not allowed');
    else if(name==='dashboard' && method==='GET')data=await service.dashboard();
    else if(name==='users' && method==='GET')data=await service.users(url.searchParams);
    else if(name==='logs' && method==='GET')data=await service.logs(url.searchParams);
    else if(name==='settings' && ['GET','PUT'].includes(method))data=await service.settings(method==='PUT'?await body():undefined);
    else throw new HttpError(405,'Method not allowed');
  } else if(allAnnouncements) {
    const rows=await env.DB.prepare('SELECT a.*,u.id AS creator_id,u.username AS creator_username,u.display_name AS creator_display_name FROM announcements a LEFT JOIN users u ON u.id=a.created_by ORDER BY a.created_at DESC,a.id DESC').all();
    data=rows.results.map(row=>({...decode('announcements',row),creator:row.creator_id===null?null:{id:row.creator_id,username:row.creator_username,displayName:row.creator_display_name}}));
  } else {
    const kind=content![1] as Kind,id=content![2];
    if(kind==='vocabulary' && id==='bulk' && method==='POST'){data=await service.bulk(await body());status=201;}
    else if(!id && method==='POST'){data=await service.create(kind,await body());status=201;}
    else if(id && method==='PUT' && kind!=='quizzes')data=await service.edit(kind,positive(id),await body());
    else if(id && method==='DELETE' && kind!=='levels')data=await service.remove(kind,positive(id));
    else throw new HttpError(405,'Method not allowed');
  }
  return json({success:true,message:'Request completed',data},status);
}
