import { Link } from 'react-router-dom'
import { ArrowRight, HandHeart, HeartHandshake, Sprout, Sun } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { BRAND, PRODUCTS } from '../data/products'

const PILLARS = [
  {
    icon: Sprout,
    title: 'Made at the farm',
    copy: 'Every sauce, jam, pickle and tea is developed and produced by us on Ngong Rd, Nairobi — not contract-bottled somewhere else.',
  },
  {
    icon: Sun,
    title: 'A full pantry, one family',
    copy: `${PRODUCTS.length} product lines and dozens of flavours, all from the same kitchen that started with a mother and daughter.`,
  },
  {
    icon: HandHeart,
    title: 'More than food',
    copy: 'Kaputei Farm Products was born from a mother-daughter dream. Every purchase supports a legacy tied to mental health awareness and emotional healing.',
  },
]

export function About() {
  return (
    <div className="py-14 sm:py-20">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">
              A mother-daughter dream, bottled.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal/70 sm:text-lg">
              {BRAND.aboutNote}
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal/70">
              What started in a family kitchen is now a full pantry — sauces,
              ketchups, chutneys, jams, pickles, dressings, honey and herbal teas, made in Nairobi
              and loved across Kenya.
            </p>
            <p className="mt-5 font-hand text-3xl text-tomato-deep">
              With love, Mama &amp; Daughter
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-md">
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2.2rem] bg-gradient-to-br from-chipotle/25 via-cream-warm to-tomato/20 blur-sm"
              />
              <img
                src="/story-art.jpg"
                alt="Hand-drawn artwork of a hand reaching among leaves — Be yourself"
                className="relative rotate-[1.5deg] rounded-[2rem] shadow-warm transition-transform duration-500 hover:rotate-0"
              />
              <p className="absolute -bottom-5 right-6 rotate-[2deg] rounded-xl bg-charcoal px-4 py-2 font-hand text-xl text-cream shadow-lg">
                be yourself.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-tomato/15 bg-gradient-to-br from-cream-warm to-white p-8 sm:flex-row sm:items-center sm:p-10">
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tomato text-white shadow-warm">
              <HeartHandshake className="h-7 w-7" />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-semibold">More than food on a shelf.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/70 sm:text-base">
                Kaputei was founded with mental health awareness and emotional healing at its
                heart. A portion of the story around every purchase supports that cause —
                because healing, like good food, is best shared.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="h-full">
              <div className="h-full rounded-3xl border border-charcoal/5 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-warm">
                  <p.icon className="h-6 w-6 text-tomato" />
                </span>
                <h2 className="mt-4 text-xl font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{p.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 overflow-hidden rounded-3xl bg-charcoal p-8 sm:p-12">
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { big: `${PRODUCTS.length} product lines`, small: 'Sauces, jams, pickles, teas, honey and more' },
                { big: 'Mother & daughter', small: 'A family business built from a shared dream' },
                { big: 'Ngong Rd, Nairobi', small: 'Our kitchen — and our home base' },
              ].map((s) => (
                <div key={s.big}>
                  <p className="font-serif text-3xl font-semibold text-chipotle">{s.big}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{s.small}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12 rounded-3xl border border-charcoal/5 bg-cream-warm/60 p-8 sm:p-10">
            <h2 className="text-2xl font-semibold sm:text-3xl">Come say hello.</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-charcoal/70">
              Find us on {BRAND.location}, follow the farm on Instagram or TikTok, or order
              directly on WhatsApp. We love hearing from shops, restaurants and sauce lovers alike.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={BRAND.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="btn-primary group"
              >
                WhatsApp us
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <Link to="/products" className="btn-ghost">
                Browse products
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
