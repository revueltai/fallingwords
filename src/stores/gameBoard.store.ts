import { defineStore } from 'pinia'

interface GameBoardState {
  boardEl: HTMLElement | null
}

export const useGameBoardStore = defineStore('gameBoard', {
  state: (): GameBoardState => ({
    boardEl: null
  }),

  actions: {
    setElement(boardEl: HTMLElement) {
      this.boardEl = boardEl
    }
  }
})
