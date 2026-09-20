import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const db=new DatabaseSync(':memory:');
for(const file of ['0000_premium_valeria_richards.sql','0001_unknown_wendigo.sql'])db.exec(readFileSync(new URL('../drizzle/'+file,import.meta.url),'utf8'));
const d1={prepare(sql){let params=[];return {bind(...args){params=args;return this},async first(){return db.prepare(sql).get(...params)||null},async all(){return {results:db.prepare(sql).all(...params)}},run(){const result=db.prepare(sql).run(...params);return {meta:{changes:Number(result.changes)}}}}},async batch(statements){db.exec('BEGIN');try{const result=statements.map(s=>s.run());db.exec('COMMIT');return result}catch(e){db.exec('ROLLBACK');throw e}}};
globalThis.powerCartTestDatabase=d1;
const serverModule=`export async function context(){return {owner:'isolated-test',db:globalThis.powerCartTestDatabase}};export async function getProducts(db,owner){const d=await db.prepare('SELECT data,version FROM products WHERE owner=?').bind(owner).all();return d.results.map(r=>({...JSON.parse(r.data),version:r.version}))};export function errorResponse(e){return Response.json({error:e.message},{status:400})}`;
let source=readFileSync(new URL('../app/api/action/route.ts',import.meta.url),'utf8');
source=source.replaceAll("@/lib/server",'data:text/javascript;base64,'+Buffer.from(serverModule).toString('base64')).replaceAll('@/lib/product-match',new URL('../lib/product-match.ts',import.meta.url).href).replaceAll('@/lib/inventory',new URL('../lib/inventory.ts',import.meta.url).href);
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ESNext}}).outputText;
const {POST}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const all=()=>db.prepare('SELECT data,version FROM products').all().map(r=>({...JSON.parse(r.data),version:r.version}));
async function save(body){const r=await POST(new Request('https://test.invalid/api/action',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,requestId:crypto.randomUUID()})}));return {status:r.status,body:await r.json()};}
test('matching an existing item preserves stock and history; duplicate identities are blocked',async()=>{
 let r=await save({kind:'create',productId:'milk',values:{name:'Milk',category:'Groceries',unit:'L',packSize:1,dailyUse:null}});assert.equal(r.status,200);
 let p=all()[0];r=await save({kind:'count',productId:p.id,version:p.version,quantity:2});assert.equal(r.status,200);p=all()[0];const before=structuredClone(p.batches);
 const values={...p,brand:'Rokeby',variant:'FitMilk Light',productName:'Rokeby FitMilk Light',barcode:'',productUrl:'https://rokebynutrition.com/products/fitmilk-light'};
 r=await save({kind:'edit',productId:p.id,version:p.version,values});assert.equal(r.status,200);p=all()[0];assert.equal(all().length,1);assert.deepEqual(p.batches,before);assert.equal(p.id,'milk');assert.equal(db.prepare('SELECT count(*) AS n FROM events').get().n,3);
 r=await save({kind:'create',values});assert.equal(r.status,409);assert.equal(r.body.duplicateId,'milk');
 r=await save({kind:'create',values:{...values,packSize:1000,unit:'mL'}});assert.equal(r.status,409);
 r=await save({kind:'edit',productId:p.id,version:p.version,values:{...values,unit:'items'}});assert.equal(r.status,400);assert.deepEqual(all()[0].batches,before);
 const last=db.prepare("SELECT id FROM events WHERE kind='edit'").get();r=await save({kind:'undo',productId:p.id,version:p.version,undoId:last.id});assert.equal(r.status,200);assert.equal(all()[0].brand,'');assert.deepEqual(all()[0].batches,before);
});
