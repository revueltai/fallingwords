import { UI } from '@/configs/constants'
import { defineStore } from 'pinia'

interface State {
  elements: BoardElements | null
  modalComponent: GameModalComponentMapKey | ''
  overlayStates: typeof UI.overlayStates
  overlayState: OverlayState
}

const overlayStates = UI.overlayStates as Record<OverlayState, OverlayState>

export const useGameUIStore = defineStore('gameUI', {
  state: (): State => ({
    elements: null,
    modalComponent: '',
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

    setModalComponent(key: GameModalComponentMapKey) {
      this.modalComponent = key
    },

    fadeInOverlay() {
      this.overlayState = overlayStates.fadeIn
    },

    fadeOutOverlay() {
      this.overlayState = overlayStates.fadeOut
    },

    hideOverlay() {
      this.overlayState = overlayStates.hidden
    },
  },
})
