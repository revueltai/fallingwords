import { API_KEYS, USER_ACCOUNT_DEFAULTS } from '@/configs/constants'
import { createUID } from '@/utils'
import APIService from '@/utils/apiService'
import { defineStore } from 'pinia'

interface UserPayload {
  name: string | null
  age: string | number | null
  email: string | null
  username: string | null
  password: string | null
}

interface UserState extends UserPayload {
  uid: string | null
  isFirstSession: boolean
  isAuthenticated: boolean
  powerups: GamePowerups | null
  lives: number
  gems: number
}

function initialState(): UserState {
  return {
    uid: null,
    name: null,
    email: null,
    age: null,
    username: null,
    password: null,
    powerups: null,
    lives: 0,
    gems: 0,
    isFirstSession: true,
    isAuthenticated: false,
  }
}

export const useUserStore = defineStore('user', {
  state: initialState,

  actions: {
    async createUserAccount(payload: UserPayload) {
      try {
        this.uid = createUID(payload.name!)
        this.name = payload.name
        this.email = payload.email
        this.username = payload.username
        this.password = payload.password
        this.powerups = USER_ACCOUNT_DEFAULTS.powerups
        this.lives = USER_ACCOUNT_DEFAULTS.lives
        this.gems = USER_ACCOUNT_DEFAULTS.gems
        this.isAuthenticated = true
        this.isFirstSession = false

        return this.updateUserData()
      } catch (error: any) {
        throw new Error(error)
      }
    },

    async updateUserData() {
      return APIService.saveStoreData(API_KEYS.userAccountData, {
        uid: this.uid,
        name: this.name,
        email: this.email,
        username: this.username,
        password: this.password, // TODO: Replace when server auth is set
        powerups: this.powerups,
        lives: this.lives,
        gems: this.gems,
      })
    },

    async logoutUser() {
      try {
        Object.assign(this, initialState())
        APIService.clearAllStoresAppData()
      } catch (error: any) {
        throw new Error(error)
      }
    },

    async loadUserAccount() {
      try {
        const userAccountData = APIService.loadStoreData(API_KEYS.userAccountData)

        if (userAccountData) {
          this.uid = userAccountData.uid
          this.name = userAccountData.name
          this.email = userAccountData.email
          this.username = userAccountData.username
          this.powerups = userAccountData.powerups
          this.lives = userAccountData.lives
          this.gems = userAccountData.gems
          this.isAuthenticated = true
          this.isFirstSession = false
        }
        /* else {
          this.uid = userAccountData.uid
          this.name = userAccountData.name
          this.email = userAccountData.email
          this.username = userAccountData.username
          this.powerups = USER_ACCOUNT_DEFAULTS.powerups
          this.lives = USER_ACCOUNT_DEFAULTS.lives
          this.gems = USER_ACCOUNT_DEFAULTS.gems
        } */
      } catch (error: any) {
        throw new Error(error)
      }
    },

    increaseLives(amount: number) {
      if (this.lives) {
        this.lives += amount
      }
    },

    increaseGems(amount: number) {
      if (this.gems) {
        this.gems += amount
      }
    },
  },
})
