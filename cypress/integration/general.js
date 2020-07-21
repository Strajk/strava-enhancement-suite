const options = require('./../../extension/pages/options');

const sessionCookie = '_strava4_session';

Cypress.Cookies.defaults({
  whitelist: sessionCookie,
});

describe('strava-enhancement-suite', () => {
  before(() => {
    login();
  });

  it(options.repeated_segments.title, () => {
    cy.visit('/activities/3553439073/segments');
    cy.get('table th:contains("Count")');
  });

  it(options.upload_manual_ux.title, () => {
    cy.visit('/upload/manual?' + Cypress.$.param({
      distance: '7',
      distance_unit: 'mi',
      elapsed_time_hours: '2',
      elapsed_time_minutes: '12',
      elapsed_time_seconds: '34',
      elev_gain: '420',
      elevation_unit: 'ft',
      type: 'Ride',
      start_date: '07/07/2020',
      start_time_of_day: '13:37',
      name: 'Rolling Thunder',
      commute: 'true',
      trainer: 'true',
      visibility: 'followers_only',
      description: 'Rollin\nRollin\nRollin',
    }));

    cy.get('#new_activity').within(() => {
      cy.get('[name="activity[distance_unit]"]').should('have.value', 'mi').siblings('.selection').should('contain', 'miles');
      cy.get('[name="activity[elevation_unit]"]').should('have.value', 'ft').siblings('.selection').should('contain', 'feet');
      cy.get('[name="activity[type]"]').siblings('.selection').should('contain', 'Ride');
      cy.get('[name="activity[name]"]').should('have.value', 'Rolling Thunder');
      cy.get('[name="activity[description]"]').should('have.value', 'Rollin\nRollin\nRollin');
    });

    // TODO: Test incorrect inputs
    // eg. distance_unit: mile instead of mi
    // eg. elevation_unit: feet instead of ft
  });
});

function login () {
  cy.getCookie(sessionCookie).then(cookie => {
    if (cookie) {
      cy.log('Already logged in, continuing');
    } else {
      cy.log('Logging in');
      const username = Cypress.env('USERNAME');
      const password = Cypress.env('PASSWORD_TEST');
      if (!password) throw new Error('Missing password value, set using CYPRESS_PASSWORD_TEST=...');

      cy.visit('/login');
      cy.get('#login_form #email').type(username);
      cy.get('#login_form #password').type(password);
      cy.get('#login-button').click();
      cy.get('#dashboard-athlete-sidebar').should('contain', 'Joe Doe');
    }
  });
}
