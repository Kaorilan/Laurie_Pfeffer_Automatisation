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

    // Attendre que le chargement soit fini
    cy.get('[data-cy="loading-spinner"]', { timeout: 10000 }).should('not.exist');

    cy.wait(10000);

    function clearCart() {
      // On retourne la chaîne Cypress pour synchroniser
      return cy.get('img[data-cy="cart-line-delete"]').then(($imgs) => {
        if ($imgs.length > 0) {
          cy.wrap($imgs[0]).scrollIntoView().click({ force: true });
          cy.wait(500);
          return clearCart();  // appel récursif avec return
        }
        cy.log('Panier vidé ✅');
        return; // fin de la promesse
      });
    }

    // Puis dans votre test :
    clearCart().then(() => {
      cy.log('Suppression terminée, on continue.');
      // Ici vos assertions sur le stock
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
      }); 
  });
});