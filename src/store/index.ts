import { createStore } from 'vuex'

// Modules
import game from './game'
import gameCharacter from './gameCharacter'

export const store = createStore({
  modules: {
    game,
    gameCharacter
  }
})
