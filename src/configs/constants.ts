export const APP_LOCALES = ['en', 'de', 'es', 'it', 'pt']

export const API_KEYS = {
  settings: 'fwSettings',
  userAccountData: 'fwUserAccount',
  userAppData: 'fwUserApp',
  userStreakData: 'fwStreak',
  userStreak: 'fwStreak',
}

export const LIFE_MAX_REFILL_LIVES = 5

export const LIFE_REFILL_TIME = 30 * 60 * 1000 // 30 minutes

export const LIFE_REGENERATION_INTERVAL_TIME = 25000 // 25 seconds

export const APP_MENU: AppMenuItem[] = [
  {
    id: 'home',
    url: 'dashboard',
    iconName: 'home',
  },
  {
    id: 'streak',
    url: 'streak',
    iconName: 'streakFlat',
  },
  {
    id: 'collections',
    url: 'collections',
    iconName: 'collection',
  },
  {
    id: 'shop',
    url: 'shop',
    iconName: 'shop',
  },
  {
    id: 'game',
    url: 'game-lobby',
    iconName: 'game',
  },
  {
    id: 'profile',
    url: 'profile',
    iconName: 'user',
  },
]

export const ALPHABETS: Record<AppLocaleCode, string> = {
  en: 'abcdefghijklmnopqrstuvwxyz',
  es: 'abcdefghijklmnopqrstuvwxyzñàèìòùü',
  de: 'abcdefghijklmnopqrstuvwxyzäüöß',
  it: 'abcdefghijklmnopqrstuvwxyzàèéìíòóù',
  pt: 'abcdefghijklmnopqrstuvwxyzàáâãçéêíóôõú',
}

export const LOCALES: FormSelectOption[] = [
  {
    label: 'English',
    value: 'en',
    image: 'en',
  },
  {
    label: 'German',
    value: 'de',
    image: 'de',
  },
  {
    label: 'Spanish',
    value: 'es',
    image: 'es',
  },
  {
    label: 'Italian',
    value: 'it',
    image: 'it',
  },
  {
    label: 'Portuguese',
    value: 'pt',
    image: 'pt',
  },
]

export const POWERUPS: Powerups = {
  life: {
    id: 'life',
    text: 'life',
    asset: 'heart-full',
    speed: -1,
    duration: 0,
    description: 'addsLife',
  },
  gem: {
    id: 'gem',
    text: 'gem',
    asset: 'gem',
    speed: -1,
    duration: 0,
    description: 'addsGem',
  },
  fire: {
    id: 'fire',
    text: 'fire',
    asset: 'powerup-fire',
    speed: null,
    duration: 3000,
    description: 'highlightsLetters',
  },
  ice: {
    id: 'ice',
    text: 'ice',
    asset: 'powerup-ice',
    duration: 5000,
    speed: 0.2,
    description: 'slowsDownLetters',
  },
  wind: {
    id: 'wind',
    text: 'wind',
    asset: 'powerup-wind',
    duration: 500,
    speed: 0,
    description: 'clearsBoard',
  },
}

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
  modalStates: Record<OverlayState, OverlayState>
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
      slideInOutTop: 'anim-slide-in-out-top-timed',
      slideInBottom: 'anim-slide-in-bottom-timed',
      beat: 'anim-beat-timed',
      highlight: 'anim-highlight-timed',
    },
  },
  modalStates: {
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut',
    visible: 'visible',
    hidden: 'hidden',
  },
}

export const USER_ACCOUNT_DEFAULTS: {
  lives: number
  gems: number
  powerups: {
    fire: number
    ice: number
    wind: number
  }
} = {
  lives: 5,
  gems: 30,
  powerups: {
    fire: 5,
    ice: 5,
    wind: 5,
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
  gameSummary: GameSummary
  roundStates: RoundStates
} = {
  speedIncreasement: 1,
  speed: 1,
  availableLetters: 8,
  wordLetterSpawnChance: 5, // chance of spawning a letter of the word (eg: value = 5 => 1 chance in 5)
  powerupSpawnChance: 5, // chance of spawning a powerup (eg: value = 5 => 1 chance in 5)
  powerupDuration: 1000,
  powerups: POWERUPS,
  gameSummary: [],
  roundStates: {
    loading: 'loading',
    ready: 'ready',
    paused: 'paused',
    playing: 'playing',
    roundwon: 'roundwon',
    roundlost: 'roundlost',
    gameover: 'gameover',
  },
}

export const MODAL_NAMES = {
  firstSession: 'firstSession',
  shop: 'shop',
  collections: 'collections',
  words: 'words',
  settings: 'settings',
  noLives: 'noLives',
  headerLives: 'headerLives',
}
