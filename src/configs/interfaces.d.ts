declare module '@project/interfaces' {  
  // Types
  export type MatchLocale = null | string
  export type MatchStates = 'loading' | 'starting' | 'paused' | 'playing' | 'gameover'
  export type PowerupTypes = 'fire' | 'life' | 'ice' | 'wind'
  export type Word = Letter[]

  // Interfaces
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

  export interface Powerups {
    life: 'heart-full';
    fire: 'powerup-fire';
    ice: 'powerup-ice';
    wind: 'powerup-wind';
  }

  export interface Powerup {
    name: string;
    type: string;
  }

  export interface PowerupConf {
    id: string;
    asset: string;
    duration: number;
  }

  export interface MatchLocales {
    original: MatchLocale;
    learn: MatchLocale;
  }
}

