import { getRandomNum } from '@/utils'
import alphabets from '../configs/alphabets.json'

/**
 * Determines whether a powerup should spawn based on a given chance.
 *
 * @param {number} spawnChance - The chance (range) for spawning a powerup.
 * @returns {boolean} True if the powerup should spawn, false otherwise.
 */
function spawnPowerup(spawnChance: number): boolean {
  return getSpawnChance(spawnChance)
}

/**
 * Determines whether a letter should spawn based on a given chance.
 *
 * @param {number} spawnChance - The chance (range) for spawning a letter.
 * @returns {boolean} True if the letter should spawn, false otherwise.
 */
function spawnWordLetter(spawnChance: number): boolean {
  return getSpawnChance(spawnChance)
}

/**
 * Determines whether an event occurs based on a given probability range.
 *
 * @param {number} range - The range within which the event occurs.
 * @returns {boolean} True if the event occurs, false otherwise.
 */
function getSpawnChance(range: number): boolean {
  return getRandomNum(range) === 1
}

/**
 * Retrieves all unguessed letters from a given Word array.
 *
 * @param {Word} word - The word array containing letters.
 * @returns {string} A string of all unguessed letters in the word.
 */
function getPendingLettersInWord(word: Word): string {
  return word.filter((l: Letter) => !l.guessed)
    .map(l => l.letter)
    .join('')
}

/**
 * Randomly selects and returns a powerup from the given powerups collection.
 *
 * @param {Powerups} powerups - An object containing available powerups.
 * @returns {Powerup} A randomly selected powerup.
 */
function createPowerup(powerups: Powerups): Powerup {
  const types = Object.keys(powerups) as PowerupName[]
  const index = getRandomNum(types.length)
  return powerups[types[index]]
}

function createLetter(
  locale: RoundLocaleCodes,
  roundWordGuess: Word,
  wordLetterSpawnChance: number,
): string {
  const a: string = (alphabets as GameAlphabet)[locale as GameAlphabetLocale]
  const pendingLetters = getPendingLettersInWord(roundWordGuess)

  if (spawnWordLetter(wordLetterSpawnChance) || !pendingLetters) {
    return a.charAt(getRandomNum(a.length))
  }

  return pendingLetters.charAt(getRandomNum(pendingLetters.length))
}

export function isLetterInWord(letter: string, word: Word): boolean {
  const arr = word.filter((l: Letter) => !l.guessed && l.letter.toLowerCase() === letter.toLowerCase())
  return arr.length > 0
}

export function getLetterIndexInWord(letter: string, word: Word): number {
  return word.findIndex((l: Letter) => !l.guessed && l.letter.toLowerCase() === letter.toLowerCase())
}

/**
 * Returns a board letter object to be used in the game board.
 *
 * @param {Powerups} powerups   - Powerups object
 * @param {RoundLocaleCodes} locale - Round locale code
 * @param {Word} roundWordGuess - Round word guess
 * @param {number} powerupSpawnChance - Powerup spawn chance
 * @param {number} wordLetterSpawnChance - Word letter spawn chance
 * @returns {BoardLetter} - Board letter object
 */
export function getLetter(
  powerups: Powerups,
  locale: RoundLocaleCodes,
  roundWordGuess: Word,
  powerupSpawnChance: number,
  wordLetterSpawnChance: number,
): BoardLetter {
  let type = null
  let powerup = null
  let letter = ''

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
    powerup,
  }
}

/**
 * Returns a list of letters to be used in the game board.
 *
 * @param {Powerups} powerups   - Powerups object
 * @param {RoundLocaleCodes} locale - Round locale code
 * @param {Word} roundWordGuess - Round word guess
 * @param {number} total - Total board letters to create
 * @param {number} powerupSpawnChance - Powerup spawn chance
 * @param {number} wordLetterSpawnChance - Word letter spawn chance
 * @returns {BoardLetter[]} - List of board letters
 */
export function getLetters(
  powerups: Powerups,
  locale: RoundLocaleCodes,
  roundWordGuess: Word,
  total: number,
  powerupSpawnChance: number,
  wordLetterSpawnChance: number,
): BoardLetter[] {
  const letters = []

  for (let i = 0; i < total; i++) {
    letters.push(
      getLetter(
        powerups,
        locale,
        roundWordGuess,
        powerupSpawnChance,
        wordLetterSpawnChance,
      ),
    )
  }

  return letters
}

/**
 * Creates a word object from a given string.
 *
 * @param {string} word - The word to create a Word object from.
 * @returns {Word} A Word object.
 */
export function createWord(word: string): Word {
  const letters = word.split('')
  return letters.map((letter: string): Letter => ({
    letter,
    guessed: false,
  }))
}
