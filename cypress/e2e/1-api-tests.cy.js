/// <reference types="Cypress" />

const API_BASE = Cypress.env('API_BASE') || 'http://localhost:8081';

describe('Tests API - requêtes demandées (avec connexion mock front + token localStorage)', () => {
  let productId;


  before(() => {
    cy.loginUI();
     cy.apiRequest({ method: 'GET', url: '/products', auth: false })
      .its('body')
      .then((products) => {
        if (Array.isArray(products) && products.length > 0) {
          productId = products[0].id;
        }
      });
  });


  it('GET /orders sans connexion → retourne erreur pour données confidentielles', () => {
     cy.apiRequest({ method: 'GET', url: '/orders', auth: false })
      .its('status')
      .should('eq', 401);
  });

  it('GET /orders avec connexion → récupère la liste des produits du panier', () => {
    
     cy.apiRequest({ method: 'GET', url: '/orders', auth: true })
      .its('status')
      .should('eq', 200);
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
      body: { username: 'inconnu@test.fr', password: 'wrong' },
      failOnStatusCode: false,
    }).its('status').should('be.oneOf', [400, 401]);
  });

  it('POST /login → utilisateur connu → retourne 200', () => {
    cy.request({
      method: 'POST',
      url: `${API_BASE}/login`,
      body: { username: Cypress.env('TEST_EMAIL'), password: Cypress.env('TEST_PASSWORD') },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status, 'Status devrait être 200 pour un login réussi').to.eq(200);
    });
  });



  it('POST /orders/add → ajout produit disponible', () => {
   cy.apiRequest({
      method: 'POST',
      url: '/orders/add',
      body: { product: 5, quantity: 1 },
      auth: true,
    }).its('status').should('not.eq', 200);
  });


  it('PUT /orders/add → ajout produit disponible', () => {
   cy.apiRequest({
    method: 'PUT',
    url: '/orders/add',
    body: { product: 5, quantity: 1 },
    auth: true,
  }).its('status').should('eq', 200);
});

  it('POST /orders/add → ajout produit en rupture de stock', () => {
     cy.apiRequest({
      method: 'POST',
      url: '/orders/add',
      body: { productId: 4, quantity: 5 },
      auth: true,
    }).its('status').should('not.eq', 200);
  });

  it('PUT /orders/add → ajout produit en rupture de stock', () => {
    cy.apiRequest({
      method: 'PUT',
      url: '/orders/add',
      body: { productId: 4, quantity: 5 },
      auth: true,
    }).then((resp) => {
      expect(resp.status).to.not.eq(200);
      expect([400, 404, 409, 422]).to.include(resp.status);
    });
  });


  before(() => {
  cy.loginUI(); // Authentification réelle pour stocker token valide
});

it('POST /reviews → ajouter un avis avec token valide', () => {
  cy.apiRequest({
    method: 'POST',
    url: '/reviews',
    body: { 
      productId: productId, 
      rating: 5, 
      comment: 'Test automatisé Cypress' 
    },
    auth: true,
  }).then((resp) => {
    expect(resp.status).to.eq(200);
  });
});
});