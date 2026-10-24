import {createClient} from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL?.trim();
const key=(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||import.meta.env.VITE_SUPABASE_ANON_KEY)?.trim();
export const configured=!!(url&&key);
export const supabase=configured?createClient(url!,key!,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}}):null;
export function publicError(e:unknown){const m=e instanceof Error?e.message:'An unexpected error occurred.';return /fetch|network|failed to fetch/i.test(m)?'Connection problem. Please check your internet connection and retry.':m.replace(/https?:\/\/\S+/g,'[service]');}
export function imageUrl(path:string|null){if(!path)return '/images/plot-view-1.webp';if(path.startsWith('http')||path.startsWith('/'))return path;return supabase?.storage.from('property-images').getPublicUrl(path).data.publicUrl||'/images/plot-view-1.webp';}
