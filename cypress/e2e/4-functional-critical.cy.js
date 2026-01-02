/// <reference types="Cypress" />

describe('Tests Fonctionnels Critiques', () => {
  it('1. Connexion Front', () => {
    cy.loginUI();

    cy.get('[data-cy="nav-link-cart"]', { timeout: 15000 })
      .should('be.visible')
      .and('contain.text', 'Mon panier');
  });

  it('2. Panier (connecté avec les infos ci-dessus)', () => {
    cy.loginUI();

    cy.visit('/#/cart');
    cy.url().should('include', '/cart');

    cy.get('[data-cy="cart-line-delete"]').then(($buttons) => {
      if ($buttons.length > 0) {
        cy.wrap($buttons).each(($btn) => {
          cy.wrap($btn).click();
          // Attendez la mise à jour du DOM si besoin
          cy.wait(500);
        });
      }
    });

    cy.visit('/#/products/5');
    cy.url().should('include', '/products/5');

    cy.wait(5000);

    cy.get('[data-cy="detail-product-stock"]')
      .invoke('text')
      .then((text) => {
        const initialStock = parseInt(text.match(/\d+/)?.[0] || '0');
        expect(initialStock).to.be.gte(2);

        cy.get('[data-cy="detail-product-quantity"]')
          .clear()
          .type('-5').blur();

        cy.get('[data-cy="detail-product-add"]')
          .click();

        cy.url()
          .should("match", /\/#\/products\/\d+/);

        cy.get('[data-cy="detail-product-quantity"]')
          .clear()
          .type('20').blur();

        cy.get('[data-cy="detail-product-add"]')
          .click();

        cy.url()
          .should('include', '/cart');

        cy.go('back');

        cy.url()
          .should('include', '/products/5');

        cy.get('[data-cy="detail-product-stock"]')
          .invoke('text')
          .then((newText) => {
            const newStock = parseInt(newText.match(/\d+/)?.[0] || '3');
            expect(newStock).to.eq(initialStock - 20);
          });

        cy.contains('en stock', { timeout: 15000 })
          .should('be.visible');
      });
  });
});