import { GAME_DEFAULTS, MESSAGES, UI } from '@/configs/constants'
import { useGameUIStore } from '@/stores/gameUI.store'
import { isEmptyObject } from '@/utils'
import { defineStore } from 'pinia'
import {
  createBoardLetters,
  createWord,
  getBoardLetter,
  getLetterIndexInWord,
  getRandomNum,
  getTimestamp,
  isLetterInWord,
  logTimeDifference,
} from './utils.store'

interface GameState {
  speed: number
  speedHelper: number
  offset: number
  powerups: Powerups
  matchLocales: MatchLocales
  matchLifes: number
  matchPowerups: MatchPowerups
  matchPowerupsDuration: number
  matchWordsList: RoundWords
  matchRoundsTotal: number
  matchRoundsCurrent: number
  roundStates: RoundStates
  roundState: RoundState
  roundTotalAvailableLetters: number
  roundWordOriginal: string | null
  roundWordGuess: Word
  roundBoardTiles: BoardLetter[]
  roundTime: RoundTime
  roundPowerupSpawnChance: number
  roundWordLetterSpawnChance: number
  roundActivePowerup: {
    active: boolean
    type: PowerupName | null
  }
}

const gameUIStore = useGameUIStore()

const roundStates = GAME_DEFAULTS.roundStates

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    speed: GAME_DEFAULTS.speed,
    speedHelper: GAME_DEFAULTS.speed,
    offset: 0,
    powerups: GAME_DEFAULTS.powerups,
    matchLocales: {
      original: null,
      learn: null,
    },
    matchLifes: GAME_DEFAULTS.matchLifes,
    matchPowerups: GAME_DEFAULTS.matchPowerups,
    matchPowerupsDuration: GAME_DEFAULTS.powerupDuration,
    matchWordsList: [],
    matchRoundsTotal: 0,
    matchRoundsCurrent: 0,
    roundStates,
    roundState: roundStates.loading,
    roundTotalAvailableLetters: GAME_DEFAULTS.availableLetters,
    roundWordOriginal: null,
    roundWordGuess: [],
    roundBoardTiles: [],
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
    roundTotalTime: state => logTimeDifference(state.roundTime.start, state.roundTime.end),
    roundIsPlaying: state => state.roundState === state.roundStates.playing,
    roundIsWon: state => state.roundState === state.roundStates.roundwon,
    roundIsLost: state => state.roundState === state.roundStates.roundlost,
    roundHasActivePowerup: state => state.roundActivePowerup.active,
    roundActivePowerupType: state => state.roundActivePowerup.type,
  },

  actions: {
    increaseLifes() {
      this.matchLifes++
    },

    decreaseLifes() {
      this.matchLifes = Math.max(this.matchLifes - 1, 0)
    },

    increaseRound() {
      if (this.matchRoundsCurrent <= this.matchRoundsTotal - 1) {
        this.matchRoundsCurrent++
      }
    },

    increasePowerups(type: PowerupName) {
      if (type && !isEmptyObject(this.matchPowerups)) {
        this.matchPowerups[type]!++
      }
    },

    decreasePowerup(type: PowerupName) {
      if (type && !isEmptyObject(this.matchPowerups)) {
        this.matchPowerups[type] = Math.max((this.matchPowerups[type] ?? 0) - 1, 0)
      }
    },

    activatePowerup(type: PowerupName) {
      if (!this.roundActivePowerup.active && this.matchPowerup[type] > 0) {
        this.decreasePowerup(type)
        this.roundActivePowerup = { active: true, type }
        const { duration, speed } = this.powerups[type]
        this.matchPowerupsDuration = duration

        if (speed) {
          this.speedHelper = this.speed
          this.speed = speed
        }
      }
    },

    deactivatePowerup() {
      this.roundActivePowerup = { active: false, type: null }
      this.speed = this.speedHelper
      this.matchPowerupsDuration = GAME_DEFAULTS.powerupDuration
    },

    deleteTile(payload: BoardLetter) {
      const index = this.roundBoardTiles.findIndex(tile => tile?.id === payload.id)

      if (index !== -1) {
        this.roundBoardTiles.splice(index, 1)
      }
    },

    createTile() {
      const newTile = getBoardLetter(
        this.powerups,
        this.matchLocales.learn,
        this.roundWordGuess,
        this.roundPowerupSpawnChance,
        this.roundWordLetterSpawnChance,
      )

      this.roundBoardTiles.push(newTile)
    },

    checkTile(tile: BoardLetter) {
      let newExpression, message

      if (tile.letter) {
        const letterInWord = isLetterInWord(tile.letter, this.roundWordGuess)

        if (letterInWord) {
          newExpression = 'like'
          message = {
            type: 'like',
            message: MESSAGES.like[getRandomNum(MESSAGES.like.length)],
          }

          this.setLetterAsGuessed(getLetterIndexInWord(tile.letter, this.roundWordGuess))
          this.checkRoundWon()
        }
        else {
          newExpression = 'dislike'
          message = {
            type: 'dislike',
            message: MESSAGES.dislike[getRandomNum(MESSAGES.dislike.length)],
          }

          this.speed += 0.5
          this.decreaseLifes()
          this.checkRoundOver()
        }
      }
      else {
        newExpression = 'love'
        const id = tile.powerup.id
        message = {
          type: 'powerup',
          message: `+1 ${tile.powerup.text}`,
        }

        id === this.powerups.life.id
          ? this.increaseLifes()
          : this.increasePowerups(id)
      }
    },

    checkRoundWon() {
      if (this.roundWordGuess.every(letter => letter.guessed)) {
        this.setRoundWon()
      }
    },

    checkRoundOver() {
      if (this.matchLifes <= 0) {
        this.setRoundLost()
      }
    },

    setMatchWords(wordsList: RoundWords) {
      this.matchWordsList = wordsList
      this.matchRoundsTotal = wordsList.length
    },

    setMatchLocales(locales: MatchLocales) {
      this.matchLocales = locales
    },

    setMatchLives(lives: number) {
      this.matchLifes = lives
    },

    setRoundWord() {
      const word = this.matchWordsList[this.matchRoundsCurrent]
      this.roundWordOriginal = word.original

      this.roundWordGuess = createWord(word.learn)
      this.roundBoardTiles = createBoardLetters(
        this.powerups,
        this.matchLocales.learn,
        this.roundWordGuess,
        this.roundTotalAvailableLetters,
        this.roundPowerupSpawnChance,
        this.roundWordLetterSpawnChance,
      )
    },

    setRoundSpeed() {
      this.speed += GAME_DEFAULTS.speedIncreasement
    },

    setRoundTime(timePoint: keyof RoundTime) {
      this.roundTime[timePoint] = getTimestamp()
    },

    setRoundState(newRoundState: RoundState) {
      this.roundState = newRoundState
    },

    setLetterAsGuessed(wordIndex: number) {
      this.roundWordGuess[wordIndex].guessed = true
    },

    setGameReset() {
      // TBD Implement
    },

    setGamePlaying() {
      this.setRoundState(roundStates.playing)
    },

    setGamePause() {
      const { roundlost, paused } = roundStates

      if (
        this.roundState !== roundlost
        && this.roundState !== paused
      ) {
        this.setRoundState(roundStates.paused)
        this.setOverlayComponent('paused')
      }
    },

    setRoundWon() {
      this.setRoundTime('end')
      this.setRoundState(roundStates.roundwon)
      this.setOverlayComponent('roundowon')
    },

    setRoundLost() {
      this.setRoundState(roundStates.roundlost)
      this.setOverlayComponent('roundlost')
    },

    setOverlayComponent(component: OverlayComponentMapKey) {
      gameUIStore.setOverlayComponent(component)
    },

    prepareMatch({ words, locales }: { words: RoundWords, locales: MatchLocales }) {
      this.setMatchWords(words)
      this.setMatchLocales(locales)
      this.setMatchLives(GAME_DEFAULTS.matchLifes)
      this.prepareRound()
    },

    prepareRound() {
      this.setRoundWord()
      this.setOverlayComponent('countdown')
    },

    initRound() {
      this.setRoundSpeed()
      this.setRoundTime('start')
      this.setRoundState(roundStates.playing)
    },
  },
})
