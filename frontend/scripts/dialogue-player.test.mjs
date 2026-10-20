import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const bundle = await build({entryPoints:['src/app/screens/study/dialoguePlayer.ts'],bundle:true,write:false,platform:'node',format:'cjs'});
const mod = {exports:{}};
new Function('require','module','exports',bundle.outputFiles[0].text)(require,mod,mod.exports);
const {createDialoguePlayer,hasListeningAudio,listeningReady,listeningSpeechLines} = mod.exports;
const setup = () => {
  const spoken = [];
  const synth = {cancel(){},getVoices:()=>[{lang:'ja-JP'}],speak:u=>spoken.push(u)};
  return {spoken,synth,player:createDialoguePlayer(synth,text=>({text}))};
};
test('long lines wait for onend; order and Japanese voice are preserved',async()=>{
  const {spoken,player}=setup();const indices=[];
  const pending=player.play(['長い文','次の文'],i=>indices.push(i));
  assert.equal(spoken.length,1); assert.equal(spoken[0].lang,'ja-JP');
  await new Promise(r=>setTimeout(r,20));assert.equal(spoken.length,1);
  spoken[0].onend();await Promise.resolve();assert.equal(spoken.length,2);
  spoken[1].onend();assert.equal(await pending,true);assert.deepEqual(indices,[0,1]);
});
test('stop settles the pending wait and cannot resume the old queue',async()=>{
  const {spoken,player}=setup();const pending=player.play(['one','two'],()=>{});
  const lateEnd=spoken[0].onend;player.stop();lateEnd();
  assert.equal(await pending,false);assert.equal(spoken.length,1);assert.equal(spoken[0].onend,null);
});
test('rapid replacement cancels old queue without stopping the new one',async()=>{
  const {spoken,player}=setup();const first=player.play(['old','never'],()=>{});
  const second=player.play(['new'],()=>{});assert.equal(await first,false);
  assert.deepEqual(spoken.map(u=>u.text),['old','new']);spoken[1].onend();assert.equal(await second,true);
});
test('external interruption ends sequence; synthesis failure rejects for visible error',async()=>{
  const {spoken,player}=setup();const pending=player.play(['one','two'],()=>{});
  spoken[0].onerror({error:'interrupted'});assert.equal(await pending,false);assert.equal(spoken.length,1);
  const failing=player.play(['one'],()=>{});spoken[1].onerror({error:'not-allowed'});
  await assert.rejects(failing,/Không phát được/);
});
test('empty text is skipped and pending audio is never a media source',async()=>{
  const {spoken,player}=setup();const pending=player.play([' ','日本語（にほんご）'],()=>{});
  assert.equal(spoken[0].text,'日本語');spoken[0].onend();assert.equal(await pending,true);
  for(const url of [null,undefined,'','  ',' PENDING_AUDIO:test']) assert.equal(hasListeningAudio(url),false);
  assert.equal(hasListeningAudio('/audio/n5.mp3'),true);
  assert.equal(hasListeningAudio('TTS:ja-JP'),false);
  assert.equal(listeningReady('TTS:ja-JP','日本語'),true);
  for(const [url,text] of [['TTS:ja-JP',' \n '],['TTS:en-US','text'],['PENDING_AUDIO:1','日本語']])assert.equal(listeningReady(url,text),false);
  assert.deepEqual(listeningSpeechLines('A: おはよう。\n店員：はい。\n男：財布です。\n朝は早いです。'),['おはよう。','はい。','財布です。','朝は早いです。']);
});

test('listening uses a native player only for a real audio URL',async()=>{
  const bundle=await build({entryPoints:['src/app/screens/study/tabs/DialogueStudyTab.tsx'],bundle:true,write:false,platform:'node',format:'cjs',packages:'external',jsx:'automatic'});
  const view={exports:{}};
  new Function('require','module','exports',bundle.outputFiles[0].text)(require,view,view.exports);
  const React=require('react'); const {renderToStaticMarkup}=require('react-dom/server');
  const html=renderToStaticMarkup(React.createElement(view.exports.DialogueStudyTab,{sections:[{id:1,listeningContent:[
    {id:1,title:'Recorded',audioUrl:'/audio/lesson.mp3',transcript:'日本語'},
    {id:2,title:'Pending',audioUrl:'PENDING_AUDIO:2',transcript:'日本語'},
    {id:3,title:'Empty',audioUrl:null,transcript:null},
    {id:4,title:'Beta TTS',audioUrl:'TTS:ja-JP',transcript:'日本語'},
  ]}]}));
  assert.equal((html.match(/<audio/g)||[]).length,1);
  assert.match(html,/src="\/audio\/lesson.mp3"/); assert.doesNotMatch(html,/src="PENDING/);
  assert.equal((html.match(/Nghe giọng đọc tự động/g)||[]).length,3);
  assert.match(html,/Bản beta · Giọng đọc tự động/);assert.doesNotMatch(html,/src="TTS/);
});

test('missing Japanese voice fails visibly and empty voice loading can be stopped',async()=>{
  const {synth}=setup();synth.getVoices=()=>[{lang:'en-US'}];
  await assert.rejects(createDialoguePlayer(synth,text=>({text})).play(['日本語'],()=>{}),/Chưa có giọng tiếng Nhật/);
  let listener; synth.getVoices=()=>[];synth.addEventListener=(_,fn)=>{listener=fn;};synth.removeEventListener=()=>{listener=undefined;};
  const player=createDialoguePlayer(synth,text=>({text}),{voices:20,start:20,playback:20});
  const pending=player.play(['日本語'],()=>{});player.stop();assert.equal(await pending,false);assert.equal(listener,undefined);
  await assert.rejects(player.play(['日本語'],()=>{}),/Chưa có giọng tiếng Nhật/);assert.equal(listener,undefined);
});

test('silent start and missing end events time out rather than leave controls playing forever',async()=>{
  const {synth,spoken}=setup();const player=createDialoguePlayer(synth,text=>({text}),{voices:10,start:10,playback:10});
  await assert.rejects(player.play(['日本語'],()=>{}),/không phản hồi/);
  const second=player.play(['日本語'],()=>{});spoken[1].onstart();
  await assert.rejects(second,/không phản hồi/);assert.equal(spoken[1].onend,null);
});

test('late Japanese voices start playback once and voice listeners are removed',async()=>{
  const {synth,spoken}=setup();let voices=[],listener;
  synth.getVoices=()=>voices;synth.addEventListener=(_,fn)=>{listener=fn;};synth.removeEventListener=()=>{listener=undefined;};
  const player=createDialoguePlayer(synth,text=>({text}));
  const pending=player.play(['日本語'],()=>{});assert.equal(spoken.length,0);
  voices=[{lang:'ja-JP'}];listener();await Promise.resolve();
  assert.equal(listener,undefined);assert.equal(spoken.length,1);spoken[0].onend();assert.equal(await pending,true);
});
