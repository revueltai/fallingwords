import { createStore } from 'vuex'

// Modules
import app from './app'
import game from './game'
import gameUI from './gameUI'
import gameCharacter from './gameCharacter'
import gameBoard from './gameBoard'

export const store = createStore({
  modules: {
    app,
    game,
    gameUI,
    gameCharacter,
    gameBoard
  }
})
