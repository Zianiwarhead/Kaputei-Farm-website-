import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, MessageCircle, ShoppingBasket, Truck } from 'lucide-react'
import { BRAND, CATEGORIES } from '../data/products'
import { RECIPES } from '../data/recipes'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/ProductCard'
import { RecipeCard } from '../components/RecipeCard'
import { Reveal } from '../components/Reveal'
import { SauceRibbon } from '../components/SauceRibbon'
import { formatKes } from '../data/products'

const TILE_GRADIENTS: Record<string, { from: string; to: string }> = {
  Sauces: { from: '#C8252C', to: '#E07A1F' },
  Dressings: { from: '#E8B93E', to: '#C8941F' },
  Chutney: { from: '#C8941F', to: '#5C8A3A' },
  Pickles: { from: '#5C8A3A', to: '#2E4D1F' },
  Spreads: { from: '#D94B2B', to: '#9E1B22' },
  Pantry: { from: '#E8B93E', to: '#B8721A' },
  Teas: { from: '#5C8A3A', to: '#8A5A3A' },
  Bulk: { from: '#1F1A17', to: '#7B3A18' },
}

const TRUST = [
  { icon: ShoppingBasket, title: '23 products', sub: 'One family pantry' },
  { icon: Truck, title: 'Nationwide', sub: 'Delivery across Kenya' },
  { icon: MessageCircle, title: 'WhatsApp orders', sub: 'One tap to order' },
]

