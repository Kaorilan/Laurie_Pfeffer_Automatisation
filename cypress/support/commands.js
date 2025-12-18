// cypress/support/commands.js

const API_BASE = 'http://localhost:8081';

// Commande : Connexion via API (POST /login)
Cypress.Commands.add('apiLogin', (email = Cypress.env('TEST_EMAIL'), password = Cypress.env('TEST_PASSWORD')) => {
  cy.request({
    method: 'POST',
    url: `${API_BASE}/login`,
    body: { email, password },
    failOnStatusCode: false, // Important pour tester les erreurs 400/401
  }).then((response) => {
    // Si login réussi (200), on stocke le token pour les futures requêtes
    if (response.status === 200) {
      const token = response.body.token || response.body.accessToken || response.body.jwt;
      if (token) {
        Cypress.env('authToken', token);
        cy.log('Token JWT stocké pour les requêtes authentifiées');
      }
    }
    // On retourne toujours la réponse pour pouvoir faire .its('status') dans les tests
    return response;
  });
});

// Commande générique pour toutes les requêtes API
Cypress.Commands.add('apiRequest', ({ method, url, body, auth = true, failOnStatusCode = false }) => {
  const headers = {};

  // Ajout du token seulement si auth = true ET qu'un token existe
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

// Commande : Connexion via l'interface utilisateur (front)
Cypress.Commands.add('loginUI', () => {
  cy.visit('/');

  // Clique sur le lien de connexion
  cy.get('[data-cy="nav-link-login"]')
    .should('be.visible')
    .and('contain.text', 'Connexion')
    .click();

  // Saisie des identifiants depuis cypress.env.json
  cy.get('input[type="email"], input#email')
    .should('be.visible')
    .type(Cypress.env('TEST_EMAIL'));

  cy.get('input[type="password"], input#password')
    .should('be.visible')
    .type(Cypress.env('TEST_PASSWORD'));

  // Soumission du formulaire
  cy.get('button[type="submit"], button:contains("Connexion"), button:contains("Se connecter")')
    .should('be.visible')
    .click();

  // Optionnel : attente que l'utilisateur soit connecté (panier visible)
  cy.get('[data-cy="cart-button"], .cart-icon, a:contains("Panier"), [data-cy="nav-link-cart"]', { timeout: 10000 })
    .should('be.visible');
});