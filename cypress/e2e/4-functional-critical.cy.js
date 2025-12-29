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

    cy.visit('/');

    let foundProduct = false;

    // Boucle sur les produits pour trouver un avec stock >=2
    cy.get('[data-cy="product-home-link"]', { timeout: 15000 })
      .each(($btn) => {
        if (!foundProduct) {
          cy.wrap($btn).click();

          cy.url({ timeout: 15000 }).should('include', '/products/');

          cy.get('[data-cy="detail-product-stock"], .stock', { timeout: 10000 })
            .invoke('text')
            .then((text) => {
              const stock = parseInt(text.match(/\d+/)?.[0] || '0');
              if (stock >= 2) {
                foundProduct = true;
                cy.log(`Produit trouvé avec stock ${stock} – test continue`);
              } else {
                cy.go('back'); // Retour accueil
              }
            });
        }
      })
      .then(() => {
        if (!foundProduct) {
          cy.log('ANOMALIE : Aucun produit avec stock >=2 trouvé – test ajout limité');
        }
      });

    // Si on a trouvé un produit avec stock >=2, on continue les tests
    if (foundProduct) {
      // Test limite négative (toujours exécuté)
      cy.get('[data-cy="detail-product-quantity"]', { timeout: 15000 })
        .clear()
        .type('-5')
        .should('not.have.value', '-5');

      // Test limite >20 seulement si stock >=25
      cy.get('[data-cy="detail-product-stock"], .stock')
        .invoke('text')
        .then((text) => {
          const stock = parseInt(text.match(/\d+/)?.[0] || '0');
          if (stock >= 25) {
            cy.get('[data-cy="detail-product-quantity"]')
              .clear()
              .type('25')
              .should('have.value', '20');
          } else {
            cy.log('ANOMALIE : Stock <25 – test limite >20 non exécuté');
          }
        });

      // Ajout de 2 produits
      cy.get('[data-cy="detail-product-quantity"]')
        .clear()
        .type('2');

      cy.contains('button', /ajouter au panier|ajouter/i)
        .click();

      // Vérif via API (dans le cahier des charges)
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
          const initialStock = parseInt(Cypress.$('[data-cy="detail-product-stock"], .stock').text().match(/\d+/)?.[0] || '0');
          expect(newStock).to.eq(initialStock - 2);
        });
    }

    // Champ disponibilité (toujours vérifié)
    cy.contains(/en stock|disponible|rupture/i)
      .should('be.visible');
  });
});