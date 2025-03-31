import { API_KEYS, LOCALES } from '@/configs/constants'
import { createUID, isEmptyArray } from '@/utils'
import APIService from '@/utils/apiService'
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

export const useAppStore = defineStore('app', () => {
  const canvasMaxWidth = 430
  const canvasMaxHeight = 932
  const showMenu = ref(false)
  const canvasEl = shallowRef<ElementRef>(null)
  const collections = ref<GameCollection[]>([])
  const formLocales = ref<FormSelectOption[]>([])
  const streak = ref<UserStreak[]>([
    { day: 'M', state: 'unknown' },
    { day: 'T', state: 'unknown' },
    { day: 'W', state: 'unknown' },
    { day: 'T', state: 'unknown' },
    { day: 'F', state: 'unknown' },
    { day: 'S', state: 'unknown' },
    { day: 'S', state: 'unknown' },
  ])

  function setAppMenu(state: boolean) {
    showMenu.value = state
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

  async function loadStreak() {
    try {
      const userStreak = APIService.loadStoreData(API_KEYS.userStreak)

      if (userStreak) {
        streak.value = userStreak as UserStreak[]
      } else {
        APIService.saveStoreData(API_KEYS.userStreak, streak.value)
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async function loadCollections() {
    try {
      const userAppData = APIService.loadStoreData(API_KEYS.userAppData)

      if (userAppData) {
        collections.value = userAppData as GameCollection[]
      } else {
        const { exampleCollection } = await import('@/assets/exampleCollection.ts')
        collections.value = exampleCollection
      }
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

    const rs = APIService.saveStoreData(API_KEYS.userAppData, collections.value)
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

      return APIService.saveStoreData(API_KEYS.userAppData, collections.value)
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

      return APIService.saveStoreData(API_KEYS.userAppData, collections.value)
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

      return APIService.saveStoreData(API_KEYS.userAppData, collections.value)
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

      return APIService.saveStoreData(API_KEYS.userAppData, collections.value)
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

        return APIService.saveStoreData(API_KEYS.userAppData, collections.value)
      }
    }

    return false
  }

  return {
    showMenu,
    collections,
    canvasMaxWidth,
    canvasMaxHeight,
    canvasEl,
    formLocales,
    streak,
    setAppMenu,
    setCanvasElement,
    setFormLocales,
    loadStreak,
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
