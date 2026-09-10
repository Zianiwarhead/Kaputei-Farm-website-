-- Kaputei Farm Products — Supabase schema
-- Run this in the Supabase SQL editor (project → SQL → New query).

-- ------------------------------------------------------------------
-- Products table (mirrors src/data/products.ts Product type)
-- ------------------------------------------------------------------
create table if not exists products (
  id text primary key,                       -- e.g. 'barbecue-sauce'
  name text not null,                        -- 'Barbecue Sauce'
  handle text not null unique,               -- 'barbecue-sauce' (matches kaputeishop URL slug)
  category text not null default 'Sauces',   -- Sauces | Dressings | Chutney | Pickles | Spreads | Pantry | Teas | Bulk
  badge text,                                -- 'Bestseller' | 'Sale handled via compare_at' | null
  price_kes numeric not null,                -- base / "from" price
  compare_at_price_kes numeric,              -- strikethrough price, null when not on sale
  description_short text default '',
  sizes text[] default '{}',                 -- e.g. '{"250g","400g","700g","1kg"}'
  variants text[] default '{}',              -- e.g. '{"Original","Honey"}'
  images text[] default '{}',                -- full https URLs OR storage paths like 'barbecue-sauce.png'
  variant_prices jsonb default '[]',         -- [{variant, size, priceKes, compareAtPriceKes?, image?}]
  gradient_from text default '#C8252C',
  gradient_to text default '#9E1B22',
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table products enable row level security;

drop policy if exists "public read products" on products;
create policy "public read products"
  on products for select
  using (true);

-- Helpful index for category filtering
create index if not exists products_category_idx on products (category);

-- ------------------------------------------------------------------
-- Image storage bucket (public read, uploads via dashboard / service key)
-- ------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- NOTE: uploads happen from the Supabase dashboard (Storage → product-images →
-- Upload), which uses the service role, so no insert policy is needed for the
-- anon key. Never expose the service_role key in the website.

-- ------------------------------------------------------------------
-- Example row (duplicate per product, or import via CSV in Table editor)
-- ------------------------------------------------------------------
-- insert into products (id, name, handle, category, price_kes, compare_at_price_kes,
--   description_short, sizes, variants, images, sort_order)
-- values (
--   'tomato-sauce', 'Tomato Sauce', 'tomato-sauce', 'Sauces',
--   61.55, 70.00,
--   'Smooth, slow-cooked everyday tomato sauce.',
--   array['250g','400g','700g','1kg'], array[]::text[],
--   array['tomato-sauce.png'],
--   1
-- );
