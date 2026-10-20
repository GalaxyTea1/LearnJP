import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const bundle = await build({entryPoints:['src/app/services/navigation.ts'],bundle:true,write:false,platform:'node',format:'cjs',external:['react']});
const mod={exports:{}};
new Function('require','module','exports',bundle.outputFiles[0].text)(require,mod,mod.exports);
const {pageFromUrl,moduleFromUrl,navigateUrl,openStudyModule,subscribeNavigation}=mod.exports;
test('URL resolves direct lessons and legacy hash pages, rejects invalid module IDs',()=>{
  assert.equal(pageFromUrl('https://test/learning?moduleId=7'),'learning');
  assert.equal(pageFromUrl('https://test/#learning'),'learning');
  assert.equal(moduleFromUrl('https://test/learning?moduleId=7'),7);
  for(const value of ['0','-1','7abc','1.5','NaN','9007199254740992','']) assert.equal(moduleFromUrl('https://test/learning?moduleId='+value),null);
  assert.equal(moduleFromUrl('https://test/home?moduleId=7'),null);
});
test('Roadmap clears lesson query; Back/Forward restore URL; repeated navigation adds no history',()=>{
  const events=new EventTarget(); const stack=['https://test/home']; let index=0;
  global.window={location:{href:stack[0]},addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events),dispatchEvent:events.dispatchEvent.bind(events),history:{pushState(_s,_t,href){stack.splice(index+1);stack.push(href);index++;window.location.href=href},replaceState(_s,_t,href){stack[index]=href;window.location.href=href}}};
  let notifications=0;const unsubscribe=subscribeNavigation(()=>notifications++);
  openStudyModule(7);assert.equal(moduleFromUrl(window.location.href),7);
  navigateUrl('/learning');assert.equal(moduleFromUrl(window.location.href),null);assert.equal(stack.length,3);
  navigateUrl('/learning');assert.equal(stack.length,3);
  window.location.href=stack[--index];window.dispatchEvent(new Event('popstate'));assert.equal(moduleFromUrl(window.location.href),7);
  window.location.href=stack[++index];window.dispatchEvent(new Event('popstate'));assert.equal(moduleFromUrl(window.location.href),null);
  assert.equal(notifications,4);unsubscribe();window.dispatchEvent(new Event('hashchange'));assert.equal(notifications,4);
  delete global.window;
});
