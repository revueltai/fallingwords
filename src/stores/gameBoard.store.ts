import { MESSAGES } from '@/configs/constants'
import { useGameStore } from '@/stores/game.store'
import { useGameCharacterStore } from '@/stores/gameCharacter.store'
import { useGameRoundStore } from '@/stores/gameRound.store'
import { getRandomNum } from '@/utils'
import { defineStore } from 'pinia'
import {
  getLetter,
  getLetterIndexInWord,
  isLetterInWord,
} from './utils.store'
import { useSoundStore } from './sounds.store'

interface GameBoardState {
  boardEl: HTMLElement | null
  roundBoardTiles: (BoardLetter | null)[]
}

const soundStore = useSoundStore()

export const useGameBoardStore = defineStore('gameBoard', {
  state: (): GameBoardState => ({
    boardEl: null,
    roundBoardTiles: [],
  }),

  getters: {
    gameStore() {
      return useGameStore()
    },

    gameRoundStore() {
      return useGameRoundStore()
    },

    gameCharacterStore() {
      return useGameCharacterStore()
    },
  },

  actions: {
    setElement(boardEl: HTMLElement) {
      this.boardEl = boardEl
    },

    deleteTile(payload: BoardLetter): number | undefined {
      const index = this.roundBoardTiles.findIndex(tile => tile?.id === payload.id)

      if (index !== -1) {
        // Nullify the tile to keep the array length
        this.roundBoardTiles[index] = null
        return index
      }
    },

    createTile(index: number) {
      const newTile = getLetter(
        this.gameRoundStore.powerups,
        this.gameStore.gameLocales.learn,
        this.gameRoundStore.roundWordGuess,
        this.gameRoundStore.roundPowerupSpawnChance,
        this.gameRoundStore.roundWordLetterSpawnChance,
      )

      this.roundBoardTiles[index] = newTile
    },

    async checkTile(tile: BoardLetter) {
      const word: Word = this.gameRoundStore.roundWordGuess
      let newExpressionType: CharacterExpressionType | '' = ''
      const message: CharacterMessage = { type: '', message: '' }

      if (tile.letter) {
        if (isLetterInWord(tile.letter, word)) {
          newExpressionType = 'like'
          this.gameRoundStore.setLetterAsGuessed(getLetterIndexInWord(tile.letter, word))
        } else {
          newExpressionType = 'dislike'
          this.gameStore.decreaseGameLives()
        }
      } else {
        newExpressionType = 'love'
        const id = tile.powerup?.id
        soundStore.playSoundEffect('gameTilePowerup')

        if (id) {
          message.type = newExpressionType
          message.message = `+1 ${tile.powerup?.text}`

          id === this.gameRoundStore.powerups.life.id
            ? this.gameStore.increaseGameLives()
            : this.gameStore.increasePowerups(id)
        }
      }

      this.gameRoundStore.handleRoundState()

      this.setMessageAndExpression(newExpressionType, message)

      if (newExpressionType === 'like' || newExpressionType === 'dislike') {
        if (this.gameRoundStore.isRoundWon() || this.gameRoundStore.isRoundLost()) {
          this.resetBoardTiles()
        }
      }
    },

    setMessageAndExpression(expressionType: CharacterMessageType, message: CharacterMessage) {
      if (expressionType) {
        message.type = expressionType
        message.message = (MESSAGES)[expressionType][getRandomNum(MESSAGES[expressionType].length)]
      }

      this.gameCharacterStore.setMessage(message)
      return this.gameCharacterStore.setChewExpressions(expressionType)
    },

    resetBoardTiles() {
      this.roundBoardTiles = []
    },
  },
})
