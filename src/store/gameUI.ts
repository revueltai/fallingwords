import {
  UIBoardElements, 
  UIOverlayStates,
  UIOverlayComponents
} from '@project/interfaces'
import { UI } from '../configs/constants'

export default {
  namespaced: true,

  state: () => {
    return {
      uiElementsHeight: {},
      overlayComponent: '',
      overlayStates: UI.overlayStates,
      overlayState: UI.overlayStates.hidden
    }
  },

  getters: {
    uiElementsHeight: (state: { uiElementsHeight: UIBoardElements }) => state.uiElementsHeight,
    overlayState: (state: { overlayState: UIOverlayStates }) => state.overlayState,
    overlayComponent: (state: { overlayComponent: UIOverlayComponents }) => state.overlayComponent
  },

  mutations: {
    SET_ELEMENT_HEIGHT(state: { uiElementsHeight: UIBoardElements }, payload: UIBoardElements) {
      state.uiElementsHeight = {
        ...state.uiElementsHeight,
        ...payload
      }
    },
    
    SET_OVERLAY_STATE(state: { overlayState: UIOverlayStates }, newState: UIOverlayStates) {
      state.overlayState = newState
    },

    SET_OVERLAY_COMPONENT(state: { overlayComponent: UIOverlayComponents }, componentName: UIOverlayComponents) {
      state.overlayComponent = componentName
    }
  },

  actions: {
    setElementHeight({ commit }, uiElement: UIBoardElements) {
      commit('SET_ELEMENT_HEIGHT', uiElement)
    },
    
    setOverlayState({ commit }, state: UIOverlayStates) {
      commit('SET_OVERLAY_STATE', state)
    },
    
    setOverlayComponent({ commit }, state: UIOverlayComponents) {
      commit('SET_OVERLAY_COMPONENT', state)
    },
  }
}
