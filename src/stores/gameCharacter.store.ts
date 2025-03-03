import MouthChew from '@/assets/images/character/MouthChew.svg'
import MouthDislike from '@/assets/images/character/MouthDislike.svg'

import MouthIdle from '@/assets/images/character/MouthIdle.svg'
import MouthLike from '@/assets/images/character/MouthLike.svg'
import MouthLove from '@/assets/images/character/MouthLove.svg'
import MouthOpen from '@/assets/images/character/MouthOpen.svg'
import { delay } from '@/utils'
import { defineStore } from 'pinia'
import { nextTick } from 'vue'

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
      await delay(500)

      await nextTick()

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
