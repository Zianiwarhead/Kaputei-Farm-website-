import { useEffect, useState } from 'react'
import { PRODUCTS, type Product, type VariantPrice } from '../data/products'
import { isSupabaseConfigured, resolveImage, supabase } from '../lib/supabase'

interface DbRow {
  id: string
  name: string
  handle: string
  category: string
  badge?: string | null
  price_kes: number | string
  compare_at_price_kes?: number | string | null
  description_short?: string | null
  sizes?: string[] | null
  variants?: string[] | null
  images?: string[] | null
  variant_prices?: VariantPrice[] | null
  gradient_from?: string | null
  gradient_to?: string | null
}

function toNumber(n: number | string | null | undefined, fallback: number): number {
  const v = typeof n === 'string' ? parseFloat(n) : n
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

function mapRow(row: DbRow): Product {
  const fallback = PRODUCTS.find((p) => p.id === row.id || p.handle === row.handle)
  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    category: row.category || fallback?.category || 'Sauces',
    badge: row.badge ?? fallback?.badge,
    priceKes: toNumber(row.price_kes, fallback?.priceKes ?? 0),
    compareAtPriceKes:
      row.compare_at_price_kes == null ? (fallback?.compareAtPriceKes ?? null) : toNumber(row.compare_at_price_kes, 0),
    descriptionShort: row.description_short ?? fallback?.descriptionShort ?? '',
    sizes: row.sizes ?? fallback?.sizes ?? [],
    variants: row.variants ?? fallback?.variants ?? [],
    images: (row.images?.length ? row.images : (fallback?.images ?? [])).map(resolveImage),
    variantPrices: (row.variant_prices ?? []).map((v) => ({
      ...v,
      image: v.image ? resolveImage(v.image) : undefined,
    })),
    gradient: {
      from: row.gradient_from ?? fallback?.gradient.from ?? '#C8252C',
      to: row.gradient_to ?? fallback?.gradient.to ?? '#9E1B22',
    },
  }
}

/**
 * Products with Supabase as primary source and bundled local data as fallback.
 * The site works fully offline / without env keys; when Supabase is configured
 * AND returns rows, those take over silently.
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [source, setSource] = useState<'local' | 'supabase'>('local')

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    let cancelled = false
    async function load() {
      try {
        const { data, error } = await supabase!
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
        if (cancelled) return
        if (!error && data && data.length > 0) {
          try {
            setProducts((data as DbRow[]).map(mapRow))
            setSource('supabase')
          } catch {
            /* keep local fallback */
          }
        }
      } catch {
        /* network failure — keep local fallback */
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { products, loading, source }
}
