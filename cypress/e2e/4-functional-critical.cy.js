/// <reference types="cypress" />

describe('Tests Fonctionnels Critiques', () => {

  it('1. Connexion Front', () => {
    cy.visit('/');

    // Clique sur le bouton connexion
    cy.get('[data-cy="nav-link-login"]')
      .should('be.visible')
      .and('contain.text', 'Connexion')
      .click();

    // Page formulaire s'affiche
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible');
    cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible');
    cy.get('button[type="submit"]', { timeout: 10000 }).should('be.visible');

    // Entre les identifiants
    cy.get('input[type="email"]').type(Cypress.env('TEST_EMAIL'));
    cy.get('input[type="password"]').type(Cypress.env('TEST_PASSWORD'));

    // Soumission
    cy.get('button[type="submit"]').click();

    // Vérifie connexion réussie : bouton panier visible
    cy.get('[data-cy="cart-button"], .cart-icon, a:contains("Panier"), [data-cy="nav-link-cart"]', { timeout: 10000 })
      .should('be.visible');
  });

  it('2. Panier (connecté avec les infos ci-dessus)', () => {
    // On se connecte d'abord via le front
    cy.loginUI();

    cy.visit('/');
    
    // Clique sur un produit dont le stock > 1
    cy.get('[data-cy="product-card"], .product-item')
      .contains('button, a', /consulter|voir|détails/i)
      .first()
      .click();

    // Attente page produit
    cy.url({ timeout: 10000 }).should('include', '/product/');

    // Récupère le stock initial
    cy.get('[data-cy="stock"], .stock, :contains("Stock")')
      .invoke('text')
      .then((text) => {
        const initialStock = parseInt(text.match(/\d+/)?.[0] || '0');
        expect(initialStock).to.be.gte(2, 'Aucun produit avec stock > 1 trouvé');
        
        // Test limite négative
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('-5')
          .should('not.have.value', '-5'); // Doit être bloqué (souvent remis à 1)

        // Test limite > 20
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('25')
          .should('have.value', '20'); // Limité à 20

        // Ajoute 2 produits au panier
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('2');

        cy.contains('button', /ajouter au panier|ajouter/i)
          .click();

        // Vérifie l’ajout via API
        cy.apiRequest({ method: 'GET', url: '/orders', auth: false })
          .its('body')
          .should('satisfy', (body) => {
            const items = Array.isArray(body) ? body : body.items || [];
            return items.some(item => item.quantity >= 2);
          });

        // Recharge la page produit et vérifie que le stock a diminué de 2
        cy.reload();
        cy.get('[data-cy="stock"], .stock')
          .invoke('text')
          .then((newText) => {
            const newStock = parseInt(newText.match(/\d+/)?.[0] || '0');
            expect(newStock).to.eq(initialStock - 2);
          });

        // Vérifie le champ de disponibilité
        cy.contains(/en stock|disponible|rupture/i)
          .should('be.visible');
      });
  });
});