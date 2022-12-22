declare module '@project/interfaces' {
  export interface Letter {
    letter: string;
    guessed: boolean;
  }

  export interface BoardLetter {
    id: number;
    type: string;
    letter: string;
    powerup: Powerup;
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

  export interface MatchLocales {
    original: MatchLocale;
    learn: MatchLocale;
  }

  export interface MatchStates {
    loading: 'loading';
    starting: 'starting';
    paused: 'paused';
    playing: 'playing';
    gameover: 'gameover';
  }

  export type Word = Letter[]

  export type MatchLocale = null | string
}

