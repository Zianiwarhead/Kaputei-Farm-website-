import { useState } from 'react'
import { ArrowRight, Clock } from 'lucide-react'
import type { Recipe } from '../data/recipes'
import { RecipeImage } from './RecipeImage'
import { RecipeModal } from './RecipeModal'

interface Props {
  recipe: Recipe
}

export function RecipeCard({ recipe }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-charcoal/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-warm">
      <div
        className="relative aspect-[3/2] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${recipe.gradient.from}, ${recipe.gradient.to})` }}
      >
        {recipe.image ? (
          <>
            <RecipeImage
              src={recipe.image}
              alt={recipe.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"
            />
            <p className="absolute bottom-4 left-4 right-4 font-serif text-2xl font-semibold leading-snug text-white drop-shadow">
              {recipe.title}
            </p>
          </>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <p className="text-center font-serif text-2xl font-semibold leading-snug text-white/90 drop-shadow-sm sm:text-3xl">
                {recipe.title}
              </p>
            </div>
            <div aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div aria-hidden="true" className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-black/10" />
          </>
        )}
        <span className="absolute left-4 top-4 chip bg-white/90 text-charcoal">{recipe.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-charcoal/55">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {recipe.time}
          </span>
          <span>·</span>
          <span>{recipe.sauce}</span>
        </div>
        <h3 className="mt-3 text-xl font-semibold leading-snug">{recipe.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{recipe.excerpt}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-tomato hover:underline"
        >
          Cook this
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </article>
    <RecipeModal recipe={recipe} open={open} onOpenChange={setOpen} />
    </>
  )
}
