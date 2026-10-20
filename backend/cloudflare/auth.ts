import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { HttpError, json } from './http';

export type AuthUser = { id:number; email:string; username:string; role:string };
type UserRow = AuthUser & { password_hash:string; display_name:string; avatar_url:string|null; is_active:number; current_streak:number; last_study_date:string|null; created_at:string };
type AuthEnv = Pick<Env,'DB'> & { JWT_SECRET:string; FRONTEND_URL:string; APP_ENV:string };
const encoder=new TextEncoder();
const ACCESS_SECONDS=900, REFRESH_SECONDS=604800;
const bytePassword=z.string().max(72).refine(v=>encoder.encode(v).length<=72,'Password exceeds 72 UTF-8 bytes');
const registration=z.object({email:z.string().trim().toLowerCase().email().max(254),username:z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),password:bytePassword.min(8),displayName:z.string().trim().min(1).max(80).optional()});
const loginInput=z.object({login:z.string().trim().min(1).max(254),password:bytePassword.min(1)});
const now=()=>Math.floor(Date.now()/1000);
const iso=(seconds:number)=>new Date(seconds*1000).toISOString();
export const digest=async(value:string)=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value)))].map(b=>b.toString(16).padStart(2,'0')).join('');
function settings(env:AuthEnv) {
  const origin=new URL(env.FRONTEND_URL);
  const local=['localhost','127.0.0.1','[::1]'].includes(origin.hostname);
  if (origin.origin!==env.FRONTEND_URL || !['local','production'].includes(env.APP_ENV) || env.JWT_SECRET.length<32 ||
    (env.APP_ENV==='local' && !local) ||
    (env.APP_ENV==='production' && (local || origin.protocol!=='https:' || env.JWT_SECRET.startsWith('local-only-')))) throw new HttpError(503,'Authentication configuration unavailable');
  return { key:encoder.encode(env.JWT_SECRET), secure:env.APP_ENV==='production', origin:origin.origin };
}
function cookieName(env:AuthEnv) {return settings(env).secure?'__Secure-sumaryjp_refresh':'sumaryjp_refresh';}
function cookie(request:Request,env:AuthEnv) {
  const name=cookieName(env)+'=';
  const value=request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(name))?.slice(name.length);
  try {return value?decodeURIComponent(value):null;}catch{return null;}
}
function cookieHeader(env:AuthEnv,token:string|null) {
  return `${cookieName(env)}=${token||''}; Path=/api/v1/auth; HttpOnly; SameSite=Lax; Max-Age=${token?REFRESH_SECONDS:0}${settings(env).secure?'; Secure':''}`;
}
function csrf(request:Request,env:AuthEnv) {
  const origin=request.headers.get('origin');
  if(request.headers.get('X-Requested-With')!=='SumaryJP' || (origin!==null&&origin!==settings(env).origin) || request.headers.get('Sec-Fetch-Site')==='cross-site') throw new HttpError(403,'Untrusted authentication request');
}
async function body(request:Request) {
  if(request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='application/json') throw new HttpError(415,'JSON content type required');
  if(Number(request.headers.get('content-length')||0)>8192) throw new HttpError(413,'Request body too large');
  const reader=request.body?.getReader();let length=0;const chunks:Uint8Array[]=[];
  if(!reader) return {};
  try {
    while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>8192){await reader.cancel();throw new HttpError(413,'Request body too large');}chunks.push(value);}
    const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    return JSON.parse(new TextDecoder().decode(bytes)||'{}');
  }catch(e){if(e instanceof HttpError)throw e;throw new HttpError(400,'Invalid JSON');}
}
async function sign(env:AuthEnv,sid:string,type:'access'|'refresh',user?:AuthUser) {
  const seconds=now();
  return new SignJWT({tokenType:type,sid,...(type==='access'&&user?{userId:user.id,role:user.role}:{})})
    .setProtectedHeader({alg:'HS256',typ:'JWT'}).setIssuer('sumaryjp-api').setAudience(type==='access'?'sumaryjp-web':'sumaryjp-refresh')
    .setIssuedAt(seconds).setExpirationTime(seconds+(type==='access'?ACCESS_SECONDS:REFRESH_SECONDS)).setJti(crypto.randomUUID()).sign(settings(env).key);
}
async function verify(env:AuthEnv,token:string,type:'access'|'refresh') {
  const key=settings(env).key;
  try {
    const {payload}=await jwtVerify(token,key,{algorithms:['HS256'],issuer:'sumaryjp-api',audience:type==='access'?'sumaryjp-web':'sumaryjp-refresh',requiredClaims:['exp','iat','jti']});
    if(payload.tokenType!==type || typeof payload.sid!=='string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(payload.sid) || typeof payload.jti!=='string' ||
      typeof payload.iat!=='number' || typeof payload.exp!=='number' || payload.iat>now() || payload.exp<=payload.iat ||
      (type==='access'&&(!Number.isSafeInteger(payload.userId)||Number(payload.userId)<1))) throw new Error('Invalid payload');
    return payload;
  }catch{throw new HttpError(401,'Invalid or expired token');}
}
function publicUser(user:UserRow) {
  return {id:user.id,email:user.email,username:user.username,displayName:user.display_name,avatarUrl:user.avatar_url,role:user.role,currentStreak:user.current_streak,lastStudyDate:user.last_study_date,createdAt:user.created_at};
}
export async function authenticate(request:Request,env:AuthEnv):Promise<AuthUser> {
  const header=request.headers.get('authorization');
  if(!header?.startsWith('Bearer ')||header.length>4096)throw new HttpError(401,'Authentication token missing or invalid');
  const p=await verify(env,header.slice(7),'access');
  const user=await env.DB.prepare(`SELECT u.id,u.email,u.username,u.role FROM users u JOIN refresh_tokens r ON r.user_id=u.id
    WHERE u.id=? AND u.is_active=1 AND r.session_id=? AND r.expires_at>?`).bind(p.userId,p.sid,iso(now())).first<AuthUser>();
  if(!user)throw new HttpError(401,'Session revoked or account inactive');
  return user; // Always use the current database role, never the token's role claim.
}
export function requireRole(user:AuthUser,roles:string[]) {if(!roles.includes(user.role))throw new HttpError(403,'Insufficient permissions');}

