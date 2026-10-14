-- Run after schema.sql and seed.sql in the Supabase SQL editor.
-- Admin users are added manually to site_admins; there is deliberately no public signup path.

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.site_admins enable row level security;
grant select on public.site_admins to authenticated;
drop policy if exists "Admins can verify their own access" on public.site_admins;
create policy "Admins can verify their own access"
  on public.site_admins for select to authenticated
  using ((select auth.uid()) = user_id);

-- Store contact details and the most commonly changed page copy as one editable record.
create table if not exists public.site_settings (
  id text primary key check (id = 'main'),
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;
drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
  on public.site_settings for all to authenticated
  using (exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())));

insert into public.site_settings (id, settings) values (
  'main',
  '{
    "name":"Kaputei Farm Products Ltd",
    "tagline":"We Got Flavor",
    "sourceSite":"https://kaputeishop.com/",
    "email":"info@kaputei.com",
    "phoneWhatsApp":"+254 710 752 751",
    "whatsappNumber":"254710752751",
    "location":"Ngong Rd, Nairobi",
    "instagram":"https://www.instagram.com/kaputeifarmproducts/",
    "facebook":"https://www.facebook.com/KaputeiFarmProducts/",
    "tiktok":"https://www.tiktok.com/@kaputeifarmproducts",
    "twitterX":"https://x.com/kaputeifarm",
    "youtube":"http://www.youtube.com/@KaputeiFarmproducts",
    "whatsappChannel":"https://whatsapp.com/channel/0029VbB7S34KQuJGepdIG01o",
    "logoUrl":"/logo.png",
    "storyImageUrl":"/story-art.jpg",
    "homeHeadline":"WE GOT FLAVOR.",
    "homeDescription":"Sauces, jams, honey & teas made by a mother-daughter team — order on WhatsApp in one tap.",
    "aboutHeadline":"A mother-daughter dream, bottled.",
    "aboutNote":"Kaputei Farm Products was born from a mother-daughter dream. Founded with a mission tied to mental health awareness and emotional healing — a portion of the story around every purchase supports that cause.",
    "faqs":[{"q":"How do I place an order?","a":"The fastest way is WhatsApp — tap any Order on WhatsApp button and your message is pre-written for you."},{"q":"Do you deliver outside Nairobi?","a":"Yes — we send orders across Kenya by courier. Message us with your town and we will confirm delivery cost and timing."},{"q":"Can my shop, hotel or restaurant stock Kaputei?","a":"Absolutely — wholesale and bulk hospitality packs are available. WhatsApp us for a quote."},{"q":"Where are you located?","a":"Our kitchen is in Nairobi. Reach out before visiting so we can make sure someone is around."},{"q":"What is the story behind Kaputei?","a":"Kaputei Farm Products was born from a mother-daughter dream, with mental health awareness and emotional healing at its heart."}]
  }'::jsonb
) on conflict (id) do nothing;

-- Public catalogue reads remain public; writes are reserved for invited admins.
grant select on public.products to anon, authenticated;
grant insert, update on public.products to authenticated;
drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products for insert to authenticated
  with check (exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())));
drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products for update to authenticated
  using (exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())));

-- Editable recipes retain a public read path and admin-only writes.
create table if not exists public.recipes (
  id text primary key,
  title text not null,
  excerpt text not null default '',
  category text not null default 'Sides',
  time text not null default '',
  serves text not null default '',
  sauce text not null default '',
  product_handle text not null default '',
  ingredients text[] not null default '{}',
  steps text[] not null default '{}',
  image text,
  gradient_from text default '#C8252C',
  gradient_to text default '#9E1B22',
  is_active boolean not null default true,
  sort_order int not null default 0
);
alter table public.recipes enable row level security;
grant select on public.recipes to anon, authenticated;
grant insert, update on public.recipes to authenticated;
drop policy if exists "Public can read recipes" on public.recipes;
create policy "Public can read recipes" on public.recipes for select to anon, authenticated using (true);
drop policy if exists "Admins can add recipes" on public.recipes;
create policy "Admins can add recipes" on public.recipes for insert to authenticated
  with check (exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())));
drop policy if exists "Admins can update recipes" on public.recipes;
create policy "Admins can update recipes" on public.recipes for update to authenticated
  using (exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.site_admins a where a.user_id = (select auth.uid())));
create index if not exists recipes_sort_order_idx on public.recipes (sort_order);

-- Product images stay publicly readable; only invited admins can add/remove uploads.
drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and exists (
    select 1 from public.site_admins a where a.user_id = (select auth.uid())
  ));
