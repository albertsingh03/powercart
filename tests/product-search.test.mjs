import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const originalFetch=globalThis.fetch;
const originalCaches=Object.getOwnPropertyDescriptor(globalThis,'caches');
// Reproduce the hosted runtime: reading caches.default itself throws.
const restrictedCache={};Object.defineProperty(restrictedCache,'default',{get(){throw new Error('This Worker is not permitted to access the default cache.')}});
Object.defineProperty(globalThis,'caches',{configurable:true,value:restrictedCache});
after(()=>{globalThis.fetch=originalFetch;if(originalCaches)Object.defineProperty(globalThis,'caches',originalCaches);else delete globalThis.caches;});
const serverModule=`export async function context(){return {owner:'isolated-test'}};export function errorResponse(e){return Response.json({error:e.message},{status:400})}`;
let source=readFileSync(new URL('../app/api/products/search/route.ts',import.meta.url),'utf8');
source=source.replaceAll('@/lib/server','data:text/javascript;base64,'+Buffer.from(serverModule).toString('base64')).replaceAll('@/lib/product-match',new URL('../lib/product-match.ts',import.meta.url).href);
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ESNext}}).outputText;
const {GET}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const request=(q,category='Groceries')=>new Request('https://power-cart.test/api/products/search?'+new URLSearchParams({q,category}));
const sample={code:'9336243005139',product_name:'Fit milk rokeby',brands:['Rokeby'],quantity:'1 L',countries_tags:['en:australia']};
test('Rokeby search returns manufacturer and live catalogue matches when default cache is forbidden',async()=>{
 let calls=0;globalThis.fetch=async (url,options)=>{calls++;assert.equal(options.cache,'no-store');assert.equal(new URL(url).hostname,'search.openfoodfacts.org');return Response.json({hits:[sample]})};
 const r=await GET(request('Rokeby fitmilk'));assert.equal(r.status,200);const data=await r.json();assert.equal(calls,1);assert.equal(data.warning,'');assert.equal(data.results[0].id,'rokeby-fitmilk-light-1l');assert.ok(data.results.some(p=>p.source==='Open Food Facts'));assert.equal(data.results[1].packSize,1);
});
test('a search without a saved reference returns actual catalogue results',async()=>{
 globalThis.fetch=async()=>Response.json({hits:[{...sample,product_name:'Example rice',brands:['Example'],quantity:'500 g'}]});
 const r=await GET(request('Example rice'));assert.equal(r.status,200);const data=await r.json();assert.equal(data.results.length,1);assert.equal(data.results[0].name,'Example rice');assert.equal(data.results[0].unit,'g');
});
test('catalogue outage returns an honest warning and keeps available manufacturer reference',async()=>{
 globalThis.fetch=async()=>{throw new Error('Temporary provider failure')};const r=await GET(request('Rokeby fitmilk'));assert.equal(r.status,200);const data=await r.json();assert.equal(data.results.length,1);assert.match(data.warning,/unavailable/);assert.doesNotMatch(JSON.stringify(data),/Worker|cache/);
});
