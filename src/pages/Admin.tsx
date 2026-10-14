import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { BookOpen, Check, LogOut, Plus, Save, Settings2, ShoppingBasket, X } from 'lucide-react'
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from '../data/siteSettings'
import { RECIPES, type Recipe } from '../data/recipes'
import type { Product, VariantPrice } from '../data/products'
import { formatKes } from '../data/products'
import { isSupabaseConfigured, resolveImage, supabase } from '../lib/supabase'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { cx } from '../lib/utils'

type AdminProduct = Product & { is_active: boolean; sort_order: number }
type AdminRecipe = Recipe & { is_active: boolean; sort_order: number }
type Tab = 'products' | 'recipes' | 'store'

const EMPTY_RECIPE = { title: '', excerpt: '', category: 'Sides', time: '', serves: '', sauce: '', productHandle: '', ingredients: '', steps: '', image: '', sortOrder: '0', active: true }

const EMPTY_PRODUCT = {
  name: '', handle: '', category: 'Sauces', badge: '', price: '', compareAt: '', description: '',
  sizes: '', variants: '', images: '', variantPrices: '[]', sortOrder: '0', active: true,
}

function slug(value: string) {
  return value.toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function lines(value: string) {
  return value.split(/[\n,]/).map((part) => part.trim()).filter(Boolean)
}

function recipeToForm(recipe: AdminRecipe) {
  return { title: recipe.title, excerpt: recipe.excerpt, category: recipe.category, time: recipe.time, serves: recipe.serves, sauce: recipe.sauce, productHandle: recipe.productHandle, ingredients: recipe.ingredients.join('\n'), steps: recipe.steps.join('\n'), image: recipe.image ?? '', sortOrder: String(recipe.sort_order), active: recipe.is_active }
}

function productToForm(product: AdminProduct) {
  return {
    name: product.name,
    handle: product.handle,
    category: product.category,
    badge: product.badge ?? '',
    price: String(product.priceKes),
    compareAt: product.compareAtPriceKes == null ? '' : String(product.compareAtPriceKes),
    description: product.descriptionShort,
    sizes: product.sizes.join('\n'),
    variants: product.variants.join('\n'),
    images: product.images.join('\n'),
    variantPrices: JSON.stringify(product.variantPrices ?? [], null, 2),
    sortOrder: String(product.sort_order ?? 0),
    active: product.is_active,
  }
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-charcoal/50">{hint}</span>}
    </label>
  )
}

const inputClass = 'w-full rounded-xl border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-tomato'

