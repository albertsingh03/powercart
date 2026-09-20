import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { seedProducts } from './seed';
import { freshProduct,Product } from './inventory';
export async function context(request?:Request){const user=await getChatGPTUser();if(!user)throw new Error('AUTH');if(request&&request.method!=='GET'){const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)throw new Error('ORIGIN');}if(!env.DB)throw new Error('Storage unavailable');return {owner:user.userId,db:env.DB,bucket:env.BUCKET};}
export async function getProducts(db:D1Database,owner:string){const found=await db.prepare('SELECT data,version FROM products WHERE owner=?').bind(owner).all();return found.results.map((r:any)=>({...JSON.parse(r.data),version:r.version} as Product));}
export async function initialize(db:D1Database,owner:string){await db.batch(seedProducts.map(p=>db.prepare('INSERT OR IGNORE INTO products (key,owner,data,version) VALUES (?,?,?,0)').bind(owner+':'+p.id,owner,JSON.stringify(freshProduct(p.id,p.name,p.category,p.notes)))));}
export function errorResponse(e:unknown){const message=e instanceof Error?e.message:'Could not complete this request';if(message==='AUTH')return Response.json({error:'Please sign in to open your Power Cart.',signIn:'/signin-with-chatgpt?return_to=%2F'},{status:401});if(message==='ORIGIN')return Response.json({error:'Request origin not allowed'},{status:403});console.error('Power Cart',message);return Response.json({error:message},{status:400});}
