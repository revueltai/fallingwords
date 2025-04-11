import {
  API_KEYS,
  LIFE_MAX_REFILL_LIVES,
  LIFE_REFILL_TIME,
  LIFE_REGENERATION_INTERVAL_TIME,
  USER_ACCOUNT_DEFAULTS,
} from '@/configs/constants'
import { createUID, isEmptyObject } from '@/utils'
import APIService from '@/utils/apiService'
import { defineStore } from 'pinia'
import { useStreakStore } from './streak.store'
import { resetStore } from './utils.store'

interface UserPayload {
  name: string | null
  age: string | number | null
  email: string | null
  username: string | null
  password: string | null
}

interface UserState extends UserPayload {
  createdAt: string | null
  uid: string | null
  isFirstSession: boolean
  isAuthenticated: boolean
  powerups: GamePowerups | null
  lives: number
  gems: number
  lastLifeAddedAt: number | null
  lifeRegenerationInterval: number | null
}

function initialState(): UserState {
  return {
    createdAt: null,
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
    lastLifeAddedAt: null,
    lifeRegenerationInterval: null,
  }
}

export const useUserStore = defineStore('user', {
  state: initialState,

  getters: {
    hasLives: state => state.lives > 0,
    hasLessThanMaxRefillLives: state => state.lives < LIFE_MAX_REFILL_LIVES,
  },

  actions: {
    async createUserAccount(payload: UserPayload) {
      try {
        this.createdAt = new Date().toISOString()
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
      if (this.isAuthenticated) {
        return APIService.saveStoreData(API_KEYS.userAccountData, {
          createdAt: this.createdAt,
          uid: this.uid,
          name: this.name,
          email: this.email,
          username: this.username,
          password: this.password, // TODO: Replace when server auth is set
          powerups: this.powerups,
          lives: this.lives,
          gems: this.gems,
          isAuthenticated: this.isAuthenticated,
          isFirstSession: this.isFirstSession,
          lastLifeAddedAt: this.lastLifeAddedAt,
        })
      }
    },

    async loadUserAccount() {
      try {
        const userAccountData = APIService.loadStoreData(API_KEYS.userAccountData)

        if (userAccountData) {
          this.createdAt = userAccountData.createdAt
          this.uid = userAccountData.uid
          this.name = userAccountData.name
          this.email = userAccountData.email
          this.username = userAccountData.username
          this.powerups = userAccountData.powerups
          this.lives = userAccountData.lives
          this.gems = userAccountData.gems
          this.lastLifeAddedAt = userAccountData.lastLifeAddedAt
          this.isAuthenticated = true
          this.isFirstSession = false

          this.startLifeRegeneration()

          const streakStore = useStreakStore()
          streakStore.loadStreak()
        }
      } catch (error: any) {
        throw new Error(error)
      }
    },

    increasePowerups(type: PowerupName, amount: number = 1) {
      if (type && this.powerups && !isEmptyObject(this.powerups)) {
        this.powerups[type] = (this.powerups[type] ?? 0) + amount
      }
    },

    decreasePowerups(type: PowerupName) {
      if (type && this.powerups && !isEmptyObject(this.powerups)) {
        this.powerups[type] = Math.max((this.powerups[type] ?? 0) - 1, 0)
      }
    },

    increaseLives(amount: number = 1) {
      this.lives += amount
    },

    increaseGems(amount: number = 1) {
      this.gems += amount
    },

    decreaseLives(amount: number = 1) {
      const newLivesCount = Math.max(this.lives - amount, 0)
      this.lives = newLivesCount
    },

    decreaseGems(amount: number) {
      const newGemsCount = Math.max(this.gems - amount, 0)

      this.gems = (newGemsCount > 0)
        ? newGemsCount
        : 0
    },

    startLifeRegeneration() {
      this.stopLifeRegeneration()

      if (this.hasLessThanMaxRefillLives) {
        this.lastLifeAddedAt = Date.now()
      }

      this.lifeRegenerationInterval = setInterval(() => {
        if (this.hasLessThanMaxRefillLives) {
          const now = Date.now()
          const lastAddedAt = this.lastLifeAddedAt || now
          const timeElapsed = now - lastAddedAt

          if (timeElapsed >= LIFE_REFILL_TIME) {
            this.increaseLives(1)
            this.lastLifeAddedAt = now
          }
        }
      }, LIFE_REGENERATION_INTERVAL_TIME)
    },

    stopLifeRegeneration() {
      if (this.lifeRegenerationInterval) {
        clearInterval(this.lifeRegenerationInterval)

        if (this.lives >= LIFE_MAX_REFILL_LIVES) {
          this.lastLifeAddedAt = null
        }

        this.lifeRegenerationInterval = null
      }
    },

    logout() {
      try {
        this.stopLifeRegeneration()
        this.isAuthenticated = false

        // TODO: reeneable after DB connection.
        // resetStore(this, initialState())
        // APIService.clearAllStoresAppData()
      } catch (error: any) {
        throw new Error(error)
      }
    },
  },
})
