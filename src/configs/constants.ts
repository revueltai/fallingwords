import type { Alphabets, Powerups } from '@project/interfaces'

export const ALPHABETS: Alphabets = {
  en: 'abcdefghijklmnopqrstuvwxyz',
  es: 'abcdefghijklmnopqrstuvwxyzñàèìòùü',
  de: 'abcdefghijklmnopqrstuvwxyzäüöß'
}

export const POWERUPS: Powerups = {
  life: {
    id:  'life',
    asset: 'heart-full',
    speed: false,
    duration: 0    
  },
  fire: {
    id: 'fire',
    asset: 'powerup-fire',
    speed: false,
    duration: 1000    
  },
  ice: {
    id: 'ice',
    asset: 'powerup-ice',
    duration: 2000,
    speed: 1    
  },
  wind: {
    id: 'wind',
    asset: 'powerup-wind',
    duration: 400,
    speed: 0    
  }
}