import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshProduct, project, advance, parseUpdate, dateDeadline, DAY } from '../lib/inventory.ts';

const start = Date.parse('2026-09-20T00:00:00Z');
const batch = (quantity, extra={}) => ({id:'b1',quantity,expiry:'',dateType:'Expiry',openedAt:null,afterOpeningDays:null,...extra});
const milk = () => ({...freshProduct('milk','Milk'),unit:'L',packSize:2,dailyUse:0.5,stockKnown:true,stockAt:start,batches:[batch(4)]});
test('usage is estimated once and a later purchase preserves the estimate',()=>{
 const p=milk();assert.equal(project(p,start+2*DAY).quantity,3);
 p.batches=advance(p.batches,start,start+2*DAY,.5);p.stockAt=start+2*DAY;p.batches.push(batch(2,{id:'b2'}));
 assert.equal(project(p,start+4*DAY).quantity,4);
});
test('expiry interrupts coverage and expired stock is excluded without being consumed',()=>{
 const p=milk();p.batches=[batch(10,{openedAt:start,afterOpeningDays:2}),batch(2,{id:'b2'})];
 assert.equal(project(p,start).days,6);
 const s=project(p,start+3*DAY);assert.equal(s.quantity,1.5);assert.equal(s.expired,9);
});
test('stock count replaces stock and blank usage remains unknown',()=>{
 const p=milk();p.batches=[batch(1)];p.stockAt=start+3*DAY;p.dailyUse=null;
 assert.equal(project(p,start+5*DAY).quantity,1);assert.equal(project(p,start+5*DAY).days,null);
 assert.equal(project(freshProduct('x','Rice'),start).state,'setup');
});
test('printed dates end on Sydney label day including daylight saving',()=>{
 assert.equal(new Date(dateDeadline('2026-09-20')).toISOString(),'2026-09-20T14:00:00.000Z');
 assert.equal(new Date(dateDeadline('2026-10-04')).toISOString(),'2026-10-04T13:00:00.000Z');
});
test('voice amounts convert units and leave compound quantities for review',()=>{
 const p=milk();for(const [text,want] of [['Bought .5 L milk',.5],['Bought 1,000 mL milk',1],['Bought two litres of milk',2],['Bought 2 bottles of milk',4],['Bought 2x2 L milk',null],['Bought 1 L and 2 L milk',null]])assert.equal(parseUpdate(text,[p]).quantity,want,text);
 assert.equal(parseUpdate('I have 1 litre of milk left',[p]).kind,'count');
 assert.equal(parseUpdate('bought 2 L milk',[p,{...p,id:'milk2'}]).ambiguous,true);
});
