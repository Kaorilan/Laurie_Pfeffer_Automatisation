const API_BASE = 'http://localhost:8081';

// Connexion via API (pour tests API, même si buguée)
Cypress.Commands.add('apiLogin', (email = Cypress.env('TEST_EMAIL'), password = Cypress.env('TEST_PASSWORD')) => {
  cy.request({
    method: 'POST',
    url: `${API_BASE}/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200) {
      const token = response.body.token || response.body.accessToken || response.body.jwt;
      if (token) {
        Cypress.env('authToken', token);
      }
    }
    return response;
  });
});

// Requête API générique
Cypress.Commands.add('apiRequest', ({ method, url, body, auth = true, failOnStatusCode = false }) => {
  const headers = {};
  const token = Cypress.env('authToken');
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }
  cy.request({
    method,
    url: `${API_BASE}${url}`,
    body,
    headers,
    failOnStatusCode,
  });
});

// Connexion via front (mockée, fonctionne)
Cypress.Commands.add('loginUI', () => {
  cy.visit('/');
  cy.get('[data-cy="nav-link-login"]')
    .should('be.visible')
    .click();

  cy.url({ timeout: 10000 }).should('include', '/#/login');

  cy.get('input[type="username"]')
    .type(Cypress.env('TEST_EMAIL'));

  cy.get('[data-cy="login-input-password"]')
    .type(Cypress.env('TEST_PASSWORD'));

  cy.get('[data-cy="login-submit"]')
    .click();

  cy.url({ timeout: 15000 }).should('not.include', '/login');

  cy.get('[data-cy="nav-link-cart"]', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'Mon panier');
});