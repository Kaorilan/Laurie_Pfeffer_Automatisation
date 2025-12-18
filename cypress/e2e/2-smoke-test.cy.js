/// <reference types="Cypress" />

describe('Smoke Tests - Front sur localhost:4200', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Vérifie présence des champs et boutons de connexion', () => {
    cy.get('[data-cy="nav-link-login"]')
      .should('be.visible')
      .and('contain.text', 'Connexion')
      .click();

    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible');
    cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible');
    cy.get('button[type="submit"]', { timeout: 10000 }).should('be.visible');
  });

  it('Vérifie présence boutons ajout au panier quand connecté', () => {
    cy.loginUI(); // Connexion via front (mock, fonctionne)

    cy.visit('/');

    cy.contains('button', /ajouter au panier|ajouter/i, { timeout: 10000 })
      .should('have.length.gte', 1)
      .and('be.visible');
  });
});