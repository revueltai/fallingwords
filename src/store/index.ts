import { createStore } from 'vuex'

// Modules
import app from './app'
import game from './game'
import gameCharacter from './gameCharacter'
import gameBoard from './gameBoard'

export const store = createStore({
  modules: {
    app,
    game,
    gameCharacter,
    gameBoard
  }
})
