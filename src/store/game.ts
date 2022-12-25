import {
  BoardUIElements, 
  MatchStates, 
  MatchLocales, 
  BoardLetter, 
  Word, 
  PowerupTypes 
} from '@project/interfaces'
import { findIndex } from 'lodash'
import {
  createWord,
  createBoardLetters,
  getBoardLetter,
  isLetterInWord,
  getLetterIndexInWord
} from './game.utils'

const defaults = {
  matchLifes: 6,
  speed: 3,
  availableLetters: 8,
  powerupDuration: 1000,
  powerupSpawn: 20,
  wordLetterSpawn: 2
}

export default {
  namespaced: true,

  state: () => {
    return {
      speed: defaults.speed,
      offset: 0,
      powerups: {
        life: {
          id:  'life',
          asset: 'heart-full',
          duration: 0,
          spawnChance: 20
        },
        fire: {
          id: 'fire',
          asset: 'powerup-fire',
          duration: 800,
          spawnChance: 10
        },
        ice: {
          id: 'ice',
          asset: 'powerup-ice',
          duration: 1000,
          spawnChance: 5
        },
        wind: {
          id: 'wind',
          asset: 'powerup-wind',
          duration: 400,
          spawnChance: 2
        }
      },
      matchLocales: {
        original: null,
        learn: null
      },
      matchLifes: defaults.matchLifes,
      matchPowerups: {
        fire: 3,
        ice: 3,
        wind: 3
      },
      uiElementsHeight: {},
      matchPowerupsDuration: defaults.powerupDuration,
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
      roundTotalAvailableLetters: defaults.availableLetters,
      roundWordOriginal: null,
      roundWordGuess: [],
      roundBoardTiles: [],
      roundPowerupSpawnChance: defaults.powerupSpawn,
      roundWordLetterSpawnChance: defaults.wordLetterSpawn,
      roundActivePowerup: {
        active: false,
        type: null
      }
    }
  },

  getters: {
    uiElementsHeight: (state: { uiElementsHeight: BoardUIElements }) => state.uiElementsHeight,
    offset: (state: { offset: number }) => state.offset,
    speed: (state: { speed: number }) => state.speed,
    powerups: state => state.powerups,
    matchStates: state => state.matchStates,
    matchState: state => state.matchState,
    matchIsPlaying: state => state.matchState === state.matchStates.playing,
    matchLifes: state => state.matchLifes,
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
      state.matchLifes++
    },

    LIVES_DECREASE(state) {
      const newLives = state.matchLifes - 1
      state.matchLifes = (newLives > 0) 
        ? newLives 
        : 0
    },

    POWERUP_AMOUNT_INCREASE(state, type: PowerupTypes) {      
      state.matchPowerups[type]++
    },

    POWERUP_AMOUNT_DECREASE(state, type: PowerupTypes) {
      const newCount = state.matchPowerups[type] - 1
      state.matchPowerups[type] = (newCount > 0)
        ? newCount
        : 0
    },

    POWERUP_ACTIVATE(state, type: PowerupTypes) {
      state.roundActivePowerup.active = true
      state.roundActivePowerup.type = type
      const powerups = state.powerups
      
      switch (type) {
        case powerups.fire.id:
          break

        case powerups.ice.id:
          state.speed = 1
          break

        case powerups.wind.id:
          state.speed = 0
          state.matchPowerupsDuration = state.powerups[type].duration
          break
      }
    },

    POWERUP_DEACTIVATE(state) {
      state.roundActivePowerup.active = false
      state.roundActivePowerup.type = null
      state.speed = defaults.speed
      state.matchPowerupsDuration = defaults.powerupDuration
    },

    SET_SPEED(state, speed: number) {      
      state.speed = speed
    },

    SET_MATCH_STATE(state, matchState: MatchStates) {
      state.matchState = matchState
    },

    SET_MATCH_WORDS(state, wordsList: MatchLocales[]) {
      state.matchWordsList = wordsList
      state.matchRoundsTotal = wordsList.length
    },

    SET_MATCH_LOCALES(state: { matchLocales: MatchLocales }, locales: MatchLocales) {
      state.matchLocales = locales
    },

    SET_MATCH_LIVES(state) {
      state.matchLifes = defaults.matchLifes
    },

    SET_ROUND(state) {
      const index = state.matchRoundsCurrent
      const word = state.matchWordsList[index]
      const locales = state.matchLocales
      const totalLetters = state.roundTotalAvailableLetters

      state.roundWordOriginal = word.original
      state.roundWordGuess = createWord(word.learn)
      state.roundBoardTiles = createBoardLetters(
        state.powerups,
        locales.learn,
        state.roundWordGuess,
        totalLetters,
        state.roundPowerupSpawnChance,
        state.roundWordLetterSpawnChance
      )
    },

    SET_LETTER_AS_GUESSED(state, wordIndex: number) {      
      state.roundWordGuess[wordIndex].guessed = true
    },

    SET_UI_ELEMENT_HEIGHT(state, payload) {
      state.uiElementsHeight = {
        ...state.uiElementsHeight,
        ...payload
      }
    },

    DELETE_TILE(state: { roundBoardTiles: BoardLetter[] }, payload: BoardLetter) {
      const index: number = findIndex(state.roundBoardTiles, (tile: BoardLetter) => tile && tile.id === payload.id)
      state.roundBoardTiles[index] = null
    },

    CREATE_TILE(state) {
      const newTile = getBoardLetter(
        state.powerups,
        state.matchLocales.learn,
        state.roundWordGuess,
        state.roundPowerupSpawnChance,
        state.roundWordLetterSpawnChance
      )
      state.roundBoardTiles.push(newTile)
    }
  },

  actions: {
    increaseLifes({ commit }) {
      commit('LIVES_INCREASE')
    },

    decreaseLifes({ commit }) {
      commit('LIVES_DECREASE')
    },

    increasePowerups({ commit }, powerupType: PowerupTypes) {
      commit('POWERUP_AMOUNT_INCREASE', powerupType)
    },

    decreasePowerup({ commit }, powerupType: PowerupTypes) {
      commit('POWERUP_AMOUNT_DECREASE', powerupType)
    },

    checkTile({ commit, getters, dispatch }, tile: BoardLetter) {      
      const word: Word = getters.roundWordGuess      
      let newExpression: string

      if (tile.letter) {
        // Check letter
        const letterInWord: boolean = isLetterInWord(tile.letter, word)

        if (letterInWord) {
          newExpression = 'like'
          const index = getLetterIndexInWord(tile.letter, word)
          commit('SET_LETTER_AS_GUESSED', index)
        } else {
          newExpression = 'dislike'
          dispatch('decreaseLifes')
          dispatch('checkGameOver')
        }
      } else {
        // Check powerup
        newExpression = 'love'
        const type: string = tile.powerup.type
        const powerups = getters.powerups

        if (type === powerups.life.id) {
          dispatch('increaseLifes')
        } else {
          dispatch('increasePowerups', type)
        }
      }

      dispatch('gameCharacter/setChewExpressions', newExpression, { root: true })
    },

    checkGameOver({ commit, getters }) {
      if (getters.matchLifes <= 0) {
        commit('SET_MATCH_STATE', getters.matchStates.gameover)
      }
    },

    getTile({ commit }) {
      commit('CREATE_TILE')
    },

    deleteTile({ commit }, letter: BoardLetter) {
      commit('DELETE_TILE', letter)
    },

    activatePoweup({ commit, getters, dispatch }, type: PowerupTypes) {      
      const hasPowerupsOfType = getters.matchPowerups[type] > 0

      if (!getters.roundHasActivePowerup && hasPowerupsOfType) {
        dispatch('decreasePowerup', type)
        commit('POWERUP_ACTIVATE', type)
      }
    },

    deactivatePowerup({ commit }) {
      commit('POWERUP_DEACTIVATE')
    },

    setUIElementHeight({ commit }, uiElement: BoardUIElements) {
      commit('SET_UI_ELEMENT_HEIGHT', uiElement)
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
