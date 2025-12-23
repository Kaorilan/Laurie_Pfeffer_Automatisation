/// <reference types="Cypress" />

const API_BASE = Cypress.env('API_BASE') || 'http://localhost:8081';

describe('Tests API - 6 requêtes demandées (avec connexion mock front + token localStorage)', () => {
  let productId = 1;


  before(() => {
    return cy.apiRequest({ method: 'GET', url: '/products', auth: false })
      .its('body')
      .then((products) => {
        if (Array.isArray(products) && products.length > 0) {
          productId = products[0].id;
        }
      });
  });

  beforeEach(() => {
    cy.loginUI(); 
  });


  it('GET /orders sans connexion → retourne erreur pour données confidentielles', () => {
    return cy.apiRequest({ method: 'GET', url: '/orders', auth: false })
      .its('status')
      .should('eq', 401);
  });

  it('GET /orders avec connexion → récupère la liste des produits du panier', () => {
    cy.loginUI();
    return cy.apiRequest({ method: 'GET', url: '/orders', auth: true })
      .its('status')
      .should('eq', 200);
  });

  it('Vérification du token dans Cypress.env après login', () => {
    cy.loginUI();
    cy.then(() => {
      const token = Cypress.env('authToken');
      cy.log('Token actuel:', token);
      expect(token).to.exist;
    });
  });

  it('GET /products/{id} → récupère une fiche produit spécifique', () => {
    cy.apiRequest({ method: 'GET', url: `/products/${productId}`, auth: false })
      .its('status')
      .should('eq', 200);
  });

it('POST /login → utilisateur inconnu → retourne erreur', () => {
  cy.request({
    method: 'POST',
    url: `${API_BASE}/login`,
    body: { email: 'inconnu@test.fr', password: 'wrong' },
    failOnStatusCode: false,
  }).its('status').should('be.oneOf', [400, 401]);
});

it('POST /login → utilisateur connu → retourne 200', () => {
  cy.request({
    method: 'POST',
    url: `${API_BASE}/login`,
    body: { email: Cypress.env('TEST_EMAIL'), password: Cypress.env('TEST_PASSWORD') },
    failOnStatusCode: false,
  }).then((resp) => {
    expect(resp.status, 'Status devrait être 200 pour un login réussi').to.eq(200);
  });
});

  it('POST /orders/add → ajout produit disponible', () => {
  return cy.apiRequest({
    method: 'POST',
    url: '/orders/add',
    body: { productId, quantity: 1 },
    auth: true,
  }).its('status').should('eq', 200);
});

  it('POST /orders/add → ajout produit en rupture de stock', () => {
    return cy.apiRequest({
      method: 'POST',
      url: '/orders/add',
      body: { productId: 999, quantity: 1 },
      auth: true,
    }).its('status').should('not.eq', 200);
  });

  it('POST /reviews → ajouter un avis', () => {
    return cy.apiRequest({
      method: 'POST',
      url: '/reviews',
      body: { productId, rating: 5, comment: 'Test automatisé' },
      auth: true,
    }).its('status').should('be.oneOf', [200, 201]);
  });
});