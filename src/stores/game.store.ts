import { GAME_DEFAULTS } from '@/configs/constants'
import { isEmptyObject } from '@/utils'
import { defineStore } from 'pinia'
import { useAppStore } from './app.store'

interface GameState {
  gameMaxRounds: number
  gameTotalRounds: number
  gameCurrentRound: number
  gameWordsList: GameWords
  gamePowerups: GamePowerups
  gamePowerupsDuration: number
  gameLocales: GameLocale
  gameLives: number
}

function initialState(): GameState {
  return {
    gameMaxRounds: 10,
    gameTotalRounds: 0,
    gameCurrentRound: 0,
    gameWordsList: [],
    gameLives: GAME_DEFAULTS.lives,
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
    isGameOver: state => state.gameCurrentRound === state.gameTotalRounds - 1,
  },

  actions: {
    increaseGameLives() {
      this.gameLives++
    },

    decreaseGameLives() {
      this.gameLives = Math.max(this.gameLives - 1, 0)
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

    setGameWords(wordsList: GameWords) {
      this.gameWordsList = wordsList
      this.gameTotalRounds = wordsList.length
    },

    setGameLocales(locales: GameLocale) {
      this.gameLocales = locales
    },

    setGameLives(lives: number) {
      this.gameLives = lives
    },

    setGameReset() {
      Object.assign(this, initialState())
    },

    prepareGame(collections: GameCollection[]) {
      try {
        console.log(2222, collections)

        const mergedWords = collections.flatMap(({ words, locales }) =>
          words.map(word => ({
            ...word,
            locales,
          })),
        )

        const shuffledWords = mergedWords
          .sort(() => Math.random() - 0.5)
          .slice(0, this.gameMaxRounds)

        const gameLocales = collections[0]?.locales

        this.setGameLives(GAME_DEFAULTS.lives)
        this.setGameWords(shuffledWords)
        this.setGameLocales(gameLocales)
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
  },
})
