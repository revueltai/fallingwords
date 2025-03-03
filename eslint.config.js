import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  rules: {
    'curly': ['error', 'multi-line'],
    'brace-style': ['error', '1tbs'],
    'operator-linebreak': ['error', 'before'],
    'no-lonely-if': 'error',
  },
})
