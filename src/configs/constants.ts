import type { Alphabets, Powerups } from '@project/interfaces'

export const ALPHABETS: Alphabets = {
  en: 'abcdefghijklmnopqrstuvwxyz',
  es: 'abcdefghijklmnopqrstuvwxyzñàèìòùü',
  de: 'abcdefghijklmnopqrstuvwxyzäüöß'
}

export const POWERUPS: Powerups = {
  life: {
    id:  'life',
    text: 'life',
    asset: 'heart-full',
    speed: false,
    duration: 0    
  },
  fire: {
    id: 'fire',
    text: 'fire',
    asset: 'powerup-fire',
    speed: false,
    duration: 1000    
  },
  ice: {
    id: 'ice',
    text: 'ice',
    asset: 'powerup-ice',
    duration: 2000,
    speed: 1    
  },
  wind: {
    id: 'wind',
    text: 'wind',
    asset: 'powerup-wind',
    duration: 400,
    speed: 0    
  }
}

// TODO PROVIDE FROM API
export const MESSAGES = {
  like: [
    'Yey',
    'Yeah',
    'Awesome',
    'Great',
    'Yummi',
    'Tasty',
    'Yum',
    'Nice',
    'Ahhh',
    'Mmm'
  ],
  dislike: [
    'Ugh',
    'Yuck',
    'Ew',
    'Gross',
    'Blech',
    'Ick',
    'Yech',
    'Pfui',
    'Bah',
    'Hmph'
  ]
}

export const GAME_DEFAULTS = {
  matchLifes: 8,
  speed: 3,
  availableLetters: 10,
  powerupDuration: 1000,
  powerupSpawn: 10,
  wordLetterSpawn: 2,
  powerups: POWERUPS
}

export const DUMMIE_DATA = {
  words: [
    {
      original: 'Speed',
      learn: 'Geschwindigkeit'
    },
    {
      original: 'Hello',
      learn: 'Hallo'
    }
  ],
  locales: {
    original: 'en',
    learn: 'de'
  }
}
