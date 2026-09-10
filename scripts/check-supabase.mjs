// Kaputei Farm Products — Supabase connection check (dev helper, no secrets inside).
// Run: node scripts/check-supabase.mjs   (reads .env automatically)
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = join(root, '.env')
const env = {}
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)
    if (m) env[m[1]] = m[2]
  }
}

const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const { createClient } = await import('@supabase/supabase-js')
const supabase = createClient(url, key)

const { data, error } = await supabase
  .from('products')
  .select('id, name', { count: 'exact' })
  .limit(3)

if (error) {
  console.error('Supabase reachable, but query failed:')
  console.error(`  ${error.message}`)
  if (error.message.includes('Could not find the table')) {
    console.error('\n  → Run supabase/schema.sql + supabase/seed.sql in the dashboard SQL editor first.')
  }
  process.exit(2)
}

console.log(`OK — connected. Sample rows: ${(data ?? []).map((r) => r.id).join(', ') || '(table empty — run seed.sql)'}`)
