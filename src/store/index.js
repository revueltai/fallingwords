import { createStore } from 'vuex'

// Modules
import game from './game.js'

export const store = createStore({
  modules: {
    game
  }
})
