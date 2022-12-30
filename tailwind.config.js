const defaultTheme = require('tailwindcss/defaultTheme')

const fontFamily = {
  sans: ['Lexend', ...defaultTheme.fontFamily.sans],
}

const fontSize = {
  's': ['12px', '16px'],
  'p': ['16px', '24px'],
  'h6': ['20px', '32px'],
  'h5': ['24px', '32px'],
  'h4': ['32px', '44px'],
  'h3': ['48px', '64px'],
  'h2': ['56px', '80px'],
  'h1': ['64px', '88px'],
  'hero': ['80px', '104px'],
  'uber': ['96px', '128px'],
  'colossus': ['112px', '152px']
}

const spacing = {
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
  10: '10px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
  56: '56px',
  64: '64px',
  72: '72px',
  80: '80px',
  96: '96px',
  104: '104px',
  112: '112px'
}

const colors = {
  'black': 'var(--c-black)',
  'white': 'var(--c-white)',
  'grey': 'var(--c-grey)',
  'primary': 'var(--c-primary)',
  'primary-lighter': 'var(--c-primary-lighter)',
  'secondary': 'var(--c-secondary)',
  'tertiary': 'var(--c-tertiary)',
  'quaternary': 'var(--c-quaternary)',
  'quinary': 'var(--c-quinary)',
  'warning': 'var(--c-warning)',
  'success': 'var(--c-success)',
  'danger': 'var(--c-danger)',
  'info': 'var(--c-info)',
  'info-alternative': 'var(--c-info-alternative)',
}

const transitionProperty = {
  'width': 'width'
}

const variants = {
  extend: {
    opacity: ['disabled']
  }
}

const safelist = [
  'stroke-2',
  'stroke-current',
  'fill-current',
  'bg-warning',
  'bg-quinary',
  'opacity-100',
  'opacity-50',
  'w-8',
  'w-16',
  'w-24',
  'w-32',
  'w-40',
  'w-48',
  'w-56',
  'w-64',
  'h-24',
  'h-32'
]

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './index.html', 
      './src/**/*.{vue,js,ts,jsx,tsx}'
    ],    
    options: {
      safelist
    }
  },
  darkMode: false,
  theme: {
    extend: {
      fontFamily,
      fontSize,
      colors,
      spacing,
      borderRadius: spacing,
      transitionProperty
    },
  },
  variants,
  plugins: [],
}
