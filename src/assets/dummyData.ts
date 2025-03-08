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
        original: 'Dog',
        learn: 'Hund',
      },
      {
        original: 'Bird',
        learn: 'Vogel',
      },
      {
        original: 'Cat',
        learn: 'Katze',
      },
      {
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
        original: 'House',
        learn: 'Haus',
      },
      {
        original: 'Park',
        learn: 'Park',
      },
      {
        original: 'Plaza',
        learn: 'Platz',
      },
      {
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
        original: 'Love',
        learn: 'Liebe',
      },
      {
        original: 'Hate',
        learn: 'Hass',
      },
      {
        original: 'Sadness',
        learn: 'Trauigkeit',
      },
      {
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
        original: 'Monday',
        learn: 'Montag',
      },
      {
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
        original: 'Hello',
        learn: 'Hallo',
      },
      {
        original: 'House',
        learn: 'Haus',
      },
      {
        original: 'Book',
        learn: 'Buch',
      },
      {
        original: 'Friend',
        learn: 'Freund',
      },
      {
        original: 'Speed',
        learn: 'Geschwindigkeit',
      },
    ],
  },
]

export const dummyLocales: FormSelectOption[] = [
  {
    label: 'English',
    value: 'en',
    image: 'en',
  },
  {
    label: 'German',
    value: 'de',
    image: 'de',
  },
  {
    label: 'Spanish',
    value: 'es',
    image: 'es',
  },
]
