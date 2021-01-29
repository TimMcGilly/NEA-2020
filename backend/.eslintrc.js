module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],

  },
  rules:{
    'max-len': 'off'

  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-typescript/base',
  ],
  ignorePatterns: [
    '.eslintrc.js',
  ],
};
