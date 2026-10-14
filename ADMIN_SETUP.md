# Kaputei owner dashboard setup

The owner dashboard is available at `/admin`. It supports products (prices, sizes, variants, descriptions, categories, image uploads, display order, and visibility), recipes (ingredients, method, image, category, and visibility), contact-page FAQs, and business details (email, phone, location, socials, logo/story image paths, home headline/description, and About copy).

## One-time setup

1. In the Supabase SQL Editor, run `supabase/schema.sql` and `supabase/seed.sql` if this project has not been initialized yet. If the product table/catalog already exists, do not run the seed again.
2. Run `supabase/admin_portal.sql`. It creates the owner allowlist and editable site settings, and grants database changes only to allowlisted users.
3. In Supabase Authentication, disable public sign-ups and create a user for the owner's email with an initial password. The owner can change it in Store details → Change sign-in password.
4. Copy that user's UUID from Authentication → Users, then add the owner in the SQL Editor:

   ```sql
   insert into public.site_admins (user_id)
   values ('PASTE_AUTH_USER_UUID_HERE');
   ```

5. In Netlify → Site configuration → Environment variables, set:
   - `VITE_SUPABASE_URL` to the Supabase project URL.
   - `VITE_SUPABASE_ANON_KEY` to the project's publishable key (or legacy anon key). Never put a `service_role` or secret key in Netlify's `VITE_` variables.
6. In Supabase Authentication → URL Configuration, set the Site URL to `https://genuine-florentine-75961e.netlify.app` and add `https://genuine-florentine-75961e.netlify.app/admin` as a redirect URL. Redeploy the Netlify site after changing environment variables.

The owner can now sign in at `https://genuine-florentine-75961e.netlify.app/admin`. In Recipes, click **Import starter recipes** to bring the current built-in set into the editable catalog. The password form works without email delivery. The optional one-time sign-in link requires Supabase custom SMTP for non-team email addresses; the built-in sender is restricted and rate-limited.

## How edits work

- Product and site-detail edits save directly to Supabase and appear on the public site without a code edit or Netlify redeploy.
- The product image upload uses the `product-images` public-read bucket created by `schema.sql`; the admin policy in `admin_portal.sql` protects uploads.
- If the dashboard says Supabase is not connected, confirm both Netlify environment variables are present and redeploy.
- Keep the business in control of its Supabase and Netlify accounts. Do not share secret keys or the Supabase service-role key with the browser.
