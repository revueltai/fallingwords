import {
  RoundStates, 
  MatchLocales, 
  BoardLetter, 
  Word, 
  PowerupTypes, 
  CharacterMessage
} from '@project/interfaces'
import { findIndex } from 'lodash'
import { GAME_DEFAULTS, MESSAGES, UI } from '../configs/constants'
import {
  createWord,
  createBoardLetters,
  getRandomNum,
  getBoardLetter,
  isLetterInWord,
  getLetterIndexInWord
} from './game.utils'

export default {
  namespaced: true,

  state: () => {
    return {
      speed: GAME_DEFAULTS.speed,
      offset: 0,
      powerups: GAME_DEFAULTS.powerups,
      matchLocales: {
        original: null,
        learn: null
      },
      matchLifes: GAME_DEFAULTS.matchLifes,
      matchPowerups: GAME_DEFAULTS.matchPowerups,
      matchPowerupsDuration: GAME_DEFAULTS.powerupDuration,
      matchWordsList: [],
      matchRoundsTotal: 0,
      matchRoundsCurrent: 0,
      roundStates: {
        loading: 'loading',
        starting: 'starting',
        paused: 'paused',
        playing: 'playing',
        gameover: 'gameover'
      },
      roundState: 'loading',
      roundTotalAvailableLetters: GAME_DEFAULTS.availableLetters,
      roundWordOriginal: null,
      roundWordGuess: [],
      roundBoardTiles: [],
      roundPowerupSpawnChance: GAME_DEFAULTS.powerupSpawn,
      roundWordLetterSpawnChance: GAME_DEFAULTS.wordLetterSpawn,
      roundActivePowerup: {
        active: false,
        type: null
      }
    }
  },

  getters: {    
    offset: (state: { offset: number }) => state.offset,
    speed: (state: { speed: number }) => state.speed,
    powerups: state => state.powerups,
    matchLifes: state => state.matchLifes,
    matchPowerups: state => state.matchPowerups,
    matchPowerupsDuration: state => state.matchPowerupsDuration,
    matchLocales: state => state.matchLocales,
    matchRoundsCurrent: state => state.matchRoundsCurrent + 1,
    matchRoundsTotal: state => state.matchRoundsTotal,
    roundIsPlaying: state => state.roundState === state.roundStates.playing,
    roundIsOver: state => state.roundState === state.roundStates.gameover,
    roundStates: state => state.roundStates,
    roundState: state => state.roundState,
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
      const { duration, speed } = state.powerups[type]

      state.matchPowerupsDuration = duration
      
      if (speed) {
        state.speed = speed
      }
    },

    POWERUP_DEACTIVATE(state) {
      state.roundActivePowerup.active = false
      state.roundActivePowerup.type = null
      state.speed = GAME_DEFAULTS.speed
      state.matchPowerupsDuration = GAME_DEFAULTS.powerupDuration
    },

    SET_SPEED(state, speed: number) {
      state.speed = speed
    },

    SET_MATCH_WORDS(state, wordsList: MatchLocales[]) {
      state.matchWordsList = wordsList
      state.matchRoundsTotal = wordsList.length
    },

    SET_MATCH_LOCALES(state: { matchLocales: MatchLocales }, locales: MatchLocales) {
      state.matchLocales = locales
    },

    SET_MATCH_LIVES(state) {
      state.matchLifes = GAME_DEFAULTS.matchLifes
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

    SET_ROUND_STATE(state, roundState: RoundStates) {
      state.roundState = roundState
    },

    SET_LETTER_AS_GUESSED(state, wordIndex: number) {
      state.roundWordGuess[wordIndex].guessed = true
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
      let message: CharacterMessage

      if (tile.letter) {
        // Check letter
        const letterInWord: boolean = isLetterInWord(tile.letter, word)

        if (letterInWord) {
          newExpression = 'like'
          message = {
            type: 'like',
            message: MESSAGES.like[getRandomNum(MESSAGES.like.length)]
          }
          
          commit('SET_LETTER_AS_GUESSED', getLetterIndexInWord(tile.letter, word))
        } else {
          newExpression = 'dislike'
          message = {
            type: 'dislike',
            message: MESSAGES.dislike[getRandomNum(MESSAGES.dislike.length)]
          }
          
          dispatch('decreaseLifes')
          dispatch('checkGameOver')
        }
      } else {
        // Check powerup
        newExpression = 'love'
        const id: string = tile.powerup.id
        const powerups = getters.powerups

        message = {
          type: 'powerup',
          message: `+1 ${tile.powerup.text}`
        }

        if (id === powerups.life.id) {
          dispatch('increaseLifes')
        } else {
          dispatch('increasePowerups', id)
        }
      }
      
      dispatch('gameCharacter/setMessage', message, { root: true })
      dispatch('gameCharacter/setChewExpressions', newExpression, { root: true })
    },

    checkGameOver({ commit, getters, dispatch }) {
      if (getters.matchLifes <= 0) {
        dispatch('setGameOver')
      }
    },

    getTile({ commit }) {
      commit('CREATE_TILE')
    },

    deleteTile({ commit }, letter: BoardLetter) {
      commit('DELETE_TILE', letter)
    },

    activatePoweup({ commit, getters, dispatch }, type: PowerupTypes) {
      const hasPowerupsOfType: boolean = getters.matchPowerups[type] > 0

      if (!getters.roundHasActivePowerup && hasPowerupsOfType) {
        dispatch('decreasePowerup', type)
        commit('POWERUP_ACTIVATE', type)
      }
    },

    deactivatePowerup({ commit }) {
      commit('POWERUP_DEACTIVATE')
    },

    setGamePlaying({ commit, getters }) {
      commit('SET_ROUND_STATE', getters.roundStates.playing)
    },

    setGamePause({ commit, getters, dispatch }) {
      const { gameover, paused } = getters.roundStates
      
      if (getters.roundState !== gameover) {
        if (getters.roundState !== paused) {
          commit('SET_ROUND_STATE', paused)
          dispatch('gameUI/setOverlayComponent', UI.overlayComponents.pause, { root: true })
        }
      }
    },

    setGameOver({ commit, getters, dispatch }) {
      commit('SET_ROUND_STATE', getters.roundStates.gameover)
      dispatch('gameUI/setOverlayComponent', UI.overlayComponents.gameover, { root: true })
    },

    preparemMatch({ commit, dispatch }, payload) {
      commit('SET_MATCH_WORDS', payload.words)
      commit('SET_MATCH_LOCALES', payload.locales)
      commit('SET_MATCH_LIVES')
      commit('SET_ROUND')
      dispatch('gameUI/setOverlayComponent', UI.overlayComponents.countdown, { root: true })
    },
    
    initMatch({ commit, getters }) {
      commit('SET_ROUND_STATE', getters.roundStates.playing)
    }
  }
}
