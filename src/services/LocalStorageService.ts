/**
 * Handles app data storage in localstorage.
 */

import { APP_LOCALSTORAGE_KEYS } from '@/configs/constants'

export const LocalStorageService = {
  /**
   * Retrieves data from local storage using a predefined key.
   *
   * @param {string} key - The key for the local storage container.
   * @returns {any | false} An array of stored game data if exists, false otherwise.
   * @throws {SyntaxError} If the stored JSON string is invalid
   */
  loadStoreData(key: string): any | false {
    const data = localStorage.getItem(key)

    if (data) {
      return JSON.parse(data)
    }

    return false
  },

  /**
   * Saves data in the local storage using a predefined key
   *
   * @param {string} key - The key for the local storage container.
   * @param {any} data - The data to be stored in local storage
   * @returns {boolean} - Returns true if data was successfully saved, false otherwise
   */
  saveStoreData(key: string, data: any): boolean {
    if (data) {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    }

    return false
  },

  /**
   * Deletes data from local storage for a given key
   *
   * @param {string} key - The key for the local storage container.
   * @returns {boolean} - Returns true if data was successfully deleted, false if key doesn't exist
   */
  deleteSingleLocalstorageAppData(key: string): boolean {
    if (this.hasStoreData(key)) {
      localStorage.removeItem(key)
      return true
    }

    return false
  },

  /**
   * Clears all data of the the app from local storage
   */
  clearAllLocalstorageAppData(): void {
    for (const [_, value] of Object.entries(APP_LOCALSTORAGE_KEYS)) {
      this.deleteSingleLocalstorageAppData(value)
    }
  },

  /**
   * Checks if a key exists in local storage
   *
   * @param {string} key - The key to check in local storage
   * @returns {boolean} - Returns true if key exists, false otherwise
   */
  hasStoreData(key: string): boolean {
    return localStorage.getItem(key) !== null
  },
}