export async function consumeLimit(db:D1Database,key:string,max:number,windowSeconds=900) {
  const stamp=iso(now()),reset=iso(now()+windowSeconds);
  const results=await db.batch([
    db.prepare('DELETE FROM auth_rate_limits WHERE key IN (SELECT key FROM auth_rate_limits WHERE reset_at<=? LIMIT 50)').bind(stamp),
    db.prepare('DELETE FROM refresh_tokens WHERE id IN (SELECT id FROM refresh_tokens WHERE expires_at<=? LIMIT 50)').bind(stamp),
    db.prepare(`INSERT INTO auth_rate_limits(key,count,reset_at) VALUES (?,1,?)
    ON CONFLICT(key) DO UPDATE SET count=CASE WHEN reset_at<=? THEN 1 ELSE count+1 END,
    reset_at=CASE WHEN reset_at<=? THEN excluded.reset_at ELSE reset_at END RETURNING count,reset_at`).bind(await digest(key),reset,stamp,stamp),
  ]);
  const bucket=results[2].results[0] as {count:number;reset_at:string}|undefined;
  if(!bucket)throw new HttpError(503,'Rate limit store unavailable');
  const headers={'RateLimit-Limit':String(max),'RateLimit-Remaining':String(Math.max(0,max-bucket.count)),'RateLimit-Reset':String(Math.ceil(Date.parse(bucket.reset_at)/1000))};
  return {allowed:bucket.count<=max,headers,retry:Math.max(1,Math.ceil((Date.parse(bucket.reset_at)-Date.now())/1000))};
}

