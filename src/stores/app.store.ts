import type { Database } from '@/types/supabase'
import { LOCALES } from '@/configs/constants'
import { supabase } from '@/services/SupabaseService'
import { enterFullscreen, isEmptyArray } from '@/utils'
import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'

type CollectionRow = Database['public']['Tables']['collections']['Row']

interface AppUiElementHeights {
  appHeader: number | null
  appFooter: number | null
}

export const useAppStore = defineStore('app', () => {
  const canvasMaxWidth = 430
  const canvasMaxHeight = 932
  const isFullscreen = ref(false)
  const canvasEl = shallowRef<RefElement>(null)
  const collections = ref<AppCollection[]>([])
  const collectionWords = ref<Record<string, AppWord[]>>({})
  const formLocales = ref<FormSelectOption[]>([])
  const appUiElementHeights = ref<AppUiElementHeights>({
    appHeader: null,
    appFooter: null,
  })

  const collectionsCount = computed(() => collections.value.length)

  const collectionsWordsCount = computed(() => collections.value.reduce((acc, collection) => acc + collection.words_count, 0))

  const originalLocales = computed(() => getUniqueLocales('original'))

  const learningLocales = computed(() => getUniqueLocales('learn'))

  function getUniqueLocales(type: 'original' | 'learn') {
    return [...new Set(collections.value.map(c => type === 'original'
      ? c.locale_original
      : c.locale_learn),
    )]
  }

  function setAppUiElementHeights(key: keyof AppUiElementHeights, value: number) {
    if (key in appUiElementHeights.value) {
      appUiElementHeights.value[key] = value
    }
  }

  function setFullscreen() {
    if (!isFullscreen.value) {
      enterFullscreen()
    }
  }

  function setCanvasElement(el: HTMLElement) {
    canvasEl.value = el
  }

  async function setFormLocales() {
    if (!isEmptyArray(formLocales.value)) {
      return
    }

    try {
      formLocales.value = LOCALES
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async function fetchCollections() {
    const data = await supabase.fetchCollections()

    if (isEmptyArray(data)) {
      return false
    }

    collections.value = data
    return true
  }

  async function fetchCollectionWords(collectionId: string) {
    try {
      const words = await supabase.fetchWords(collectionId)

      if (!words) {
        return false
      }

      collectionWords.value[collectionId] = words.map(word => ({
        uid: word.id,
        original: word.original,
        learn: word.learn,
      }))

      return true
    } catch (error) {
      console.error('FailedFetchCollectionWords', error)
      return false
    }
  }

  async function getCollectionById(uid: string): Promise<AppCollection | undefined> {
    return collections.value.find(collection => collection.id === uid)
  }

  async function getWordById(collectionId: string, wordId: string): Promise<AppWord | undefined> {
    if (!collectionWords.value[collectionId]) {
      await fetchCollectionWords(collectionId)
    }

    return collectionWords.value[collectionId]?.find(word => word.uid === wordId)
  }

  async function updateCollectionState(collectionId: string) {
    const updatedCollection = await supabase.fetchCollection(collectionId)

    if (updatedCollection) {
      const index = collections.value.findIndex(c => c.id === collectionId)

      if (index !== -1) {
        collections.value[index] = updatedCollection
      }
    }
  }

  async function createWord(collectionId: string, payload: { original: string, learn: string }) {
    if (!collectionId) {
      throw new Error('MissingCollectionId')
    }

    try {
      const rs = await supabase.insertWord({
        collection_id: collectionId,
        original: payload.original,
        learn: payload.learn,
      })

      if (!rs) {
        throw new Error('FailedCreateWord')
      }

      if (!collectionWords.value[collectionId]) {
        collectionWords.value[collectionId] = []
      }

      collectionWords.value[collectionId].push({
        uid: rs.id,
        original: rs.original,
        learn: rs.learn,
      })

      await updateCollectionState(collectionId)

      return rs.id
    } catch (error) {
      console.error('FailedCreateWord:', error)
      throw error
    }
  }

  async function createCollection(payload: CollectionUpdate) {
    try {
      const rs = await supabase.insertCollection({
        name: payload.name,
        locale_original: payload.localeOriginal,
        locale_learn: payload.localeLearn,
      }) as CollectionRow

      if (!rs) {
        throw new Error('FailedCreateCollection')
      }

      collections.value.push({
        id: rs.id,
        name: rs.name,
        locale_original: rs.locale_original,
        locale_learn: rs.locale_learn,
        words_count: rs.words_count,
      })

      return rs.id
    } catch (error) {
      console.error('FailedCreateCollection:', error)
      throw error
    }
  }

  async function updateCollection(payload: CollectionUpdate) {
    if (!payload) {
      throw new Error('MissingCollectionPayload')
    }

    if (!payload?.uid) {
      throw new Error('MissingCollectionId')
    }

    try {
      const rs = await supabase.updateCollection(
        payload.uid,
        {
          name: payload.name,
          locale_original: payload.localeOriginal,
          locale_learn: payload.localeLearn,
        },
      ) as CollectionRow

      if (!rs) {
        throw new Error('FailedUpdateCollection')
      }

      const index = collections.value.findIndex(c => c.id === payload.uid)
      if (index !== -1) {
        collections.value[index] = {
          id: rs.id,
          name: rs.name,
          locale_original: rs.locale_original,
          locale_learn: rs.locale_learn,
          words_count: rs.words_count,
        }
      }

      return rs.id
    } catch (error) {
      console.error('FailedUpdateCollection:', error)
      throw error
    }
  }

  async function updateWord(collectionId: string, payload: AppWord) {
    if (!collectionId || !payload.uid) {
      throw new Error('MissingIds')
    }

    try {
      const rs = await supabase.updateWord(payload.uid, {
        original: payload.original,
        learn: payload.learn,
      })

      if (!rs) {
        throw new Error('FailedUpdateWord')
      }

      if (collectionWords.value[collectionId]) {
        const index = collectionWords.value[collectionId].findIndex(w => w.uid === payload.uid)

        if (index !== -1) {
          collectionWords.value[collectionId][index] = {
            uid: rs.id,
            original: rs.original,
            learn: rs.learn,
          }
        }
      }

      return rs.id
    } catch (error) {
      console.error('FailedUpdateWord:', error)
      throw error
    }
  }

  async function deleteCollection(id: string): Promise<boolean> {
    if (!id) {
      return false
    }

    const rs = await supabase.deleteCollection(id)

    if (rs) {
      collections.value = collections.value.filter(c => c.id !== id)
    }

    return rs
  }

  async function deleteWord(collectionId: string, wordId: string): Promise<boolean> {
    if (!wordId || !collectionId) {
      throw new Error('MissingIds')
    }

    try {
      const rs = await supabase.deleteWord(wordId)

      if (rs) {
        if (collectionWords.value[collectionId]) {
          const index = collectionWords.value[collectionId].findIndex(w => w.uid === wordId)

          if (index !== -1) {
            collectionWords.value[collectionId].splice(index, 1)
          }
        }

        await updateCollectionState(collectionId)
      }

      return rs
    } catch (error) {
      console.error('FailedDeleteWord:', error)
      throw error
    }
  }

  return {
    collections,
    collectionWords,
    canvasMaxWidth,
    canvasMaxHeight,
    canvasEl,
    formLocales,
    collectionsCount,
    collectionsWordsCount,
    originalLocales,
    learningLocales,
    appUiElementHeights,
    setFullscreen,
    setAppUiElementHeights,
    setCanvasElement,
    setFormLocales,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    fetchCollectionWords,
    createWord,
    updateWord,
    deleteWord,
    getCollectionById,
    getWordById,
  }
})
