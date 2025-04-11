import { API_KEYS } from '@/configs/constants'
import { getToday, isEmptyArray } from '@/utils'
import APIService from '@/utils/apiService'
import { defineStore } from 'pinia'
import { useUserStore } from './user.store'

interface UserState {
  userUid: string | null
  streakDates: string[]
  currentStreak: number
}

function initialState(): UserState {
  return {
    userUid: null,
    streakDates: [],
    currentStreak: 0,
  }
}

const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export const useStreakStore = defineStore('streak', {
  state: initialState,

  getters: {
    userStore() {
      return useUserStore()
    },
    hasPlayedToday(): boolean {
      return this.streakDates.includes(getToday())
    },
  },

  actions: {
    async loadStreak() {
      if (this.userStore.isAuthenticated) {
        const streakData = await APIService.loadStoreData(API_KEYS.userStreakData)

        if (!streakData) {
          this.updateStreakData()
          this.loadStreak()
          return
        }

        this.userUid = streakData.userUid
        this.streakDates = streakData.streakDates || []
      }
    },

    async updateStreakData() {
      if (this.userStore.isAuthenticated) {
        return APIService.saveStoreData(API_KEYS.userStreakData, {
          userUid: this.userStore.uid,
          streakDates: this.streakDates,
        })
      }
    },

    isStreakOngoing(): boolean {
      if (isEmptyArray(this.streakDates)) {
        return false
      }

      const today = getToday()
      const lastStreakDate = new Date(Math.max(...this.streakDates.map(date => new Date(date).getTime())))
      const daysSinceLastStreak = Math.floor((new Date(today).getTime() - lastStreakDate.getTime()) / (1000 * 60 * 60 * 24))

      return daysSinceLastStreak <= 1
    },

    setStreakLength() {
      const sortedDates = [...this.streakDates].sort()

      for (let i = sortedDates.length - 1; i >= 0; i--) {
        const date = new Date(sortedDates[i])
        const previousDate = i > 0
          ? new Date(sortedDates[i - 1])
          : null

        const dayDifference = previousDate
          ? (date.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
          : 1

        if (dayDifference === 1) {
          this.currentStreak++
        } else {
          break
        }
      }
    },

    getStreakResultsForCurrentWeek(): UserStreak[] {
      const todayDate = new Date()
      const results: UserStreak[] = []
      const currentDayIndex = todayDate.getDay()
      const daysToSunday = currentDayIndex

      for (let i = 0; i < 7; i++) {
        const date = new Date(todayDate)
        date.setDate(todayDate.getDate() - daysToSunday + i)
        const dateString = date.toISOString().split('T')[0]
        const dayName = weekDays[date.getDay()]

        if (this.userStore.createdAt) {
          let state: UserStreakState
          if (dateString > getToday()) {
            state = 'unknown'
          } else if (this.streakDates.includes(dateString)) {
            state = 'completed'
          } else if (dateString < this.userStore.createdAt) {
            state = 'unknown'
          } else {
            state = 'missing'
          }

          results.push({
            date: dateString,
            dayName,
            state,
            isToday: dateString === getToday(),
          })
        }
      }

      return results
    },

    async addStreakDate() {
      const today = getToday()

      if (!this.streakDates.includes(today)) {
        this.streakDates.push(today)
        await this.updateStreakData()
        this.setStreakLength()
      }
    },
  },
})
