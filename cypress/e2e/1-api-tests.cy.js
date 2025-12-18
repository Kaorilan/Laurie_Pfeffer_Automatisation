describe('Tests API - 6 requêtes principales (backend sur 8081)', () => {
  const EMAIL = 'test2@test.fr';
  const PASSWORD = 'testtest';
  let productId = 1; // À adapter ou récupérer dynamiquement

  before(() => {
    // Optionnel : récupérer un produit valide
    cy.apiRequest({ method: 'GET', url: '/products', auth: false }).then((resp) => {
      if (resp.body.length > 0) productId = resp.body[0].id;
    });
  });

  it('GET /orders sans connexion → 401 (pas 403)', () => {
    cy.apiRequest({ method: 'GET', url: '/orders', auth: false }).its('status').should('eq', 401);
  });

  it('GET /orders avec connexion → liste panier', () => {
    cy.apiLogin(EMAIL, PASSWORD);
    cy.apiRequest({ method: 'GET', url: '/orders' }).its('status').should('eq', 200);
  });

  it('GET /products/{id} → fiche produit', () => {
    cy.apiRequest({ method: 'GET', url: `/products/${productId}`, auth: false })
      .its('status').should('eq', 200);
  });

  it('POST /login → utilisateur inconnu → 401', () => {
    cy.apiLogin('inconnu@test.fr', 'wrong').its('status').should('eq', 401);
  });

  it('POST /login → utilisateur connu → 200', () => {
    cy.apiLogin(EMAIL, PASSWORD).its('status').should('eq', 200);
  });

  it('POST /orders/add → produit disponible + vérif méthode (devrait être POST)', () => {
    cy.apiLogin(EMAIL, PASSWORD);
    cy.apiRequest({
      method: 'POST',
      url: '/orders/add',
      body: { productId, quantity: 1 },
    }).then((resp) => {
      expect(resp.status).to.eq(200); // Si 405 ou autre → bug méthode toujours là
    });
  });

  it('POST /reviews → ajouter un avis', () => {
    cy.apiLogin(EMAIL, PASSWORD);
    cy.apiRequest({
      method: 'POST',
      url: '/reviews',
      body: { productId, rating: 5, comment: 'Test auto avis' },
    }).its('status').should('be.oneOf', [200, 201]);
  });
});