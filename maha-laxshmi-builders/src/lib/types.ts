export type PropertyStatus='available'|'reserved'|'sold';
export type Property={id:string;title:string;slug:string;description:string|null;category:string;location:string;area:number|null;area_unit:string;price:number|null;price_unit:string;cover_image:string|null;gallery_images:string[];features:string[];status:PropertyStatus;featured:boolean;published:boolean;created_at:string;updated_at:string};
export type Enquiry={id:string;name:string;phone:string;property_id:string|null;message:string|null;status:'new'|'contacted'|'closed';created_at:string;properties?:{title:string}|null};
export type Visit={id:string;name:string;phone:string;property_id:string|null;preferred_date:string;preferred_time:string;message:string|null;status:'new'|'contacted'|'closed';created_at:string;properties?:{title:string}|null};
export type Category='Residential Plot'|'Commercial Property'|'Agricultural Land'|'House'|'Flat'|'Other';
export const categories:Category[]=['Residential Plot','Commercial Property','Agricultural Land','House','Flat','Other'];
export const formatPrice=(p:Property)=>p.price==null?'Contact for price':`₹${p.price.toLocaleString('en-IN')}${p.price_unit==='per_sq_ft'?'/sq.ft.':''}`;
