import { useErrorService } from '@/composables/useErrorService'
import {
  APP_LOCALSTORAGE_KEYS,
  LIFE_MAX_REFILL_LIVES,
  LIFE_REFILL_TIME,
  LIFE_REGENERATION_INTERVAL_TIME,
  USER_ACCOUNT_DEFAULTS,
} from '@/configs/constants'
import { LocalStorageService } from '@/services/LocalStorageService'
import { supabase } from '@/services/SupabaseService'
import { isEmptyObject } from '@/utils'
import { defineStore } from 'pinia'
import { useSoundStore } from './sounds.store'
import { useStreakStore } from './streak.store'

interface UserState extends UserPayload {
  createdAt: string | null
  uid: string | null
  powerups: AppPowerups | null
  lives: number
  gems: number
  lastLifeAddedAt: number | null
  lifeRegenerationInterval: NodeJS.Timeout | null
  gameMaxroundsCount: number
}

function initialState(): UserState {
  return {
    createdAt: null,
    uid: null,
    name: null,
    email: null,
    age: null,
    username: null,
    powerups: null,
    lives: 0,
    gems: 0,
    lastLifeAddedAt: null,
    lifeRegenerationInterval: null,
    originalLocale: null,
    learnLocale: null,
    gameMaxroundsCount: 0,
  }
}

const { handleError } = useErrorService()

export const useUserStore = defineStore('user', {
  state: initialState,

  getters: {
    soundStore() {
      return useSoundStore()
    },
    isAuthenticated: state => !!state.uid,
    isFirstSession: state => !state.createdAt,
    hasLives: state => state.lives > 0,
    hasLessThanMaxRefillLives: state => state.lives < LIFE_MAX_REFILL_LIVES,
  },

  actions: {
    async checkEmailExists(email: string): Promise<boolean> {
      try {
        const isUnique = await supabase.isEmailUnique(email)
        return !isUnique
      } catch (error) {
        console.error('Error checking email:', error)
        return true
      }
    },

    async checkUsernameExists(username: string): Promise<boolean> {
      try {
        const isUnique = await supabase.isUsernameUnique(username)
        return !isUnique
      } catch (error) {
        console.error('Error checking username:', error)
        return true
      }
    },

    async createUserAccount(payload: UserPayload) {
      try {
        if (!payload.email || !payload.password || !payload.username) {
          return handleError({ msg: 'authSignupFailed', shouldThrow: false })
        }

        const { data, error } = await supabase.signUp(payload)

        if (error || !data.user) {
          await supabase.revertSignUp(payload.email)
          return handleError({ msg: 'authSignupFailed', shouldThrow: false })
        }

        const userData: UserDataPayload[] = await supabase.insertUserData()

        if (!userData) {
          await supabase.revertSignUp(payload.email)
          return handleError({ msg: 'authSignupFailed', shouldThrow: false })
        }

        const userDataEntry = userData[0]

        this.uid = data.user.id
        this.createdAt = data.user.created_at
        this.name = payload.name
        this.email = payload.email
        this.username = payload.username
        this.powerups = userDataEntry.powerups || USER_ACCOUNT_DEFAULTS.powerups
        this.lives = userDataEntry.lives || USER_ACCOUNT_DEFAULTS.lives
        this.gems = userDataEntry.gems || USER_ACCOUNT_DEFAULTS.gems

        LocalStorageService.saveStoreData(APP_LOCALSTORAGE_KEYS.userAccountData, {
          uid: this.uid,
          createdAt: this.createdAt,
        })

        return true
      } catch (error: any) {
        console.error(error)
        return handleError({ msg: 'authSignupFailed', shouldThrow: false })
      }
    },

    async updateUserData() {
      if (!this.isAuthenticated) {
        return false
      }

      await supabase.updateUserData({
        lives: this.lives,
        gems: this.gems,
        powerups: this.powerups as AppPowerups,
        music: this.soundStore.soundsOn,
        sound_effects: this.soundStore.soundEffectsOn,
        game_maxrounds_count: this.gameMaxroundsCount,
      })
    },

    async loadUserAccount() {
      try {
        const sessionData = await supabase.initializeSession()

        if (!sessionData) {
          this.$reset()
          return false
        }

        const { user, userData } = sessionData

        this.uid = user.id
        this.createdAt = user.created_at
        this.email = user.email!
        this.name = user.user_metadata?.name
        this.username = user.user_metadata?.display_name
        this.originalLocale = user.user_metadata?.originalLocale
        this.learnLocale = user.user_metadata?.learnLocale
        this.powerups = userData.powerups
        this.lives = userData.lives
        this.gems = userData.gems
        this.lastLifeAddedAt = userData.last_life_added_at
        this.gameMaxroundsCount = userData.game_maxrounds_count

        this.startLifeRegeneration()
        this.soundStore.initializeSounds(userData.music, userData.sound_effects)

        const streakStore = useStreakStore()
        await streakStore.loadStreak()
      } catch (error: any) {
        console.error('Error loading user account:', error)
        handleError({ shouldThrow: true })
      }
    },

    async logout() {
      try {
        await supabase.signOut()
        this.stopLifeRegeneration()
        this.$reset()
      } catch (error) {
        console.error('Logout failed:', error)
        throw error
      }
    },

    async deleteAccount() {
      try {
        if (!this.uid) {
          return
        }

        await supabase.updateUser({
          customMetadata: {
            account_deleted: true,
          },
        })

        await this.logout()
      } catch (error) {
        console.error('authAccountDeleted', error)
        throw error
      }
    },

    hasEnoughGems(amount: number): boolean {
      return this.gems >= amount
    },

    increasePowerups(type: PowerupIngame, amount: number = 1) {
      if (type && this.powerups && !isEmptyObject(this.powerups)) {
        this.powerups[type] = (this.powerups[type] ?? 0) + amount
      }
    },

    decreasePowerups(type: PowerupIngame) {
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
  },
})
