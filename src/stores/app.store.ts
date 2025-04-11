import { APP_LOCALSTORAGE_KEYS, LOCALES } from '@/configs/constants'
import APIService from '@/services/LocalStorageService'
import { createUID, enterFullscreen, isEmptyArray } from '@/utils'
import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'

interface AppUiElementHeights {
  appHeader: number | null
  appFooter: number | null
}

export const useAppStore = defineStore('app', () => {
  const canvasMaxWidth = 430
  const canvasMaxHeight = 932
  const isFullscreen = ref(false)
  const canvasEl = shallowRef<RefElement>(null)
  const collections = ref<GameCollection[]>([])
  const formLocales = ref<FormSelectOption[]>([])
  const appUiElementHeights = ref<AppUiElementHeights>({
    appHeader: null,
    appFooter: null,
  })

  const collectionsCount = computed(() => collections.value.length)

  const collectionsWordsCount = computed(() => collections.value.reduce((acc, collection) => acc + collection.words.length, 0))

  const originalLocales = computed(() => getUniqueLocales('original'))

  const learningLocales = computed(() => getUniqueLocales('learn'))

  function getUniqueLocales(type: 'original' | 'learn') {
    return [...new Set(collections.value.map(c => c.locales[type]))]
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

  async function loadCollections() {
    try {
      const userAppData = APIService.loadStoreData(APP_LOCALSTORAGE_KEYS.userAppData)

      if (userAppData) {
        collections.value = userAppData as GameCollection[]
      }

      return true
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async function getCollectionById(uid: string): Promise<GameCollection | undefined> {
    return collections.value.find(collection => collection.uid === uid)
  }

  async function getWordById(collectionUid: string, wordUid: string): Promise<GameWord | undefined> {
    const collection = collections.value.find(item => item.uid === collectionUid)

    if (collection) {
      return collection.words.find(item => item.uid === wordUid)
    }

    return undefined
  }

  async function createCollection(payload: CollectionUpdate) {
    const uid = createUID(payload.name)

    collections.value.push({
      uid,
      name: payload.name,
      locales: {
        original: payload.localeOriginal,
        learn: payload.localeLearn,
      },
      words: [],
    })

    const rs = APIService.saveStoreData(APP_LOCALSTORAGE_KEYS.userAppData, collections.value)
    return rs ? uid : null
  }

  async function createWord(collectionUid: string, payload: GameWord) {
    if (!collectionUid) {
      throw new Error('No uid provided')
    }

    const collection = collections.value.find(item => item.uid === collectionUid)

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

    const collectionToUpdate = collections.value.find(item => item.uid === payload.uid)

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

    const collection = collections.value.find(item => item.uid === collectionUid)

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

  async function deleteCollection(uid: string): Promise<boolean> {
    if (!uid) {
      throw new Error('No uid provided')
    }

    const deleteIndex = collections.value.findIndex(item => item.uid === uid)

    if (deleteIndex !== -1) {
      collections.value.splice(deleteIndex, 1)

      return APIService.saveStoreData(APP_LOCALSTORAGE_KEYS.userAppData, collections.value)
    }

    return false
  }

  async function deleteWord(collectionUid: string, wordUid: string): Promise<boolean> {
    if (!wordUid || !collectionUid) {
      throw new Error('No uid provided')
    }

    const collection = collections.value.find(item => item.uid === collectionUid)

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
    loadCollections,
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
