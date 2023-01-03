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
    duration: 2000
  },
  ice: {
    id: 'ice',
    text: 'ice',
    asset: 'powerup-ice',
    duration: 3000,
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

export const UI = {
  overlayStates: {
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut',
    hidden: 'hidden'
  },
  overlayComponents: {
    countdown: 'UiGameOverlayInitCount',
    pause: 'UiGameOverlayPause',
    roundowon: 'UiGameOverlayRoundWon',
    roundlost: 'UiGameOverlayRoundLost'
  }
}

export const GAME_DEFAULTS = {
  speed: 4,
  availableLetters: 8,
  wordLetterSpawn: 3,
  powerupSpawn: 8,
  powerupDuration: 1000,
  powerups: POWERUPS,
  matchLifes: 3,
  matchPowerups: {
    fire: 3,
    ice: 3,
    wind: 3
  },
  roundStates: {
    loading: 'loading',
    starting: 'starting',
    paused: 'paused',
    playing: 'playing',
    roundwon: 'roundwon',
    roundlost: 'roundlost'
  },
}

export const DUMMIE_DATA = {
  locales: {
    original: 'en',
    learn: 'de'
  },
  words: [
    {
      original: 'hello',
      learn: 'hallo'
    },
    {
      original: 'Speed',
      learn: 'Geschwindigkeit'
    },
  ]
}
