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

    // 2. Attente de la page dédiée /#/login
    cy.url({ timeout: 10000 }).should('include', '/#/login');

    // 3. Vérification des champs du formulaire
    cy.get('input[type="email"], input#email', { timeout: 10000 })
      .should('be.visible');

    cy.get('input[type="password"], input#password', { timeout: 10000 })
      .should('be.visible');

    cy.get('button[type="submit"], button:contains("Connexion"), button:contains("Se connecter")', { timeout: 10000 })
      .should('be.visible');
  });

  it('Vérifie la présence des boutons d’ajout au panier quand connecté', () => {
    // 1. Aller sur la page login
    cy.get('[data-cy="nav-link-login"]')
      .click();

    cy.url().should('include', '/#/login');

    // 2. Saisie des identifiants
    cy.get('input[type="email"]')
      .type(Cypress.env('TEST_EMAIL'));

    cy.get('input[type="password"]')
      .type(Cypress.env('TEST_PASSWORD'));

    // 3. Soumission
    cy.get('button[type="submit"]')
      .click();

    // 4. Attente redirection vers accueil (ou page principale)
    cy.url({ timeout: 15000 }).should('eq', 'http://localhost:4200/#/'); // ou .not.include('/login')

    // 5. Vérification bouton panier visible (connexion réussie)
    cy.get('[data-cy="cart-button"], .cart-icon, a:contains("Panier")', { timeout: 10000 })
      .should('be.visible');

    // 6. Vérification boutons "Ajouter au panier" sur les produits
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="add-to-cart"], [data-cy="add-to-cart-btn"]').length > 0) {
        cy.get('[data-cy="add-to-cart"], [data-cy="add-to-cart-btn"]')
          .should('have.length.gte', 1)
          .and('be.visible');
      } else {
        // Fallback sur texte courant
        cy.contains('button', /ajouter au panier|ajouter|add/i, { timeout: 10000 })
          .should('have.length.gte', 1)
          .and('be.visible');
      }
    });
  });
});