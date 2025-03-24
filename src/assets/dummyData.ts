// TODO: all data here needs to come from the DB

export const dummyCollection: GameCollection[] = [
  {
    uid: 'c1', // timestamp + userName
    name: 'Animals',
    locales: {
      original: 'en',
      learn: 'de',
    },
    words: [
      {
        uid: 'w1',
        original: 'Dog',
        learn: 'Hund',
      },
      {
        uid: 'w2',
        original: 'Bird',
        learn: 'Vogel',
      },
      {
        uid: 'w3',
        original: 'Cat',
        learn: 'Katze',
      },
      {
        uid: 'w4',
        original: 'Cow',
        learn: 'Kuh',
      },
    ],
  },
  {
    uid: 'c2', // timestamp + userName
    name: 'Places',
    locales: {
      original: 'en',
      learn: 'de',
    },
    words: [
      {
        uid: 'w21',
        original: 'House',
        learn: 'Haus',
      },
      {
        uid: 'w22',
        original: 'Park',
        learn: 'Park',
      },
      {
        uid: 'w23',
        original: 'Plaza',
        learn: 'Platz',
      },
      {
        uid: 'w24',
        original: 'Neighbourhood',
        learn: 'Nachbarschaft',
      },
    ],
  },
  {
    uid: 'c3', // timestamp + userName
    name: 'Feelings',
    locales: {
      original: 'en',
      learn: 'de',
    },
    words: [
      {
        uid: 'w31',
        original: 'Love',
        learn: 'Liebe',
      },
      {
        uid: 'w32',
        original: 'Hate',
        learn: 'Hass',
      },
      {
        uid: 'w33',
        original: 'Sadness',
        learn: 'Trauigkeit',
      },
      {
        uid: 'w34',
        original: 'Hunger',
        learn: 'Hunger',
      },
    ],
  },
  {
    uid: 'c4', // timestamp + userName
    name: 'Days',
    locales: {
      original: 'en',
      learn: 'de',
    },
    words: [
      {
        uid: 'w41',
        original: 'Monday',
        learn: 'Montag',
      },
      {
        uid: 'w42',
        original: 'Tuesday',
        learn: 'Dienstag',
      },
    ],
  },
  {
    uid: 'c5', // timestamp + userName
    name: 'Dummy Words Advanced',
    locales: {
      original: 'en',
      learn: 'de',
    },
    words: [
      {
        uid: 'w51',
        original: 'Hello',
        learn: 'Hallo',
      },
      {
        uid: 'w52',
        original: 'House',
        learn: 'Haus',
      },
      {
        uid: 'w53',
        original: 'Book',
        learn: 'Buch',
      },
      {
        uid: 'w54',
        original: 'Friend',
        learn: 'Freund',
      },
      {
        uid: 'w55',
        original: 'Speed',
        learn: 'Geschwindigkeit',
      },
    ],
  },
  {
    uid: 'c6', // timestamp + userName
    name: 'Empty',
    locales: {
      original: 'en',
      learn: 'de',
    },
    words: [],
  },
  {
    uid: 'c7', // timestamp + userName
    name: 'Single letters',
    locales: {
      original: 'en',
      learn: 'de',
    },
    words: [
      {
        uid: 'w71',
        original: 'a',
        learn: 'a',
      },
    ],
  },
]
