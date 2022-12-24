export default {
  namespaced: true,

  state: () => {
    return {      
      boardEl: null
    }
  },

  getters: {    
    boardEl: (state: { boardEl: HTMLElement }) => state.boardEl,
  },

  mutations: {
    SET_ELEMENT(state: { boardEl: HTMLElement }, boardEl: HTMLElement) {
      state.boardEl = boardEl
    }
  },

  actions: {
    setElement({ commit }, boardEl: HTMLElement) {
      commit('SET_ELEMENT', boardEl)
    }
  }
}
