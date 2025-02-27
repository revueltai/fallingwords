import { defineStore } from 'pinia'

export const useGameCharacterStore = defineStore('character', {
  state: (): {
    offset: number
    characterEl: HTMLElement | null
    message: CharacterMessage
    expression: CharacterExpressionType
    expressions: Record<CharacterExpressionType, string>
  } => ({
    offset: 90,
    characterEl: null,
    message: {
      message: '',
      type: ''
    },
    expression: 'idle',
    expressions: {
      idle: 'MouthIdle.svg',
      open: 'MouthOpen.svg',
      chew: 'MouthChew.svg',
      like: 'MouthLike.svg',
      dislike: 'MouthDislike.svg',
      love: 'MouthLikeHeart.svg',
    }
  }),

  getters: {
    // message: (state) => state.message,
    // offset: (state) => state.offset,
    // characterEl: (state) => state.characterEl,
    // expression: (state) => state.expression,
    expressionAsset: (state) => `/images/character/${state.expressions[state.expression]}`,
  },

  actions: {
    setElement(characterEl: HTMLElement | null) {
      this.characterEl = characterEl
    },

    setMessage(message: CharacterMessage) {
      this.message = {
        type: message.type,
        message: message.message
      }
    },

    setExpression(expression: CharacterExpressionType) {
      this.expression = expression
    },

    setChewExpressions(expression: CharacterExpressionType) {
      this.expression = 'chew'

      setTimeout(() => {
        this.expression = 'idle'
      }, 50)

      setTimeout(() => {
        this.expression = 'chew'
      }, 80)

      setTimeout(() => {
        this.expression = 'idle'
      }, 110)

      setTimeout(() => {
        this.expression = 'chew'
      }, 140)

      setTimeout(() => {
        this.expression = 'idle'
      }, 170)

      setTimeout(() => {
        this.expression = expression
      }, 200)

      setTimeout(() => {
        this.expression = 'open'
      }, 500)
    },

    resetMessage() {
      this.message = {
        type: '',
        message: ''
      }
    },
  }
})
