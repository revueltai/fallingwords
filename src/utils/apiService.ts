/**
 * API service to handle data storage.
 *
 * TODO: Replace localstorage with propper backend.
 */

export default {
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
}