export function Admin() {
  const settings = useSiteSettings()
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [tab, setTab] = useState<Tab>('products')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [useMagicLink, setUseMagicLink] = useState(false)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [recipes, setRecipes] = useState<AdminRecipe[]>([])
  const [editingRecipe, setEditingRecipe] = useState<AdminRecipe | null>(null)
  const [recipeForm, setRecipeForm] = useState(EMPTY_RECIPE)
  const [showArchived, setShowArchived] = useState(false)
  const [editing, setEditing] = useState<AdminProduct | null>(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [settingsDraft, setSettingsDraft] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS)
  const [faqText, setFaqText] = useState('')

  useEffect(() => {
    setSettingsDraft(settings)
    setFaqText(settings.faqs.map((item) => `${item.q} | ${item.a}`).join('\n'))
  }, [settings])

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return }
    let active = true
    void supabase.auth.getSession().then(({ data }) => {
      if (active) { setSession(data.session); setAuthReady(true) }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setAuthReady(true)
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    let active = true
    setIsAdmin(false)
    setProducts([])
    setRecipes([])
    if (!session || !supabase) return
    void (async () => {
      const { data: admin, error: adminError } = await supabase!
        .from('site_admins').select('user_id').eq('user_id', session.user.id).maybeSingle()
      if (!active) return
      if (adminError) { setNotice('Admin access is not set up yet. Follow the setup steps in the repository.'); return }
      if (!admin) { setNotice('This account has not been invited to manage the site.'); return }
      setIsAdmin(true)
      setNotice('')
      const { data, error } = await supabase!.from('products').select('*').order('sort_order', { ascending: true })
      if (!active) return
      if (error) setNotice(`Could not load products: ${error.message}`)
      else setProducts((data ?? []).map((row: Record<string, unknown>) => ({
        id: String(row.id), name: String(row.name), handle: String(row.handle),
        category: String(row.category ?? 'Sauces'), badge: row.badge ? String(row.badge) : undefined,
        priceKes: Number(row.price_kes ?? 0),
        compareAtPriceKes: row.compare_at_price_kes == null ? null : Number(row.compare_at_price_kes),
        descriptionShort: String(row.description_short ?? ''), sizes: (row.sizes as string[] | null) ?? [],
        variants: (row.variants as string[] | null) ?? [], images: ((row.images as string[] | null) ?? []).map(resolveImage),
        variantPrices: (row.variant_prices as VariantPrice[] | null) ?? [],
        gradient: { from: String(row.gradient_from ?? '#C8252C'), to: String(row.gradient_to ?? '#9E1B22') },
        is_active: Boolean(row.is_active), sort_order: Number(row.sort_order ?? 0),
      })))
      const { data: recipeRows, error: recipeError } = await supabase!.from('recipes').select('*').order('sort_order', { ascending: true })
      if (!active) return
      if (recipeError) setNotice(`Could not load recipes: ${recipeError.message}`)
      else setRecipes((recipeRows ?? []).map((row: Record<string, unknown>) => ({
        id: String(row.id), title: String(row.title), excerpt: String(row.excerpt ?? ''), category: String(row.category ?? 'Sides'),
        time: String(row.time ?? ''), serves: String(row.serves ?? ''), sauce: String(row.sauce ?? ''),
        productHandle: String(row.product_handle ?? ''), ingredients: (row.ingredients as string[] | null) ?? [],
        steps: (row.steps as string[] | null) ?? [], image: row.image ? String(row.image) : undefined,
        gradient: { from: String(row.gradient_from ?? '#C8252C'), to: String(row.gradient_to ?? '#7B3A18') },
        is_active: Boolean(row.is_active), sort_order: Number(row.sort_order ?? 0),
      })))
    })()
    return () => { active = false }
  }, [session])

  async function signIn(event: FormEvent) {
    event.preventDefault()
    if (!supabase) return
    setBusy(true); setNotice('')
    if (useMagicLink) {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/admin` },
      })
      setBusy(false)
      setNotice(error ? error.message : 'Check your inbox for the secure sign-in link.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      setBusy(false)
      setPassword('')
      setNotice(error ? 'Email or password was not accepted.' : '')
    }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setSession(null); setIsAdmin(false); setNotice('You have been signed out.')
  }

  function startNewProduct() {
    setEditing(null); setForm(EMPTY_PRODUCT); setImageFile(null); setNotice('')
  }

  function editProduct(product: AdminProduct) {
    setEditing(product); setForm(productToForm(product)); setImageFile(null); setNotice('')
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault()
    if (!supabase || !session) return
    const price = Number(form.price)
    if (!Number.isFinite(price) || price < 0) { setNotice('Enter a valid price.'); return }
    const id = editing?.id ?? slug(form.handle || form.name)
    const handle = slug(form.handle || form.name)
    if (!id || !handle) { setNotice('Add a product name first.'); return }
    setBusy(true); setNotice('')
    let images = lines(form.images)
    try {
      if (imageFile) {
        const extension = imageFile.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
        const path = `${session.user.id}/${id}/${crypto.randomUUID()}.${extension}`
        const { error: uploadError } = await supabase.storage.from('product-images').upload(path, imageFile, {
          contentType: imageFile.type, cacheControl: '3600', upsert: false,
        })
        if (uploadError) throw uploadError
        images = [path, ...images.slice(1).filter((item) => item !== path)]
      }
      let variantPrices: VariantPrice[] = []
      try { variantPrices = JSON.parse(form.variantPrices || '[]') as VariantPrice[] }
      catch { throw new Error('Variant pricing must be valid JSON (or an empty array).') }
      if (!Array.isArray(variantPrices) || variantPrices.some((item) =>
        typeof item !== 'object' || item === null || typeof item.size !== 'string' ||
        typeof item.priceKes !== 'number' || !Number.isFinite(item.priceKes) || item.priceKes < 0
      )) throw new Error('Each variant price needs a size and a non-negative priceKes number.')
      const row = {
        id, name: form.name.trim(), handle, category: form.category.trim() || 'Other',
        badge: form.badge.trim() || null, price_kes: price,
        compare_at_price_kes: form.compareAt ? Number(form.compareAt) : null,
        description_short: form.description.trim(), sizes: lines(form.sizes), variants: lines(form.variants),
        images, variant_prices: variantPrices, is_active: form.active,
        sort_order: Number(form.sortOrder) || 0,
        gradient_from: editing?.gradient.from ?? '#C8252C', gradient_to: editing?.gradient.to ?? '#7B3A18',
      }
      const { error } = await supabase.from('products').upsert(row, { onConflict: 'id' })
      if (error) throw error
      setNotice('Product saved. The public catalog will show the change shortly.')
      setEditing(null); setForm(EMPTY_PRODUCT); setImageFile(null)
      const { data } = await supabase.from('products').select('*').order('sort_order', { ascending: true })
      if (data) window.location.reload()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save the product.')
    } finally { setBusy(false) }
  }

  function startNewRecipe() {
    setEditingRecipe(null); setRecipeForm(EMPTY_RECIPE); setNotice('')
  }

  function editRecipe(recipe: AdminRecipe) {
    setEditingRecipe(recipe); setRecipeForm(recipeToForm(recipe)); setNotice('')
  }

  async function saveRecipe(event: FormEvent) {
    event.preventDefault()
    if (!supabase) return
    const title = recipeForm.title.trim()
    const id = editingRecipe?.id ?? slug(title)
    if (!title || !id) { setNotice('Add a recipe title first.'); return }
    setBusy(true); setNotice('')
    const row = {
      id, title, excerpt: recipeForm.excerpt.trim(), category: recipeForm.category.trim() || 'Sides',
      time: recipeForm.time.trim(), serves: recipeForm.serves.trim(), sauce: recipeForm.sauce.trim(),
      product_handle: slug(recipeForm.productHandle || recipeForm.sauce), ingredients: lines(recipeForm.ingredients),
      steps: lines(recipeForm.steps), image: recipeForm.image.trim() || null,
      gradient_from: editingRecipe?.gradient.from ?? '#C8252C', gradient_to: editingRecipe?.gradient.to ?? '#7B3A18',
      is_active: recipeForm.active, sort_order: Number(recipeForm.sortOrder) || 0,
    }
    const { error } = await supabase.from('recipes').upsert(row, { onConflict: 'id' })
    setBusy(false)
    if (error) setNotice(`Could not save recipe: ${error.message}`)
    else window.location.reload()
  }

  async function importStarterRecipes() {
    if (!supabase) return
    setBusy(true); setNotice('')
    const rows = RECIPES.map((recipe, index) => ({
      id: recipe.id, title: recipe.title, excerpt: recipe.excerpt, category: recipe.category,
      time: recipe.time, serves: recipe.serves, sauce: recipe.sauce, product_handle: recipe.productHandle,
      ingredients: recipe.ingredients, steps: recipe.steps, image: recipe.image ?? null,
      gradient_from: recipe.gradient.from, gradient_to: recipe.gradient.to, is_active: true, sort_order: index + 1,
    }))
    const { error } = await supabase.from('recipes').upsert(rows, { onConflict: 'id' })
    setBusy(false)
    if (error) setNotice(`Could not import recipes: ${error.message}`)
    else window.location.reload()
  }

  async function archiveRecipe(recipe: AdminRecipe) {
    if (!supabase) return
    setBusy(true); setNotice('')
    const { error } = await supabase.from('recipes').update({ is_active: !recipe.is_active }).eq('id', recipe.id)
    setBusy(false)
    if (error) setNotice(error.message)
    else window.location.reload()
  }

  async function saveSettings(event: FormEvent) {
    event.preventDefault()
    if (!supabase) return
    setBusy(true); setNotice('')
    const { error } = await supabase.from('site_settings').upsert({
      id: 'main', settings: { ...settingsDraft, faqs: faqText.split(/\r?\n/).map((line) => { const [q, ...answer] = line.split('|'); return { q: q.trim(), a: answer.join('|').trim() } }).filter((item) => item.q && item.a) }, updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })
    setBusy(false)
    if (error) setNotice(`Could not save store details: ${error.message}`)
    else {
      setNotice('Store details saved.')
      window.dispatchEvent(new Event('site-settings-updated'))
    }
  }

  async function updatePassword() {
    if (!supabase) return
    if (newPassword.length < 10) { setNotice('Choose a password with at least 10 characters.'); return }
    if (newPassword !== confirmPassword) { setNotice('The new passwords do not match.'); return }
    setBusy(true); setNotice('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setBusy(false)
    if (error) setNotice(`Could not update password: ${error.message}`)
    else { setNewPassword(''); setConfirmPassword(''); setNotice('Sign-in password updated.') }
  }

  async function archiveProduct(product: AdminProduct) {
    if (!supabase) return
    if (product.is_active && products.filter((item) => item.is_active).length <= 1) {
      setNotice('Keep at least one product visible on the website.')
      return
    }
    setBusy(true); setNotice('')
    const { error } = await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id)
    setBusy(false)
    if (error) setNotice(error.message)
    else window.location.reload()
  }

  const visibleProducts = products.filter((product) => showArchived || product.is_active)
  const visibleRecipes = recipes.filter((recipe) => showArchived || recipe.is_active)

  return (
    <main className="min-h-[70vh] bg-cream-warm/40 py-10 sm:py-16">
      <div className="container-site max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow">Kaputei site tools</p><h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">Owner dashboard</h1>
            <p className="mt-2 max-w-xl text-sm text-charcoal/60">Update products and store details. Changes save to the live catalog without editing code.</p>
          </div>
          {isAdmin && <button type="button" onClick={signOut} className="btn-ghost"><LogOut className="h-4 w-4" />Sign out</button>}
        </div>

        {!isSupabaseConfigured ? (
          <div className="rounded-3xl border border-tomato/20 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Connect the site database</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/65">The owner dashboard is ready, but this Netlify deployment needs the Supabase project URL and public key in its environment settings. See <code>ADMIN_SETUP.md</code> in the repository for the safe setup steps.</p>
          </div>
        ) : !authReady ? (
          <div className="rounded-3xl bg-white p-8 text-sm text-charcoal/60">Checking your sign-in…</div>
        ) : !session ? (
          <div className="mx-auto max-w-md rounded-3xl border border-charcoal/5 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-warm text-tomato"><Settings2 className="h-6 w-6" /></div>
            <h2 className="font-serif text-2xl font-semibold">Owner sign-in</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/60">For invited owners only. There is no public sign-up.</p>
            <form className="mt-5 space-y-4" onSubmit={signIn}>
              <Field label="Email"><input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@business.com" /></Field>
              {useMagicLink ? (
                <button disabled={busy} className="btn-primary w-full">{busy ? 'Sending…' : 'Email me a sign-in link'}</button>
              ) : (
                <><Field label="Password"><input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} /></Field><button disabled={busy} className="btn-primary w-full">{busy ? 'Signing in…' : 'Sign in'}</button></>
              )}
              <button type="button" onClick={() => setUseMagicLink((value) => !value)} className="w-full py-2 text-xs font-semibold text-charcoal/55 hover:text-charcoal">{useMagicLink ? 'Use password instead' : 'Use a one-time email link instead'}</button>
            </form>
            {notice && <p role="status" className="mt-4 rounded-xl bg-cream-warm p-3 text-sm text-charcoal/70">{notice}</p>}
          </div>
        ) : !isAdmin ? (
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm text-charcoal/70">{notice || 'Checking administrator access…'}</p>
            <button type="button" onClick={signOut} className="btn-ghost mt-5">Sign out</button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              <button type="button" onClick={() => setTab('products')} className={cx('btn', tab === 'products' ? 'bg-charcoal text-white' : 'bg-white text-charcoal')}><ShoppingBasket className="h-4 w-4" />Products</button>
              <button type="button" onClick={() => setTab('recipes')} className={cx('btn', tab === 'recipes' ? 'bg-charcoal text-white' : 'bg-white text-charcoal')}><BookOpen className="h-4 w-4" />Recipes</button>
              <button type="button" onClick={() => setTab('store')} className={cx('btn', tab === 'store' ? 'bg-charcoal text-white' : 'bg-white text-charcoal')}><Settings2 className="h-4 w-4" />Store details</button>
            </div>
            {notice && <p role="status" className="mb-5 rounded-2xl border border-leaf/20 bg-white p-4 text-sm text-charcoal/75">{notice}</p>}

            {tab === 'products' ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
                <section className="rounded-3xl border border-charcoal/5 bg-white p-5 shadow-sm sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><h2 className="text-xl font-semibold">Product catalog</h2><p className="mt-1 text-sm text-charcoal/55">{products.filter((p) => p.is_active).length} active products</p></div>
                    <button type="button" onClick={startNewProduct} className="btn-primary"><Plus className="h-4 w-4" />Add product</button>
                  </div>
                  <label className="mt-5 inline-flex items-center gap-2 text-sm text-charcoal/65"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />Show archived products</label>
                  <div className="mt-4 divide-y divide-charcoal/10">
                    {visibleProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 py-3">
                        <img src={product.images[0] || '/logo.png'} alt="" className="h-12 w-12 rounded-xl bg-cream-warm object-contain p-1" />
                        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{product.name}</p><p className="text-xs text-charcoal/55">{product.category} · {formatKes(product.priceKes)}{!product.is_active && ' · Archived'}</p></div>
                        <button type="button" onClick={() => editProduct(product)} className="btn-ghost px-3 py-2">Edit</button>
                        <button type="button" disabled={busy} onClick={() => archiveProduct(product)} className="rounded-full px-3 py-2 text-xs font-semibold text-charcoal/55 hover:bg-cream-warm">{product.is_active ? 'Archive' : 'Restore'}</button>
                      </div>
                    ))}
                    {visibleProducts.length === 0 && <p className="py-8 text-center text-sm text-charcoal/50">No products yet. Add the first product or run the catalog seed file.</p>}
                  </div>
                </section>

                <section className="rounded-3xl border border-charcoal/5 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">{editing ? 'Edit item' : 'New item'}</p><h2 className="mt-1 text-xl font-semibold">{editing ? editing.name : 'Add a product'}</h2></div>{editing && <button type="button" onClick={startNewProduct} aria-label="New product" className="rounded-full p-2 hover:bg-cream-warm"><Plus className="h-4 w-4" /></button>}</div>
                  <form className="space-y-4" onSubmit={saveProduct}>
                    <Field label="Product name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Mango Chutney" /></Field>
                    <div className="grid gap-4 sm:grid-cols-2"><Field label="Category"><input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} placeholder="Chutney" /></Field><Field label="Badge (optional)"><input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={inputClass} placeholder="Bestseller" /></Field></div>
                    <div className="grid gap-4 sm:grid-cols-2"><Field label="Price (KSh)"><input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} /></Field><Field label="Was price (optional)"><input type="number" min="0" step="0.01" value={form.compareAt} onChange={(e) => setForm({ ...form, compareAt: e.target.value })} className={inputClass} /></Field></div>
                    <Field label="Short description"><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} /></Field>
                    <div className="grid gap-4 sm:grid-cols-2"><Field label="Sizes" hint="One per line"><textarea rows={3} value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className={inputClass} placeholder={'250g\n400g'} /></Field><Field label="Flavours / variants" hint="One per line"><textarea rows={3} value={form.variants} onChange={(e) => setForm({ ...form, variants: e.target.value })} className={inputClass} /></Field></div>
                    <Field label="Product image" hint="Upload a new image, or use the URL/path field below."><input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className={inputClass} /></Field>
                    <Field label="Image URL or storage path" hint="Paste a URL or leave blank to use the uploaded image. One per line for extra gallery images."><textarea rows={2} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className={inputClass} /></Field>
                    <details className="rounded-xl bg-cream-warm/60 p-3"><summary className="cursor-pointer text-sm font-semibold">Advanced variant prices</summary><textarea rows={5} value={form.variantPrices} onChange={(e) => setForm({ ...form, variantPrices: e.target.value })} className={`${inputClass} mt-3 font-mono text-xs`} /><p className="mt-1 text-xs text-charcoal/50">Optional JSON. Leave as [] to use the main product price.</p></details>
                    <div className="grid gap-4 sm:grid-cols-2"><Field label="Display order"><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className={inputClass} /></Field><label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Visible on the website</label></div>
                    <div className="flex flex-wrap gap-2"><button disabled={busy} className="btn-primary"><Save className="h-4 w-4" />{busy ? 'Saving…' : 'Save product'}</button><button type="button" onClick={startNewProduct} className="btn-ghost"><X className="h-4 w-4" />Clear</button></div>
                  </form>
                </section>
              </div>
            ) : tab === 'recipes' ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
                <section className="rounded-3xl border border-charcoal/5 bg-white p-5 shadow-sm sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><h2 className="text-xl font-semibold">Recipes</h2><p className="mt-1 text-sm text-charcoal/55">{recipes.filter((recipe) => recipe.is_active).length} active recipes</p></div>
                    <button type="button" onClick={startNewRecipe} className="btn-primary"><Plus className="h-4 w-4" />Add recipe</button>
                  </div>
                  {recipes.length === 0 && <div className="mt-5 rounded-2xl bg-cream-warm/70 p-4"><p className="text-sm text-charcoal/65">The site is still showing its built-in starter recipes. Import them to start editing, or add a recipe and the starters will be kept.</p><button type="button" disabled={busy} onClick={importStarterRecipes} className="btn-ghost mt-3">Import starter recipes</button></div>}
                  <label className="mt-5 inline-flex items-center gap-2 text-sm text-charcoal/65"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />Show archived recipes</label>
                  <div className="mt-4 divide-y divide-charcoal/10">
                    {visibleRecipes.map((recipe) => <div key={recipe.id} className="flex items-center gap-3 py-3">
                      <img src={recipe.image || '/story-art.jpg'} alt="" className="h-12 w-16 rounded-xl bg-cream-warm object-cover" />
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{recipe.title}</p><p className="text-xs text-charcoal/55">{recipe.category}{!recipe.is_active && ' · Archived'}</p></div>
                      <button type="button" onClick={() => editRecipe(recipe)} className="btn-ghost px-3 py-2">Edit</button>
                      <button type="button" disabled={busy} onClick={() => archiveRecipe(recipe)} className="rounded-full px-3 py-2 text-xs font-semibold text-charcoal/55 hover:bg-cream-warm">{recipe.is_active ? 'Archive' : 'Restore'}</button>
                    </div>)}
                  </div>
                </section>
                <section className="rounded-3xl border border-charcoal/5 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-5"><p className="eyebrow">{editingRecipe ? 'Edit recipe' : 'New recipe'}</p><h2 className="mt-1 text-xl font-semibold">{editingRecipe ? editingRecipe.title : 'Add a recipe'}</h2></div>
                  <form className="space-y-4" onSubmit={saveRecipe}>
                    <Field label="Recipe title"><input required value={recipeForm.title} onChange={(e) => setRecipeForm({ ...recipeForm, title: e.target.value })} className={inputClass} /></Field>
                    <Field label="Short introduction"><textarea rows={2} value={recipeForm.excerpt} onChange={(e) => setRecipeForm({ ...recipeForm, excerpt: e.target.value })} className={inputClass} /></Field>
                    <div className="grid gap-4 sm:grid-cols-2"><Field label="Category"><input value={recipeForm.category} onChange={(e) => setRecipeForm({ ...recipeForm, category: e.target.value })} className={inputClass} /></Field><Field label="Cooking time"><input value={recipeForm.time} onChange={(e) => setRecipeForm({ ...recipeForm, time: e.target.value })} className={inputClass} placeholder="35 min" /></Field></div>
                    <div className="grid gap-4 sm:grid-cols-2"><Field label="Serves"><input value={recipeForm.serves} onChange={(e) => setRecipeForm({ ...recipeForm, serves: e.target.value })} className={inputClass} /></Field><Field label="Kaputei product"><input value={recipeForm.sauce} onChange={(e) => setRecipeForm({ ...recipeForm, sauce: e.target.value })} className={inputClass} /></Field></div>
                    <Field label="Product page handle" hint="For example: barbecue-sauce"><input value={recipeForm.productHandle} onChange={(e) => setRecipeForm({ ...recipeForm, productHandle: e.target.value })} className={inputClass} /></Field>
                    <Field label="Recipe image URL or path"><input value={recipeForm.image} onChange={(e) => setRecipeForm({ ...recipeForm, image: e.target.value })} className={inputClass} /></Field>
                    <Field label="Ingredients" hint="One ingredient per line"><textarea rows={5} value={recipeForm.ingredients} onChange={(e) => setRecipeForm({ ...recipeForm, ingredients: e.target.value })} className={inputClass} /></Field>
                    <Field label="Method" hint="One step per line"><textarea rows={7} value={recipeForm.steps} onChange={(e) => setRecipeForm({ ...recipeForm, steps: e.target.value })} className={inputClass} /></Field>
                    <div className="flex items-center justify-between"><Field label="Display order"><input type="number" value={recipeForm.sortOrder} onChange={(e) => setRecipeForm({ ...recipeForm, sortOrder: e.target.value })} className={inputClass} /></Field><label className="ml-4 flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={recipeForm.active} onChange={(e) => setRecipeForm({ ...recipeForm, active: e.target.checked })} />Visible</label></div>
                    <div className="flex flex-wrap gap-2"><button disabled={busy} className="btn-primary"><Save className="h-4 w-4" />{busy ? 'Saving…' : 'Save recipe'}</button><button type="button" onClick={startNewRecipe} className="btn-ghost"><X className="h-4 w-4" />Clear</button></div>
                  </form>
                </section>
              </div>
            ) : (
              <form onSubmit={saveSettings} className="rounded-3xl border border-charcoal/5 bg-white p-5 shadow-sm sm:p-8">
                <div className="mb-6"><h2 className="text-xl font-semibold">Store details and page copy</h2><p className="mt-1 text-sm text-charcoal/55">These details are used across the website.</p></div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Business name"><input value={settingsDraft.name} onChange={(e) => setSettingsDraft({ ...settingsDraft, name: e.target.value })} className={inputClass} /></Field>
                  <Field label="Tagline"><input value={settingsDraft.tagline} onChange={(e) => setSettingsDraft({ ...settingsDraft, tagline: e.target.value })} className={inputClass} /></Field>
                  <Field label="Contact email"><input type="email" value={settingsDraft.email} onChange={(e) => setSettingsDraft({ ...settingsDraft, email: e.target.value })} className={inputClass} /></Field>
                  <Field label="Phone shown on site"><input value={settingsDraft.phoneWhatsApp} onChange={(e) => setSettingsDraft({ ...settingsDraft, phoneWhatsApp: e.target.value })} className={inputClass} /></Field>
                  <Field label="WhatsApp number" hint="Include the country code, e.g. 2547…"><input value={settingsDraft.whatsappNumber} onChange={(e) => setSettingsDraft({ ...settingsDraft, whatsappNumber: e.target.value })} className={inputClass} /></Field>
                  <Field label="Location"><input value={settingsDraft.location} onChange={(e) => setSettingsDraft({ ...settingsDraft, location: e.target.value })} className={inputClass} /></Field>
                  <Field label="Shop URL"><input type="url" value={settingsDraft.sourceSite} onChange={(e) => setSettingsDraft({ ...settingsDraft, sourceSite: e.target.value })} className={inputClass} /></Field>
                  <Field label="Logo image URL or path"><input value={settingsDraft.logoUrl} onChange={(e) => setSettingsDraft({ ...settingsDraft, logoUrl: e.target.value })} className={inputClass} /></Field>
                  <Field label="Instagram URL"><input value={settingsDraft.instagram} onChange={(e) => setSettingsDraft({ ...settingsDraft, instagram: e.target.value })} className={inputClass} /></Field>
                  <Field label="Facebook URL"><input value={settingsDraft.facebook} onChange={(e) => setSettingsDraft({ ...settingsDraft, facebook: e.target.value })} className={inputClass} /></Field>
                  <Field label="TikTok URL"><input value={settingsDraft.tiktok} onChange={(e) => setSettingsDraft({ ...settingsDraft, tiktok: e.target.value })} className={inputClass} /></Field>
                  <Field label="X URL"><input value={settingsDraft.twitterX} onChange={(e) => setSettingsDraft({ ...settingsDraft, twitterX: e.target.value })} className={inputClass} /></Field>
                  <Field label="YouTube URL"><input value={settingsDraft.youtube} onChange={(e) => setSettingsDraft({ ...settingsDraft, youtube: e.target.value })} className={inputClass} /></Field>
                  <Field label="WhatsApp channel URL"><input value={settingsDraft.whatsappChannel} onChange={(e) => setSettingsDraft({ ...settingsDraft, whatsappChannel: e.target.value })} className={inputClass} /></Field>
                  <Field label="Homepage headline"><input value={settingsDraft.homeHeadline} onChange={(e) => setSettingsDraft({ ...settingsDraft, homeHeadline: e.target.value })} className={inputClass} /></Field>
                  <Field label="About page headline"><input value={settingsDraft.aboutHeadline} onChange={(e) => setSettingsDraft({ ...settingsDraft, aboutHeadline: e.target.value })} className={inputClass} /></Field>
                  <Field label="Story image URL or path"><input value={settingsDraft.storyImageUrl} onChange={(e) => setSettingsDraft({ ...settingsDraft, storyImageUrl: e.target.value })} className={inputClass} /></Field>
                  <div className="md:col-span-2"><Field label="Homepage description"><textarea rows={3} value={settingsDraft.homeDescription} onChange={(e) => setSettingsDraft({ ...settingsDraft, homeDescription: e.target.value })} className={inputClass} /></Field></div>
                  <div className="md:col-span-2"><Field label="About page story"><textarea rows={5} value={settingsDraft.aboutNote} onChange={(e) => setSettingsDraft({ ...settingsDraft, aboutNote: e.target.value })} className={inputClass} /></Field></div>
                  <div className="md:col-span-2"><Field label="Contact page FAQs" hint="One per line: question | answer"><textarea rows={8} value={faqText} onChange={(e) => setFaqText(e.target.value)} className={inputClass} /></Field></div>
                </div>
                <button disabled={busy} className="btn-primary mt-6"><Check className="h-4 w-4" />{busy ? 'Saving…' : 'Save store details'}</button>
                <div className="mt-10 border-t border-charcoal/10 pt-6">
                  <h3 className="text-lg font-semibold">Change sign-in password</h3>
                  <p className="mt-1 text-sm text-charcoal/55">Use a unique password and keep it private.</p>
                  <div className="mt-4 grid max-w-2xl gap-4 sm:grid-cols-2">
                    <Field label="New password"><input type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} /></Field>
                    <Field label="Confirm new password"><input type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} /></Field>
                  </div>
                  <button type="button" disabled={busy} onClick={updatePassword} className="btn-ghost mt-4">Update password</button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </main>
  )
}
