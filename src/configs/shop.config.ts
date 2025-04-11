export const shopConfig = {
  lives: [
    {
      uid: 'livesSm',
      asset: 'shopLivesSm',
      heading: 'get5Lives',
      amount: {
        lives: 5,
      },
      price: 5,
    },
    {
      uid: 'livesMd',
      asset: 'shopLivesMd',
      heading: 'get15Lives',
      amount: {
        lives: 15,
      },
      price: 10,
    },
    {
      uid: 'livesLg',
      asset: 'shopLivesLg',
      heading: 'get20Lives',
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
      heading: 'stayInTheGame',
      description: 'stayInTheGameDesc',
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
      heading: 'unleashTheElements',
      description: 'unleashTheElementsDesc',
    },
  ],
}
