/// <reference types="Cypress" />

describe('Smoke Tests - Front sur localhost:4200', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Vérifie la présence des champs et boutons de connexion', () => {
    cy.get('[data-cy="nav-link-login"]')
      .should('be.visible')
      .and('contain.text', 'Connexion')
      .click();

    cy.url({ timeout: 10000 }).should('include', '/#/login');

    // Champ email : fallback sur tous les inputs possibles
    cy.get('input[type="text"], input[type="email"], input[placeholder*="mail"], input[placeholder*="user"], input[name="email"], input[name="username"]', { timeout: 10000 })
      .first()
      .should('be.visible');

    // Champ mot de passe
    cy.get('[data-cy="login-input-password"]', { timeout: 10000 })
      .should('be.visible');

    // Bouton Se connecter
    cy.get('[data-cy="login-submit"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Se connecter');
  });

  it('Vérifie la présence des boutons d’ajout au panier quand connecté', () => {
    cy.get('[data-cy="nav-link-login"]').click();
    cy.url().should('include', '/#/login');

    // Saisie dans le champ email (fallback robuste)
    cy.get('input[type="text"], input[type="email"], input[placeholder*="mail"], input[placeholder*="user"], input[name="email"], input[name="username"]')
      .first()
      .type(Cypress.env('TEST_EMAIL'));

    cy.get('[data-cy="login-input-password"]')
      .type(Cypress.env('TEST_PASSWORD'));

    cy.get('[data-cy="login-submit"]').click();

    cy.url({ timeout: 15000 }).should('not.include', '/login');

    // Bouton "Mon panier" visible
    cy.get('[data-cy="nav-link-cart"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Mon panier');

    // Clic sur "Mon panier" et vérif URL
    cy.get('[data-cy="nav-link-cart"]').click();
    cy.url({ timeout: 10000 }).should('include', '/#/cart');

    // Retour à l'accueil
    cy.go('back');

    // Clic sur le bouton "Consulter"
    cy.get('[data-cy="product-home-link"]', { timeout: 10000 })
      .first()
      .should('be.visible')
      .and('contain.text', 'Consulter')
      .click();

    // Attente page produit
    cy.url({ timeout: 10000 }).should('include', '/products/');

    // Bouton "Ajouter au panier" visible sur page produit
    cy.contains('button', /ajouter au panier|ajouter/i, { timeout: 10000 })
      .should('be.visible');
  });
});