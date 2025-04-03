export const shopConfig = {
  lives: [
    {
      uid: 'livesSm',
      asset: 'shopLivesSm',
      amount: {
        lives: 5,
      },
      price: 5,
    },
    {
      uid: 'livesMd',
      asset: 'shopLivesMd',
      amount: {
        lives: 15,
      },
      price: 10,
    },
    {
      uid: 'livesLg',
      asset: 'shopLivesLg',
      amount: {
        lives: 20,
      },
      price: 15,
    },
  ],
  powerups: [
    {
      uid: 'fire',
      asset: 'shopPowerupFire',
      amount: {
        fire: 5,
      },
      price: 10,
    },
    {
      uid: 'wind',
      asset: 'shopPowerupWind',
      amount: {
        wind: 5,
      },
      price: 10,
    },
    {
      uid: 'ice',
      asset: 'shopPowerupIce',
      amount: {
        ice: 5,
      },
      price: 10,
    },
  ],
  specialOffers: [
    {
      uid: 'offerLives',
      asset: 'shopSpecialOfferLives',
      amount: {
        lives: 99,
      },
      price: 80,
      heading: 'Stay in the Game!',
      description: 'More chances, more fun! Grab this life pack and keep DOT moving!',
    },
    {
      uid: 'offerPowerups',
      asset: 'shopSpecialOfferPowerups',
      amount: {
        fire: 20,
        ice: 10,
        wind: 30,
      },
      price: 90,
      heading: 'Unleash the Elements!',
      description: 'A balanced boost to help you freeze, burn, and breeze through any challenge!',
    },
  ],
}
