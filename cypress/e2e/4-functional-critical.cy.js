/// <reference types="Cypress" />

describe('Tests Fonctionnels Critiques', () => {
  it('1. Connexion complète via interface', () => {
    cy.loginUI();

    cy.get('[data-cy="cart-button"], .cart-icon, a:contains("Panier")', { timeout: 10000 })
      .should('be.visible');
  });

  it('3. Panier : ajout, stock, limites quantité', () => {
    cy.loginUI();
    cy.visit('/');

    cy.get('[data-cy="product-card"]').first().within(() => {
      cy.contains('a, button', /consulter|voir|détails/i).click();
    });

    cy.url().should('include', '/product/');

    cy.get('[data-cy="stock"], .stock')
      .invoke('text')
      .then((text) => {
        const initialStock = parseInt(text.match(/\d+/)?.[0] || '0');
        expect(initialStock).to.be.gte(2);

        // Limites
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('-5')
          .should('not.have.value', '-5');

        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('25')
          .should('have.value', '20');

        // Ajout 2
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('2');

        cy.contains('button', /ajouter au panier/i).click();

        // Stock diminué après reload
        cy.reload();
        cy.get('[data-cy="stock"], .stock')
          .invoke('text')
          .then((newText) => {
            const newStock = parseInt(newText.match(/\d+/)?.[0] || '0');
            expect(newStock).to.eq(initialStock - 2);
          });

        // Disponibilité visible
        cy.contains(/en stock|disponible|rupture/i).should('be.visible');
      });
  });
});