export class Auth {
  constructor(private env:AuthEnv) {settings(env);}
  async register(input:unknown) {
    const parsed=registration.safeParse(input);if(!parsed.success)throw new HttpError(400,'Invalid registration data');
    const data=parsed.data;
    const sid=crypto.randomUUID(),refresh=await sign(this.env,sid,'refresh');
    const passwordHash=await bcrypt.hash(data.password,10);
    const db=this.env.DB;
    let rows:D1Result[];
    try { rows=await db.batch([
      db.prepare("INSERT INTO users(email,username,password_hash,display_name,role) VALUES (?,?,?,?,'USER') RETURNING *").bind(data.email,data.username,passwordHash,data.displayName||data.username),
      db.prepare('INSERT INTO user_learning_settings(user_id) SELECT id FROM users WHERE email=?').bind(data.email),
      db.prepare('INSERT INTO user_gamification(user_id) SELECT id FROM users WHERE email=?').bind(data.email),
      db.prepare('INSERT INTO refresh_tokens(token,user_id,expires_at,session_id) SELECT ?,id,?,? FROM users WHERE email=?').bind(await digest(refresh),iso(now()+REFRESH_SECONDS),sid,data.email),
    ]);}catch(error){
      // Unique constraints settle races; no partial account/settings/session can commit.
      if(String(error).includes('UNIQUE constraint failed: users.email'))throw new HttpError(400,'Email is already registered');
      if(String(error).includes('UNIQUE constraint failed: users.username'))throw new HttpError(400,'Username is already taken');
      throw error;
    }
    const user=rows[0].results[0] as UserRow;
    return {data:{user:publicUser(user),accessToken:await sign(this.env,sid,'access',user)},refresh};
  }
  async login(input:unknown) {
    const parsed=loginInput.safeParse(input);if(!parsed.success)throw new HttpError(400,'Invalid login data');
    const {login,password}=parsed.data;
    const isEmail=login.includes('@');
    const user=await this.env.DB.prepare(`SELECT * FROM users WHERE ${isEmail?'email':'username'}=?`).bind(isEmail?login.toLowerCase():login).first<UserRow>();
    if(!user||!user.is_active||!await bcrypt.compare(password,user.password_hash))throw new HttpError(401,'Invalid credentials or account inactive');
    const sid=crypto.randomUUID(),refresh=await sign(this.env,sid,'refresh');
    const created=await this.env.DB.prepare(`INSERT INTO refresh_tokens(token,user_id,expires_at,session_id)
      SELECT ?,id,?,? FROM users WHERE id=? AND is_active=1 AND password_hash=? RETURNING id`).bind(await digest(refresh),iso(now()+REFRESH_SECONDS),sid,user.id,user.password_hash).first();
    if(!created)throw new HttpError(401,'Account changed; sign in again');
    return {data:{user:publicUser(user),accessToken:await sign(this.env,sid,'access',user)},refresh};
  }
  async refresh(token:string) {
    const p=await verify(this.env,token,'refresh'),hashed=await digest(token);
    const row=await this.env.DB.prepare(`SELECT u.*,r.id AS token_id FROM refresh_tokens r JOIN users u ON u.id=r.user_id
      WHERE r.session_id=? AND r.token=? AND r.expires_at>? AND u.is_active=1`).bind(p.sid,hashed,iso(now())).first<UserRow & {token_id:number}>();
    if(!row)throw new HttpError(401,'Refresh token expired or revoked');
    const refresh=await sign(this.env,String(p.sid),'refresh');
    // Compare-and-swap is one SQL statement: exactly one concurrent request can rotate.
    const updated=await this.env.DB.prepare(`UPDATE refresh_tokens SET token=?,expires_at=?
      WHERE id=? AND token=? AND session_id=? AND expires_at>? AND user_id IN (SELECT id FROM users WHERE is_active=1)
      RETURNING id`).bind(await digest(refresh),iso(now()+REFRESH_SECONDS),row.token_id,hashed,p.sid,iso(now())).first();
    if(!updated)throw new HttpError(409,'Refresh already consumed; retry using the current session');
    return {data:{accessToken:await sign(this.env,String(p.sid),'access',row)},refresh};
  }
  async logout(token:string|null) {
    if(!token)return;
    let p;try{p=await verify(this.env,token,'refresh');}catch(error){if(error instanceof HttpError&&error.status===401)return;throw error;}
    // Stable sid revokes successors even when logout races with rotation of this cookie.
    await this.env.DB.prepare('DELETE FROM refresh_tokens WHERE session_id=?').bind(p.sid).run();
  }
  async me(user:AuthUser) {
    const row=await this.env.DB.prepare('SELECT * FROM users WHERE id=?').bind(user.id).first<UserRow>();
    const settings=await this.env.DB.prepare('SELECT * FROM user_learning_settings WHERE user_id=?').bind(user.id).first<any>();
    const game=await this.env.DB.prepare('SELECT * FROM user_gamification WHERE user_id=?').bind(user.id).first<any>();
    if(!row||!row.is_active)throw new HttpError(401,'Account inactive');
    return {...publicUser(row),learningSettings:settings?{userId:settings.user_id,weeklyGoalTarget:settings.weekly_goal_target,dailyReminderTime:settings.daily_reminder_time,preferredLevel:settings.preferred_level,createdAt:settings.created_at,updatedAt:settings.updated_at}:null,
      gamification:game?{xp:game.xp,totalXpEarned:game.total_xp_earned,streak:game.streak,badges:JSON.parse(game.badges),stats:JSON.parse(game.stats)}:null};
  }
}

