import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const fontFamily = {
  sans: ['Lexend', ...defaultTheme.fontFamily.sans],
}

type TailwindFontSizeName = 's' | 'p' | 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1' | 'hero' | 'uber' | 'colossus'
type TailwindFontSize = [string, { fontWeight: string; lineHeight: string }]

const fontSize: Record<TailwindFontSizeName, TailwindFontSize>= {
  's': ['var(--text-s)', {
    fontWeight: 'var(--fw-400)',
    lineHeight: 'var(--text-s--line-height)'
  }],
  'p': ['var(--text-p)', {
    fontWeight: 'var(--fw-400)',
    lineHeight: 'var(--text-p--line-height)'
  }],
  'h6': ['var(--text-h6)', {
    fontWeight: 'var(--fw-500)',
    lineHeight: 'var(--text-h6--line-height)'
  }],
  'h5': ['var(--text-h5)', {
    fontWeight: 'var(--fw-500)',
    lineHeight: 'var(--text-h5--line-height)'
  }],
  'h4': ['var(--text-h4)', {
    fontWeight: 'var(--fw-600)',
    lineHeight: 'var(--text-h4--line-height)'
  }],
  'h3': ['var(--text-h3)', {
    fontWeight: 'var(--fw-600)',
    lineHeight: 'var(--text-h3--line-height)'
  }],
  'h2': ['var(--text-h2)', {
    fontWeight: 'var(--fw-700)',
    lineHeight: 'var(--text-h2--line-height)'
  }],
  'h1': ['var(--text-h1)', {
    fontWeight: 'var(--fw-700)',
    lineHeight: 'var(--text-h1--line-height)'
  }],
  'hero': ['var(--text-hero)', {
    fontWeight: 'var(--fw-800)',
    lineHeight: 'var(--text-hero--line-height)'
  }],
  'uber': ['var(--text-uber)', {
    fontWeight: 'var(--fw-800)',
    lineHeight: 'var(--text-uber--line-height)'
  }],
  'colossus': ['var(--text-colossus)', {
    fontWeight: 'var(--fw-900)',
    lineHeight: 'var(--text-colossus--line-height)'
   }]
}

const colors = {
  'black': 'var(--color-black)',
  'white': 'var(--color-white)',
  'grey': 'var(--color-grey)',
  'primary': 'var(--color-primary)',
  'primary-lighter': 'var(--color-primary-lighter)',
  'secondary': 'var(--color-secondary)',
  'tertiary': 'var(--color-tertiary)',
  'quaternary': 'var(--color-quaternary)',
  'quinary': 'var(--color-quinary)',
  'warning': 'var(--color-warning)',
  'success': 'var(--color-success)',
  'danger': 'var(--color-danger)',
  'info': 'var(--color-info)',
  'info-alternative': 'var(--color-info-alternative)',
}

function getSafelist() {
  return [
    'stroke-2',
    'stroke-current',
    'fill-current',
    'bg-warning',
    'bg-quinary',
    'opacity-100',
    'opacity-50',
    // 'w-8',
    // 'w-16',
    // 'w-6',
    // 'w-32',
    // 'w-40',
    // 'w-48',
    // 'w-56',
    // 'w-64',
    // 'h-24',
    // 'h-32'
  ]
}

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx,vue}'
  ],
  safelist: getSafelist(),
  theme: {
    extend: {
      fontFamily,
      fontSize,
      colors,
    }
  },
  plugins: [],
} satisfies Config
