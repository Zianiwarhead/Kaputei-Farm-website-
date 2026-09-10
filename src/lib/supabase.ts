import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null =
  isSupabaseConfigured && url && anonKey ? createClient(url, anonKey) : null

/** Resolve an image reference to a usable URL.
 *  Full URLs pass through; bare paths resolve against the product-images bucket. */
export function resolveImage(ref: string): string {
  if (!ref) return ref
  if (/^https?:\/\//i.test(ref) || ref.startsWith('/')) return ref
  if (supabase && url) {
    const clean = ref.replace(/^\/+/, '')
    return `${url.replace(/\/$/, '')}/storage/v1/object/public/product-images/${clean}`
  }
  return ref
}
