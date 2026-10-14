import { useEffect, useMemo, useState } from 'react'
import { useRecipes } from '../hooks/useRecipes'
import { RecipeCard } from '../components/RecipeCard'
import { Reveal } from '../components/Reveal'
import { cx } from '../lib/utils'

const CATEGORIES = ['All', 'Beef', 'Chicken', 'Pork', 'Sides', 'Sauces'] as const

export function Recipes() {
  const { recipes } = useRecipes()
  const [filter, setFilter] = useState<string>('All')
  const categories = [...new Set([...CATEGORIES, ...recipes.map((recipe) => recipe.category)])]

  const filtered = useMemo(
    () => (filter === 'All' ? recipes : recipes.filter((r) => r.category === filter)),
    [filter, recipes],
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="py-14 sm:py-20">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Recipes</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold sm:text-6xl">
            From the family kitchen.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal/65">
            The dishes we actually cook at home — each one built around a Kaputei sauce.
            Simple ingredients, big flavour.
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={cx(
                'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                filter === c
                  ? 'bg-tomato text-white shadow-warm'
                  : 'border border-charcoal/15 bg-white text-charcoal/70 hover:border-charcoal hover:text-charcoal',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {filtered.map((recipe, i) => (
              <Reveal key={recipe.id} delay={Math.min(i, 5) * 60}>
                <RecipeCard recipe={recipe} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-charcoal/20 bg-white/60 p-10 text-center">
            <p className="font-serif text-xl">No {filter} recipes yet.</p>
            <p className="mt-2 text-sm text-charcoal/60">
              We're cooking something up — check back soon, or try another category.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
