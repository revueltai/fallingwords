declare global {
  type ValueOf<T> = T[keyof T]

  // UI
  type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  type Color = 'black' | 'white' | 'grey' | 'primary' | 'primary-lighter' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'warning' | 'success' | 'danger' | 'info' | 'info-alternative'

  type OverlayState = 'fadeIn' | 'visible' | 'fadeOut' | 'hidden'

  interface OverlayComponentMap {
    countdown: 'GameOverlayInitCount'
    paused: 'GameOverlayPause'
    roundowon: 'GameOverlayRoundWon'
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
    powerup: Powerup// | null
  }

  type PowerupName = 'life' | 'fire' | 'ice' | 'wind'

  interface Powerup {
    id: PowerupName
    text: string
    asset: string
    duration: number
    speed: number // | boolean;
    // name: string
    // type: string
  }

  type Powerups = { [key in PowerupName]: Powerup }

  type MatchPowerups = Partial<Record<keyof Powerups, number>>
  type MatchLocale = null | GameAlphabetLocale

  interface MatchLocales {
    original: MatchLocale
    learn: MatchLocale
  }

  interface RoundWord {
    original: string
    learn: string
  }

  type RoundWords = RoundWord[]

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

  interface CharacterMessage {
    message: string
    type: 'powerup' | 'like' | 'dislike' | ''
  }

  type CharacterExpressionType = 'idle' | 'open' | 'chew' | 'like' | 'dislike' | 'love'
  type CharacterEvent = TouchEvent | KeyboardEvent
}

export { }
