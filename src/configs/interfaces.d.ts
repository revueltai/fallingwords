declare module '@project/interfaces' {
  ////// Types

  // UI
  export type UIOverlayStates = 'fadeIn' | 'visible' | 'fadeOut' | 'hidden';
  export type UIOverlayComponents = 'UiGameOverlayInitCount' | 'UiGameOverlayPause' | 'UiGameOverlayRoundWon' | 'UiGameOverlayRoundLost';

  // Game
  export type MatchLocale = null | string;
  export type RoundStates = 'loading' | 'starting' | 'paused' | 'playing' | 'roundwon' | 'roundlost';
  export type PowerupTypes = 'fire' | 'life' | 'ice' | 'wind';
  export type Word = Letter[];
  export type CharacterEvent = TouchEvent | KeyboardEvent;
  export type CharacterExpressions = 'like' | 'dislike' | 'idle' | 'open' | 'love';

  ////// Interfaces

  // UI
  export interface UIBoardElements {
    header: HTMLElement;
    footer: HTMLElement;
  }

  export interface UICharacter {
    el: HTMLElement;
    rect: DOMRect;
  }
  
  export interface UI {
    overlayStates: {
      fadeIn: UIOverlayStates;
      fadeOut: UIOverlayStates;
      hidden: UIOverlayStates;
    },
    overlayComponents: {
      countdown: UIOverlayComponents;
      pause: UIOverlayComponents;
    }
  }

  // Game
  export interface Alphabets {
    en: string;
    es: string;
    de: string;
  }

  export interface CharacterMessage {
    type: 'powerup' | 'like' | 'dislike';
    message: string;
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

