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
    speed: null,
    duration: 2000,
  },
  ice: {
    id: 'ice',
    text: 'ice',
    asset: 'powerup-ice',
    duration: 4000,
    speed: 0.2,
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
    '💩',
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
  love: [
    'OMG',
    'Looove',
    '❤️',
  ],
}

export const UI: {
  animationClasses: {
    named: Record<string, string>
    timed: Record<string, string>
  }
  overlayStates: Record<OverlayState, OverlayState>
  overlayComponents: OverlayComponentMap
} = {
  animationClasses: {
    named: {
      scaleIn: 'anim-scale-in-named',
      scaleOut: 'anim-scale-out-named',
      fadeIn: 'anim-fade-in-named',
      fadeOut: 'anim-fade-out-named',
      slideInTop: 'anim-slide-in-top-named',
      slideInBottom: 'anim-slide-in-bottom-named',
      beat: 'anim-beat-named',
      highlight: 'anim-highlight-named',
    },
    timed: {
      scaleIn: 'anim-scale-in-timed',
      scaleOut: 'anim-scale-out-timed',
      fadeIn: 'anim-fade-in-timed',
      fadeOut: 'anim-fade-out-timed',
      slideInTop: 'anim-slide-in-top-timed',
      slideInBottom: 'anim-slide-in-bottom-timed',
      beat: 'anim-beat-timed',
      highlight: 'anim-highlight-timed',
    },
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
    roundwon: 'GameOverlayRoundWon',
    roundlost: 'GameOverlayRoundLost',
  },
}

export const GAME_DEFAULTS: {
  speedIncreasement: number
  speed: number
  availableLetters: number
  wordLetterSpawnChance: number
  powerupSpawnChance: number
  powerupDuration: number
  powerups: Powerups
  lives: number
  gamePowerups: {
    fire: number
    ice: number
    wind: number
  }
  roundStates: RoundStates
} = {
  speedIncreasement: 1,
  speed: 0.5,
  availableLetters: 8,
  wordLetterSpawnChance: 10, // 1/10 chance
  powerupSpawnChance: 10, // 1/10 chance
  powerupDuration: 1000,
  powerups: POWERUPS,
  lives: 13,
  gamePowerups: {
    fire: 3,
    ice: 3,
    wind: 33,
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
