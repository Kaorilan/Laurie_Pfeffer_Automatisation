describe('Smoke Tests - Front sur localhost:4200', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Vérifie présence des champs et boutons de connexion', () => {
    cy.contains('[data-cy="nav-link-login"]').click();
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('Vérifie présence boutons ajout panier quand connecté', () => {
    cy.apiLogin(); // Connexion API
    cy.visit('/');
    cy.get('button:contains("Ajouter au panier"), [data-cy="add-to-cart"]').should('have.length.gte', 1);
  });
});