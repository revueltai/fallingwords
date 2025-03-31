import { MouthChew, MouthDislike, MouthIdle, MouthLike, MouthLove, MouthOpen } from '@/configs/assets.config'
import { capitalize, delay } from '@/utils'
import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import { useSoundStore } from './sounds.store'

const soundStore = useSoundStore()

export const useGameCharacterStore = defineStore('character', {
  state: (): {
    offset: number
    isEating: boolean
    characterEl: HTMLElement | null
    message: CharacterMessage
    expression: CharacterExpressionType
    expressions: Record<CharacterExpressionType, string>
  } => ({
    offset: 90,
    isEating: false,
    characterEl: null,
    message: {
      message: '',
      type: '',
    },
    expression: 'idle',
    expressions: {
      idle: MouthIdle,
      open: MouthOpen,
      chew: MouthChew,
      like: MouthLike,
      dislike: MouthDislike,
      love: MouthLove,
    },
  }),

  getters: {
    expressionAsset: state => state.expressions[state.expression],
  },

  actions: {
    setElement(characterEl: HTMLElement | null) {
      this.characterEl = characterEl
    },

    setMessage(message: CharacterMessage) {
      if (message.type) {
        this.message = message
      }
    },

    setExpression(expressionType: CharacterExpressionType) {
      this.expression = expressionType
    },

    async setChewExpressions(expressionType: CharacterExpressionType) {
      this.isEating = true

      this.setExpression('chew')
      soundStore.playSoundEffect('characterChew')
      await delay(500)

      await nextTick()

      soundStore.playSoundEffect(`character${capitalize(expressionType)}` as GameSoundEffectName)
      this.setExpression(expressionType)
      await delay(500)

      this.setExpression('idle')
      this.isEating = false
    },

    resetMessage() {
      this.message = {
        type: '',
        message: '',
      }
    },
  },
})
