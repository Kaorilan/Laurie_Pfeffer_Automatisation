

// Connexion via front (mock) + extraction du token localStorage
Cypress.Commands.add('loginUI', () => {
  cy.log(Cypress.env('FRONTEND_BASE'))

  cy.visit(Cypress.env('FRONTEND_BASE'));
  cy.get('body', { timeout: 10000 }).should('be.visible');
  cy.get('[data-cy="nav-link-login"]', { timeout: 10000 }).should('be.visible').click();
    
  cy.url({ timeout: 15000 }).should('include', '/#/login');

  cy.get('[data-cy="login-input-username"]', { timeout: 15000 })
    .type(Cypress.env('TEST_EMAIL'));

  cy.get('[data-cy="login-input-password"]')
    .type(Cypress.env('TEST_PASSWORD'));

  cy.get('[data-cy="login-submit"]')
    .click();

  cy.url({ timeout: 20000 }).should('not.include', '/login');

  // Extraction du token du localStorage (key "user")
  cy.window().then((win) => {
    const token = win.localStorage.getItem('user');
    if (token) {
      Cypress.env('authToken', token);
      cy.log('Token mock extrait du localStorage et stocké dans Cypress.env');
    } else {
      throw new Error('Token non trouvé dans localStorage après connexion');
    }
  });

  cy.get('[data-cy="nav-link-cart"]', { timeout: 15000 })
    .should('be.visible')
    .and('contain.text', 'Mon panier');
});

// Requête API avec token extrait
Cypress.Commands.add('apiRequest', ({ method, url, body, auth = true, failOnStatusCode = false }) => {
  const API_BASE = Cypress.env('API_BASE') || 'http://localhost:8081';
  const headers = {};
  const token = Cypress.env('authToken');
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return cy.request({
    method,
    url: `${API_BASE}${url}`,
    body,
    headers,
    failOnStatusCode,
  }).then(response => {
    return cy.wrap(response);
  });
});