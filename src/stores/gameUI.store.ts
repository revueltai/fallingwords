import { UI } from '@/configs/constants'
import { defineStore } from 'pinia'

interface State {
  elements: BoardElements | null
  modalComponent: GameModalComponentMapKey | ''
  modalStates: typeof UI.modalStates
  modalState: OverlayState
}

const modalStates = UI.modalStates as Record<OverlayState, OverlayState>

export const useGameUIStore = defineStore('gameUI', {
  state: (): State => ({
    elements: null,
    modalComponent: '',
    modalStates,
    modalState: modalStates.hidden,
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

    fadeInGameModal() {
      this.modalState = modalStates.fadeIn
    },

    fadeOutOverlay() {
      this.modalState = modalStates.fadeOut
    },

    hideOverlay() {
      this.modalState = modalStates.hidden
    },
  },
})
