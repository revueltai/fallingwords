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
  getTimestamp,
  getRandomNum,
  getLetterIndexInWord,
  getBoardLetter,
  isLetterInWord,
  logTimeDifference  
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
      roundStates: GAME_DEFAULTS.roundStates,
      roundState: GAME_DEFAULTS.roundStates.loading,
      roundTotalAvailableLetters: GAME_DEFAULTS.availableLetters,
      roundWordOriginal: null,
      roundWordGuess: [],
      roundBoardTiles: [],
      roundTime: {
        start: null,
        end: null
      },
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
    matchRoundsCurrent: state => state.matchRoundsCurrent,
    matchRoundsTotal: state => state.matchRoundsTotal,
    roundStates: state => state.roundStates,
    roundState: state => state.roundState,
    roundTotalTime: state => logTimeDifference(state.roundTime.start, state.roundTime.end),
    roundIsPlaying: state => state.roundState === state.roundStates.playing,
    roundIsWon: state => state.roundState === state.roundStates.roundwon,
    roundIsLost: state => state.roundState === state.roundStates.roundlost,
    roundWordOriginal: state => state.roundWordOriginal,
    roundWordGuess: state => state.roundWordGuess,
    roundBoardTiles: state => state.roundBoardTiles,
    roundHasActivePowerup: state => state.roundActivePowerup.active,
    roundActivePowerupType: state => state.roundActivePowerup.type
  },

  mutations: {
    ROUND_INCREASE(state) {
      if (state.matchRoundsCurrent <= state.matchRoundsTotal - 1) {
        state.matchRoundsCurrent++
      }
    },

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

    SET_ROUND_TIME(state, timePoint: string) {
      state.roundTime[timePoint] = getTimestamp()
    },
    
    SET_ROUND_STATE(state: { roundState: RoundStates }, roundState: RoundStates) {
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
    increaseRound({ commit }) {
      commit('ROUND_INCREASE')
    },

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
          dispatch('checkRoundWon')
        } else {
          newExpression = 'dislike'
          message = {
            type: 'dislike',
            message: MESSAGES.dislike[getRandomNum(MESSAGES.dislike.length)]
          }
          
          dispatch('decreaseLifes')
          dispatch('checkRoundOver')
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

    checkRoundWon({ getters, dispatch }) {
      let isWordFullyGuessed: boolean = true
      for (const letter of getters.roundWordGuess) {
        if (!letter.guessed) {
          isWordFullyGuessed = false
        }
      }

      if (isWordFullyGuessed) {
        dispatch('setRoundWon')
      }
    },

    checkRoundOver({ getters, dispatch }) {
      if (getters.matchLifes <= 0) {
        dispatch('setRoundLost')
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

    setGamePlaying({ commit }) {
      commit('SET_ROUND_STATE', GAME_DEFAULTS.roundStates.playing)
    },

    setGamePause({ commit, getters, dispatch }) {
      const { roundlost, paused } = GAME_DEFAULTS.roundStates
      
      if (getters.roundState !== roundlost) {
        if (getters.roundState !== paused) {
          commit('SET_ROUND_STATE', paused)
          dispatch('gameUI/setOverlayComponent', UI.overlayComponents.pause, { root: true })
        }
      }
    },

    setRoundWon({ commit, dispatch }) {
      commit('SET_ROUND_TIME', 'end')
      commit('SET_ROUND_STATE', GAME_DEFAULTS.roundStates.roundwon)
      dispatch('gameUI/setOverlayComponent', UI.overlayComponents.roundowon, { root: true })
    },

    setRoundLost({ commit, dispatch }) {
      commit('SET_ROUND_STATE', GAME_DEFAULTS.roundStates.roundlost)
      dispatch('gameUI/setOverlayComponent', UI.overlayComponents.roundlost, { root: true })
    },

    prepareMatch({ commit, dispatch }, payload) {
      commit('SET_MATCH_WORDS', payload.words)
      commit('SET_MATCH_LOCALES', payload.locales)
      commit('SET_MATCH_LIVES')
      dispatch('prepareRound')
    },

    prepareRound({ commit, dispatch }) {
      commit('SET_ROUND')
      dispatch('gameUI/setOverlayComponent', UI.overlayComponents.countdown, { root: true })
    },
    
    initRound({ commit, dispatch }) {
      commit('SET_ROUND_TIME', 'start')
      dispatch('setGamePlaying')
    }
  }
}
