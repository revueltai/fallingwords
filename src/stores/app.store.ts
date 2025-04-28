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

  /**
   * Returns a unique list of locales from collections.
   *
   * @param {('original' | 'learn')} type - Type of locale to extract.
   * @returns {string[]} Array of unique locales.
   */
  function getUniqueLocales(type: 'original' | 'learn') {
    return [...new Set(collections.value.map(c => type === 'original'
      ? c.locale_original
      : c.locale_learn),
    )]
  }

  /**
   * Sets the height for a UI element.
   *
   * @param {keyof AppUiElementHeights} key - UI element key.
   * @param {number} value - Height value to set.
   */
  function setAppUiElementHeights(key: keyof AppUiElementHeights, value: number) {
    if (key in appUiElementHeights.value) {
      appUiElementHeights.value[key] = value
    }
  }

  /**
   * Enters fullscreen mode if not already active.
   *
   * @returns {void}
   */
  function setFullscreen(): void {
    if (!isFullscreen.value) {
      enterFullscreen()
    }
  }

  /**
   * Sets the canvas element reference.
   *
   * @param {HTMLElement} el - The canvas HTML element.
   * @returns {void}
   */
  function setCanvasElement(el: HTMLElement): void {
    canvasEl.value = el
  }

  /**
   * Sets formLocales if it's empty.
   *
   * @returns {Promise<void>}
   */
  async function setFormLocales(): Promise<void> {
    if (!isEmptyArray(formLocales.value)) {
      return
    }

    try {
      formLocales.value = LOCALES
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   * Fetches collections from Supabase and stores them.
   *
   * @returns {Promise<boolean>} True if data was fetched, false otherwise.
   */
  async function fetchCollections(): Promise<boolean> {
    const data = await supabase.fetchCollections()

    if (isEmptyArray(data)) {
      return false
    }

    collections.value = data
    return true
  }

  /**
   * Fetches words for a given collection ID and stores them.
   *
   * @param {string} collectionId - ID of the collection.
   * @returns {Promise<boolean>} True if words were fetched, false otherwise.
   */
  async function fetchCollectionWords(collectionId: string): Promise<boolean> {
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

  /**
   * Finds a collection by its ID.
   *
   * @param {string} collectionId - Collection ID.
   * @returns {Promise<AppCollection | undefined>} The found collection or undefined.
   */
  async function getCollectionById(collectionId: string): Promise<AppCollection | undefined> {
    return collections.value.find(collection => collection.id === collectionId)
  }

  /**
   * Finds a word by ID within a collection.
   *
   * @param {string} collectionId - ID of the collection.
   * @param {string} wordId - ID of the word.
   * @returns {Promise<AppWord | undefined>} The found word or undefined.
   */
  async function getWordById(collectionId: string, wordId: string): Promise<AppWord | undefined> {
    if (!collectionWords.value[collectionId]) {
      await fetchCollectionWords(collectionId)
    }

    return collectionWords.value[collectionId]?.find(word => word.uid === wordId)
  }

  /**
   * Updates local state for a specific collection by fetching its latest data.
   *
   * @param {string} collectionId - ID of the collection to update.
   * @returns {Promise<void>}
   */
  async function updateCollectionState(collectionId: string): Promise<void> {
    const updatedCollection = await supabase.fetchCollection(collectionId)

    if (updatedCollection) {
      const index = collections.value.findIndex(c => c.id === collectionId)

      if (index !== -1) {
        collections.value[index] = updatedCollection
      }
    }
  }

  /**
   * Creates a new word in the specified collection.
   *
   * @param {string} collectionId - ID of the collection.
   * @param {{ original: string, learn: string }} payload - Word data to insert.
   * @returns {Promise<string>} ID of the created word.
   */
  async function createWord(collectionId: string, payload: { original: string, learn: string }): Promise<string> {
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
    } catch (error: any) {
      if (error.message === 'MaxWordsLimitReached') {
        throw new Error('MaxWordsLimitReached')
      }

      console.error('FailedCreateWord:', error)
      throw error
    }
  }

  /**
   * Creates a new collection and updates local state.
   *
   * @param {CollectionUpdate} payload - Data for the new collection.
   * @returns {Promise<string>} ID of the created collection.
   */
  async function createCollection(payload: CollectionUpdate): Promise<string> {
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

  /**
   * Updates an existing collection.
   *
   * @param {CollectionUpdate} payload - Updated collection data.
   * @returns {Promise<string>} ID of the updated collection.
   */
  async function updateCollection(payload: CollectionUpdate): Promise<string> {
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

  /**
   * Updates an existing word in a collection.
   *
   * @param {string} collectionId - ID of the collection.
   * @param {AppWord} payload - Updated word data.
   * @returns {Promise<string>} ID of the updated word.
   */
  async function updateWord(collectionId: string, payload: AppWord): Promise<string> {
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

  /**
   * Deletes a collection by ID.
   *
   * @param {string} id - ID of the collection to delete.
   * @returns {Promise<boolean>} True if deleted successfully.
   */
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

  /**
   * Deletes a word from a collection.
   *
   * @param {string} collectionId - ID of the collection.
   * @param {string} wordId - ID of the word to delete.
   * @returns {Promise<boolean>} True if deleted successfully.
   */
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
