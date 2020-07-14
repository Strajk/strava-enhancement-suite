const task = require('cypress-skip-and-only-ui/task');
const extensionLoader = require('cypress-browser-extension-plugin/loader');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => { // eslint-disable-line no-unused-vars
  on('task', task);
  on('before:browser:launch', extensionLoader.load({ source: './extension', alias: 'strava-enhancement-suite' }));
};
