const options = require('./../../extension/pages/options');

const sessionCookie = '_strava4_session';

Cypress.Cookies.defaults({
  whitelist: sessionCookie,
});

describe('strava-enhancement-suite', () => {
  before(() => {
    login();
  });

  beforeEach(() => {
    cy.clearExtensionStorage('sync');
  });

  it('executeInstructionsFromUrl', () => {
    cy.visit('/dashboard', {
      qs: {
        '__SES.opts.repeated_segments': true,
        '__SES.opts.annual_achievements': 'unhighlight',
      },
    });
    cy.getExtensionStorage('sync').should('deep.eq', { repeated_segments: true, annual_achievements: 'unhighlight' });
  });

  it(options.activity_shortcuts.title, () => {
    // Open own activity
    cy.visit('/activities/3929744208');

    // typing "e" (in "teeest") inside textarea should not redirect to edit
    cy.get('.view-comments.button').click();
    cy.get('.mentionable-comment-field textarea').type('Teeest', { delay: 250 });
    cy.get('.lightbox-window .btn-close').click();

    // typing "e" elsewhere should
    cy.get('body').type('e');
    cy.url().should('include', '/edit');
  });

  it(options.submit_forms_with_keyboard.title, () => {
    const metaEnter = ['keydown', { key: 'Enter', metaKey: true }];

    // TODO: Upload: File

    { // Training editing
      const name = '.table-activity-edit:first #name';
      const description = '.table-activity-edit:first #description';

      cy.setExtensionStorage('sync', { submit_forms_with_keyboard: false });
      cy.visit('/athlete/training');
      cy.get('.quick-edit').first().click();
      cy.get(name).clear().type('Test name').trigger(...metaEnter);
      cy.get('.table-activity-edit:first').should('be.visible');
      cy.get(description).clear().type('Test description').trigger(...metaEnter);
      cy.get('.table-activity-edit:first').should('be.visible');

      cy.setExtensionStorage('sync', { submit_forms_with_keyboard: true });
      cy.visit('/athlete/training');
      cy.get('.quick-edit').first().click();
      cy.get(name).clear().type('Test name').trigger(...metaEnter);
      cy.get('.table-activity-edit:first').should('not.be.visible');
      cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get('.quick-edit').first().click();
      cy.get(description).clear().type('Test description').trigger(...metaEnter);
      cy.get('.table-activity-edit:first').should('not.be.visible');
    }

    { // Activity editing
      const url = '/activities/3806933378/edit';
      const name = '[name="activity[name]"]';
      const description = '[name="activity[description]"]';

      cy.setExtensionStorage('sync', { submit_forms_with_keyboard: false });
      cy.visit(url);
      cy.get(name).clear().type('Test name').trigger(...metaEnter);
      cy.url().should('include', '/edit');
      cy.get(description).clear().type('Test description').trigger(...metaEnter);
      cy.url().should('include', '/edit');

      cy.setExtensionStorage('sync', { submit_forms_with_keyboard: true });
      cy.visit(url);
      cy.get(name).clear().type('Test name').trigger(...metaEnter);
      cy.url().should('not.include', '/edit');
      cy.visit(url);
      cy.get(description).clear().type('Test description').trigger(...metaEnter);
      cy.url().should('not.include', '/edit');
    }

    { // Upload: Manual
      const name = '[name="activity[name]"]';
      const description = '[name="activity[description]"]';

      cy.setExtensionStorage('sync', { submit_forms_with_keyboard: false });
      cy.visit('/upload/manual');
      cy.get(name).clear().type('Test name').trigger(...metaEnter);
      cy.url().should('include', '/upload');
      cy.get(description).clear().type('Test description').trigger(...metaEnter);
      cy.url().should('include', '/upload');

      cy.setExtensionStorage('sync', { submit_forms_with_keyboard: true });
      cy.visit('/upload/manual');
      cy.get(name).clear().type('Test name').trigger(...metaEnter);
      cy.url().should('include', '/activities');
      cy.visit('/upload/manual');
      cy.get(description).clear().type('Test description').trigger(...metaEnter);
      cy.url().should('include', '/activities'); // API return conflict, but that doesn't matter for this test
    }

    { // Comments
      const url = '/activities/1731836154';
      cy.setExtensionStorage('sync', { submit_forms_with_keyboard: false });
      cy.visit(url);
      cy.get('.icon-comment').click();
      cy.get('.comments textarea').type('Wheee').trigger(...metaEnter);
      cy.get('.comments .media-actions button').should('not.have.attr', 'disabled'); // cause it was not sent

      cy.setExtensionStorage('sync', { submit_forms_with_keyboard: true });
      cy.visit(url);
      cy.get('.icon-comment').click();
      cy.get('.comments textarea').type('Wheee').trigger(...metaEnter);
      cy.get('.comments .media-actions button').should('have.attr', 'disabled'); // cause it was sent
    }


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
      const username = Cypress.env('USERNAME_TEST');
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
