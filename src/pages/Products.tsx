import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { CATEGORIES, formatKes, type CategoryFilter } from '../data/products'
import { BRAND } from '../data/products'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/Reveal'
import { cx } from '../lib/utils'

export function Products() {
  const { products, loading, source } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCat = searchParams.get('cat')
  const [filter, setFilter] = useState<CategoryFilter>(
    initialCat && (CATEGORIES as readonly string[]).includes(initialCat)
      ? (initialCat as CategoryFilter)
      : 'All',
  )
  const [query, setQuery] = useState('')

  function pickFilter(c: CategoryFilter) {
    setFilter(c)
    setSearchParams(c === 'All' ? {} : { cat: c }, { replace: true })
  }

  const filtered = useMemo(() => {
    const byCat = filter === 'All' ? products : products.filter((p) => p.category === filter)
    const q = query.trim().toLowerCase()
    if (!q) return byCat
    return byCat.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.descriptionShort.toLowerCase().includes(q) ||
        p.variants.some((v) => v.toLowerCase().includes(q)),
    )
  }, [filter, query, products])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="py-14 sm:py-20">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Our range</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold sm:text-6xl">
            We got flavor.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal/65">
            {products.length} product lines — from everyday tomato sauce and ketchup to chutneys,
            pestos, jams, pickles and herbal teas. All made at the farm in Nairobi.
            {loading && <span className="ml-2 text-xs text-charcoal/40">Refreshing…</span>}
            {source === 'supabase' && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-leaf">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> Live
              </span>
            )}
          </p>
        </Reveal>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => pickFilter(c)}
                className={cx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                  filter === c
                    ? 'bg-tomato text-white shadow-warm'
                    : 'border border-charcoal/15 bg-white text-charcoal/70 hover:border-charcoal hover:text-charcoal',
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sauces, jams, teas…"
              className="w-full rounded-full border border-charcoal/15 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-charcoal/35 focus:border-tomato sm:w-64"
            />
          </label>
        </div>

        <p className="mt-5 text-sm text-charcoal/50">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          {filter !== 'All' && ` in ${filter}`}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i, 5) * 60} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-charcoal/20 bg-white/60 p-10 text-center">
            <p className="font-serif text-xl">Nothing matches "{query}".</p>
            <p className="mt-2 text-sm text-charcoal/60">
              Try another word — or{' '}
              <a
                href={`https://wa.me/254710752751?text=${encodeURIComponent('Hi! Do you make...?')}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-tomato underline"
              >
                ask us on WhatsApp
              </a>{' '}
              if we can make it for you.
            </p>
          </div>
        )}

        {/* Bulk / hospitality band */}
        <Reveal>
          <div className="mt-16 overflow-hidden rounded-3xl bg-charcoal p-8 sm:p-12">
            <div className="grid items-center gap-8 md:grid-cols-5">
              <div className="md:col-span-3">
                <p className="chip bg-white/10 text-chipotle">Hotels · Restaurants · Caterers</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
                  House sauces at hospitality scale.
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
                  Tomato, ketchup, BBQ, choma, chilli, 1000 island, chipotle, cool ranch, honey
                  mustard, teriyaki, mayonnaise & eggless mayo — in 2L, 5L and 20L packs.
                </p>
              </div>
              <div className="md:col-span-2 md:text-right">
                <p className="text-3xl font-semibold text-chipotle">{formatKes(222.58)}+</p>
                <p className="mt-1 text-xs text-white/50">bulk packs, from</p>
                <a
                  href={`https://wa.me/254710752751?text=${encodeURIComponent('Hi! I run a business and I would like a wholesale quote for your sauces.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-5"
                >
                  Get a wholesale quote
                </a>
                <p className="mt-3 text-xs text-white/45">
                  Or call {BRAND.phoneWhatsApp} · {BRAND.location}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
