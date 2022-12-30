import {
  CharacterExpressions,
  CharacterMessage
} from '@project/interfaces'
export default {
  namespaced: true,

  state: () => {
    return {
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
        love: 'MouthLikeHeart.svg'
      }
    }
  },

  getters: {
    message: (state: { message: CharacterMessage }) => state.message,
    offset: (state: { offset: number }) => state.offset,
    speed: (state: { speed: number }) => state.speed,
    characterEl: (state: { characterEl: HTMLElement }) => state.characterEl,
    expression: (state: { expression: CharacterExpressions }) => state.expression,
    expressionAsset: (state: { expression: string, expressions: { [key: string]: string } }) => `/images/character/${state.expressions[state.expression]}`
  },

  mutations: {
    SET_CHARACTER_EXPRESSION(state: { expression: string }, expression: string) {
      state.expression = expression
    },

    SET_CHARACTER_MESSAGE(state: { message: CharacterMessage }, message: CharacterMessage) {
      state.message = { 
        type: message.type, 
        message: message.message 
      }
    },

    SET_ELEMENT(state: { characterEl: HTMLElement }, characterElement: HTMLElement) {
      state.characterEl = characterElement
    }
  },

  actions: {
    setElement({ commit }, characterElement: HTMLElement) {
      commit('SET_ELEMENT', characterElement)
    },

    setMessage({ commit }, message: string) {
      commit('SET_CHARACTER_MESSAGE', message)
    },
    
    setExpression({ commit }, expression: string) {
      commit('SET_CHARACTER_EXPRESSION', expression)
    },

    setChewExpressions({ commit }, expression: string) {
      commit('SET_CHARACTER_EXPRESSION', 'chew')

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', 'idle')
      }, 50)

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', 'chew')
      }, 80)

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', 'idle')
      }, 110)

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', 'chew')
      }, 140)

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', 'idle')
      }, 170)

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', expression)
      }, 200)

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', 'open')
      }, 500)
    },

    resetMessage({ commit }) {
      commit('SET_CHARACTER_MESSAGE', {
        type: '',
        message: ''
      })
    },
  }
}
