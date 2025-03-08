import { isEmptyArray } from '@/utils'
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

  async function getCollectionById(uid: string) {
    return collections.value.find(collection => collection.uid === uid)
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
      return true
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
    updateCollection,
    deleteCollection,
    getCollectionById,
  }
})
