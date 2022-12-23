import { createStore } from 'vuex'

// Modules
import app from './app'
import game from './game'
import gameCharacter from './gameCharacter'

export const store = createStore({
  modules: {
    app,
    game,
    gameCharacter
  }
})
