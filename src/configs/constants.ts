export const ALPHABETS: GameAlphabet = {
  en: 'abcdefghijklmnopqrstuvwxyz',
  es: 'abcdefghijklmnopqrstuvwxyzñàèìòùü',
  de: 'abcdefghijklmnopqrstuvwxyzäüöß',
}

export const POWERUPS: Powerups = {
  life: {
    id: 'life',
    text: 'life',
    asset: 'heart-full',
    speed: -1,
    duration: 0,
  },
  fire: {
    id: 'fire',
    text: 'fire',
    asset: 'powerup-fire',
    speed: -1,
    duration: 2000,
  },
  ice: {
    id: 'ice',
    text: 'ice',
    asset: 'powerup-ice',
    duration: 3000,
    speed: 1,
  },
  wind: {
    id: 'wind',
    text: 'wind',
    asset: 'powerup-wind',
    duration: 400,
    speed: 0,
  },
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
    'Mmm',
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
    'Hmph',
  ],
}

export const UI: {
  animationClasses: Record<string, string>
  overlayStates: Record<OverlayState, OverlayState>
  overlayComponents: OverlayComponentMap
} = {
  animationClasses: {
    scaleIn: 'anim-scale-in',
    scaleOut: 'anim-scale-out',
    fadeIn: 'anim-fade-in',
    fadeOut: 'anim-fade-out',
    slideInTop: 'anim-slide-in-top',
    slideInBottom: 'anim-slide-in-bottom',
    beat: 'anim-beat',
    highlight: 'anim-highlight',
  },
  overlayStates: {
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut',
    visible: 'visible',
    hidden: 'hidden',
  },
  overlayComponents: {
    countdown: 'GameOverlayInitCount',
    paused: 'GameOverlayPause',
    roundowon: 'GameOverlayRoundWon',
    roundlost: 'GameOverlayRoundLost',
  },
}

export const GAME_DEFAULTS: {
  speedIncreasement: number
  speed: number
  availableLetters: number
  wordLetterSpawn: number
  powerupSpawn: number
  powerupDuration: number
  powerups: Powerups
  matchLifes: number
  matchPowerups: {
    fire: 3
    ice: 3
    wind: 3
  }
  roundStates: RoundStates
} = {
  speedIncreasement: 1,
  speed: 2,
  availableLetters: 8,
  wordLetterSpawn: 3,
  powerupSpawn: 8,
  powerupDuration: 1000,
  powerups: POWERUPS,
  matchLifes: 10,
  matchPowerups: {
    fire: 3,
    ice: 3,
    wind: 3,
  },
  roundStates: {
    loading: 'loading',
    ready: 'ready',
    paused: 'paused',
    playing: 'playing',
    roundwon: 'roundwon',
    roundlost: 'roundlost',
  },
}

export const DUMMIE_DATA = {
  locales: {
    original: 'en',
    learn: 'de',
  },
  words: [
    {
      original: 'a',
      learn: 'a',
    },
    {
      original: 'b',
      learn: 'b',
    },
    {
      original: 'c',
      learn: 'c',
    },
    // {
    //   original: 'Speed',
    //   learn: 'Geschwindigkeit'
    // },
  ],
}
