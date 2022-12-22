import { findIndex } from 'lodash'
import {
  createLettersArr,
  createBoardLetters,
  getBoardLetter,
  isLetterInWord,
  getLetterIndexInWord
} from './game.utils'

const defaults = {
  matchLives: 4,
  duration: 5000,
  speed: 3
}

export default {
  namespaced: true,

  state: () => {
    return {
      speed: defaults.speed,
      offset: 90,
      expression: 'idle',
      expressions: {
        idle: 'MouthIdle.svg',
        open: 'MouthOpen.svg',
        chew: 'MouthChew.svg',
        like: 'MouthLike.svg',
        dislike: 'MouthDislike.svg',
        love: 'MouthLikeHeart.svg'
      },
      powerups: {
        life: 'heart-full',
        fire: 'powerup-fire',
        ice: 'powerup-ice',
        wind: 'powerup-wind'
      },
      matchLocales: {
        original: null,
        learn: null
      },
      matchLives: defaults.matchLives,
      matchPowerups: {
        fire: 3,
        ice: 3,
        wind: 3
      },
      uiElementsHeight: {},
      matchPowerupsDuration: defaults.duration,
      matchStates: {
        loading: 'loading',
        starting: 'starting',
        paused: 'paused',
        playing: 'playing',
        gameover: 'gameover'
      },
      matchState: 'loading',
      matchWordsList: [],
      matchRoundsTotal: 0,
      matchRoundsCurrent: 0,
      roundTotalAvailableLetters: 5,
      roundWordOriginal: null,
      roundWordGuess: [],
      roundBoardTiles: [],
      roundActivePowerup: {
        active: false,
        type: null
      }
    }
  },

  getters: {
    uiElementsHeight: state => state.uiElementsHeight,
    offset: state => state.offset,
    speed: state => state.speed,
    powerups: state => state.powerups,
    expression: state => `/images/character/${state.expressions[state.expression]}`,
    matchStates: state => state.matchStates,
    matchState: state => state.matchState,
    matchIsPlaying: state => state.matchState === state.matchStates.playing,
    matchLives: state => state.matchLives,
    matchPowerups: state => state.matchPowerups,
    matchPowerupsDuration: state => state.matchPowerupsDuration,
    matchLocales: state => state.matchLocales,
    matchRoundsCurrent: state => state.matchRoundsCurrent + 1,
    matchRoundsTotal: state => state.matchRoundsTotal,
    roundWordOriginal: state => state.roundWordOriginal,
    roundWordGuess: state => state.roundWordGuess,
    roundBoardTiles: state => state.roundBoardTiles,
    roundHasActivePowerup: state => state.roundActivePowerup.active,
    roundActivePowerupType: state => state.roundActivePowerup.type
  },

  mutations: {
    LIVES_INCREASE(state) {
      state.matchLives++
    },

    LIVES_DECREASE(state) {
      const newLives = state.matchLives - 1
      state.matchLives = (newLives > 0) ? newLives : 0
    },

    POWERUP_AMOUNT_INCREASE(state, payload) {
      state.matchPowerups[payload]++
    },

    POWERUP_AMOUNT_DECREASE(state, payload) {
      const newCount = state.matchPowerups[payload] - 1
      state.matchPowerups[payload] = (newCount > 0) ? newCount : 0
    },

    POWERUP_ACTIVATE(state, payload) {
      state.roundActivePowerup.active = true
      state.roundActivePowerup.type = payload

      switch (payload) {
        case 'fire':
          break

        case 'ice':
          state.speed = 1
          break

        case 'wind':
          state.speed = 0
          state.matchPowerupsDuration = 500
          break
      }
    },

    POWERUP_DEACTIVATE(state) {
      state.roundActivePowerup.active = false
      state.roundActivePowerup.type = null
      state.speed = defaults.speed
      state.matchPowerupsDuration = defaults.duration
    },

    SET_SPEED(state, payload) {
      state.speed = payload
    },

    SET_CHARACTER_EXPRESSION(state, payload) {
      state.expression = payload
    },

    SET_MATCH_STATE(state, payload) {
      state.matchState = payload
    },

    SET_MATCH_WORDS(state, payload) {
      state.matchWordsList = payload
      state.matchRoundsTotal = payload.length
    },

    SET_MATCH_LOCALES(state, payload) {
      state.matchLocales = payload
    },

    SET_MATCH_LIVES(state) {
      state.matchLives = defaults.matchLives
    },

    SET_ROUND(state) {
      const index = state.matchRoundsCurrent
      const word = state.matchWordsList[index]
      const locales = state.matchLocales
      const totalLetters = state.roundTotalAvailableLetters

      state.roundWordOriginal = word.original
      state.roundWordGuess = createLettersArr(word.learn)
      state.roundBoardTiles = createBoardLetters(state.powerups, locales.learn, state.roundWordGuess, totalLetters)
    },

    SET_LETTER_AS_GUESSED(state, payload) {
      state.roundWordGuess[payload].guessed = true
    },

    SET_UI_ELEMENT_HEIGHT(state, payload) {
      state.uiElementsHeight = {
        ...state.uiElementsHeight,
        ...payload
      }
    },

    DELETE_TILE(state, payload) {
      const index = findIndex(state.roundBoardTiles, tile => tile && tile.id === payload.id)
      state.roundBoardTiles[index] = null
    },

    CREATE_TILE(state) {
      const newTile = getBoardLetter(state.powerups, state.matchLocales.learn, state.roundWordGuess)
      state.roundBoardTiles.push(newTile)
    }
  },

  actions: {
    increaseLives({ commit }) {
      commit('LIVES_INCREASE')
    },

    decreaseLives({ commit }) {
      commit('LIVES_DECREASE')
    },

    increasePowerup({ commit }, powerupType) {
      commit('POWERUP_AMOUNT_INCREASE', powerupType)
    },

    decreasePowerup({ commit }, powerupType) {
      commit('POWERUP_AMOUNT_DECREASE', powerupType)
    },

    checkTile({ commit, getters, dispatch }, tile) {
      const word = getters.roundWordGuess
      let newExpression = null

      if (tile.letter) {
        // Check letter
        const letterInWord = isLetterInWord(tile.letter, word)

        if (letterInWord) {
          newExpression = 'like'
          const index = getLetterIndexInWord(tile.letter, word)
          commit('SET_LETTER_AS_GUESSED', index)
        } else {
          newExpression = 'dislike'
          dispatch('decreaseLives')
          dispatch('checkGameOver')
        }
      } else {
        // Check powerup
        newExpression = 'love'
        const type = tile.powerup.type

        if (type === 'live') {
          dispatch('increaseLives')
        } else {
          dispatch('increasePowerup', type)
        }
      }

      // Animate character
      dispatch('setChewExpressions', newExpression)
    },

    checkGameOver({ commit, getters }) {
      if (getters.matchLives <= 0) {
        commit('SET_MATCH_STATE', getters.matchStates.gameover)
      }
    },

    getTile({ commit }) {
      commit('CREATE_TILE')
    },

    setExpression({ commit }, payload) {
      commit('SET_CHARACTER_EXPRESSION', payload)
    },

    setChewExpressions({ commit }, payload) {
      commit('SET_CHARACTER_EXPRESSION', 'chew')

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', 'idle')
      }, 50)

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', 'chew')
      }, 80)

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', 'idle')
      }, 100)

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', 'chew')
      }, 150)

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', 'idle')
      }, 200)

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', payload)
      }, 300)

      setTimeout(() => {
        commit('SET_CHARACTER_EXPRESSION', 'open')
      }, 900)
    },

    deleteTile({ commit }, tile) {
      commit('DELETE_TILE', tile)
    },

    activatePoweup({ commit, getters, dispatch }, type) {
      const hasPowerupsOfType = getters.matchPowerups[type] > 0

      if (!getters.roundHasActivePowerup && hasPowerupsOfType) {
        dispatch('decreasePowerup', type)
        commit('POWERUP_ACTIVATE', type)
      }
    },

    deactivatePowerup({ commit }) {
      commit('POWERUP_DEACTIVATE')
    },

    setUIElementHeight({ commit }, payload) {
      commit('SET_UI_ELEMENT_HEIGHT', payload)
    },

    initMatch({ commit, getters }, payload) {
      commit('SET_MATCH_WORDS', payload.words)
      commit('SET_MATCH_LOCALES', payload.locales)
      commit('SET_MATCH_LIVES')
      commit('SET_ROUND')
      commit('SET_MATCH_STATE', getters.matchStates.playing)
    }
  }
}
