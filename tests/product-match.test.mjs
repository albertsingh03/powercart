import {test} from 'node:test';
import assert from 'node:assert/strict';
import {identityKey,sameProduct,quantityIn,parsePack,validBarcode} from '../lib/product-match.ts';
const milk={name:'Milk',brand:'Rokeby',productName:'Rokeby FitMilk Light',variant:'Light',packSize:1,unit:'L'};
test('matching uses the exact product and equivalent sizes, not the generic label',()=>{
 assert.equal(sameProduct(milk,{...milk,name:'My milk',unit:'mL',packSize:1000}),true);
 assert.equal(sameProduct(milk,{...milk,productName:'Rokeby FitMilk Full Cream'}),false);
 assert.equal(sameProduct(milk,{...milk,packSize:2}),false);
 assert.equal(identityKey(milk),identityKey({...milk,unit:'mL',packSize:1000}));
});
test('barcodes need a valid check digit and padded GTINs match',()=>{
 const code='3017620422003';assert.equal(validBarcode(code),code);assert.equal(validBarcode('3017620422004'),'');
 assert.equal(sameProduct({...milk,barcode:code},{name:'Abbreviated label',barcode:'0'+code}),true);
});
test('pack parsing preserves unknown or multipack quantities',()=>{
 assert.deepEqual(parsePack('1 L'),{packSize:1,unit:'L'});assert.deepEqual(parsePack('2 x 1 L'),{packSize:null,unit:''});
 assert.deepEqual(parsePack('1.5 kg'),{packSize:1.5,unit:'kg'});assert.equal(quantityIn(1,'L','items'),null);
});
