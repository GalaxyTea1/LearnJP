// Local-only browser verification fixture. No real account, API, or database writes.
import { build } from 'esbuild';
import { createServer } from 'node:http';
const bundle = await build({
  stdin: { resolveDir: process.cwd(), loader: 'tsx', contents: `
    import React, {useState} from 'react';
    import {createRoot} from 'react-dom/client';
    import {QuizStudyTab} from './src/app/screens/study/tabs/QuizStudyTab';
    import {TestAuth} from 'fixture-auth';
    import {setServerChanged} from './src/app/services/api';
    function App() {
      const [user, setUser] = useState(303);
      const [visible, setVisible] = useState(true);
      const [changed, setChanged] = useState(false);
      const [confirmed, setConfirmed] = useState(0);
      const [blocked, setBlocked] = useState(false);
      const [original] = useState(() => Storage.prototype.setItem);
      const questions = [{id:1, question:changed?'Updated question':'Fixture question one',options:['First','Second'],points:10}, {id:2,question:'Fixture question two',options:['First','Second'],points:10}];
      return <TestAuth.Provider value={{user:user?{id:user}:null,checking:false,openLogin:()=>setUser(101)}}>
        <h1>Local Quiz verification fixture — fake API</h1>
        <p>Account: {user || 'guest'} | Completion callbacks: {confirmed}</p>
        <button onClick={()=>setUser(101)}>Account A</button>
        <button onClick={()=>setUser(202)}>Account B</button>
        <button onClick={()=>setUser(undefined)}>Guest</button>
        <button onClick={()=>setVisible(v=>!v)}>Toggle Quiz</button>
        <button onClick={()=>setServerChanged(true)}>Change server revision only</button>
        <button onClick={()=>setChanged(v=>!v)}>Change question version</button>
        <button onClick={()=>{Storage.prototype.setItem = blocked ? original : function(){throw new Error('Fixture storage unavailable')};setBlocked(!blocked)}}>Toggle storage failure</button>
        {visible && <QuizStudyTab moduleId={990005} quizQuestions={questions} revision={(changed ? 'b' : 'a').repeat(64)} onCompleteTab={()=>setConfirmed(v=>v+1)}/>}
      </TestAuth.Provider>
    }
    createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
  ` },
  bundle: true, write: false, format: 'iife', jsx: 'automatic',
  plugins: [{ name: 'isolated-fixtures', setup(build) {
    build.onResolve({ filter: /AuthProvider$|^fixture-auth$/ }, () => ({ path: 'auth', namespace: 'fixture' }));
    build.onResolve({ filter: /services\/api$/ }, () => ({ path: 'api', namespace: 'fixture' }));
    build.onLoad({ filter: /.*/, namespace: 'fixture' }, ({path}) => ({ resolveDir: process.cwd(), loader: 'js', contents: path === 'auth' ? `
      import {createContext,useContext} from 'react'; export const TestAuth=createContext(null);export const useAuth=()=>useContext(TestAuth);
    ` : `
      export class ApiError extends Error { constructor(message,status){super(message);this.status=status;} }
      let serverChanged=false; let cached=null; let originalRequest=null; export const setServerChanged=value=>{serverChanged=value;};
      export const progressApi={submitQuizAttempt:async(moduleId,answers,seconds,revision,requestId)=>{
        const payload=JSON.stringify({moduleId,answers,seconds,revision,requestId});
        const saved=localStorage.getItem('fixture-l5-server');
        if(saved){const previous=JSON.parse(saved);if(previous.payload!==payload)throw Error('Retry payload changed');return previous.result;}

        if(serverChanged) throw new ApiError('QUIZ_REVISION_CHANGED',409);
        const results=[1,2].map(id=>({questionId:id,selected:answers.find(a=>a.questionId===id)?.selectedIndex??null,isCorrect:answers.find(a=>a.questionId===id)?.selectedIndex===0,correctIndex:0,explanation:'Fixture explanation'}));
        const score=results.filter(r=>r.isCorrect).length;
        const result={success:true,data:{score,totalQuestions:2,scorePercent:score*50,passed:score===2,xpEarned:0,results}};
        localStorage.setItem('fixture-l5-server',JSON.stringify({payload,result}));
        throw new DOMException('Fixture lost response','TimeoutError');
      }};
    ` }));
  } }],
});
const js = bundle.outputFiles[0].text;
createServer((req,res) => {
  res.setHeader('Cache-Control','no-store');
  if (req.url === '/fixture.js') { res.setHeader('Content-Type','text/javascript'); res.end(js); }
  else { res.setHeader('Content-Type','text/html; charset=utf-8'); res.end('<!doctype html><html><head><title>Local Quiz fixture</title><style>body{font:16px system-ui;max-width:900px;margin:24px auto}button{padding:12px;margin:5px}button[aria-pressed=true]{background:#ffd7c7}</style></head><body><div id="root"></div><script src="/fixture.js"></script></body></html>'); }
}).listen(Number(process.env.PORT || 5181),'127.0.0.1',()=>console.log('Local isolated fixture port: '+(process.env.PORT || 5181)));
