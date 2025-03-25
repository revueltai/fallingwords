import { GAME_DEFAULTS } from '@/configs/constants'
import { useGameStore } from '@/stores/game.store'
import { useGameBoardStore } from '@/stores/gameBoard.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import { createWord, formatRoundDuration, getLetters, getRoundPercentage } from '@/stores/utils.store'
import { getTimestamp, isEmptyArray, logTimeDifference } from '@/utils'
import { defineStore } from 'pinia'

interface GameState {
  roundSpeed: number
  roundSpeedHelper: number
  powerups: Powerups
  roundWordLocales: GameLocale | undefined
  roundStates: RoundStates
  roundState: RoundState
  roundTotalAvailableLetters: number
  roundWordOriginal: string | null
  roundWordGuess: Word
  roundTime: RoundTimestamp
  roundPowerupSpawnChance: number
  roundWordLetterSpawnChance: number
  roundActivePowerup: {
    active: boolean
    type: PowerupName | null
  }
}

const roundStates = GAME_DEFAULTS.roundStates

function initialState(): GameState {
  return {
    roundSpeed: GAME_DEFAULTS.speed,
    roundSpeedHelper: GAME_DEFAULTS.speed,
    powerups: GAME_DEFAULTS.powerups,
    roundWordLocales: undefined,
    roundStates,
    roundState: roundStates.loading,
    roundTotalAvailableLetters: GAME_DEFAULTS.availableLetters,
    roundWordOriginal: null,
    roundWordGuess: [],
    roundTime: {
      start: 0,
      end: 0,
    },
    roundPowerupSpawnChance: GAME_DEFAULTS.powerupSpawnChance,
    roundWordLetterSpawnChance: GAME_DEFAULTS.wordLetterSpawnChance,
    roundActivePowerup: {
      active: false,
      type: null,
    },
  }
}

export const useGameRoundStore = defineStore('gameRound', {
  state: initialState,

  getters: {
    gameStore() {
      return useGameStore()
    },
    gameUIStore() {
      return useGameUIStore()
    },
    roundTotalTime: state => formatRoundDuration(logTimeDifference(state.roundTime.start, state.roundTime.end)),
    roundScorePercentage: state => getRoundPercentage(state.roundWordGuess, logTimeDifference(state.roundTime.start, state.roundTime.end)),
    roundIsLoading: state => state.roundState === state.roundStates.loading,
    roundIsReady: state => state.roundState === state.roundStates.ready,
    roundIsPlaying: state => state.roundState === state.roundStates.playing,
    roundIsPaused: state => state.roundState === state.roundStates.paused,
    roundIsWon: state => state.roundState === state.roundStates.roundwon,
    roundIsLost: state => state.roundState === state.roundStates.roundlost,
    roundHasActivePowerup: state => state.roundActivePowerup.active,
    roundActivePowerupType: state => state.roundActivePowerup.type,
  },

  actions: {
    activatePowerup(type: PowerupName) {
      // (this.gameStore.gameSummary.roundPowerupUsed?[]![type])++

      this.gameStore.decreasePowerups(type)
      this.roundActivePowerup = {
        active: true,
        type,
      }

      const { duration, speed } = this.powerups[type]
      this.gameStore.gamePowerupsDuration = duration

      if (speed) {
        this.roundSpeedHelper = this.roundSpeed
        this.roundSpeed = speed
      }
    },

    deactivatePowerup() {
      this.roundActivePowerup = {
        active: false,
        type: null,
      }

      this.roundSpeed = this.roundSpeedHelper
      this.gameStore.gamePowerupsDuration = GAME_DEFAULTS.powerupDuration
    },

    isRoundWon() {
      return this.roundWordGuess.every(letter => letter.guessed)
    },

    isRoundLost() {
      return this.gameStore.gameLives <= 0
    },

    setLetterAsGuessed(wordIndex: number) {
      this.roundWordGuess[wordIndex].guessed = true
    },

    setRoundsReset() {
      Object.assign(this, initialState())
    },

    setRoundWord() {
      if (isEmptyArray(this.gameStore.gameWordsList)) {
        return
      }

      const word = this.gameStore.gameWordsList[this.gameStore.gameCurrentRound]

      this.roundWordOriginal = word.original
      this.roundWordLocales = word.locales!
      this.roundWordGuess = createWord(word.learn)

      const gameBoardStore = useGameBoardStore()
      gameBoardStore.roundBoardTiles = getLetters(
        this.powerups,
        this.gameStore.gameLocales.learn,
        this.roundWordGuess,
        this.roundTotalAvailableLetters,
        this.roundPowerupSpawnChance,
        this.roundWordLetterSpawnChance,
      )
    },

    setRoundSpeed() {
      if (this.gameStore.gameCurrentRound === 0) {
        return
      }

      this.roundSpeed += GAME_DEFAULTS.speedIncreasement
    },

    setRoundTime(timePoint: keyof RoundTimestamp) {
      this.roundTime[timePoint] = getTimestamp()
    },

    setRoundState(newRoundState: RoundState) {
      this.roundState = newRoundState
    },

    prepareRound() {
      this.setRoundWord()
      this.gameUIStore.setModalComponent('countdown')
      this.setRoundState(roundStates.ready)
    },

    startRound() {
      this.setRoundSpeed()
      this.setRoundTime('start')
      this.resumeRound()
    },

    resumeRound() {
      this.setRoundState(roundStates.playing)
    },

    pauseRound() {
      const { roundlost, paused } = roundStates

      if (
        this.roundState !== roundlost
        && this.roundState !== paused
      ) {
        this.setRoundState(roundStates.paused)
        this.gameUIStore.setModalComponent('paused')
      }
    },

    setRoundWon() {
      this.setRoundTime('end')
      this.setRoundState(roundStates.roundwon)
      this.gameUIStore.setModalComponent('roundwon')
    },

    setRoundLost() {
      this.setRoundTime('end')
      this.setRoundState(roundStates.roundlost)
      this.gameUIStore.setModalComponent('roundlost')
    },

    setGameOver() {
      this.setRoundTime('end')
      this.setRoundState(roundStates.gameover)
      this.gameUIStore.setModalComponent('gameover')
    },

    updateRoundSummary() {
      this.gameStore.gameSummary.push({
        duration: this.roundTotalTime,
        score: this.roundScorePercentage,
      })
    },

    handleRoundState() {
      if (this.gameStore.isGameOver) {
        this.setGameOver()
      } else if (this.isRoundWon()) {
        this.setRoundWon()
      } else if (this.isRoundLost()) {
        this.setRoundLost()
      }

      if (this.gameStore.isGameOver || this.isRoundWon()) {
        this.updateRoundSummary()
      }
    },
  },
})
