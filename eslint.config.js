export default [
  {
    ignores: ['node_modules', 'dist']
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      'arrow-spacing': ['error', { before: true, after: true }],
      'space-before-blocks': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'comma-dangle': ['error', 'never']
    }
  }
];
