import { findIndex, isEmpty } from 'lodash'
import { ALPHABETS } from '../configs/constants'
import type {
  Letter,
  Word,
  Powerups,
  MatchLocale,
  Powerup,
  BoardLetter
} from '@project/interfaces'

const spawnPowerup = (spawnChance: number): boolean => {
  return getSpawnChance(spawnChance)
}

const spawnWordLetter = (spawnChance: number): boolean => {
  return getSpawnChance(spawnChance)
}

const getSpawnChance = (range: number): boolean => {
  const spawnChance = getRandomNum(range)
  return spawnChance === 1
}

const getPendingLettersInWord = (word: Word): string => {
  const pendingLetters = word.filter((l: Letter) => !l.guessed)
    .map(l => l.letter)

  return pendingLetters.join('')
}

const createPowerup = (powerups: Powerups): Powerup => {
  const types: string[] = Object.keys(powerups)
  const index: number = getRandomNum(types.length)
  return powerups[types[index]]
}

const createLetter = (
  locale: MatchLocale, 
  roundWordGuess: Word, 
  wordLetterSpawnChance: number
): string => {
  const a: string = ALPHABETS[locale]
  const pendingLetters = getPendingLettersInWord(roundWordGuess)

  if (spawnWordLetter(wordLetterSpawnChance) || !pendingLetters) {
    return a.charAt(getRandomNum(a.length))
  } 

  return pendingLetters.charAt(getRandomNum(pendingLetters.length))
}

export const getRandomNum = (range: number): number => {
  return Math.floor(Math.random() * range)
}

export const isLetterInWord = (letter: string, word: Word): boolean => {
  const arr = word.filter((l: Letter) => 
    !l.guessed && 
    l.letter.toLowerCase() === letter.toLowerCase()
  )
  return !isEmpty(arr)
}

export const getLetterIndexInWord = (letter: string, word: Word): number => {  
  return findIndex(word, (l: Letter) => 
    !l.guessed && 
    l.letter.toLowerCase() === letter.toLowerCase()
  )
}

export const getBoardLetter = (
  powerups: Powerups,
  locale: MatchLocale,
  roundWordGuess: Word,
  powerupSpawnChance: number,
  wordLetterSpawnChance: number
): BoardLetter => {
  let type = null
  let letter = null
  let powerup = null

  if (spawnPowerup(powerupSpawnChance)) {
    type = 'powerup'
    powerup = createPowerup(powerups)
  } else {
    type = 'letter'
    letter = createLetter(locale, roundWordGuess, wordLetterSpawnChance)
  }

  return {
    id: getRandomNum(1000),
    type,
    letter,
    powerup
  }
}

export const createBoardLetters = (
  powerups: Powerups,
  locale: MatchLocale,
  roundWordGuess: Word,
  total: number,
  powerupSpawnChance: number,
  wordLetterSpawnChance: number
): BoardLetter[] => {
  const boardLetters = []

  for (let i = 0; i < total; i++) {
    boardLetters.push(
      getBoardLetter(
        powerups, 
        locale, 
        roundWordGuess, 
        powerupSpawnChance, 
        wordLetterSpawnChance
      )
    )
  }

  return boardLetters
}

export const createWord = (word: string): Word => {
  const letters = word.split('')

  return letters.map((letter: string): Letter => {
    return {
      letter,
      guessed: false
    }
  })
}
