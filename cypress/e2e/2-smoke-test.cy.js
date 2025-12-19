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
    cy.get('input[type="email"], [data-cy="login-input-email"]', { timeout: 10000 })
      .should('be.visible');

    cy.get('[data-cy="login-input-password"]', { timeout: 10000 })
      .should('be.visible');

    // 4. Vérification du bouton Se connecter
    cy.get('[data-cy="login-submit"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Se connecter');
  });

  it('Vérifie la présence des boutons d’ajout au panier quand connecté', () => {
    // 1. Aller sur la page login
    cy.get('[data-cy="nav-link-login"]')
      .click();

    cy.url().should('include', '/#/login');

    // 2. Saisie des identifiants
    cy.get('input[type="email"], [data-cy="login-input-email"]')
      .type(Cypress.env('TEST_EMAIL'));

    cy.get('[data-cy="login-input-password"]')
      .type(Cypress.env('TEST_PASSWORD'));

    // 3. Soumission
    cy.get('[data-cy="login-submit"]')
      .click();

    // 4. Attente redirection vers accueil
    cy.url({ timeout: 15000 }).should('not.include', '/login');

    // 5. Vérification que le bouton panier est visible (connexion réussie)
    cy.get('[data-cy="cart-button"], .cart-icon, a:contains("Panier")', { timeout: 10000 })
      .should('be.visible');

    // 6. Vérification des boutons "Ajouter au panier" sur les produits
    // Adapte le sélecteur selon ce que tu vois dans l'inspecteur sur la page d'accueil connectée
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="add-to-cart"], [data-cy="add-to-cart-btn"]').length > 0) {
        cy.get('[data-cy="add-to-cart"], [data-cy="add-to-cart-btn"]')
          .should('have.length.gte', 1)
          .and('be.visible');
      } else {
        // Fallback sur texte courant (à adapter)
        cy.contains('button', /ajouter au panier|ajouter/i, { timeout: 10000 })
          .should('have.length.gte', 1)
          .and('be.visible');
      }
    });
  });
});