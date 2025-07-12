import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { db } from '../lib/supabase'
import { supabase } from '../lib/supabase'

interface StoreState {
  isDarkMode: boolean
  activeSection: string
  siteSettings: Record<string, string>
  settingsLoaded: boolean
  settingsSubscription: any
  setDarkMode: (isDark: boolean) => void
  setActiveSection: (section: string) => void
  fetchSiteSettings: () => Promise<void>
  initializeSettingsSubscription: () => void
  cleanupSettingsSubscription: () => void
}

export const useStore = create<StoreState>()(
  subscribeWithSelector((set, get) => ({
  isDarkMode: true,
  activeSection: 'hero',
  settingsLoaded: false,
  settingsSubscription: null,
  setDarkMode: (isDark) => set({ isDarkMode: isDark }),
  setActiveSection: (section) => set({ activeSection: section }),
  siteSettings: {}, // Initialize siteSettings as an empty object
  fetchSiteSettings: async () => {
    try {
      console.log('Fetching site settings...')
      const settings = await db.getSiteSettings()
      console.log('Raw settings from DB:', settings)
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      }, {} as Record<string, string>)
      console.log('Processed settings map:', settingsMap)
      set({ siteSettings: settingsMap, settingsLoaded: true })
    } catch (error) {
      console.error('Failed to fetch site settings:', error)
      set({ settingsLoaded: true }) // Still mark as loaded even on error
    }
  },
  initializeSettingsSubscription: () => {
    const { settingsSubscription } = get()
    
    // Clean up existing subscription if any
    if (settingsSubscription) {
      settingsSubscription.unsubscribe()
    }
    
    // Create new subscription for real-time updates
    const subscription = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'site_settings' 
        }, 
        (payload) => {
          console.log('Site settings changed:', payload)
          // Refetch settings when they change
          get().fetchSiteSettings()
        }
      )
      .subscribe()
    
    set({ settingsSubscription: subscription })
  },
  cleanupSettingsSubscription: () => {
    const { settingsSubscription } = get()
    if (settingsSubscription) {
      settingsSubscription.unsubscribe()
      set({ settingsSubscription: null })
    }
  },
}))
)