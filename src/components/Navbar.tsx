import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cx } from '../lib/utils'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/5 bg-cream/85 backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="Kaputei Farm Products — home">
          <img src="/logo.png" alt="Kaputei Farm Products" className="h-11 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cx(
                  'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-tomato text-white' : 'text-charcoal/75 hover:bg-cream-warm hover:text-charcoal',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn-primary ml-2">
            Order now
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden rounded-full p-2 text-charcoal hover:bg-cream-warm"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-charcoal/5 bg-cream md:hidden">
          <div className="container-site flex flex-col gap-1 py-3">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'rounded-xl px-4 py-2 text-sm font-medium',
                    isActive ? 'bg-tomato text-white' : 'text-charcoal/80 hover:bg-cream-warm',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