export function Home() {
  const { products } = useProducts()
  const pick = (id: string, fallbackIndex: number) =>
    products.find((p) => p.id === id) ?? products[fallbackIndex % products.length]
  const heroMain = pick('barbecue-sauce', 0)
  const heroLeft = pick('choma-sauce', 3)
  const heroRight = pick('tomato-sauce', 21)
  const railIds = ['barbecue-sauce', 'tomato-sauce', 'choma-sauce', 'chilli-sauce', 'honey', 'jams', 'tomato-ketchup', 'salsa-kachumbari']
  const rail = railIds
    .map((id, i) => products.find((p) => p.id === id) ?? products[i % products.length])
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
  const recipeTeaser = RECIPES.slice(0, 3)
  const categories = CATEGORIES.filter((c) => c !== 'All').map((c) => ({
    name: c,
    count: products.filter((p) => p.category === c).length,
  }))

  return (
    <>
      {/* Hero */}
      <section className="px-3 pt-4 sm:px-5 sm:pt-6">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#FFFCF4] shadow-[0_20px_60px_-30px_rgba(200,37,44,0.25)] sm:rounded-[2.5rem]">
          <div
            aria-hidden="true"
            className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-chipotle/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-tomato/10 blur-3xl"
          />

          <div className="relative grid items-center gap-8 px-6 pb-12 pt-12 sm:px-12 sm:pt-16 lg:grid-cols-2 lg:pb-16">
            <div className="animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-cream">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-leaf" />
                Kaputei Farm Products · Nairobi
              </p>
              <h1 className="mt-5 font-display text-6xl font-extrabold leading-[0.95] tracking-tight sm:text-8xl">
                WE GOT
                <br />
                <span className="text-tomato">FLAVOR.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-charcoal/70 sm:text-lg">
                Sauces, jams, honey &amp; teas made by a mother-daughter team —
                order on WhatsApp in one tap.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={BRAND.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn group bg-charcoal px-7 py-3.5 text-white shadow-lg transition-all hover:bg-tomato"
                >
                  Order Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <Link
                  to="/products"
                  className="btn border-2 border-charcoal/15 bg-white px-7 py-3 text-charcoal hover:border-charcoal"
                >
                  Explore Range
                </Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
                {TRUST.map((t) => (
                  <div key={t.title} className="flex items-center gap-2.5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream-warm">
                      <t.icon className="h-5 w-5 text-tomato" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold leading-tight">{t.title}</span>
                      <span className="block text-xs text-charcoal/55">{t.sub}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating cluster */}
            <div className="relative mx-auto flex h-[420px] w-full max-w-md items-center justify-center sm:h-[500px]" aria-hidden="true">
              <div className="absolute h-72 w-72 rounded-full bg-chipotle/25 blur-2xl sm:h-96 sm:w-96" />
              <div className="absolute left-2 top-8 h-40 w-40 rounded-full bg-tomato/15 blur-xl" />
              <div className="absolute bottom-6 right-0 h-48 w-48 rounded-full bg-leaf/15 blur-xl" />

              <Leaf className="absolute left-6 top-10 h-8 w-8 -rotate-12 text-leaf/50" />
              <Leaf className="absolute bottom-14 left-12 h-6 w-6 rotate-45 text-leaf/40" />
              <Leaf className="absolute right-8 top-16 h-7 w-7 rotate-12 text-leaf/50" />
              <span className="absolute left-16 top-1/3 h-3 w-3 rounded-full bg-tomato/60" />
              <span className="absolute bottom-20 right-16 h-2.5 w-2.5 rounded-full bg-chipotle" />
              <span className="absolute right-24 top-6 h-2 w-2 rounded-full bg-tomato/50" />

              <img
                src={heroLeft.images[0]}
                alt=""
                loading="eager"
                className="animate-float absolute left-0 top-16 w-32 -rotate-12 drop-shadow-2xl sm:w-44"
                style={{ animationDelay: '0.8s', ['--float-rot' as string]: '-12deg' }}
              />
              <img
                src={heroMain.images[0]}
                alt="Kaputei bestseller sauces"
                loading="eager"
                className="animate-float relative z-10 w-48 drop-shadow-2xl sm:w-64"
                style={{ ['--float-rot' as string]: '3deg' }}
              />
              <img
                src={heroRight.images[0]}
                alt=""
                loading="eager"
                className="animate-float absolute bottom-10 right-0 w-32 rotate-12 drop-shadow-2xl sm:w-44"
                style={{ animationDelay: '1.6s', ['--float-rot' as string]: '12deg' }}
              />

              <span className="animate-float absolute right-4 top-4 z-20 rounded-2xl bg-white px-3.5 py-2 text-center shadow-lg" style={{ animationDelay: '0.4s' }}>
                <span className="block font-display text-lg font-bold leading-none text-tomato">{formatKes(heroRight.priceKes)}</span>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-charcoal/55">Tomato Sauce</span>
              </span>
              <span className="animate-float absolute bottom-4 left-4 z-20 rounded-2xl bg-charcoal px-3.5 py-2 text-center shadow-lg" style={{ animationDelay: '1.2s' }}>
                <span className="block font-display text-sm font-bold leading-none text-chipotle">BESTSELLER</span>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-white/60">Choma Sauce</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Ribbon */}
      <div className="mt-4 sm:mt-6">
        <SauceRibbon />
      </div>

      {/* Bestsellers rail */}
      <section className="py-14 sm:py-20">
        <div className="container-site">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Most loved</p>
                <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Bestsellers.</h2>
              </div>
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition-colors hover:text-tomato"
              >
                Shop all {products.length}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="container-site mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
          {rail.map((product) => (
            <div key={product.id} className="w-64 shrink-0 snap-start sm:w-72">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-cream-warm/60 py-14 sm:py-20">
        <div className="container-site">
          <Reveal>
            <p className="eyebrow">Shop by craving</p>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Pick your flavor.</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((c, i) => {
              const g = TILE_GRADIENTS[c.name] ?? { from: '#C8252C', to: '#E07A1F' }
              return (
                <Reveal key={c.name} delay={Math.min(i, 7) * 50}>
                  <Link
                    to={`/products?cat=${encodeURIComponent(c.name)}`}
                    className="group flex items-center gap-3 rounded-2xl border border-charcoal/5 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm"
                  >
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                    >
                      {c.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-semibold leading-tight">{c.name}</span>
                      <span className="block text-xs text-charcoal/55">
                        {c.count} {c.count === 1 ? 'product' : 'products'}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Slim story strip */}
      <section className="py-10">
        <div className="container-site">
          <Reveal>
            <Link
              to="/about"
              className="group flex flex-col items-center justify-between gap-3 rounded-3xl bg-charcoal px-8 py-6 text-center sm:flex-row sm:text-left"
            >
              <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                <span className="font-hand text-2xl text-chipotle">Born from a mother-daughter dream — </span>
                every jar supports mental-health awareness.
              </p>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-tomato">
                Our story
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Recipes teaser */}
      <section className="py-14 sm:py-20">
        <div className="container-site">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">From the family kitchen</p>
                <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Cook with Kaputei.</h2>
              </div>
              <Link
                to="/recipes"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition-colors hover:text-tomato"
              >
                All recipes
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipeTeaser.map((recipe, i) => (
              <Reveal key={recipe.id} delay={i * 80}>
                <RecipeCard recipe={recipe} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-charcoal py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(ellipse at 30% 20%, #E07A1F55, transparent 60%), radial-gradient(ellipse at 75% 80%, #C8252C66, transparent 60%)' }}
        />
        <div className="container-site relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-display text-5xl font-bold text-white sm:text-6xl">
              Taste the flavor.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-white/60">
              Retail, wholesale or hospitality — one WhatsApp message and dinner is sorted.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={BRAND.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="btn bg-leaf px-7 py-3 text-white hover:bg-[#4A7230]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp {BRAND.phoneWhatsApp}
              </a>
              <Link to="/products" className="btn border border-white/25 text-white hover:border-white hover:bg-white/10">
                Browse products
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
