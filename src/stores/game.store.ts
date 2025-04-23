import { GAME_DEFAULTS } from '@/configs/constants'
import { supabase } from '@/services/SupabaseService'
import { defineStore } from 'pinia'
import { useAppStore } from './app.store'
import { useGameRoundStore } from './gameRound.store'
import { useUserStore } from './user.store'

interface GameState {
  gameMaxRounds: number
  gameTotalRounds: number
  gameCurrentRound: number
  gameAwardedGems: number
  gameCollections: AppCollection[]
  gameCollectionWords: GameWords
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
    gameCollectionWords: [],
    gameSummary: GAME_DEFAULTS.gameSummary,
    gamePowerupsDuration: GAME_DEFAULTS.powerupDuration,
    gameLocales: {
      original: null,
      learn: null,
    },
  }
}

function shuffleGameWords(words: GameWords, maxRounds: number) {
  return words
    .sort(() => Math.random() - 0.5)
    .slice(0, maxRounds)
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

    async setGameCollections(collections: AppCollection[]) {
      this.gameCollections = collections
    },

    async setGameWords(wordsList: GameWords | null) {
      this.gameCollectionWords = []

      if (wordsList) {
        this.gameCollectionWords = wordsList
      } else {
        for (const collection of this.gameCollections) {
          const words = await supabase.fetchWords(collection.id)

          if (words) {
            const mappedWords = words.map(word => ({
              uid: word.id,
              original: word.original,
              learn: word.learn,
              locales: {
                original: collection.locale_original,
                learn: collection.locale_learn,
              },
            }))

            this.gameCollectionWords.push(...mappedWords)
          }
        }
      }

      this.gameCollectionWords = shuffleGameWords(this.gameCollectionWords, this.gameMaxRounds)
      this.gameTotalRounds = this.gameCollectionWords.length
    },

    setGameLocales(locales: GameLocale) {
      this.gameLocales = locales
    },

    setGameReset() {
      const gameRoundStore = useGameRoundStore()
      gameRoundStore.setRoundsReset()
      this.$reset()
    },

    setGameGemsReward() {
      // One gem for each word guessed
      this.gameAwardedGems = this.gameCollectionWords.length

      // One gem extra for each game word where score > 50
      this.gameAwardedGems += this.gameSummary.reduce((acc, word) => {
        return word.score && word.score > 50
          ? acc + 1
          : acc
      }, 0)

      this.userStore.increaseGems(this.gameAwardedGems)
    },

    async saveGameResults() {
      await this.userStore.updateUserData()
    },

    async replayGame() {
      const tempGameCollections = this.gameCollections
      const tempGameCollectionWords = this.gameCollectionWords
      this.setGameReset()

      await this.prepareGame(tempGameCollections, tempGameCollectionWords)

      const gameRoundStore = useGameRoundStore()
      gameRoundStore.prepareRound()
    },

    async prepareGame(
      collections: AppCollection[],
      words: GameWords | null = null,
    ) {
      try {
        await this.setGameCollections(collections)
        await this.setGameWords(words)

        const firstWordLocales = this.gameCollectionWords[0].locales

        if (firstWordLocales) {
          this.setGameLocales(firstWordLocales)
        }

        return true
      } catch (error) {
        console.error('FailedPrepareGame', error)
        return false
      }
    },
  },
})
