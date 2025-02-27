import alphabets from '../configs/alphabets.json'

function spawnPowerup (spawnChance: number): boolean {
  return getSpawnChance(spawnChance)
}

function spawnWordLetter (spawnChance: number): boolean {
  return getSpawnChance(spawnChance)
}

function getSpawnChance (range: number): boolean {
  return getRandomNum(range) === 1
}

function getPendingLettersInWord (word: Word): string {
  return word.filter((l: Letter) => !l.guessed)
    .map(l => l.letter)
    .join('')
}

function createPowerup (powerups: Powerups): Powerup {
  const types = Object.keys(powerups) as Array<keyof Powerups>
  const index: number = getRandomNum(types.length)
  return powerups[types[index]]
}

function createLetter (
  locale: MatchLocale,
  roundWordGuess: Word,
  wordLetterSpawnChance: number
): string {
  const a: string = (alphabets as GameAlphabet)[locale as GameAlphabetLocale]
  const pendingLetters = getPendingLettersInWord(roundWordGuess)

  if (spawnWordLetter(wordLetterSpawnChance) || !pendingLetters) {
    return a.charAt(getRandomNum(a.length))
  }

  return pendingLetters.charAt(getRandomNum(pendingLetters.length))
}

export function getRandomNum (range: number): number {
  return Math.floor(Math.random() * range)
}

export function isLetterInWord (letter: string, word: Word): boolean {
  const arr = word.filter((l: Letter) => !l.guessed && l.letter.toLowerCase() === letter.toLowerCase())
  // return !isEmpty(arr)
  return arr.length > 0
}

export function getLetterIndexInWord (letter: string, word: Word): number {
  // return findIndex(word, (l: Letter) => !l.guessed && l.letter.toLowerCase() === letter.toLowerCase())
  return word.findIndex((l: Letter) => !l.guessed && l.letter.toLowerCase() === letter.toLowerCase())
}


export function getBoardLetter (
  powerups: Powerups,
  locale: MatchLocale,
  roundWordGuess: Word,
  powerupSpawnChance: number,
  wordLetterSpawnChance: number
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
    powerup
  }
}

export function createBoardLetters (
  powerups: Powerups,
  locale: MatchLocale,
  roundWordGuess: Word,
  total: number,
  powerupSpawnChance: number,
  wordLetterSpawnChance: number
): BoardLetter[] {
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

export function createWord (word: string): Word {
  const letters = word.split('')
  return letters.map((letter: string): Letter => ({
    letter,
    guessed: false
  }))
}

export function getTimestamp () {
  return new Date().getTime()
}

export function logTimeDifference (
  timestamp1: number,
  timestamp2: number
): { minutes: number, seconds: number } {
  const timeDifference = timestamp2 - timestamp1

  return {
    minutes: Math.floor(timeDifference / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000)
  }
}
