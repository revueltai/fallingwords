import type { Database } from '@/types/supabase'
import { APP_LOCALSTORAGE_KEYS, LOCALES } from '@/configs/constants'
import APIService from '@/services/LocalStorageService'
import { supabase } from '@/services/SupabaseService'
import { createUID, enterFullscreen, isEmptyArray } from '@/utils'
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

  async function getCollectionById(uid: string): Promise<AppCollection | undefined> {
    return collections.value.find(collection => collection.id === uid)
  }

  async function getWordById(collectionUid: string, wordUid: string): Promise<GameWord | undefined> {
    const collection = collections.value.find(item => item.id === collectionUid)

    if (collection) {
      return collection.words.find(item => item.uid === wordUid)
    }

    return undefined
  }

  async function createCollection(payload: CollectionUpdate) {
    try {
      const { data } = await supabase.insertCollection({
        name: payload.name,
        locale_original: payload.localeOriginal,
        locale_learn: payload.localeLearn,
      }) as { data: CollectionRow }

      if (!data) {
        throw new Error('FailedCreateCollection')
      }

      collections.value.push({
        id: data.id,
        name: data.name,
        locale_original: data.locale_original,
        locale_learn: data.locale_learn,
        words_count: data.words_count,
      })

      return data.id
    } catch (error) {
      console.error('FailedCreateCollection:', error)
      throw error
    }
  }

  async function createWord(collectionUid: string, payload: GameWord) {
    if (!collectionUid) {
      throw new Error('No uid provided')
    }

    const collection = collections.value.find(item => item.id === collectionUid)

    if (collection) {
      const uid = createUID()
      collection.words.push({ ...payload, uid })

      return APIService.saveStoreData(APP_LOCALSTORAGE_KEYS.userAppData, collections.value)
    }

    return false
  }

  async function updateCollection(payload: CollectionUpdate) {
    if (!payload.uid) {
      throw new Error('No uid provided')
    }

    const collectionToUpdate = collections.value.find(item => item.id === payload.uid)

    if (collectionToUpdate) {
      Object.assign(collectionToUpdate, {
        name: payload.name,
        locales: {
          original: payload.localeOriginal,
          learn: payload.localeLearn,
        },
      })

      return APIService.saveStoreData(APP_LOCALSTORAGE_KEYS.userAppData, collections.value)
    }

    return false
  }

  async function updateWord(collectionUid: string, payload: GameWord) {
    if (!collectionUid || !payload.uid) {
      throw new Error('No uid provided')
    }

    const collection = collections.value.find(item => item.id === collectionUid)

    if (collection) {
      const wordToUpdate = collection.words.find(item => item.uid === payload.uid)

      if (wordToUpdate) {
        Object.assign(wordToUpdate, {
          ...wordToUpdate,
          original: payload.original,
          learn: payload.learn,
        })
      }

      return APIService.saveStoreData(APP_LOCALSTORAGE_KEYS.userAppData, collections.value)
    }

    return false
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

  async function deleteWord(collectionUid: string, wordUid: string): Promise<boolean> {
    if (!wordUid || !collectionUid) {
      throw new Error('No uid provided')
    }

    const collection = collections.value.find(item => item.id === collectionUid)

    if (collection) {
      const wordIndex = collection.words.findIndex(item => item.uid === wordUid)

      if (wordIndex !== -1) {
        collection.words.splice(wordIndex, 1)

        return APIService.saveStoreData(APP_LOCALSTORAGE_KEYS.userAppData, collections.value)
      }
    }

    return false
  }

  return {
    collections,
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
    createWord,
    updateWord,
    deleteWord,
    getCollectionById,
    getWordById,
  }
})
