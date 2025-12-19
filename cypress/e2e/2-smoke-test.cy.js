/// <reference types="Cypress" />

describe('Smoke Tests - Front sur localhost:4200', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Vérifie la présence des champs et boutons de connexion', () => {
    // 1. Clique sur le lien Connexion
    cy.get('[data-cy="nav-link-login"]')
      .should('be.visible')
      .and('contain.text', 'Connexion')
      .click();

    // 2. Attente de la page de connexion
    cy.url({ timeout: 10000 }).should('include', '/#/login');

    // 3. Vérification des champs (email supposé data-cy="login-input-email")
    cy.get('input[type="username"], [data-cy="login-input-username"]', { timeout: 10000 })
      .should('be.visible');

    cy.get('[data-cy="login-input-password"]', { timeout: 10000 })
      .should('be.visible');

    // 4. Vérification du bouton Se connecter
    cy.get('[data-cy="login-submit"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Se connecter');
  });

  it('Vérifie la présence des boutons d’ajout au panier quand connecté', () => {
    // 1. Aller sur page login
    cy.get('[data-cy="nav-link-login"]').click();
    cy.url().should('include', '/#/login');

    // 2. Saisie identifiants (username au lieu d'email)
    cy.get('input[type="username"], [data-cy="login-input-username"], input#username')
      .type(Cypress.env('TEST_EMAIL')); // On met quand même l'email dedans

    cy.get('[data-cy="login-input-password"]')
      .type(Cypress.env('TEST_PASSWORD'));

    // 3. Soumission
    cy.get('[data-cy="login-submit"]').click();

    // 4. Attente redirection accueil
    cy.url({ timeout: 15000 }).should('not.include', '/login');

    // Bouton panier visible
    cy.get('[data-cy="nav-link-cart"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Mon panier');

    // Clic sur le panier et vérif URL
    cy.get('[data-cy="nav-link-cart"]').click();
    cy.url({ timeout: 10000 }).should('include', '/#/cart');

    // Retour à l'accueil
    cy.go('back');

    // Clic sur un produit depuis l'accueil
    cy.get('[data-cy="product-card"], .product-item, .card') // Adapte si besoin
      .first()
      .within(() => {
        cy.contains('a, button', /consulter|voir|détails/i).click();
      });

    // Attente page produit
    cy.url({ timeout: 10000 }).should('include', '/product/');

    // Bouton "Ajouter au panier" visible sur la page produit
    cy.contains('button', /ajouter au panier|ajouter/i, { timeout: 10000 })
      .should('be.visible');
  });
});