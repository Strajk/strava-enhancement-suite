module.exports = {
  extends: ['plugin:cypress/recommended'],
  env: {
    node: true,
  },
  rules: {
    'import/no-extraneous-dependencies': 'off', // Cypress tests uses dependencies that are installed just for dev env
  },
};
