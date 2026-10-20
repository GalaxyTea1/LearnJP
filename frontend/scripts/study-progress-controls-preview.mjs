// Local fixture: real viewer/sync with fake auth and API, no database writes.
import { build } from 'esbuild';
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
const bundle = await build({ stdin: { resolveDir: process.cwd(), loader: 'tsx', contents: `
import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ModuleStudyViewer} from './src/app/screens/study/ModuleStudyViewer';
import {recover} from './src/app/services/api';
function App(){ const [writes,setWrites]=useState(0); useEffect(()=>{const changed=()=>setWrites(v=>v+1);window.addEventListener('fixture-write',changed);return()=>window.removeEventListener('fixture-write',changed)},[]);
return <><aside style={{padding:20,border:'2px dashed gray'}}>Fixture L3 — API giả, không ghi database. <span>Writes: {writes}</span><button onClick={recover}>Khôi phục API giả</button></aside><ModuleStudyViewer moduleId={990003} onBack={()=>{}}/></>}
createRoot(document.getElementById('root')).render(<App/>);
` }, bundle:true,write:false,format:'iife',jsx:'automatic',plugins:[{name:'fixture',setup(build){
build.onResolve({filter:/AuthProvider$/},()=>({path:'auth',namespace:'fixture'}));
build.onResolve({filter:/services\/api$/},()=>({path:'api',namespace:'fixture'}));
build.onLoad({filter:/.*/,namespace:'fixture'},({path})=>({loader:'js',contents:path==='auth'?`
export const useAuth=()=>({user:{id:990003},checking:false});export const GuestNotice=()=>null;
`:`
let failed=true;let details={completedTabs:[],masteredVocabularyIds:[],quizCompleted:false};
export const recover=()=>{failed=false};export class ApiError extends Error{};
export const contentApi={getModuleFullContent:async()=>({success:true,data:{id:990003,unitNumber:1,title:'L3: Học khi lỗi tiến độ',level:{level:'N5'},vocabulary:[{id:1,japanese:'日',hiragana:'ひ',romaji:'hi',english:'day'}],kanji:[],grammarPatterns:[],quizQuestions:[],sections:[{id:1,conversations:[{id:1,title:'Chào hỏi',lines:[{id:1,speaker:'A',japanese:'こんにちは',translation:'Xin chào',sortOrder:0}]}],exercises:[{id:1,prompt:'Chọn lời chào',options:['こんにちは','さようなら'],correctAnswer:0,explanation:'Xin chào'}]}]}})};
export const progressApi={getStudyProgress:async()=>{if(failed)throw Error('fixture progress failure');return {data:details}},saveStudyProgress:async(_id,patch)=>{if(failed)throw Error('fixture progress failure');details={...details,completedTabs:[...new Set([...details.completedTabs,...patch.completedTabs])]};window.dispatchEvent(new Event('fixture-write'));return {data:details}}};
`}));}}]});
const files=await readdir('dist/assets');const css=await readFile('dist/assets/'+files.find(f=>f.endsWith('.css')));
const server=createServer((req,res)=>{res.setHeader('Cache-Control','no-store');if(req.url==='/fixture.js'){res.setHeader('Content-Type','text/javascript');res.end(bundle.outputFiles[0].text)}else if(req.url==='/fixture.css'){res.setHeader('Content-Type','text/css');res.end(css)}else{res.setHeader('Content-Type','text/html;charset=utf-8');res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/fixture.css"><title>L3 isolated fixture</title></head><body><div id="root"></div><script src="/fixture.js"></script></body></html>')}});
server.listen(5179,'127.0.0.1',()=>console.log('L3 fixture: http://127.0.0.1:5179'));
