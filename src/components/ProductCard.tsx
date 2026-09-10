import { useRef, useState, type MouseEvent } from 'react'
import { Eye, MessageCircle } from 'lucide-react'
import type { Product } from '../data/products'
import { BRAND, formatKes } from '../data/products'
import { ProductQuickView } from './ProductQuickView'
import { cx } from '../lib/utils'

interface Props {
  product: Product
}

function orderLink(product: Product) {
  return (
    'https://wa.me/254710752751?text=' +
    encodeURIComponent(`Hi ${BRAND.name}! I would like to order: ${product.name} (${product.handle}).`)
  )
}

/** Resolves display pricing. Today this falls back to the flat priceKes;
    once `variantPrices` lands it shows the lowest price as "from KSh X". */
function displayPrice(product: Product): { from: number; compareAt: number | null; isRange: boolean } {
  if (product.variantPrices && product.variantPrices.length > 0) {
    const prices = product.variantPrices.map((v) => v.priceKes)
    const from = Math.min(...prices)
    const compareAt =
      product.variantPrices.find((v) => v.priceKes === from)?.compareAtPriceKes ??
      product.compareAtPriceKes
    return { from, compareAt: compareAt ?? null, isRange: prices.length > 1 }
  }
  return {
    from: product.priceKes,
    compareAt: product.compareAtPriceKes,
    isRange: product.sizes.length > 1,
  }
}

export function ProductCard({ product }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const [quickView, setQuickView] = useState(false)

  function onMove(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`
  }

  function onLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)'
  }

  const price = displayPrice(product)

  return (
    <div
      className="tilt group flex h-full flex-col overflow-hidden rounded-3xl border border-charcoal/5 bg-white shadow-sm transition-shadow hover:shadow-warm"
    >
      <button
        ref={ref}
        type="button"
        onClick={() => setQuickView(true)}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="block w-full cursor-pointer overflow-hidden text-left"
        aria-label={`Quick view ${product.name}`}
      >
        <div
          className="relative aspect-square overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${product.gradient.from}, ${product.gradient.to})` }}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain p-5 drop-shadow-lg transition-all duration-500 group-hover:scale-105"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} back label`}
              loading="lazy"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-contain p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          {product.badge && (
            <span className="absolute left-3 top-3 chip bg-white/95 text-charcoal">{product.badge}</span>
          )}
          {price.compareAt && (
            <span className="absolute right-3 top-3 rounded-full bg-tomato px-2.5 py-1 text-xs font-bold text-white">
              Sale
            </span>
          )}
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-charcoal/80 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <Eye className="h-3.5 w-3.5" />
            Quick view
          </span>
        </div>
      </button>

      <div className="tilt-inner flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug">{product.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-charcoal/65 line-clamp-2">{product.descriptionShort}</p>

        {product.sizes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.sizes.map((s) => (
              <span key={s} className="rounded-full bg-cream-warm px-2.5 py-0.5 text-xs font-medium text-charcoal/70">
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-semibold text-tomato">{formatKes(price.from)}</span>
            {price.compareAt && (
              <span className="text-sm text-charcoal/40 line-through">{formatKes(price.compareAt)}</span>
            )}
            {price.isRange && (
              <span className="ml-auto text-xs text-charcoal/45">from</span>
            )}
          </div>
          <a
            href={orderLink(product)}
            target="_blank"
            rel="noreferrer"
            className={cx(
              'btn mt-3 w-full bg-leaf text-white hover:bg-[#4A7230]',
            )}
          >
            <MessageCircle className="h-4 w-4" />
            Order on WhatsApp
          </a>
        </div>
      </div>
      <ProductQuickView product={product} open={quickView} onOpenChange={setQuickView} />
    </div>
  )
}
