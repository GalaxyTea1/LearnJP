import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
const {code}=await transform(await readFile(new URL('../src/app/screens/study/sentenceOrder.ts',import.meta.url),'utf8'),{loader:'ts',format:'esm'});
const {appendToken,sentenceText}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
test('ordering keeps repeated text as separate tokens and prevents duplicate/invalid selections',()=>{
  const tokens=['は','私','母','は']; let order=[];
  for(const index of [1,0,2,3])order=appendToken(order,index,tokens.length);
  assert.equal(sentenceText(tokens,order),'私は母は');
  for(const index of [0,-1,4,1.5])assert.deepEqual(appendToken(order,index,tokens.length),order);
  const removed=order.filter(i=>i!==0);
  assert.equal(sentenceText(tokens,removed),'私母は');
  assert.equal(sentenceText(tokens,appendToken(removed,0,tokens.length)),'私母はは');
});
