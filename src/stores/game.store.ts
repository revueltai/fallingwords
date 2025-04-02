import { GAME_DEFAULTS } from '@/configs/constants'
import { isEmptyObject } from '@/utils'
import { defineStore } from 'pinia'
import { useAppStore } from './app.store'
import { useGameRoundStore } from './gameRound.store'
import { useUserStore } from './user.store'

interface GameState {
  gameMaxRounds: number
  gameTotalRounds: number
  gameCurrentRound: number
  gameCollections: GameCollection[]
  gameWordsList: GameWords
  gameSummary: GameSummary
  gamePowerups: GamePowerups
  gamePowerupsDuration: number
  gameLocales: GameLocale
}

function initialState(): GameState {
  return {
    gameMaxRounds: 7,
    gameTotalRounds: 0,
    gameCurrentRound: 0,
    gameCollections: [],
    gameWordsList: [],
    gameSummary: GAME_DEFAULTS.gameSummary,
    gamePowerups: GAME_DEFAULTS.gamePowerups,
    gamePowerupsDuration: GAME_DEFAULTS.powerupDuration,
    gameLocales: {
      original: null,
      learn: null,
    },
  }
}

export const useGameStore = defineStore('game', {
  state: initialState,

  getters: {
    appStore() {
      return useAppStore()
    },
    userStore() {
      return useUserStore()
    },
    isGameOver: state => state.gameCurrentRound === state.gameTotalRounds - 1,
  },

  actions: {
    increaseGameLives() {
      this.userStore.lives++
    },

    decreaseGameLives() {
      const newLivesCount = Math.max(this.userStore.lives - 1, 0)
      if (newLivesCount > 0) {
        this.userStore.lives = newLivesCount
      }
    },

    increaseGameRound() {
      if (this.gameCurrentRound <= this.gameTotalRounds - 1) {
        this.gameCurrentRound++
      }
    },

    increasePowerups(type: PowerupName) {
      if (type && !isEmptyObject(this.gamePowerups)) {
        this.gamePowerups[type]!++
      }
    },

    decreasePowerups(type: PowerupName) {
      if (type && !isEmptyObject(this.gamePowerups)) {
        this.gamePowerups[type] = Math.max((this.gamePowerups[type] ?? 0) - 1, 0)
      }
    },

    setGameCollections(collections: GameCollection[]) {
      this.gameCollections = collections
    },

    setGameWords(wordsList: GameWords) {
      this.gameWordsList = wordsList
      this.gameTotalRounds = wordsList.length
    },

    setGameLocales(locales: GameLocale) {
      this.gameLocales = locales
    },

    setGameReset() {
      const gameRoundStore = useGameRoundStore()
      gameRoundStore.setRoundsReset()

      Object.assign(this, initialState())
    },

    replayGame(collections: GameCollection[]) {
      this.setGameReset()
      this.setGameCollections(collections)
      this.prepareGame()

      const gameRoundStore = useGameRoundStore()
      gameRoundStore.prepareRound()
    },

    prepareGame() {
      try {
        const mergedWords = this.gameCollections.flatMap(({ words, locales }) =>
          words.map(word => ({
            ...word,
            locales,
          })),
        )

        const shuffledWords = mergedWords
          .sort(() => Math.random() - 0.5)
          .slice(0, this.gameMaxRounds)

        const gameLocales = this.gameCollections[0]?.locales

        this.setGameWords(shuffledWords)
        this.setGameLocales(gameLocales)
        this.setGameLocales(gameLocales)
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
  },
})
