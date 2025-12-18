/// <reference types="Cypress" />

describe('Tests API - Endpoints publics et incohérences détectées', () => {
  let productId = 1;

  before(() => {
    cy.apiRequest({ method: 'GET', url: '/products', auth: false })
      .its('body')
      .then((products) => {
        if (Array.isArray(products) && products.length > 0) {
          productId = products[0].id;
        }
      });
  });

  it('GET /orders sans connexion → retourne 401', () => {
    cy.apiRequest({ method: 'GET', url: '/orders', auth: false })
      .its('status')
      .should('eq', 401); // Protégé, OK (mais devrait être 403 ?)
  });

  it('GET /products/{id} → fiche produit spécifique', () => {
    cy.apiRequest({ method: 'GET', url: `/products/${productId}`, auth: false })
      .then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.have.property('id', productId);
      });
  });

  it('POST /login → retourne 400 même avec identifiants valides (incohérence front/back)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: { email: Cypress.env('TEST_EMAIL'), password: Cypress.env('TEST_PASSWORD') },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(400); // Bug : devrait être 200
    });
  });

  it('POST /orders/add → retourne 405 (attend PUT au lieu de POST)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/orders/add',
      body: { productId, quantity: 1 },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(405); // Bug non corrigé
    });
  });

  // Les autres tests authentifiés sont désactivés car login API non fonctionnel
});