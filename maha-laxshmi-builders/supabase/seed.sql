-- OPTIONAL DEVELOPMENT REFERENCE ONLY. Never automatically run in production.
-- Source: client-supplied Hindi/Odia draft ad copy dated October 2026.
-- Conflicting price/approval/registration details deliberately omitted.
-- Hirli Prime Valley vs Samim Khan Plot needs confirmation, so neither is seeded.
insert into public.properties(title,slug,description,category,location,area,area_unit,price,price_unit,features,status,featured,published) values
('Sunshine Colony','sunshine-colony','Borigumma/NH26 area. Information from draft marketing copy; confirm before publishing.','Residential Plot','Near NH26, Borigumma',1800,'sq.ft.',250,'per_sq_ft',array['Near NH26','20 ft road'],'available',true,false),
('Sri Ram Nagar','sri-ram-nagar','Nabarangpur–Tentulikhunti Road. Pricing, documents and availability to be confirmed.','Residential Plot','Nabarangpur–Tentulikhunti Road',1800,'sq.ft.',null,'per_sq_ft',array['20 ft road'],'available',true,false),
('M.B.G Nagar','mbg-nagar','Near Mondei Field. Pricing and approval details to be confirmed.','Residential Plot','Near Mondei Field, Nabarangpur',1742,'sq.ft.',null,'per_sq_ft',array['Road access'],'available',true,false),
('Mahalaxshmi Greens Colony','mahalaxshmi-greens-colony','RO Road area. Confirm registration status, pricing and availability with owner.','Residential Plot','RO Road, near NH26',1750,'sq.ft.',null,'per_sq_ft',array['20 ft road'],'available',true,false)
on conflict(slug) do nothing;
