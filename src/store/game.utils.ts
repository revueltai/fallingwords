import { findIndex, isEmpty } from 'lodash'
import type {
  Letter,
  Word,
  Powerups,
  MatchLocale,
  Powerup,
  BoardLetter
} from '@project/interfaces'
import alphabets from '../configs/alphabets.json'

const spawnPowerup = (): boolean => {
  return setSpawnChance(10)
}

const spawnWordLetter = (): boolean => {
  return setSpawnChance(2)
}

const setSpawnChance = (range: number): boolean => {
  const chance = getRandomNum(range)
  return chance === 1
}

const getRandomNum = (range: number): number => {
  return Math.floor(Math.random() * range)
}

const getPendingLettersInWord = (word: Word): string => {
  const arr = word.filter((l: Letter) => !l.guessed)
    .map(l => l.letter)

  return arr.join('')
}

const createPowerup = (powerups: Powerups): Powerup => {
  const powerupKeys = Object.keys(powerups)
  const powerupIndex = getRandomNum(powerupKeys.length)
  const powerupName = powerupKeys[powerupIndex]

  return {
    name: powerups[powerupName],
    type: powerupName
  }
}

const createLetter = (locale: MatchLocale, roundWordGuess: Word): string => {
  const a = alphabets[locale]
  const pendingLetters = getPendingLettersInWord(roundWordGuess)
  let letter = null

  if (spawnWordLetter() || !pendingLetters) {
    letter = a.charAt(getRandomNum(a.length))
  } else {
    letter = pendingLetters.charAt(getRandomNum(pendingLetters.length))
  }

  return letter
}

export const isLetterInWord = (letter: string, word: Word): boolean => {
  const arr = word.filter((l: Letter) => !l.guessed && l.letter.toLowerCase() === letter.toLowerCase())
  return !isEmpty(arr)
}

export const getLetterIndexInWord = (letter: string, word: Word): number => {
  return findIndex(word, (l: Letter) => !l.guessed && l.letter.toLowerCase() === letter.toLowerCase())
}

export const getBoardLetter = (powerups: Powerups, locale: MatchLocale, roundWordGuess: Word): BoardLetter => {
  let type = null
  let letter = null
  let powerup = null

  if (spawnPowerup()) {
    type = 'powerup'
    powerup = createPowerup(powerups)
  } else {
    type = 'letter'
    letter = createLetter(locale, roundWordGuess)
  }

  return {
    id: getRandomNum(1000),
    type,
    letter,
    powerup
  }
}

export const createBoardLetters = (powerups: Powerups, locale: MatchLocale, roundWordGuess: Word, total: number): BoardLetter[] => {
  const output = []

  for (let i = 0; i < total; i++) {
    output.push(getBoardLetter(powerups, locale, roundWordGuess))
  }

  return output
}

export const createLettersArr = (word: string): Word => {
  const arr = word.split('')

  return arr.map((letter: string): Letter => {
    return {
      letter,
      guessed: false
    }
  })
}
