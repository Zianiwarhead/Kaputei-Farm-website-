import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { Recipes } from './pages/Recipes'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { NotFound } from './pages/NotFound'
import { SiteSettingsProvider } from './hooks/useSiteSettings'

const Admin = lazy(() => import('./pages/Admin').then((module) => ({ default: module.Admin })))

export default function App() {
  return (
    <SiteSettingsProvider>
      <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Suspense fallback={<p className="container-site py-16 text-sm text-charcoal/60">Loading owner tools…</p>}><Admin /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      </div>
    </SiteSettingsProvider>
  )
}
