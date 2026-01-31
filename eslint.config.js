export default [
  {
    ignores: ['dist', 'node_modules', 'functions/node_modules'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        import: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
