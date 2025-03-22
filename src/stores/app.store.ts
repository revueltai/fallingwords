import { createUID, isEmptyArray } from '@/utils'
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

export const useAppStore = defineStore('app', () => {
  const canvasMaxWidth = 600
  const canvasMaxHeight = 800
  const canvasEl = shallowRef<ElementRef>(null)
  const collections = ref<GameCollection[]>([])
  const formLocales = ref<FormSelectOption[]>([])

  function setCanvasElement(el: HTMLElement) {
    canvasEl.value = el
  }

  async function setFormLocales() {
    if (!isEmptyArray(formLocales.value)) {
      return
    }

    try {
      // TODO: replace with API call
      const { dummyLocales } = await import('@/assets/dummyData.ts')
      formLocales.value = dummyLocales
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async function setCollections() {
    try {
      // TODO: replace with API call
      const { dummyCollection } = await import('@/assets/dummyData.ts')
      collections.value = dummyCollection
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
  }

  async function createWord(collectionUid: string, payload: GameWord) {
    if (!collectionUid) {
      throw new Error('No uid provided')
    }

    const collection = collections.value.find(item => item.uid === collectionUid)

    if (collection) {
      const uid = createUID()
      collection.words.push({ ...payload, uid })

      // TODO send API Req.
      return true
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

      // TODO send API Req.
      return true
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

      // TODO send API Req.
      return true
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

      // TODO send API Req.
      return true
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

        // TODO send API Req.
        return true
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
    setCanvasElement,
    setFormLocales,
    setCollections,
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
