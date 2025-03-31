export const API_KEYS = {
  settings: 'fwSettings',
  userAccountData: 'fwUserAccount',
  userAppData: 'fwUserApp',
  userStreak: 'fwStreak',
}

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
    id: 'game',
    url: 'game-lobby',
    iconName: 'game',
  },
  {
    id: 'settings',
    url: 'settings',
    iconName: 'gear',
  },
]

export const DASHBOARD_MENU: DashboardMenuItem[] = [
  {
    id: 'collections',
    heading: 'Collections',
    url: 'collections',
    iconName: 'collection',
  },
  {
    id: 'play',
    heading: 'Play',
    url: 'gameLobby',
    iconName: 'play',
  },
  {
    id: 'settings',
    heading: 'Settings',
    url: 'settings',
    iconName: 'gear',
  },
]

export const ALPHABETS: Record<GameAlphabetLocale, string> = {
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
    description: 'Adds +1 life',
  },
  fire: {
    id: 'fire',
    text: 'fire',
    asset: 'powerup-fire',
    speed: null,
    duration: 3000,
    description: 'Highlights the correct letters',
  },
  ice: {
    id: 'ice',
    text: 'ice',
    asset: 'powerup-ice',
    duration: 5000,
    speed: 0.2,
    description: 'Slows Down letters',
  },
  wind: {
    id: 'wind',
    text: 'wind',
    asset: 'powerup-wind',
    duration: 500,
    speed: 0,
    description: 'Clears the board',
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
  modalStates: Record<OverlayState, OverlayState>
  modalComponents: OverlayComponentMap
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
  modalComponents: {
    countdown: 'ModalGameInitCountdown',
    paused: 'ModalGamePaused',
    roundwon: 'ModalGameRoundWon',
    roundlost: 'ModalGameRoundLost',
    gameover: 'ModalGameOver',
  },
}

export const USER_ACCOUNT_DEFAULTS: {
  lives: number
  gems: number
} = {
  lives: 5,
  gems: 30,
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
  gameSummary: GameSummary
  roundStates: RoundStates
} = {
  speedIncreasement: 1,
  speed: 1,
  availableLetters: 8,
  wordLetterSpawnChance: 2, // 1/10 chance
  powerupSpawnChance: 10, // 1/10 chance
  powerupDuration: 1000,
  powerups: POWERUPS,
  lives: 1,
  gamePowerups: {
    fire: 5,
    ice: 5,
    wind: 5,
  },
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
