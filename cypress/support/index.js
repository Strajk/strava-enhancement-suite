require('cypress-skip-and-only-ui/support');
require('cypress-browser-extension-plugin/commands')(Cypress, {
  alias: 'strava-enhancement-suite',
});
