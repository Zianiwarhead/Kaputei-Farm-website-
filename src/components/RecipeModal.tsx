import * as Dialog from '@radix-ui/react-dialog'
import { Clock, MessageCircle, Users, X } from 'lucide-react'
import type { Recipe } from '../data/recipes'
import { BRAND } from '../data/products'
import { RecipeImage } from './RecipeImage'

interface Props {
  recipe: Recipe
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecipeModal({ recipe, open, onOpenChange }: Props) {
  const orderLink =
    'https://wa.me/254710752751?text=' +
    encodeURIComponent(`Hi ${BRAND.name}! I would like to order ${recipe.sauce} to cook ${recipe.title}.`)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm" />
        <Dialog.Content
          className="dialog-content fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-2.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-cream shadow-2xl outline-none"
          aria-describedby={undefined}
        >
          <div
            className="relative overflow-hidden px-6 pb-6 pt-10 sm:px-8"
            style={{ background: `linear-gradient(135deg, ${recipe.gradient.from}, ${recipe.gradient.to})` }}
          >
            <div aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <span className="chip bg-white/90 text-charcoal">{recipe.category}</span>
            <Dialog.Title className="mt-3 max-w-lg font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {recipe.title}
            </Dialog.Title>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {recipe.time}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Serves {recipe.serves}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                Uses: {recipe.sauce}
              </span>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:grid-cols-5 sm:p-8">
            {recipe.image && (
              <div className="sm:col-span-5">
                <RecipeImage
                  src={recipe.image}
                  alt={recipe.title}
                  className="aspect-video w-full rounded-2xl object-cover shadow-sm"
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-tomato">Ingredients</h3>
              <ul className="mt-3 space-y-2">
                {recipe.ingredients.map((ing) => (
                  <li key={ing} className="flex gap-2.5 text-sm leading-relaxed text-charcoal/75">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-tomato" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div className="sm:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-tomato">Method</h3>
              <ol className="mt-3 space-y-3.5">
                {recipe.steps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed text-charcoal/75">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-charcoal text-xs font-bold text-cream">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <a
                href={orderLink}
                target="_blank"
                rel="noreferrer"
                className="btn mt-6 w-full bg-leaf text-white hover:bg-[#4A7230]"
              >
                <MessageCircle className="h-4 w-4" />
                Order {recipe.sauce} on WhatsApp
              </a>
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
