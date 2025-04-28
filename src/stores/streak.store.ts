import { supabase } from '@/services/SupabaseService'
import { getToday, isEmptyArray } from '@/utils'
import { defineStore } from 'pinia'
import { useUserStore } from './user.store'

interface StreakState {
  streakDates: string[]
  currentStreak: number
}

const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function initialState(): StreakState {
  return {
    streakDates: [],
    currentStreak: 0,
  }
}

export const useStreakStore = defineStore('streak', {
  state: initialState,

  getters: {
    userStore() {
      return useUserStore()
    },
    hasPlayedToday(): boolean {
      return this.streakDates.includes(getToday())
    },
    hasStreak(): boolean {
      return this.currentStreak > 0
    },
  },

  actions: {
    setStreakLength() {
      if (isEmptyArray(this.streakDates)) {
        this.currentStreak = 0
        return
      }

      this.currentStreak = 1
      const sortedDates = [...this.streakDates].sort()

      for (let i = sortedDates.length - 1; i > 0; i--) {
        const date = new Date(sortedDates[i])
        const previousDate = new Date(sortedDates[i - 1])

        const dayInMs = 1000 * 60 * 60 * 24
        const dayDifference = (date.getTime() - previousDate.getTime()) / dayInMs

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

    async loadStreak() {
      if (!this.userStore.isAuthenticated) {
        return
      }

      const streak = await supabase.fetchStreak()

      if (!streak) {
        await supabase.initializeStreak()
        return
      }

      this.streakDates = streak.streak_dates || []
      this.currentStreak = streak.current_streak
    },

    async updateStreakData() {
      if (!this.userStore.isAuthenticated) {
        return false
      }

      return supabase.updateStreak({
        streak_dates: this.streakDates,
        current_streak: this.currentStreak,
      })
    },

    async addStreakDate() {
      const today = getToday()

      if (!this.streakDates.includes(today)) {
        this.streakDates.push(today)
        this.setStreakLength()

        await this.updateStreakData()
      }
    },
  },
})
