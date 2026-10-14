import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from '../data/siteSettings'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    let alive = true
    const load = async () => {
      const { data, error } = await supabase!.from('site_settings').select('settings').eq('id', 'main').maybeSingle()
      if (alive && !error && data?.settings) setSettings({ ...DEFAULT_SITE_SETTINGS, ...data.settings })
    }
    void load()
    const refresh = () => void load()
    window.addEventListener('site-settings-updated', refresh)
    return () => {
      alive = false
      window.removeEventListener('site-settings-updated', refresh)
    }
  }, [])

  const value = useMemo(() => settings, [settings])
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
