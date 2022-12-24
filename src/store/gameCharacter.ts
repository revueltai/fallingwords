export default {
  namespaced: true,

  state: () => {
    return {
      offset: 90,
      characterEl: null,
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
    uiElementsHeight: (state: { uiElementsHeight: number }) => state.uiElementsHeight,
    offset: (state: { offset: number }) => state.offset,
    speed: (state: { speed: number }) => state.speed,
    characterEl: (state: { characterEl: HTMLElement }) => state.characterEl,
    expression: (state: { expression: string, expressions: { [key: string]: string } }) => `/images/character/${state.expressions[state.expression]}`
  },

  mutations: {
    SET_CHARACTER_EXPRESSION(state: { expression: string }, expression: string) {
      state.expression = expression
    },

    SET_ELEMENT(state: { characterEl: HTMLElement }, characterElement: HTMLElement) {
      state.characterEl = characterElement
    }
  },

  actions: {
    setElement({ commit }, characterElement: HTMLElement) {
      commit('SET_ELEMENT', characterElement)
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
    }
  }
}
