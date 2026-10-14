import { Link } from 'react-router-dom'
import { Home as HomeIcon, ShoppingBasket } from 'lucide-react'

export function NotFound() {
  return (
    <div className="py-20 sm:py-28">
      <div className="container-site text-center">
        <p className="eyebrow">404</p>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
          Nothing cooking
          <br />
          <span className="text-tomato">here.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-charcoal/70">
          That page has wandered off the farm — but the good stuff is still on the shelf.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <HomeIcon className="h-4 w-4" />
            Back home
          </Link>
          <Link to="/products" className="btn-ghost">
            <ShoppingBasket className="h-4 w-4" />
            Browse products
          </Link>
        </div>
      </div>
    </div>
  )
}