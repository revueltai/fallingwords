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
    duration: 0,
    spawnChance: 2
  },
  fire: {
    id: 'fire',
    asset: 'powerup-fire',
    duration: 800,
    spawnChance: 10
  },
  ice: {
    id: 'ice',
    asset: 'powerup-ice',
    duration: 1000,
    spawnChance: 5
  },
  wind: {
    id: 'wind',
    asset: 'powerup-wind',
    duration: 400,
    spawnChance: 2
  }
}