import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
async function load(path) {const {code}=await transform(await readFile(new URL(path,import.meta.url),'utf8'),{loader:'ts',format:'esm'});return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));}

test('lazy storage adapter lets guest study initialize when even the browser property is blocked',async()=>{
  Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new DOMException('Blocked','SecurityError');}});
  const {browserStorage}=await load('../src/app/services/browserStorage.ts');
  const {createStudySync}=await load('../src/app/screens/study/studyProgressSync.ts');
  let view;
  const sync=createStudySync({storage:browserStorage,moduleId:6,userId:null,read:()=>assert.fail('Guest must not read account progress'),write:()=>assert.fail('Guest must not write account progress'),notify:value=>{view=value;}});
  await sync.start();assert.equal(view.ready,true);assert.equal(view.storageError,true);
  sync.change({completedTabs:['grammar'],vocabulary:[{id:1,mastered:true}]});
  assert.deepEqual(view.completedTabs,['grammar']);assert.deepEqual(view.masteredVocabularyIds,[1]);assert.equal(view.storageError,true);
  sync.dispose();delete globalThis.localStorage;
});
