describe('Smoke Tests - Front sur localhost:4200', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Vérifie présence des champs et boutons de connexion', () => {
    // Le lien Connexion est un <a> avec data-cy="nav-link-login"
    cy.get('[data-cy="nav-link-login"]')
      .should('be.visible')
      .and('contain.text', 'Connexion')
      .click();

    // Vérification que le formulaire de login s'affiche
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible');
    cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible');
    cy.get('button[type="submit"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', /connexion|se connecter|login/i');
  });

  it('Vérifie présence boutons ajout panier quand connecté', () => {
    // Connexion via API (plus rapide et fiable que le front)
    cy.apiLogin(); // Utilise TEST_EMAIL / TEST_PASSWORD depuis cypress.env.json

    // Recharge la page d'accueil pour que l'UI reflète la session connectée
    cy.visit('/');
    // cy.reload(); // Alternative si déjà sur /

    // Vérification : au moins un bouton "Ajouter au panier" visible
    // On cherche par texte OU par data-cy potentiel
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="add-to-cart"], [data-cy="add-to-cart-btn"]').length > 0) {
        cy.get('[data-cy="add-to-cart"], [data-cy="add-to-cart-btn"]')
          .should('have.length.gte', 1)
          .and('be.visible');
      } else {
        // Fallback sur le texte du bouton
        cy.contains('button', /ajouter au panier|ajouter|add to cart/i, { timeout: 10000 })
          .should('have.length.gte', 1)
          .and('be.visible');
      }
    });
  });
});