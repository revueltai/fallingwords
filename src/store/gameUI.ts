import {
  UIBoardElements, 
  UIOverlayStates
} from '@project/interfaces'
import { UI } from '../configs/constants'

export default {
  namespaced: true,

  state: () => {
    return {
      uiElementsHeight: {},
      overlayStates: UI.overlayStates,
      overlayState: UI.overlayStates.hidden
    }
  },

  getters: {
    uiElementsHeight: (state: { uiElementsHeight: UIBoardElements }) => state.uiElementsHeight,
    overlayState: (state: { overlayState: UIOverlayStates }) => state.overlayState,
  },

  mutations: {
    SET_UI_ELEMENT_HEIGHT(state: { uiElementsHeight: UIBoardElements }, payload: UIBoardElements) {
      state.uiElementsHeight = {
        ...state.uiElementsHeight,
        ...payload
      }
    },
    
    SET_UI_OVERLAY_STATE(state: { overlayState: UIOverlayStates }, newState: UIOverlayStates) {
      state.overlayState = newState
    }
  },

  actions: {
    setElementHeight({ commit }, uiElement: UIBoardElements) {
      commit('SET_UI_ELEMENT_HEIGHT', uiElement)
    },
    
    setOverlayState({ commit }, state: UIOverlayStates) {
      commit('SET_UI_OVERLAY_STATE', state)
    },
  }
}
