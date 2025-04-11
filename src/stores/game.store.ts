import { GAME_DEFAULTS } from '@/configs/constants'
import { defineStore } from 'pinia'
import { useAppStore } from './app.store'
import { useGameRoundStore } from './gameRound.store'
import { useUserStore } from './user.store'

interface GameState {
  gameMaxRounds: number
  gameTotalRounds: number
  gameCurrentRound: number
  gameAwardedGems: number
  gameCollections: GameCollection[]
  gameWordsList: GameWords
  gameSummary: GameSummary
  gamePowerupsDuration: number
  gameLocales: GameLocale
}

function initialState(): GameState {
  return {
    gameMaxRounds: 7,
    gameTotalRounds: 0,
    gameCurrentRound: 0,
    gameAwardedGems: 0,
    gameCollections: [],
    gameWordsList: [],
    gameSummary: GAME_DEFAULTS.gameSummary,
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

    isLastRound: state => state.gameCurrentRound === state.gameTotalRounds - 1,
  },

  actions: {
    increaseGameRound() {
      if (this.gameCurrentRound <= this.gameTotalRounds - 1) {
        this.gameCurrentRound++
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

    setGameGemsReward() {
      // One gem for each word guessed
      this.gameAwardedGems = this.gameWordsList.length

      // One gem extra for each game word where score > 50
      this.gameAwardedGems += this.gameSummary.reduce((acc, word) => {
        return word.score && word.score > 50
          ? acc + 1
          : acc
      }, 0)

      this.userStore.increaseGems(this.gameAwardedGems)
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
          words.map(word => ({ ...word, locales })),
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
