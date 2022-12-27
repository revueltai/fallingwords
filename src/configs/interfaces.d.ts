declare module '@project/interfaces' {  
  // Types
  export type MatchLocale = null | string
  export type MatchStates = 'loading' | 'starting' | 'paused' | 'playing' | 'gameover'
  export type PowerupTypes = 'fire' | 'life' | 'ice' | 'wind'
  export type Word = Letter[]

  // Interfaces
  export interface Alphabets {
    en: string;
    es: string;
    de: string;
  }

  export interface BoardUIElements {
    header: number;
    footer: number;
  }

  export interface BoardLetter {
    id: number;
    type: string;
    letter: string;
    powerup: Powerup;
  }

  export interface Letter {
    letter: string;
    guessed: boolean;
  }

  export interface Expressions {
    idle: string;
    open: string;
    chew: string;
    like: string;
    dislike: string;
    love: string;
  }

  export interface Powerups {
    life: Powerup;
    fire: Powerup;
    ice: Powerup;
    wind: Powerup;
  }

  export interface Powerup {
    id: string;
    text: string;
    asset: string;
    duration: number;
    speed: number | boolean;
  }

  export interface MatchLocales {
    original: MatchLocale;
    learn: MatchLocale;
  }
}

