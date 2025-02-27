import { UI } from '@/configs/constants'
import { defineStore } from 'pinia'

interface State {
  elements: BoardElements | null
  overlayComponent: OverlayComponentMapKey | ''
  overlayStates: typeof UI.overlayStates
  overlayState: OverlayState
}

const overlayStates = UI.overlayStates as Record<OverlayState, OverlayState>

export const useGameUIStore = defineStore('gameUI', {
  state: (): State => ({
    elements: null,
    overlayComponent: '',
    overlayStates,
    overlayState: overlayStates.hidden,
  }),

  getters: {
    elementsHeight: (state) => {
      if (state.elements) {
        const rs: Record<string, number> = {}

        for (const [key, el] of Object.entries(state.elements)) {
          rs[key] = el.getBoundingClientRect().height
        }

        return rs
      }
    },
  },

  actions: {
    setElement(uiElement: BoardElements) {
      this.elements = {
        ...this.elements,
        ...uiElement,
      }
    },

    setOverlayFadeIn() {
      this.overlayState = overlayStates.fadeIn
    },

    setOverlayFadeOut() {
      this.overlayState = overlayStates.fadeOut
    },

    setOverlayHidden() {
      this.overlayState = overlayStates.hidden
    },

    setOverlayComponent(key: OverlayComponentMapKey) {
      this.overlayComponent = key
    },
  },
})
