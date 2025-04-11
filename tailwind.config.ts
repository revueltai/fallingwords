import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const fontFamily = {
  sans: ['Lexend', ...defaultTheme.fontFamily.sans],
}

type TailwindFontSizeName = 'xs' | 'sm' | 'p' | 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1' | 'hero' | 'uber' | 'colossus'
type TailwindFontSize = [string, { fontWeight: string, lineHeight: string }]

const colors = ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary', 'senary', 'septenary']
const colorWeights = ['light', 'dark']

const fontSize: Record<TailwindFontSizeName, TailwindFontSize> = {
  xs: ['var(--text-xs)', {
    fontWeight: 'var(--fw-400)',
    lineHeight: 'var(--text-xs--line-height)',
  }],
  sm: ['var(--text-sm)', {
    fontWeight: 'var(--fw-400)',
    lineHeight: 'var(--text-sm--line-height)',
  }],
  p: ['var(--text-p)', {
    fontWeight: 'var(--fw-400)',
    lineHeight: 'var(--text-p--line-height)',
  }],
  h6: ['var(--text-h6)', {
    fontWeight: 'var(--fw-500)',
    lineHeight: 'var(--text-h6--line-height)',
  }],
  h5: ['var(--text-h5)', {
    fontWeight: 'var(--fw-500)',
    lineHeight: 'var(--text-h5--line-height)',
  }],
  h4: ['var(--text-h4)', {
    fontWeight: 'var(--fw-600)',
    lineHeight: 'var(--text-h4--line-height)',
  }],
  h3: ['var(--text-h3)', {
    fontWeight: 'var(--fw-600)',
    lineHeight: 'var(--text-h3--line-height)',
  }],
  h2: ['var(--text-h2)', {
    fontWeight: 'var(--fw-700)',
    lineHeight: 'var(--text-h2--line-height)',
  }],
  h1: ['var(--text-h1)', {
    fontWeight: 'var(--fw-700)',
    lineHeight: 'var(--text-h1--line-height)',
  }],
  hero: ['var(--text-hero)', {
    fontWeight: 'var(--fw-800)',
    lineHeight: 'var(--text-hero--line-height)',
  }],
  uber: ['var(--text-uber)', {
    fontWeight: 'var(--fw-800)',
    lineHeight: 'var(--text-uber--line-height)',
  }],
  colossus: ['var(--text-colossus)', {
    fontWeight: 'var(--fw-900)',
    lineHeight: 'var(--text-colossus--line-height)',
  }],
}

const screens = {
  xs: { max: '639px' },
}

const strokeWidth = {
  2: '2',
  3: '3',
  4: '4',
}

function getColors(): Record<Color, string> {
  const output = {
    black: 'var(--color-black)',
    white: 'var(--color-white)',
    grey: 'var(--color-grey)',
  }

  colors.forEach((color) => {
    output[color] = `var(--color-${color})`

    colorWeights.forEach((weight) => {
      output[`${color}-${weight}`] = `var(--color-${color}-${weight})`
    })
  })

  return output
}

function getSafelist() {
  const output: any = [
    'stroke-2',
    'stroke-3',
    'stroke-4',
    'stroke-current',
    'fill-current',
    'opacity-100',
    'opacity-50',
  ]

  // Colors
  const colorsWithWeights: string[] = []
  colors.forEach((color) => {
    colorWeights.forEach((weight) => {
      colorsWithWeights.push(`${color}-${weight}`)
    })
  })

  const safeColors = [
    ['black', 'white', 'grey'].join('|'),
    colors.join('|'),
    colorsWithWeights.join('|'),
  ].flatMap(color => color).join('|')

  output.push({
    pattern: new RegExp(`(stroke|text|bg|border|ring|fill)-(black|grey|white|${safeColors})`, 'g'),
    variants: ['hover', 'focus', 'active'],
  })

  // Fonts
  output.push({
    pattern: new RegExp(`(text)-(${[...Object.keys(fontSize)].join('|')})`, 'g'),
  })

  return output
}

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx,vue}',
  ],
  safelist: getSafelist(),
  theme: {
    extend: {
      fontFamily,
      fontSize,
      strokeWidth,
      colors: getColors(),
      screens,
    },
  },
  plugins: [],
} satisfies Config
