import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { ExternalLink, MessageCircle, X } from 'lucide-react'
import type { Product } from '../data/products'
import { BRAND, formatKes } from '../data/products'
import { cx } from '../lib/utils'

interface Props {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

function orderLink(product: Product) {
  return (
    'https://wa.me/254710752751?text=' +
    encodeURIComponent(`Hi ${BRAND.name}! I would like to order: ${product.name} (${product.handle}).`)
  )
}

export function ProductQuickView({ product, open, onOpenChange }: Props) {
  const [active, setActive] = useState(0)
  const current = product.images[Math.min(active, product.images.length - 1)] ?? product.images[0]

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) setActive(0); onOpenChange(o) }}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm" />
        <Dialog.Content
          className="dialog-content fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-2.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-cream shadow-2xl outline-none"
          aria-describedby={undefined}
        >
          <div className="grid sm:grid-cols-2">
            <div
              className="relative flex min-h-64 flex-col items-center justify-center gap-3 p-6 sm:min-h-full"
              style={{ background: `linear-gradient(135deg, ${product.gradient.from}, ${product.gradient.to})` }}
            >
              <img
                src={current}
                alt={product.name}
                className="max-h-72 w-full flex-1 object-contain drop-shadow-2xl"
              />
              {product.images.length > 1 && (
                <div className="flex max-w-full flex-wrap justify-center gap-1.5">
                  {product.images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`View image ${i + 1} of ${product.name}`}
                      className={cx(
                        'h-12 w-12 overflow-hidden rounded-xl border-2 bg-white/20 transition-all',
                        i === active ? 'border-white shadow-md' : 'border-white/30 opacity-70 hover:opacity-100',
                      )}
                    >
                      <img src={src} alt="" loading="lazy" className="h-full w-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
              {product.badge && (
                <span className="absolute left-4 top-4 chip bg-white/95 text-charcoal">{product.badge}</span>
              )}
            </div>

            <div className="flex flex-col p-6 sm:p-7">
              <Dialog.Title className="font-serif text-2xl font-semibold leading-tight">
                {product.name}
              </Dialog.Title>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal/65">{product.descriptionShort}</p>

              {product.sizes.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/50">Sizes</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <span key={s} className="rounded-full bg-cream-warm px-3 py-1 text-xs font-medium text-charcoal/75">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.variants.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/50">
                    Flavours ({product.variants.length})
                  </p>
                  <div className="mt-2 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
                    {product.variants.map((v) => (
                      <span key={v} className="rounded-full border border-charcoal/10 bg-white px-3 py-1 text-xs font-medium text-charcoal/75">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-semibold text-tomato">{formatKes(product.priceKes)}</span>
                {product.compareAtPriceKes && (
                  <span className="text-base text-charcoal/40 line-through">{formatKes(product.compareAtPriceKes)}</span>
                )}
              </div>

              <div className="mt-5 grid gap-2.5">
                <a
                  href={orderLink(product)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn w-full bg-leaf text-white hover:bg-[#4A7230]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Order on WhatsApp
                </a>
                <a
                  href={`${BRAND.sourceSite}products/${product.handle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost w-full"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on kaputeishop.com
                </a>
              </div>

              <p className="mt-4 font-hand text-xl leading-snug text-charcoal/55">
                made with love, mama &amp; daughter
              </p>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-charcoal/70 p-2 text-white backdrop-blur-sm transition-colors hover:bg-charcoal"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
