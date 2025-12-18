describe('Tests API - 6 requêtes principales (backend sur 8081)', () => {
  const API_BASE = 'http://localhost:8081';

  let productId = 1; // Valeur par défaut au cas où

  // Récupération d'un ID produit valide une seule fois au début
  before(() => {
    cy.apiRequest({ method: 'GET', url: '/products', auth: false })
      .its('body')
      .then((products) => {
        if (Array.isArray(products) && products.length > 0) {
          productId = products[0].id;
          cy.log(`Produit ID sélectionné pour les tests : ${productId}`);
        } else {
          cy.log('Aucun produit trouvé, utilisation de l’ID par défaut : 1');
        }
      });
  });

  it('GET /orders sans connexion → 401 (et non 403)', () => {
    cy.apiRequest({ method: 'GET', url: '/orders', auth: false })
      .its('status')
      .should('eq', 401); // Anomalie héritée de Marie : devrait être 403 ?
  });

  it('GET /orders avec connexion → liste panier', () => {
    cy.apiLogin(); // Utilise les vars de cypress.env.json
    cy.apiRequest({ method: 'GET', url: '/orders' })
      .then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.be.an('array').or.an('object'); // Selon structure API
      });
  });

  it('GET /products/{id} → fiche produit spécifique', () => {
    cy.apiRequest({ method: 'GET', url: `/products/${productId}`, auth: false })
      .then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.have.property('id', productId);
        // Optionnel : vérifier présence de champs clés
        expect(resp.body).to.have.keys(['name', 'description', 'price', 'stock', 'image']);
      });
  });

  it('POST /login → utilisateur inconnu → 401', () => {
    cy.apiLogin('inconnu@test.fr', 'wrong')
      .its('status')
      .should('eq', 401);
  });

  it('POST /login → utilisateur connu → 200', () => {
    cy.apiLogin() // Utilise TEST_EMAIL / TEST_PASSWORD du cypress.env.json
      .then((resp) => {
        expect(resp.status).to.eq(200);
        // Vérifie que le token est bien renvoyé (si JWT)
        if (resp.body.token) {
          expect(resp.body.token).to.be.a('string');
        }
      });
  });

  it('POST /orders/add → produit disponible (doit être POST, pas PUT)', () => {
    cy.apiLogin();
    cy.apiRequest({
      method: 'POST',
      url: '/orders/add',
      body: { productId, quantity: 1 },
    }).then((resp) => {
      // Si toujours 405 → bug non corrigé
      expect(resp.status).to.eq(200, 'L’endpoint /orders/add attend toujours un PUT au lieu de POST');
    });
  });

  it('POST /reviews → ajouter un avis', () => {
    cy.apiLogin();
    cy.apiRequest({
      method: 'POST',
      url: '/reviews',
      body: { productId, rating: 5, comment: 'Test automatisé Cypress - avis positif' },
    }).then((resp) => {
      expect(resp.status).to.be.oneOf([200, 201]);
    });
  });
});