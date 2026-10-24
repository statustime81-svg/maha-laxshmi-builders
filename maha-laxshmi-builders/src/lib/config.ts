export const company = {
 name:'MAHA LAXSHMI BUILDERS', legalName:'Maha Laxshmi Builders & Private Limited',
 phone:'7205077057', whatsapp:'917205077057', location:'Nabarangpur, Odisha, India',
 email:'', address:'', mapsUrl:'', instagram:'', facebook:'',
};
export const waLink = (message:string) => `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
export const asset = (path:string)=>path;
