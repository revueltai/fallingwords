import { supabase } from '@/services/SupabaseService'
import { defineStore } from 'pinia'
import { useAppStore } from './app.store'

interface SettingsState {
  isLoading: boolean
  maxWordsPerCollection: number
  maxWordsPerCollectionExpanded?: {
    sm: number
    md: number
    lg: number
    xl: number
  }
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    maxWordsPerCollection: 0,
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

      this.maxWordsPerCollection = settings.collection_limits.max_words
      this.maxWordsPerCollectionExpanded = settings.collection_limits.max_words_expanded
      this.isLoading = false
    },
  },
})
