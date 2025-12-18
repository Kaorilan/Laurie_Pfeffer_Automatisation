describe('Tests Fonctionnels Critiques (Front 4200)', { viewportWidth: 1280, viewportHeight: 720 }, () => {
  // Session unique pour tous les tests (évite reconnexion multiple)
  before(() => {
    cy.session('userSession', () => {
      cy.loginUI();  // Utilise la commande personnalisée avec Cypress.env
      cy.get('[data-cy="cart-button"], .cart-icon, a:contains("Panier"), [data-cy="nav-link-cart"]', { timeout: 10000 })
        .should('be.visible');
    });
  });

  it('1. Connexion complète via interface', () => {
    cy.visit('/');
    cy.loginUI();  // Tout le flow de connexion

    // Vérification succès : élément panier visible après connexion
    cy.get('[data-cy="cart-button"], .cart-icon, a:contains("Panier"), [data-cy="nav-link-cart"]', { timeout: 10000 })
      .should('be.visible');
  });

  it('3. Panier : ajout, décrément stock, limites quantité, vérif API', () => {
    cy.visit('/');  // Page d'accueil avec produits

    // Sélectionne le premier produit avec stock > 1 (adapte data-cy si différent)
    cy.get('[data-cy="product-card"], .product-item').first().within(() => {
      // Clique sur "Consulter" ou "Voir le produit"
      cy.contains('a, button', /consulter|voir|détails/i).click();
    });

    // Attente page produit chargée
    cy.url({ timeout: 10000 }).should('include', '/product/'); // ou '/produit/'

    // Récupère stock initial
    cy.get('[data-cy="stock"], .stock, :contains("Stock")', { timeout: 10000 })
      .invoke('text')
      .then((text) => {
        const initialStock = parseInt(text.match(/\d+/)?.[0] || '0', 10);
        expect(initialStock).to.be.gte(2, 'Pas assez de stock pour le test');

        // Test limite négative → doit être bloqué (valeur remise à 1 ou 0)
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('-5')
          .should('not.have.value', '-5'); // Souvent remis à 1

        // Test limite >20 → doit être capped à 20
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('25')
          .should('have.value', '20');

        // Ajout de 2 unités
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('2');

        cy.contains('button', /ajouter au panier|add to cart/i)
          .click();

        // Vérification ajout via API panier
        cy.apiRequest({ method: 'GET', url: '/orders' })
          .its('body')
          .should('satisfy', (body) => {
            const items = Array.isArray(body) ? body : body.items || [];
            return items.some(item => item.quantity >= 2);
          });

        // Recharge la page produit
        cy.reload();

        // Vérification stock diminué de 2
        cy.get('[data-cy="stock"], .stock')
          .invoke('text')
          .then((newText) => {
            const newStock = parseInt(newText.match(/\d+/)?.[0] || '0', 10);
            expect(newStock).to.eq(initialStock - 2);
          });

        // Champ disponibilité toujours présent
        cy.contains(/en stock|disponible|rupture de stock/i)
          .should('be.visible');
      });
  });
});describe('Tests Fonctionnels Critiques (Front 4200)', { viewportWidth: 1280, viewportHeight: 720 }, () => {
  // Session unique pour tous les tests (évite reconnexion multiple)
  before(() => {
    cy.session('userSession', () => {
      cy.loginUI();  // Utilise la commande personnalisée avec Cypress.env
      cy.get('[data-cy="cart-button"], .cart-icon, a:contains("Panier"), [data-cy="nav-link-cart"]', { timeout: 10000 })
        .should('be.visible');
    });
  });

  it('1. Connexion complète via interface', () => {
    cy.visit('/');
    cy.loginUI();  // Tout le flow de connexion

    // Vérification succès : élément panier visible après connexion
    cy.get('[data-cy="cart-button"], .cart-icon, a:contains("Panier"), [data-cy="nav-link-cart"]', { timeout: 10000 })
      .should('be.visible');
  });

  it('3. Panier : ajout, décrément stock, limites quantité, vérif API', () => {
    cy.visit('/');  // Page d'accueil avec produits

    // Sélectionne le premier produit avec stock > 1 (adapte data-cy si différent)
    cy.get('[data-cy="product-card"], .product-item').first().within(() => {
      // Clique sur "Consulter" ou "Voir le produit"
      cy.contains('a, button', /consulter|voir|détails/i).click();
    });

    // Attente page produit chargée
    cy.url({ timeout: 10000 }).should('include', '/product/'); // ou '/produit/'

    // Récupère stock initial
    cy.get('[data-cy="stock"], .stock, :contains("Stock")', { timeout: 10000 })
      .invoke('text')
      .then((text) => {
        const initialStock = parseInt(text.match(/\d+/)?.[0] || '0', 10);
        expect(initialStock).to.be.gte(2, 'Pas assez de stock pour le test');

        // Test limite négative → doit être bloqué (valeur remise à 1 ou 0)
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('-5')
          .should('not.have.value', '-5'); // Souvent remis à 1

        // Test limite >20 → doit être capped à 20
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('25')
          .should('have.value', '20');

        // Ajout de 2 unités
        cy.get('input[type="number"], [data-cy="quantity"]')
          .clear()
          .type('2');

        cy.contains('button', /ajouter au panier|add to cart/i)
          .click();

        // Vérification ajout via API panier
        cy.apiRequest({ method: 'GET', url: '/orders' })
          .its('body')
          .should('satisfy', (body) => {
            const items = Array.isArray(body) ? body : body.items || [];
            return items.some(item => item.quantity >= 2);
          });

        // Recharge la page produit
        cy.reload();

        // Vérification stock diminué de 2
        cy.get('[data-cy="stock"], .stock')
          .invoke('text')
          .then((newText) => {
            const newStock = parseInt(newText.match(/\d+/)?.[0] || '0', 10);
            expect(newStock).to.eq(initialStock - 2);
          });

        // Champ disponibilité toujours présent
        cy.contains(/en stock|disponible|rupture de stock/i)
          .should('be.visible');
      });
  });
});