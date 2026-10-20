// Isolated UI fixture: real ExerciseStudyTab, no auth/API/database writes.
// Browser drafts belong to localhost:5180, separate from the app on :8787.
import { build } from 'esbuild';
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';

const snapshot = JSON.parse(await readFile(new URL('../../.local/content-review/n5-candidate.json', import.meta.url), 'utf8'));
const unit = snapshot.learning_modules.find(module => module.id === 7);
if (!unit) throw Error('Unit 1 module 7 missing from reviewed snapshot');
const sectionIds = new Set(snapshot.lesson_sections.filter(section => section.moduleId === 7).map(section => section.id));
const tasks = snapshot.writing_tasks.filter(task => sectionIds.has(task.sectionId));
if (!tasks.length) throw Error('Unit 1 writing tasks missing from reviewed snapshot');
const bundle = await build({ stdin: { resolveDir: process.cwd(), loader: 'tsx', contents: `
import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ExerciseStudyTab} from './src/app/screens/study/tabs/ExerciseStudyTab';
const tasks=${JSON.stringify(tasks)};
const nativeSet=Storage.prototype.setItem;
let failWrites=false;
Storage.prototype.setItem=function(key,value){
  if(failWrites && key.startsWith('writing_draft_v1_')) throw new DOMException('Fixture quota failure','QuotaExceededError');
  return nativeSet.call(this,key,value);
};
function App(){
  const [exercise,setExercise]=useState(true),[account,setAccount]=useState('guest'),[checking,setChecking]=useState(false),[blocked,setBlocked]=useState(false),[mobile,setMobile]=useState(false);
  return <main className="min-h-screen bg-background text-foreground p-4">
    <aside className="flex flex-col gap-3 p-4 mb-6 border border-dashed border-border rounded-xl">
      <h1 className="font-bold">Thử bản nháp luyện viết — Unit 1</h1>
      <p>Trang thử riêng, tài khoản giả; không ghi database hoặc xuất bản nội dung.</p>
      <div className="flex flex-wrap items-center gap-3">
        <label>Tài khoản thử <select value={account} onChange={e=>setAccount(e.target.value)}><option value="guest">Khách</option><option value="1">Tài khoản A</option><option value="2">Tài khoản B</option></select></label>
        <label><input type="checkbox" checked={checking} onChange={e=>setChecking(e.target.checked)}/> Đang xác định tài khoản</label>
        <label><input type="checkbox" checked={blocked} onChange={e=>{failWrites=e.target.checked;setBlocked(failWrites)}}/> Giả lập lỗi lưu</label>
        <label><input type="checkbox" checked={mobile} onChange={e=>setMobile(e.target.checked)}/> Khung hẹp 390px</label>
        <button className="text-accent underline" onClick={()=>location.reload()}>Tải lại trang thử</button>
      </div>
      <p className="text-sm">Gõ bài → đổi phần → quay lại → tải lại. Chọn tài khoản A/B để thử lưu riêng. Khi giả lập lỗi lưu, gõ thêm rồi đổi phần: chữ vẫn còn và có nút thử lưu lại. Khung hẹp chỉ kiểm tra bố cục; chưa thay thế thiết bị thật.</p>
    </aside>
    <section style={{maxWidth:mobile?390:1100,margin:'0 auto',width:'100%'}}>
      <nav className="flex gap-4 mb-4"><button className="text-accent underline" onClick={()=>setExercise(true)}>Bài tập</button><button className="text-accent underline" onClick={()=>setExercise(false)}>Phần học khác</button></nav>
      {exercise?<ExerciseStudyTab moduleId={7} userId={account==='guest'?undefined:Number(account)} checking={checking} sections={[{id:1,writingTasks:tasks}]} />:<p>Đã rời phần bài tập. Quay lại để kiểm tra bản nháp.</p>}
    </section>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
` }, bundle: true, write: false, format: 'iife', jsx: 'automatic' });
const files = await readdir('dist/assets');
const css = await readFile('dist/assets/' + files.find(file => file.endsWith('.css')));
const server = createServer((req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.url === '/fixture.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(bundle.outputFiles[0].text); }
  else if (req.url === '/fixture.css') { res.setHeader('Content-Type', 'text/css'); res.end(css); }
  else { res.setHeader('Content-Type', 'text/html;charset=utf-8'); res.end('<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/fixture.css"><title>Writing draft local preview</title></head><body><div id="root"></div><script src="/fixture.js"></script></body></html>'); }
});
server.listen(5180, '127.0.0.1', () => console.log('Writing draft preview: http://127.0.0.1:5180'));
