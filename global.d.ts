declare global {
  type ValueOf<T> = T[keyof T]
  type RefElement = ref<RefElement>
  type CrudActions = 'create' | 'update' | 'delete'
  type ModalProps = Record<string, any>

  interface ModalConfig {
    name: string
    heading?: string
    byline?: string
  }

  interface FormSelectOption {
    value: string | number
    label: string
    icon?: string
    image?: string
  }

  // UI
  type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  type TextSize = 's' | 'p' | 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1' | 'hero' | 'uber' | 'colossus'
  type ColorScale = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'senary' | 'septenary'
  type ColorWeights = 'light' | 'dark'
  type ColorBase = 'black' | 'white' | 'grey'
  type Color = ColorBase | ColorScale | `${ColorScale}-${ColorWeights}` | 'none' | 'transparent'
  type IconName = 'cornerDownLeft' | 'chevronDown' | 'chevronLeft' | 'chevronLeftDouble' | 'chevronRight' | 'chevronRightDouble' | 'chevronUp' | 'cross' | 'effects' | 'heart-empty' | 'heart-full' | 'home' | 'info' | 'list' | 'menu' | 'play' | 'pause' | 'plus' | 'powerup-fire' | 'powerup-ice' | 'powerup-wind' | 'skip' | 'sound' | 'check' | 'gear' | 'collection' | 'question' | 'trashbin' | 'word' | 'eye' | 'eye-closed' | 'magnifier' | 'github' | 'star' | 'gem' | 'streak' | 'streakFlat' | 'game' | 'shop' | 'user' | 'gemFlat' | 'wordFlat' | 'gemStroke' | 'streakStroke' | 'heartStroke'
  type IconType = 'fill' | 'stroke' | 'both'
  type IconSizeName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'

  type OverlayState = 'fadeIn' | 'visible' | 'fadeOut' | 'hidden'

  interface OverlayComponentMap {
    countdown: 'ModalGameInitCountdown'
    paused: 'ModalGamePaused'
    roundwon: 'ModalGameRoundWon'
    roundlost: 'ModalGameRoundLost'
    gamesummary: 'ModalGameSummary'
  }

  type GameModalComponentMapKey = keyof OverlayComponentMap
  type OverlayComponent = ValueOf<OverlayComponentMap> | ''

  interface AppMenuItem {
    id: string
    url: string
    iconName: IconName
  }

  type AppLocaleCode = 'en' | 'es' | 'de' | 'it' | 'pt'

  type AppWordType = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'interjection'

  interface AppLocaleArticles {
    definite: string[]
    indefinite: string[]
  }

  interface AppCollectionPackage {
    id: string
    value: number
    price: number
  }

  interface AppSettings {
    locales_data: {
      id: AppLocaleCode
      name: string
      articles: AppLocaleArticles
      enable: boolean
    }[]
    word_types: AppWordType[]
    collection_limits: {
      words_packages: AppCollectionPackage[]
    }
  }

  interface AppCollection {
    id: string
    name: string
    locale_learn: AppLocaleCode
    locale_original: AppLocaleCode
    words_count: number
    collection_package_name?: string
  }

  interface AppWord {
    uid: string
    original: string
    learn: string
    type: AppWordType
    learnArticle?: string
    originalArticle?: string
    locales?: GameLocale
  }

  interface AppPowerups {
    ice: number
    fire: number
    wind: number
  }

  interface DashboardMenuItem {
    id: string
    heading: string
    url: string
    iconName: string
  }

  interface CollectionUpdate {
    uid?: string
    name: string
    localeOriginal: AppLocaleCode
    localeLearn: AppLocaleCode
    collectionPackageName?: string
  }

  interface CollectionPackageUpdate {
    uid: string
    collectionPackageName: string
  }

  // Game
  interface BoardElements {
    header?: HTMLElement
    footer?: HTMLElement
  }

  type GameAlphabet = Record<AppLocaleCode, string>
  type GameBoardRef = HTMLElement | null

  type Word = Letter[]

  interface Letter {
    letter: string
    guessed: boolean
  }

  interface BoardLetter {
    id: number
    type: string
    letter: string
    powerup: Powerup | null
  }

  type PowerupIngame = 'fire' | 'ice' | 'wind'
  type PowerupCollectable = 'life' | 'gem'

  type PowerupName = PowerupIngame | PowerupCollectable

  interface Powerup {
    id: PowerupName
    text: string
    asset: string
    duration: number
    speed: number | null
    description?: string
  }

  type Powerups = { [key in PowerupName]: Powerup }

  type GamePowerups = Partial<Record<keyof Powerups, number>>
  type RoundLocaleCodes = null | AppLocaleCode

  interface GameLocale {
    original: RoundLocaleCodes
    learn: RoundLocaleCodes
  }

  type GameWords = AppWord[]

  type RoundState = 'loading' | 'ready' | 'paused' | 'playing' | 'roundwon' | 'roundlost' | 'gameover'

  type RoundStates = {
    [key in RoundState]: RoundState
  }

  interface RoundTimeDuration {
    minutes: number
    seconds: number
  }

  interface RoundTimestamp {
    start: number
    end: number
  }

  interface GameSummaryItem {
    duration?: string
    score?: number
    usedPowerups?: GamePowerups[]
  }

  type GameSummary = GameSummaryItem[]

  interface Character {
    el: HTMLElement
    rect: DOMRect
  }

  type CharacterEvent = TouchEvent | KeyboardEvent
  type CharacterExpressionType = 'idle' | 'open' | 'chew' | 'like' | 'dislike' | 'love'

  interface CharacterExpressionData {
    asset: string
    duration: number
  }

  type CharacterMessageType = 'love' | 'like' | 'dislike'
  interface CharacterMessage {
    type: CharacterMessageType | ''
    message: string
  }

  interface GameSound {
    audio: HTMLAudioElement
    volume: number
  }

  interface GameSoundsMap {
    firstSessionBg: GameSound
    dashboardBg: GameSound
    gameBg: GameSound
  }

  interface GameSoundsEffectsMap {
    fire: GameSound
    ice: GameSound
    wind: GameSound
    characterChew: GameSound
    characterMove: GameSound
    characterLike: GameSound
    characterDislike: GameSound
    characterLove: GameSound
    buttonClick: GameSound
    notificationSuccess: GameSound
    notificationError: GameSound
    gameTick: GameSound
    gameTilePop: GameSound
    gameTilePowerup: GameSound
    gameRoundOver: GameSound
    gameRoundLost: GameSound
    gameWon: GameSound
    gameLost: GameSound
  }

  type GameSoundName = keyof GameSoundsMap
  type GameSoundEffectName = keyof GameSoundsEffectsMap

  type UserStreakState = 'completed' | 'missing' | 'unknown'

  interface UserStreak {
    dayName: string
    state: UserStreakState
    isToday: boolean
    date: string
  }

  interface SuggestionsLocaleItem {
    collectionName: string
    wordName: {
      article: string
      word: string
    }
  }

  type SuggestionsLocale = Record<AppLocaleCode, SuggestionsLocaleItem>

  interface ShopItem {
    uid: string
    asset: string
    price: number
    amount: {
      lives?: number
      fire?: number
      wind?: number
      ice?: number
    }
  }

  type CharacterMobileControlDirection = 'left' | 'right'

  interface UserPayload {
    name: string | null
    age: string | number | null
    email: string | null
    originalLocale: AppLocaleCode | null
    learnLocale: AppLocaleCode | null
    username: string | null
    password?: string | null
  }

  interface UserDataPayload {
    gems?: number
    lives?: number
    powerups?: AppPowerups
    music?: boolean
    sound_effects?: boolean
    game_maxrounds_count?: number
  }

  type ToastType = 'success' | 'error' | 'info'

  interface ToastPayload {
    message: string
    type: ToastType
    translateMessage?: boolean
  }
}

export { }