export async function handleAuth(request:Request,env:AuthEnv):Promise<Response|null> {
  const path=new URL(request.url).pathname.replace(/\/$/,'');
  if(!path.startsWith('/api/v1/auth/'))return null;
  const action=path.slice('/api/v1/auth/'.length);
  if(!['register','login','refresh','logout','me'].includes(action))return json({success:false,message:'Not found'},404);
  const headers=new Headers();
  try {
    const auth=new Auth(env);
    if(action==='me'){
      if(request.method!=='GET')throw new HttpError(405,'Method not allowed');
      return json({success:true,message:'User profile retrieved',data:await auth.me(await authenticate(request,env))});
    }
    if(request.method!=='POST')throw new HttpError(405,'Method not allowed');
    csrf(request,env);
    // CF-Connecting-IP is set by Cloudflare at the edge; never trust X-Forwarded-For.
    const ip=env.APP_ENV==='local'?'local':request.headers.get('CF-Connecting-IP');
    if(!ip)throw new HttpError(503,'Client address unavailable');
    const limit=await consumeLimit(env.DB,`${action==='login'?'login':'auth'}:${ip}`,action==='login'?10:30);
    Object.entries(limit.headers).forEach(([k,v])=>headers.set(k,v));
    if(!limit.allowed){headers.set('Retry-After',String(limit.retry));return json({success:false,message:'Too many requests. Please try again later.'},429,headers);}
    const input=await body(request);
    if(action==='logout'){await auth.logout(cookie(request,env));headers.set('Set-Cookie',cookieHeader(env,null));return json({success:true,message:'Logged out successfully',data:null},200,headers);}
    let result;
    if(action==='refresh'){const token=cookie(request,env);if(!token)throw new HttpError(401,'Refresh cookie missing');result=await auth.refresh(token);}
    else result=action==='register'?await auth.register(input):await auth.login(input);
    headers.set('Set-Cookie',cookieHeader(env,result.refresh));
    return json({success:true,message:action==='register'?'User registered successfully':action==='login'?'Login successful':'Token refreshed successfully',data:result.data},action==='register'?201:200,headers);
  }catch(error){return json({success:false,message:error instanceof HttpError?error.message:'Authentication temporarily unavailable'},error instanceof HttpError?error.status:503,headers);}
}
