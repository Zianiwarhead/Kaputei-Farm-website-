# Deploying to Netlify

This site is a static Vite + React app. No server, no database — just files.

## Option A — Drag & drop (fastest, no account setup beyond login)

1. Build the site:
   ```bash
   cd "C:\Users\brian\Desktop\Kaputei\website"
   npm install
   npm run build
   ```
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag the `dist/` folder onto the page.
4. You get a live URL instantly (e.g. `kaputei-farm-products.netlify.app`).
   Rename it under **Site settings → Change site name**.

The `public/_redirects` file (already in this repo, copied into `dist/`
automatically) makes `/products`, `/recipes`, `/about`, `/contact` work —
without it those pages would 404 on refresh.

## Option B — Netlify CLI (repeatable)

```bash
npm install -g netlify-cli
netlify login
netlify deploy --dir=dist            # preview URL
netlify deploy --dir=dist --prod     # production URL
```

## Option C — Git-connected (best long-term)

1. Push this folder to GitHub.
2. Netlify → **Add new site → Import an existing project**.
3. Build command: `npm run build` · Publish directory: `dist`.
4. Every `git push` redeploys automatically.

## Custom domain (later)

Netlify → **Domain settings → Add custom domain**, then point your DNS
(A record or CNAME) at Netlify. HTTPS is issued automatically and free.

## Supabase (products + images backend)

The site reads products from Supabase when configured, and silently falls back
to the bundled `src/data/products.ts` otherwise — so it works with or without keys.

1. Create a project at [supabase.com](https://supabase.com) (free tier is plenty).
2. **SQL editor → New query** → paste `supabase/schema.sql` → Run.
   This creates the `products` table, public read policy, and the public
   `product-images` storage bucket.
3. **Storage → product-images → Upload** your cutout PNGs (same filenames as
   `public/products/`). Reference them in the `images` column either as full
   URLs or bare paths (`barbecue-sauce.png` resolves to the bucket automatically).
4. **Table editor → products → Insert** rows (or import CSV). Column names match
   `supabase/schema.sql`; `variant_prices` is JSON like
   `[{"variant":"Honey","size":"400g","priceKes":148.57}]`.
5. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` +
   `VITE_SUPABASE_ANON_KEY` (Project Settings → API). **Never commit `.env`.**
6. On Netlify: **Site settings → Environment variables** → add the same two keys,
   then redeploy. The Products page shows a small "Live" badge when Supabase data
   is active, so you can confirm the switch worked.

## Checklist before going live

- [ ] `npm run build` passes with no errors
- [ ] Product images swapped to local `/products/*.png` (see `public/products/README.md`)
- [ ] Real per-variant pricing filled in (`variantPrices` in `src/data/products.ts`)
- [ ] Contact details + socials double-checked (currently: info@kaputei.com, +254 710 752 751, Ngong Rd)
- [ ] Favicon present (`public/logo.png`)
