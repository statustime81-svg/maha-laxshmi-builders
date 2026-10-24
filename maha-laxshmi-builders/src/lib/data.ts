import {supabase,configured} from './supabase';
import {previewProperties} from './preview';
import type {Property} from './types';
export async function fetchProperties(featured=false):Promise<{rows:Property[];demo:boolean}>{
 if(!configured)return {rows:featured?previewProperties.slice(0,5):previewProperties,demo:false};
 const q=supabase!.from('properties').select('*').eq('published',true).order('created_at',{ascending:false});
 const {data,error}=await (featured?q.eq('featured',true):q);
 if(error)throw error;
 return {rows:(data||[]) as Property[],demo:false};
}
export async function fetchProperty(slug:string):Promise<{row:Property|null;demo:boolean}>{
 if(!configured)return {row:previewProperties.find(p=>p.slug===slug)||null,demo:false};
 const {data,error}=await supabase!.from('properties').select('*').eq('slug',slug).eq('published',true).maybeSingle();
 if(error)throw error;return {row:data as Property|null,demo:false};
}
