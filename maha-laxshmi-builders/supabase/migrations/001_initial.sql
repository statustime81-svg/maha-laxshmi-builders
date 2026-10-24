-- Maha Laxshmi Builders schema for Supabase PostgreSQL
-- Run in SQL Editor as the project owner. Enable email/password auth in Supabase.
create extension if not exists pgcrypto;
create table if not exists public.admin_users (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
-- No direct public access to administrator list.
revoke all on public.admin_users from anon, authenticated;
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.admin_users where user_id=auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon,authenticated;

create table if not exists public.properties (
 id uuid primary key default gen_random_uuid(),
 title text not null check(length(trim(title)) between 2 and 160),
 slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 description text check(description is null or length(description)<=10000),
 category text not null default 'Residential Plot' check(category in ('Residential Plot','Commercial Property','Agricultural Land','House','Flat','Other')),
 location text not null check(length(trim(location)) between 2 and 250),
 area numeric(14,2) check(area is null or area>0),
 area_unit text not null default 'sq.ft.' check(area_unit in ('sq.ft.','sq.yd.','acre','decimal')),
 price numeric(16,2) check(price is null or price>=0),
 price_unit text not null default 'per_sq_ft' check(price_unit in ('per_sq_ft','total')),
 cover_image text,
 gallery_images text[] not null default '{}',
 features text[] not null default '{}',
 status text not null default 'available' check(status in ('available','reserved','sold')),
 featured boolean not null default false,
 published boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists idx_properties_published on public.properties(published,featured,created_at desc);
create index if not exists idx_properties_category on public.properties(category);

create table if not exists public.enquiries (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(trim(name)) between 2 and 100),
 phone text not null check(phone ~ '^[6-9][0-9]{9}$'),
 property_id uuid references public.properties(id) on delete set null,
 message text check(message is null or length(message)<=1200),
 status text not null default 'new' check(status in ('new','contacted','closed')),
 created_at timestamptz not null default now()
);
create index if not exists idx_enquiries_created_at on public.enquiries(created_at desc);
create index if not exists idx_enquiries_property on public.enquiries(property_id);

create table if not exists public.site_visits (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(trim(name)) between 2 and 100),
 phone text not null check(phone ~ '^[6-9][0-9]{9}$'),
 property_id uuid references public.properties(id) on delete set null,
 preferred_date date not null check(preferred_date>=date '2026-01-01'),
 preferred_time time not null,
 message text check(message is null or length(message)<=1200),
 status text not null default 'new' check(status in ('new','contacted','closed')),
 created_at timestamptz not null default now()
);
create index if not exists idx_site_visits_created on public.site_visits(created_at desc);
create index if not exists idx_site_visits_property on public.site_visits(property_id);

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at=now();return new;end $$;
drop trigger if exists properties_update_timestamp on public.properties;
create trigger properties_update_timestamp before update on public.properties for each row execute function public.touch_updated_at();

-- Prevent anonymous submission of admin-controlled fields, including status.
create or replace function public.validate_public_lead() returns trigger language plpgsql set search_path = '' as $$
begin
 if not public.is_admin() then
  if new.status <> 'new' then raise exception 'Invalid lead status';end if;
  if new.property_id is not null and not exists(select 1 from public.properties where id=new.property_id and published=true) then
   raise exception 'Property unavailable';
  end if;
 end if;
 return new;
end $$;
drop trigger if exists check_public_enquiry on public.enquiries;
create trigger check_public_enquiry before insert on public.enquiries for each row execute function public.validate_public_lead();
create or replace function public.validate_visit_date() returns trigger language plpgsql set search_path = '' as $$
begin
 if new.preferred_date < current_date then raise exception 'Visit date cannot be in the past'; end if;
 return new;
end $$;
drop trigger if exists check_visit_date on public.site_visits;
create trigger check_visit_date before insert or update on public.site_visits for each row execute function public.validate_visit_date();
drop trigger if exists check_public_visit on public.site_visits;
create trigger check_public_visit before insert on public.site_visits for each row execute function public.validate_public_lead();

alter table public.properties enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_visits enable row level security;
-- Properties: published records visible to the public; admins can manage all.
create policy "Public read published properties" on public.properties for select to anon,authenticated using (published or public.is_admin());
create policy "Admins insert properties" on public.properties for insert to authenticated with check(public.is_admin());
create policy "Admins update properties" on public.properties for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "Admins delete properties" on public.properties for delete to authenticated using(public.is_admin());
-- Leads: public may insert only a short validated enquiry, cannot read or change.
create policy "Public submit enquiries" on public.enquiries for insert to anon,authenticated with check(status='new');
create policy "Admins read enquiries" on public.enquiries for select to authenticated using(public.is_admin());
create policy "Admins update enquiries" on public.enquiries for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "Public submit visits" on public.site_visits for insert to anon,authenticated with check(status='new');
create policy "Admins read visits" on public.site_visits for select to authenticated using(public.is_admin());
create policy "Admins update visits" on public.site_visits for update to authenticated using(public.is_admin()) with check(public.is_admin());

-- Harden column-level grants: visitor may insert only allowed fields.
revoke all on public.properties from anon,authenticated;
grant select on public.properties to anon,authenticated;
grant insert,update,delete on public.properties to authenticated;
revoke all on public.enquiries from anon,authenticated;
grant insert(name,phone,property_id,message) on public.enquiries to anon,authenticated;
grant select,update on public.enquiries to authenticated;
revoke all on public.site_visits from anon,authenticated;
grant insert(name,phone,property_id,preferred_date,preferred_time,message) on public.site_visits to anon,authenticated;
grant select,update on public.site_visits to authenticated;

-- Public images, authorized uploads. Properties do not expose private image buckets.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
 values ('property-images','property-images',true,5242880,array['image/jpeg','image/png','image/webp','image/avif'])
 on conflict(id) do update set public=true,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "Public view property images" on storage.objects for select to anon,authenticated using(bucket_id='property-images');
create policy "Admins upload property images" on storage.objects for insert to authenticated with check(bucket_id='property-images' and public.is_admin());
create policy "Admins modify property images" on storage.objects for update to authenticated using(bucket_id='property-images' and public.is_admin()) with check(bucket_id='property-images' and public.is_admin());
create policy "Admins delete property images" on storage.objects for delete to authenticated using(bucket_id='property-images' and public.is_admin());
