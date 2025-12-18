describe('Tests Fonctionnels Critiques (Front 4200)', () => {
  const EMAIL = 'test2@test.fr';
  const PASSWORD = 'testtest';

  it('1. Connexion complète via interface', () => {
    cy.visit('/');
    cy.contains('button', /connexion|login/i).click();
    cy.get('input[type="email"]').type(EMAIL);
    cy.get('input[type="password"]').type(PASSWORD);
    cy.get('button[type="submit"]').click();

    // Vérification connexion réussie
    cy.contains('button', /panier|cart/i).should('be.visible');
  });

  it('3. Panier : ajout, décrément stock, limites quantité, vérif API', () => {
    cy.apiLogin();
    cy.visit('/');

    // Choisir un produit avec stock > 1
    cy.get('[data-cy="product-card"]').first().within(() => {
      cy.contains('button', /consulter|voir/i).click();
    });

    // Récupérer stock initial
    cy.get('[data-cy="stock"], .stock').invoke('text').then((text) => {
      const initialStock = parseInt(text.match(/\d+/)?.[0]);
      expect(initialStock).to.be.gte(2);

      // Test limite négative
      cy.get('input[type="number"]').clear().type('-5');
      cy.get('input[type="number"]').should('not.have.value', '-5'); // Doit être corrigé

      // Test limite >20
      cy.get('input[type="number"]').clear().type('25');
      cy.get('input[type="number"]').should('have.value', '20');

      // Ajout 2 produits
      cy.get('input[type="number"]').clear().type('2');
      cy.contains('button', /ajouter au panier/i).click();

      // Vérif via API
      cy.apiRequest({ method: 'GET', url: '/orders' })
        .its('body')
        .should('satisfy', (items) => items.some(item => item.quantity >= 2));

      // Recharge page produit → stock diminué
      cy.reload();
      cy.get('[data-cy="stock"], .stock')
        .invoke('text')
        .then((newText) => {
          const newStock = parseInt(newText.match(/\d+/)?.[0]);
          expect(newStock).to.eq(initialStock - 2);
        });

      // Champ disponibilité présent
      cy.contains(/en stock|disponible|rupture/i).should('be.visible');
    });
  });
});