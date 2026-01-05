describe('Gestion du stock dans l’interface produit', () => {
  const productId = 3; // Choisissez un produit en rupture ou quasi rupture

  beforeEach(() => {
    cy.loginUI(); // Connectez-vous si nécessaire
    cy.visit(`/#/products/${4}`);
  });

  it('Ne permet pas d\'ajouter une quantité supérieure au stock', () => {
    cy.get('[data-cy="detail-product-stock"]')
      .invoke('text')
      .then((text) => {
        const stock = parseInt(text.match(/\d+/)?.[0] || '0');
        expect(stock).to.be.lte(1); // stock faible pour le test

        // Saisie d’une quantité supérieure au stock (ex: stock+5)
        cy.get('[data-cy="detail-product-quantity"]').clear().type(`${stock + 5}`).blur();
        cy.get('[data-cy="detail-product-add"]').click();

        // Attendre la réponse API (vous pouvez intercepter si besoin)
        // Puis vérifier qu’un message d’erreur apparaît
        cy.get('[data-cy="error-message"]').should('be.visible')
          .and('contain.text', 'quantité disponible');

        // Vérifier que le stock affiché est resté correct (pas négatif)
        cy.get('[data-cy="detail-product-stock"]').invoke('text')
          .then((newText) => {
            const newStock = parseInt(newText.match(/\d+/)?.[0] || '0');
            expect(newStock).to.be.gte(0);
          });
      });
  });
});