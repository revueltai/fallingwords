import { supabase } from '@/services/SupabaseService'
import { defineStore } from 'pinia'
import { useAppStore } from './app.store'

interface SettingsState {
  isLoading: boolean
  appLocales: AppLocaleCode[]
  appLocalesArticles: Partial<Record<AppLocaleCode, AppLocaleArticles>>
  appWordTypes: AppWordType[]
  appCollectionPackagesOrder: string[]
  appCollectionPackages: AppCollectionPackage[]
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    appLocales: [],
    appWordTypes: [],
    appLocalesArticles: {},
    appCollectionPackages: [],
    appCollectionPackagesOrder: ['sm', 'md', 'lg', 'xl', 'xxl'],
    isLoading: false,
  }),

  getters: {
    appStore() {
      return useAppStore()
    },
  },

  actions: {
    async loadSettings() {
      if (this.isLoading) {
        return
      }

      this.isLoading = true
      const settings = await supabase.fetchSettings()

      this.appLocales = settings.locales_data.map((locale: any) => locale.id)
      this.appLocalesArticles = settings.locales_data.reduce((acc, locale) => ({
        ...acc,
        [locale.id]: locale.articles,
      }), {})

      this.appWordTypes = settings.word_types
      this.appCollectionPackages = settings.collection_limits.words_packages
      this.isLoading = false
    },
  },
})
