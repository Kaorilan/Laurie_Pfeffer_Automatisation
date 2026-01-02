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

    // Vérifie stock >1
    cy.get('[data-cy="detail-product-stock"]', { timeout: 15000 })
      .invoke('text')
      .then((text) => {
        const initialStock = parseInt(text.match(/\d+/)?.[0] || '0');
        expect(initialStock).to.be.gte(2);
      });

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

    // Vérif ajout via UI (badge panier ou page panier)
    cy.get('[data-cy="nav-link-cart"]')
      .should('contain.text', '(2)') // Badge quantité (adapte si différent)

    // Ou ouvre le panier
    cy.get('[data-cy="nav-link-cart"]').click();
    cy.url().should('include', '/cart');
    cy.contains('2') // Quantité dans le panier
      .should('be.visible');

    // Recharge produit et vérif stock diminué
    cy.go('back');
    cy.reload();

    cy.get('[data-cy="detail-product-stock"]')
      .invoke('text')
      .then((newText) => {
        const newStock = parseInt(newText.match(/\d+/)?.[0] || '0');
        const initialStock = parseInt(Cypress.$('[data-cy="detail-product-stock"]').text().match(/\d+/)?.[0] || '0');
        expect(newStock).to.eq(initialStock - 2);
      });

    // Champ disponibilité
    cy.contains('en stock', { timeout: 15000 })
      .should('be.visible');
  });
});