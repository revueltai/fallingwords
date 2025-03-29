import { API_KEYS, USER_ACCOUNT_DEFAULTS } from '@/configs/constants'
import APIService from '@/utils/apiService'
import { defineStore } from 'pinia'

interface UserState {
  isFirstSession: boolean
  isAuthenticated: boolean
  uid: number | null
  name: string | null
  email: string | null
  username: string | null
  streakUid: number | null
  lives: number | null
  gems: number | null
}

function initialState(): UserState {
  return {
    isFirstSession: true,
    isAuthenticated: false,
    uid: null,
    name: null,
    email: null,
    username: null,
    streakUid: null,
    lives: null,
    gems: null,
  }
}

export const useUserStore = defineStore('user', {
  state: initialState,

  actions: {
    async loadUserAccount(uid: string = '') {
      try {
        const userAccountData = APIService.loadStoreData(API_KEYS.userAccountData)

        if (userAccountData) {
          if (userAccountData.uid === uid) {
            this.uid = userAccountData.uid
            this.name = userAccountData.name
            this.email = userAccountData.email
            this.username = userAccountData.username
            this.streakUid = userAccountData.streakUid
            this.lives = userAccountData.lives
            this.gems = userAccountData.gems
            this.isAuthenticated = true
            this.isFirstSession = false
          }
        } else {
          this.uid = userAccountData.uid
          this.name = userAccountData.name
          this.email = userAccountData.email
          this.username = userAccountData.username
          this.streakUid = userAccountData.streakUid
          this.lives = USER_ACCOUNT_DEFAULTS.lives
          this.gems = USER_ACCOUNT_DEFAULTS.gems
        }
      } catch (error: any) {
        throw new Error(error)
      }
    },

    updateLives(amount: number) {
      if (this.lives) {
        this.lives += amount
      }
    },

    updateGems(amount: number) {
      if (this.gems) {
        this.gems += amount
      }
    },
  },
})
