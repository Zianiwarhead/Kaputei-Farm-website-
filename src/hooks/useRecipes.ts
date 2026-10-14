import { useEffect, useState } from 'react'
import { RECIPES, type Recipe } from '../data/recipes'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

type RecipeRow = {
  id: string; title: string; excerpt: string; category: string; time: string; serves: string
  sauce: string; product_handle: string; ingredients: string[] | null; steps: string[] | null
  image: string | null; gradient_from: string | null; gradient_to: string | null
  is_active?: boolean | null; sort_order?: number | null
}

function mapRecipe(row: RecipeRow): Recipe {
  const fallback = RECIPES.find((item) => item.id === row.id)
  return {
    id: row.id, title: row.title, excerpt: row.excerpt, category: row.category,
    time: row.time, serves: row.serves, sauce: row.sauce, productHandle: row.product_handle,
    ingredients: row.ingredients ?? fallback?.ingredients ?? [], steps: row.steps ?? fallback?.steps ?? [],
    image: row.image ?? fallback?.image,
    gradient: { from: row.gradient_from ?? fallback?.gradient.from ?? '#C8252C', to: row.gradient_to ?? fallback?.gradient.to ?? '#9E1B22' },
  }
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(RECIPES)
  const [source, setSource] = useState<'local' | 'supabase'>('local')

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    let alive = true
    void supabase.from('recipes').select('*').order('sort_order', { ascending: true }).then(({ data, error }) => {
      if (!alive || error || !data?.length) return
      setRecipes((data as RecipeRow[]).filter((row) => row.is_active !== false).map(mapRecipe))
      setSource('supabase')
    })
    return () => { alive = false }
  }, [])

  return { recipes, source }
}
