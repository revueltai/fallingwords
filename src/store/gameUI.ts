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
      elements: {},
      overlayComponent: '',
      overlayStates: UI.overlayStates,
      overlayState: UI.overlayStates.hidden
    }
  },

  getters: {
    overlayState: (state: { overlayState: UIOverlayStates }) => state.overlayState,
    overlayComponent: (state: { overlayComponent: UIOverlayComponents }) => state.overlayComponent,
    elementsHeight: (state: { elements: UIBoardElements }) => {
      const rs = {}
      for (const [key, el] of Object.entries(state.elements)) {
        rs[key] = el.getBoundingClientRect().height
      }
      return rs
    },
  },

  mutations: {
    SET_ELEMENT(state: { elements: UIBoardElements }, payload: UIBoardElements) {
      state.elements = {
        ...state.elements,
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
    setElement({ commit }, uiElement: UIBoardElements) {
      commit('SET_ELEMENT', uiElement)
    },
    
    setOverlayFadeIn({ commit }) {
      commit('SET_OVERLAY_STATE', UI.overlayStates.fadeIn)
    },
    
    setOverlayFadeOut({ commit }) {
      commit('SET_OVERLAY_STATE', UI.overlayStates.fadeOut)
    },
    
    setOverlayHidden({ commit }) {
      commit('SET_OVERLAY_STATE', UI.overlayStates.hidden)
    },
    
    setOverlayComponent({ commit }, state: UIOverlayComponents) {
      commit('SET_OVERLAY_COMPONENT', state)
    }
  }
}
