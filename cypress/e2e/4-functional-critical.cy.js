/// <reference types="Cypress" />

describe('Tests Fonctionnels Critiques', () => {
  it('1. Connexion Front', () => {
    cy.loginUI(); // Connexion mock

    cy.get('[data-cy="nav-link-cart"]', { timeout: 15000 })
      .should('be.visible')
      .and('contain.text', 'Mon panier');
  });

  it('2. Panier (connecté avec les infos ci-dessus)', () => {
    cy.loginUI(); // Connexion mock

    // Visite directe du produit avec stock >20 (tu as confirmé /products/5)
    cy.visit('/#/products/5');

    cy.url({ timeout: 15000 }).should('include', '/products/5');

    // Récupère le stock initial (doit être >20)
    cy.get('[data-cy="detail-product-stock"], .stock', { timeout: 15000 })
      .invoke('text')
      .then((text) => {
        const initialStock = parseInt(text.match(/\d+/)?.[0] || '0');
        expect(initialStock).to.be.gte(25, 'Produit /products/5 doit avoir stock >=25 pour le test limite');

        // Test limite négative
        cy.get('input[type="number"], [data-cy="quantity"]', { timeout: 15000 })
          .clear()
          .type('-5')
          .should('not.have.value', '-5');

        // Test limite >20
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('25')
          .should('have.value', '20');

        // Ajout de 2 produits
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('2');

        cy.contains('button', /ajouter au panier|ajouter/i)
          .click();

        // Vérif via API (auth false car mock)
        cy.apiRequest({ method: 'GET', url: '/orders', auth: false })
          .then((resp) => {
            if (resp.status === 200) {
              const items = Array.isArray(resp.body) ? resp.body : resp.body.items || [];
              expect(items.some(item => item.quantity >= 2)).to.be.true;
            }
          });

        // Recharge et vérif stock diminué
        cy.reload();

        cy.get('[data-cy="detail-product-stock"], .stock')
          .invoke('text')
          .then((newText) => {
            const newStock = parseInt(newText.match(/\d+/)?.[0] || '0');
            expect(newStock).to.eq(initialStock - 2);
          });

        // Champ disponibilité
        cy.contains(/en stock|disponible|rupture/i)
          .should('be.visible');
      });
  });
});