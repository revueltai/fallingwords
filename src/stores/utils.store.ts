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
  return powerups[types[index]] as Powerup
}

/**
 * Generates a single letter based on game parameters and word completion status
 *
 * @param locale - The locale code determining which alphabet to use
 * @param roundWordGuess - The word being guessed in the current round
 * @param wordLetterSpawnChance - Probability (0-1) of spawning a letter from the word vs a random letter
 * @returns A single letter character - either from the remaining letters in the word or a random letter from the alphabet
 */
function createLetter(
  locale: RoundLocaleCodes,
  roundWordGuess: Word,
  wordLetterSpawnChance: number,
): string {
  const a: string = (alphabets as GameAlphabet)[locale as AppLocaleCode]
  const pendingLetters = getPendingLettersInWord(roundWordGuess)

  if (spawnWordLetter(wordLetterSpawnChance) || !pendingLetters) {
    return pendingLetters.charAt(getRandomNum(pendingLetters.length))
  }

  return a.charAt(getRandomNum(a.length))
}

/**
 * Checks if a given letter exists in the word and hasn't been guessed yet.
 *
 * @param {string} letter - The letter to check for in the word
 * @param {Word} word - The word to search through
 * @returns {boolean} True if the unguessed letter exists in the word, false otherwise
 */
export function isLetterInWord(letter: string, word: Word): boolean {
  const arr = word.filter((l: Letter) => !l.guessed && l.letter.toLowerCase() === letter.toLowerCase())
  return arr.length > 0
}

/**
 * Finds the index of an unguessed letter in the word.
 *
 * @param {string} letter - The letter to find the index for
 * @param {Word} word - The word to search through
 * @returns {number} The index of the first matching unguessed letter, or -1 if not found
 */
export function getLetterIndexInWord(letter: string, word: Word): number {
  return word.findIndex((l: Letter) => !l.guessed && l.letter.toLowerCase() === letter.toLowerCase())
}

/**
 * Returns a board letter object to be used in the game board.
 *
 * @param {Powerups} powerups   - Powerups object
 * @param {RoundLocaleCodes} locale - Round locale code
 * @param {Word} roundWordGuess - Round word guess
 * @param {number} powerupSpawnChance - Chance to get a Powerup spawn
 * @param {number} wordLetterSpawnChance - Chance to get a Word letter spawn
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
 * @param {number} powerupSpawnChance - Chance to get a Powerup spawn
 * @param {number} wordLetterSpawnChance - Chance to get a Word letter spawn
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
export function createGameWord(word: string): Word {
  const letters = word.split('')
  return letters.map((letter: string): Letter => ({
    letter,
    guessed: false,
  }))
}

/**
 * Formats a round time object into a string.
 *
 * @param {RoundTimeDuration} input - The round time to format.
 * @returns {string} The formatted string.
 */
export function formatRoundDuration(input: RoundTimeDuration): string {
  const { minutes, seconds } = input
  const output = [String(minutes), String(seconds)]

  if (minutes < 10) {
    output[0] = `0${minutes}`
  }

  if (seconds < 10) {
    output[1] = `0${seconds}`
  }

  return `${output[0]}:${output[1]}`
}

/**
 * Calculates the round score, as a percentage from 0 to 100,
 * based on the round word's length relative to the round total time.
 *
 * @param {Word} word - The word to calculate the percentage for.
 * @param {RoundTimeDuration} totalTime - The total time duration.
 * @param {number} secondsMultiplier - A multiplier for the word length.
 * @returns {number} The calculated percentage.
 */
export function getRoundScorePercentage(
  word: Word,
  totalTime: RoundTimeDuration,
  secondsMultiplier: number = 4,
): number {
  if (!word || !totalTime) {
    throw new Error('Invalid input: word and totalTime are required')
  }

  const rank = word.length * secondsMultiplier

  const { seconds, minutes } = totalTime
  const finalTime = seconds + (minutes * 60)

  return Math.round((rank / finalTime) * 100)
}

/**
 * Resets the store context to its initial state.
 *
 * @param {any} ctx - The current store context to be reset.
 * @param {any} initialState - The initial state to apply to the context.
 */
export function resetStore(ctx: any, initialState: any) {
  Object.assign(ctx, initialState)
}
