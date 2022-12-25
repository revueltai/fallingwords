export default {
  namespaced: true,

  state: () => {
    return {
      canvasMaxWidth: 600,
      canvasMaxHeight: 800,
      canvasEl: null
    }
  },

  getters: {
    canvasMaxWidth: (state: { canvasMaxWidth: number }) => state.canvasMaxWidth,
    canvasMaxHeight: (state: { canvasMaxHeight: number }) => state.canvasMaxHeight,
    canvasEl: (state: { canvasEl: HTMLElement }) => state.canvasEl
  },

  mutations: {
    SET_ELEMENT(state: { canvasEl: HTMLElement }, canvasEl: HTMLElement) {
      state.canvasEl = canvasEl
    }
  },

  actions: {
    setElement({ commit }, canvasEl: HTMLElement) {
      commit('SET_ELEMENT', canvasEl)
    }
  }
}
