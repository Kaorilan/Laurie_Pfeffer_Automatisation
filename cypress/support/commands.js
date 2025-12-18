const API_BASE = 'http://localhost:8081';

Cypress.Commands.add('apiLogin', (email = 'test2@test.fr', password = 'testtest') => {
  cy.request({
    method: 'POST',
    url: `${API_BASE}/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then((resp) => {
    if (resp.status === 200 && resp.body.token) {
      Cypress.env('authToken', resp.body.token); // Assume JWT ou session token
    }
    return resp;
  });
});

Cypress.Commands.add('apiRequest', ({ method, url, body, auth = true, failOnStatusCode = false }) => {
  const headers = auth && Cypress.env('authToken')
    ? { Authorization: `Bearer ${Cypress.env('authToken')}` }
    : {};

  cy.request({
    method,
    url: `${API_BASE}${url}`,
    body,
    headers,
    failOnStatusCode,
  });
});

Cypress.Commands.add('loginUI', () => {
  cy.visit('/');
  cy.get('[data-cy="nav-link-login"]').contains('Connexion').click();

  cy.get('input[type="email"], input#email').type(Cypress.env('TEST_EMAIL'));
  cy.get('input[type="password"], input#password').type(Cypress.env('TEST_PASSWORD'));

  cy.get('button[type="submit"], button:contains("Connexion")').click();
});