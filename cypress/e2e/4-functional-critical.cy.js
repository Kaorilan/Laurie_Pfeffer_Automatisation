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

    cy.visit('/#/products/5');

    cy.url({ timeout: 15000 }).should('include', '/products/5');

    // Récupère le stock initial (le chiffre est dans un span ou le parent)
    cy.get('[data-cy="detail-product-stock"]', { timeout: 15000 })
      .parent() // Remonte au parent si le chiffre est dans un span
      .invoke('text')
      .then((text) => {
        const initialStock = parseInt(text.match(/\d+/)?.[0] || '0');
        expect(initialStock).to.be.gte(2);

        // Test limite négative
        cy.get('[data-cy="detail-product-quantity"]', { timeout: 15000 })
          .clear()
          .type('-5')
          .should('not.have.value', '-5');

        // Test limite >20
        cy.get('[data-cy="detail-product-quantity"]')
          .clear()
          .type('25')
          .should('have.value', '20');

        // Ajout de 2 produits
        cy.get('[data-cy="detail-product-quantity"]')
          .clear()
          .type('2');

        cy.contains('button', /ajouter au panier|ajouter/i)
          .click();

        // Vérif via API
        cy.apiRequest({ method: 'GET', url: '/orders', auth: false })
          .then((resp) => {
            if (resp.status === 200) {
              const items = Array.isArray(resp.body) ? resp.body : resp.body.items || [];
              expect(items.some(item => item.quantity >= 2)).to.be.true;
            }
          });

        // Recharge et vérif stock diminué
        cy.reload();

        cy.get('[data-cy="detail-product-stock"]')
          .parent()
          .invoke('text')
          .then((newText) => {
            const newStock = parseInt(newText.match(/\d+/)?.[0] || '0');
            expect(newStock).to.eq(initialStock - 2);
          });

        // Champ disponibilité
        cy.contains('en stock', { timeout: 15000 })
          .should('be.visible');
      });
  });
});