/* eslint-env node */

module.exports = {
  'extends': ['eslint:recommended'],
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'env': {
    'browser': true,
    'es6': true,
  },
  'globals': {
    'StravaEnhancementSuiteOptions': true, // `true` to allow the variable to be overwritten
    'jQuery': false,
    '$': false,
  },
  'ignorePatterns': [
    'extension/js/libs/*.js',
  ],
  'rules': {
    // Overwrite few recommended options to avoid too many changes when introducing ESLint to the codebase
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-style': ['error', 'last'],
    'semi-style': ['error', 'last'],
    'comma-dangle': ['error', 'always-multiline'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'object-curly-spacing': ['error', 'always'],
    'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],

    'no-redeclare': 'warn',

    'no-unused-vars': 'off',
  },
};
