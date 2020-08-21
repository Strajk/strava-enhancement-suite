/* eslint-env node */

module.exports = {
  extends: ['eslint:recommended'],
  plugins: ['unicorn'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    StravaEnhancementSuiteOptions: 'writable',
    StravaEnhancementSuiteOptionsContexts: 'writable',
    jQuery: 'readonly',
    $: 'readonly',
  },
  ignorePatterns: [
    'extension/js/libs/*.js',
  ],
  rules: {
    // Overwrite few recommended options to avoid too many changes when introducing ESLint to the codebase
    quotes: ['error', 'single'],
    'quote-props': ['error', 'as-needed'],
    semi: ['error', 'always'],
    'comma-style': ['error', 'last'],
    'semi-style': ['error', 'last'],
    'comma-dangle': ['error', 'always-multiline'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'object-curly-spacing': ['error', 'always'],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],

    'no-redeclare': 'warn',

    'no-unused-vars': 'off',

    // Prefer event key over keyCode
    'unicorn/prefer-event-key': 'error', // only works on addEventListener, not with jQuery's .on
    'no-restricted-properties': ['error', { // quick'n'dirty solution for jQuery
      property: 'keyCode',
      message: 'Use .key instead of .keyCode',
    }],
  },
};
