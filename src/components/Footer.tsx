import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Phone, Youtube } from 'lucide-react'
import { BRAND, PRODUCTS } from '../data/products'

export function Footer() {
  const shopLink = `${BRAND.sourceSite}`
  const waLink = 'https://wa.me/254710752751'

  return (
    <footer className="border-t border-charcoal/5 bg-charcoal text-cream">
      <div className="container-site grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Kaputei Farm Products" className="h-14 w-auto rounded-lg" />
          </div>
          <p className="mt-3 text-sm text-cream/65">
            {BRAND.tagline} — {PRODUCTS.length} product lines of sauces, jams, pickles, honey and
            herbal teas made in Nairobi.
          </p>
          <p className="mt-2 font-hand text-xl text-chipotle/90">
            a mother-daughter dream
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-cream/55">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-chipotle" to="/products">Products</Link></li>
            <li><Link className="hover:text-chipotle" to="/recipes">Recipes</Link></li>
            <li><Link className="hover:text-chipotle" to="/about">Our story</Link></li>
            <li><Link className="hover:text-chipotle" to="/contact">Contact</Link></li>
            <li><a className="hover:text-chipotle" href={shopLink} target="_blank" rel="noreferrer">Shop online</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-cream/55">Reach us</h4>
          <ul className="mt-3 space-y-2 text-sm text-cream/75">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-chipotle" />
              <span>{BRAND.location}, Nairobi</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-chipotle" />
              <a href={`tel:${BRAND.phoneWhatsApp.replace(/\s/g, '')}`} className="hover:text-chipotle">
                {BRAND.phoneWhatsApp}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-chipotle" />
              <a href={`mailto:${BRAND.email}`} className="hover:text-chipotle">{BRAND.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 shrink-0 text-chipotle" />
              <a href={waLink} target="_blank" rel="noreferrer" className="hover:text-chipotle">
                WhatsApp us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-cream/55">Follow</h4>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-chipotle">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={BRAND.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-chipotle">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={BRAND.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="rounded-full bg-white/10 p-2 hover:bg-chipotle">
              <Music2 className="h-4 w-4" />
            </a>
            <a href={BRAND.twitterX} target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="rounded-full bg-white/10 p-2 hover:bg-chipotle">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.5l-5.9-7.7-6.7 7.7H.2l8.7-9.9L0 1.2h7.7l5.3 7 5.9-7zm-1.3 19.4h2L6.6 3.3H4.4l13.2 17.3z"/></svg>
            </a>
            <a href={BRAND.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-full bg-white/10 p-2 hover:bg-chipotle">
              <Youtube className="h-4 w-4" />
            </a>
            <a href={BRAND.whatsappChannel} target="_blank" rel="noreferrer" aria-label="WhatsApp Channel" className="rounded-full bg-white/10 p-2 hover:bg-leaf">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-4 text-xs text-cream/50">
            Wholesale & retail enquiries welcome.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Made with love in Nairobi, Kenya.</p>
        </div>
      </div>
    </footer>
  )
}
