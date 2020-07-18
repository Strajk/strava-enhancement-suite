const sessionCookie = '_strava4_session';

Cypress.Cookies.defaults({
  whitelist: sessionCookie,
});

describe('strava-enhancement-suite', () => {
  before(() => {
    login();
  });

  it('walk through', () => {
    // Search
    visitAndWait('/athletes/search?utf8=%E2%9C%93&text=test&gsf=1');
    visitAndWait('/clubs/search?utf8=%E2%9C%93&sport_type=all&text=test&gsf=1');

    // Dashboard
    visitAndWait('/dashboard');

    // Segments
    visitAndWait('/athlete/segments/starred');
    visitAndWait('/athlete/segments/created');
    visitAndWait('/athlete/segments/hidden');
    visitAndWait('/segments/explore');
    visitAndWait('/segments/search');
    visitAndWait('/segments/search?utf8=%E2%9C%93&keywords=test&gsf=1');

    // Routes
    visitAndWait('/athlete/routes');
    visitAndWait('/athlete/routes?type=1');
    visitAndWait('/athlete/routes?type=2');
    visitAndWait('/routes/new?v2=true');

    // Goals
    visitAndWait('/athlete/goals');

    // Heatmaps
    visitAndWait('/athlete/heatmaps');

    // Training
    visitAndWait('/athlete/calendar');
    visitAndWait('/athlete/training');
    visitAndWait('/athlete/training?keywords=test&gsf=1');
    visitAndWait('/athletes/5041066/training/log?v2=true');
    visitAndWait('/athlete/analysis');
    visitAndWait('/athlete/fitness');

    // Training plans
    visitAndWait('/training-plans/cycling');

    // Challenges
    visitAndWait('/challenges');

    // Activities
    visitAndWait('/activities/3776381800'); // Not mine - bike
    visitAndWait('/activities/3776372936'); // Not mine - run
    visitAndWait('/activities/3774523674'); // Mine - run
  });
});

function visitAndWait(url) {
  cy.visit(url);
  cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
}

function login () {
  cy.getCookie(sessionCookie).then(cookie => {
    if (cookie) {
      cy.log('Already logged in, continuing');
    } else {
      cy.log('Logging in');
      const username = 'strajk@me.com';
      const password = Cypress.env('password_personal');
      if (!password) throw new Error('Missing password value, set using CYPRESS_password=...');

      cy.visit('/login');
      cy.get('#login_form #email').type(username);
      cy.get('#login_form #password').type(password);
      cy.get('#login-button').click();
      cy.get('#dashboard-athlete-sidebar').should('contain', 'Dolecek');
    }
  });
}
