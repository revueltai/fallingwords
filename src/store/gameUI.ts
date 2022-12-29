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
      elementsHeight: {},
      overlayComponent: '',
      overlayStates: UI.overlayStates,
      overlayState: UI.overlayStates.hidden
    }
  },

  getters: {
    elementsHeight: (state: { elementsHeight: UIBoardElements }) => state.elementsHeight,
    overlayState: (state: { overlayState: UIOverlayStates }) => state.overlayState,
    overlayComponent: (state: { overlayComponent: UIOverlayComponents }) => state.overlayComponent
  },

  mutations: {
    SET_ELEMENT_HEIGHT(state: { elementsHeight: UIBoardElements }, payload: UIBoardElements) {
      state.elementsHeight = {
        ...state.elementsHeight,
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
    
    setOverlayFadeIn({ commit }, state: UIOverlayStates) {
      commit('SET_OVERLAY_STATE', UI.overlayStates.fadeIn)
    },
    
    setOverlayFadeOut({ commit }, state: UIOverlayStates) {
      commit('SET_OVERLAY_STATE', UI.overlayStates.fadeOut)
    },
    
    setOverlayComponent({ commit }, state: UIOverlayComponents) {
      commit('SET_OVERLAY_COMPONENT', state)
    },
  }
}
