import { useState, type FormEvent } from 'react'
import { CheckCircle2, ChevronDown, Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Phone, Send, Youtube } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { BRAND } from '../data/products'
import { cx } from '../lib/utils'

const INTENTS = ['Just saying hello', 'Retail order', 'Wholesale / stockist', 'Restaurant / catering'] as const

const FAQS = [
  {
    q: 'How do I place an order?',
    a: 'The fastest way is WhatsApp on +254 710 752 751 — tap any "Order on WhatsApp" button and your message is pre-written for you. You can also shop the full catalogue on kaputeishop.com.',
  },
  {
    q: 'Do you deliver outside Nairobi?',
    a: 'Yes — we send orders across Kenya by courier. Message us on WhatsApp with your town and what you would like, and we will confirm delivery cost and timing.',
  },
  {
    q: 'I run a shop, hotel or restaurant. Can I stock Kaputei?',
    a: 'Absolutely — wholesale and bulk hospitality packs (2L, 5L, 20L) are a big part of what we do. Choose "Wholesale / stockist" above or WhatsApp us directly for a quote.',
  },
  {
    q: 'Where are you located?',
    a: 'Our kitchen is on Ngong Rd, Nairobi. Reach out before visiting so we can make sure someone is around to receive you warmly.',
  },
  {
    q: 'What is the story behind Kaputei?',
    a: 'Kaputei Farm Products was born from a mother-daughter dream, founded with mental health awareness and emotional healing at its heart. Every purchase supports that cause.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="py-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-serif text-lg font-semibold">{q}</span>
        <span className={cx('shrink-0 rounded-full bg-cream-warm p-1.5 transition-transform duration-300', open && 'rotate-180')}>
          <ChevronDown className="h-4 w-4 text-tomato" />
        </span>
      </button>
      <div
        className={cx(
          'grid transition-all duration-300 ease-out',
          open ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <p className="overflow-hidden text-sm leading-relaxed text-charcoal/65">{a}</p>
      </div>
    </div>
  )
}

export function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [intent, setIntent] = useState<(typeof INTENTS)[number]>(INTENTS[0])
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  const mailto = `mailto:${BRAND.email}?subject=${encodeURIComponent(
    `Kaputei enquiry — ${intent} — ${name}`,
  )}&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`

  return (
    <div className="py-14 sm:py-20">
      <div className="container-site grid gap-10 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Say hello.</h1>
          <p className="mt-4 text-base leading-relaxed text-charcoal/65">
            Wholesale, retail, or just hungry — send us a note and we'll get back to you.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="rounded-full bg-cream-warm p-2">
                <MapPin className="h-4 w-4 text-tomato" />
              </span>
              <span>
                <strong className="block font-semibold">{BRAND.location}</strong>
                <span className="text-charcoal/60">Nairobi, Kenya</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="rounded-full bg-cream-warm p-2">
                <Phone className="h-4 w-4 text-tomato" />
              </span>
              <span>
                <strong className="block font-semibold">{BRAND.phoneWhatsApp}</strong>
                <span className="text-charcoal/60">Call or WhatsApp</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="rounded-full bg-cream-warm p-2">
                <Mail className="h-4 w-4 text-tomato" />
              </span>
              <span>
                <strong className="block font-semibold">{BRAND.email}</strong>
                <span className="text-charcoal/60">We reply within a day or two</span>
              </span>
            </li>
          </ul>

          <div className="mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal/55">Follow the farm</h2>
            <div className="mt-3 flex flex-wrap gap-2.5">
              <a href={BRAND.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full bg-white p-2.5 shadow-sm transition-colors hover:bg-tomato hover:text-white">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={BRAND.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full bg-white p-2.5 shadow-sm transition-colors hover:bg-tomato hover:text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={BRAND.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="rounded-full bg-white p-2.5 shadow-sm transition-colors hover:bg-tomato hover:text-white">
                <Music2 className="h-4 w-4" />
              </a>
              <a href={BRAND.twitterX} target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="rounded-full bg-white p-2.5 shadow-sm transition-colors hover:bg-tomato hover:text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.5l-5.9-7.7-6.7 7.7H.2l8.7-9.9L0 1.2h7.7l5.3 7 5.9-7zm-1.3 19.4h2L6.6 3.3H4.4l13.2 17.3z"/></svg>
              </a>
              <a href={BRAND.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-full bg-white p-2.5 shadow-sm transition-colors hover:bg-tomato hover:text-white">
                <Youtube className="h-4 w-4" />
              </a>
              <a href={BRAND.whatsappChannel} target="_blank" rel="noreferrer" aria-label="WhatsApp Channel" className="rounded-full bg-white p-2.5 shadow-sm transition-colors hover:bg-leaf hover:text-white">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-3">
          <div className="rounded-3xl border border-charcoal/5 bg-white p-6 shadow-sm sm:p-8">
            {sent ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-leaf" />
                <h2 className="mt-4 font-serif text-2xl font-semibold">Asante, {name || 'friend'}!</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-charcoal/65">
                  Your note is ready. Since this site has no backend yet, click below to send it
                  via your email app — or just WhatsApp us directly.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a href={mailto} className="btn-primary">
                    <Send className="h-4 w-4" />
                    Send via email
                  </a>
                  <a
                    href={BRAND.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn bg-leaf text-white hover:bg-[#4A7230]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp instead
                  </a>
                  <button type="button" onClick={() => setSent(false)} className="btn-ghost">
                    Edit message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Your name</span>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Wanjiku Mwangi"
                      className="w-full rounded-2xl border border-charcoal/15 bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-charcoal/35 focus:border-tomato"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Email</span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-charcoal/15 bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-charcoal/35 focus:border-tomato"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">I'm interested in</span>
                  <select
                    value={intent}
                    onChange={(e) => setIntent(e.target.value as (typeof INTENTS)[number])}
                    className="w-full rounded-2xl border border-charcoal/15 bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-tomato"
                  >
                    {INTENTS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Message</span>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you'd like — flavours, quantities, delivery town…"
                    className="w-full resize-y rounded-2xl border border-charcoal/15 bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-charcoal/35 focus:border-tomato"
                  />
                </label>
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  <Send className="h-4 w-4" />
                  Prepare message
                </button>
                <p className="text-xs text-charcoal/50">
                  No backend wired up yet — submitting prepares an email you send from your own
                  inbox. Nothing leaves your browser until then.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>

      <div className="container-site mt-16 max-w-3xl">
        <Reveal>
          <p className="eyebrow">Good to know</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Questions, answered.</h2>
          <div className="mt-6 divide-y divide-charcoal/10 rounded-3xl border border-charcoal/10 bg-white px-6 shadow-sm sm:px-8">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
