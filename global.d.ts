declare global {
  type ValueOf<T> = T[keyof T]
  type ElementRef = ref<ElementRef>

  // UI
  type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  type TextSize = 's' | 'p' | 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1' | 'hero' | 'uber' | 'colossus'
  type ColorScale = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'senary' | 'septenary'
  type ColorWeights = 'light' | 'dark'
  type ColorBase = 'black' | 'white' | 'grey'
  type Color = ColorBase | ColorScale | `${ColorScale}-${ColorWeights}`

  type OverlayState = 'fadeIn' | 'visible' | 'fadeOut' | 'hidden'

  interface OverlayComponentMap {
    countdown: 'GameOverlayInitCount'
    paused: 'GameOverlayPause'
    roundwon: 'GameOverlayRoundWon'
    roundlost: 'GameOverlayRoundLost'
  }

  type OverlayComponentMapKey = keyof OverlayComponentMap
  type OverlayComponent = ValueOf<OverlayComponentMap> | ''

  interface BoardElements {
    header?: HTMLElement
    footer?: HTMLElement
  }

  // Game
  type GameAlphabetLocale = 'en' | 'es' | 'de'
  type GameAlphabet = Record<GameAlphabetLocale, string>
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

  type PowerupName = 'life' | 'fire' | 'ice' | 'wind'

  interface Powerup {
    id: PowerupName
    text: string
    asset: string
    duration: number
    speed: number | null
    // name: string
    // type: string
  }

  type Powerups = { [key in PowerupName]: Powerup }

  type GamePowerups = Partial<Record<keyof Powerups, number>>
  type RoundLocaleCodes = null | GameAlphabetLocale

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
    original: string
    learn: string
  }

  type GameWords = GameWord[]

  type RoundState = 'loading' | 'ready' | 'paused' | 'playing' | 'roundwon' | 'roundlost'

  type RoundStates = {
    [key in RoundState]: RoundState
  }

  interface RoundTime {
    start: number
    end: number
  }

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
}

export { }
