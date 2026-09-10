import { PRODUCTS } from '../data/products'

const EXTRA = ['We Got Flavor', 'Farm crafted', 'Mother-daughter dream', 'Made in Nairobi']

export function SauceRibbon() {
  const items = [...PRODUCTS.map((p) => p.name), ...EXTRA]
  const row = [...items, ...items]

  return (
    <div className="overflow-hidden bg-charcoal py-3.5">
      <div className="marquee-mask">
        <div className="animate-marquee flex w-max items-center gap-8 pr-8">
          {row.map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-8 whitespace-nowrap">
              <span className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-cream/85">
                {item}
              </span>
              <span className={`h-1.5 w-1.5 rounded-full ${i % 3 === 0 ? 'bg-chipotle' : i % 3 === 1 ? 'bg-tomato' : 'bg-cream/40'}`} />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
