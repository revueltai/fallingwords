import { GAME_DEFAULTS } from '@/configs/constants'
import { useGameStore } from '@/stores/game.store'
import { useGameBoardStore } from '@/stores/gameBoard.store'
import { useGameUIStore } from '@/stores/gameUI.store'
import {
  createWord,
  getLetters,
} from '@/stores/utils.store'
import { getTimestamp, logTimeDifference } from '@/utils'
import { defineStore } from 'pinia'

interface GameState {
  speed: number
  speedHelper: number
  powerups: Powerups
  roundWordsList: GameWords
  roundStates: RoundStates
  roundState: RoundState
  roundTotalAvailableLetters: number
  roundWordOriginal: string | null
  roundWordGuess: Word
  roundTime: RoundTime
  roundPowerupSpawnChance: number
  roundWordLetterSpawnChance: number
  roundActivePowerup: {
    active: boolean
    type: PowerupName | null
  }
}

const roundStates = GAME_DEFAULTS.roundStates

export const useGameRoundStore = defineStore('gameRound', {
  state: (): GameState => ({
    speed: GAME_DEFAULTS.speed,
    speedHelper: GAME_DEFAULTS.speed,
    powerups: GAME_DEFAULTS.powerups,
    roundWordsList: [],
    roundStates,
    roundState: roundStates.loading,
    roundTotalAvailableLetters: GAME_DEFAULTS.availableLetters,
    roundWordOriginal: null,
    roundWordGuess: [],
    roundTime: {
      start: 0,
      end: 0,
    },
    roundPowerupSpawnChance: GAME_DEFAULTS.powerupSpawn,
    roundWordLetterSpawnChance: GAME_DEFAULTS.wordLetterSpawn,
    roundActivePowerup: {
      active: false,
      type: null,
    },
  }),

  getters: {
    gameStore() {
      return useGameStore()
    },
    gameUIStore() {
      return useGameUIStore()
    },
    roundTotalTime: state => logTimeDifference(state.roundTime.start, state.roundTime.end),
    roundIsPlaying: state => state.roundState === state.roundStates.playing,
    roundIsPaused: state => state.roundState === state.roundStates.paused,
    roundIsWon: state => state.roundState === state.roundStates.roundwon,
    roundIsLost: state => state.roundState === state.roundStates.roundlost,
    roundHasActivePowerup: state => state.roundActivePowerup.active,
    roundActivePowerupType: state => state.roundActivePowerup.type,
  },

  actions: {
    activatePowerup(type: PowerupName) {
      this.gameStore.decreasePowerups(type)
      this.roundActivePowerup = {
        active: true,
        type,
      }

      const { duration, speed } = this.powerups[type]
      this.gameStore.gamePowerupsDuration = duration

      if (speed) {
        this.speedHelper = this.speed
        this.speed = speed
      }
    },

    deactivatePowerup() {
      this.roundActivePowerup = {
        active: false,
        type: null,
      }

      this.speed = this.speedHelper
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

    setRoundWord() {
      const word = this.gameStore.gameWordsList[this.gameStore.gameCurrentRound]

      this.roundWordOriginal = word.original
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

    setRoundSpeed(speed?: number) {
      this.speed += speed || GAME_DEFAULTS.speedIncreasement
    },

    setRoundTime(timePoint: keyof RoundTime) {
      this.roundTime[timePoint] = getTimestamp()
    },

    setRoundState(newRoundState: RoundState) {
      this.roundState = newRoundState
    },

    setRoundStart() {
      this.setRoundWord()
      this.gameUIStore.setOverlayComponent('countdown')
    },

    setRoundPlaying() {
      this.setRoundState(roundStates.playing)
    },

    setRoundPause() {
      const { roundlost, paused } = roundStates

      if (
        this.roundState !== roundlost
        && this.roundState !== paused
      ) {
        this.setRoundState(roundStates.paused)
        this.gameUIStore.setOverlayComponent('paused')
      }
    },

    setRoundWon() {
      this.setRoundTime('end')
      this.setRoundState(roundStates.roundwon)
      this.gameUIStore.setOverlayComponent('roundwon')
    },

    setRoundLost() {
      this.setRoundState(roundStates.roundlost)
      this.gameUIStore.setOverlayComponent('roundlost')
    },

    initRound() {
      this.setRoundSpeed()
      this.setRoundTime('start')
      this.setRoundPlaying()
    },

    handleRoundState() {
      if (this.isRoundWon()) {
        this.setRoundWon()
      } else if (this.isRoundLost()) {
        this.setRoundLost()
      }
    },
  },
})
