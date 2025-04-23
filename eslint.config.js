import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  rules: {
    'curly': ['error', 'multi-line'],
    'operator-linebreak': ['error', 'before'],
    'no-lonely-if': 'error',
    'keyword-spacing': ['error', {
      before: true,
      after: true,
      overrides: {
        catch: { after: true, before: true },
      },
    }],
    'space-before-blocks': ['error', 'always'],
    'brace-style': 'off',
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
  },
})
