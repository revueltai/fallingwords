declare global {
  type ValueOf<T> = T[keyof T]
  type RefElement = ref<RefElement>
  type CrudActions = 'create' | 'update' | 'delete'
  type ModalProps = Record<string, any>

  interface FormSelectOption {
    value: string
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

  // Dashboard
  interface DashboardMenuItem {
    id: string
    heading: string
    url: string
    iconName: string
  }

  interface CollectionUpdate {
    uid?: string
    name: string
    localeOriginal: RoundLocaleCodes
    localeLearn: RoundLocaleCodes
  }

  type AppLocaleCode = 'en' | 'es' | 'de' | 'it' | 'pt'

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
    letter: string// | null
    powerup: Powerup | null
  }

  type PowerupName = 'life' | 'gem' | 'fire' | 'ice' | 'wind'

  interface Powerup {
    id: PowerupName
    text: string
    asset: string
    duration: number
    speed: number | null
    description?: string
    // name: string
    // type: string
  }

  type Powerups = { [key in PowerupName]: Powerup }

  type GamePowerups = Partial<Record<keyof Powerups, number>>
  type RoundLocaleCodes = null | AppLocaleCode

  interface GameLocale {
    original: RoundLocaleCodes
    learn: RoundLocaleCodes
  }

  interface GameCollection {
    uid: string
    name: string
    locales: GameLocale
    words: GameWords
  }

  interface GameWord {
    uid: string
    original: string
    learn: string
    locales?: GameLocale
  }

  type GameWords = GameWord[]

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
    wordName: string
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
    username: string | null
    password: string | null
    originalLocale: AppLocaleCode | null
    learnLocale: AppLocaleCode | null
  }

  interface UserDataPayload {
    gems?: number
    lives?: number
    powerups?: GamePowerups
  }

  type ToastType = 'success' | 'error' | 'info'

  interface ToastPayload {
    message: string
    type: ToastType
    translateMessage?: boolean
  }
}

export { }
