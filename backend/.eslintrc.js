module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    modules: "true",
  },
  rules:{
    'max-len': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
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
