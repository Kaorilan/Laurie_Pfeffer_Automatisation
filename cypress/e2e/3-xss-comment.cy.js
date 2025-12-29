/// <reference types="Cypress" />

describe('Sécurité - Test XSS dans espace commentaire/avis', () => {
  const payloads = [
    '<script>alert("XSS")</script>',
    '"><script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '<svg onload=alert("XSS")>',
    'javascript:alert("XSS")',
  ];

  beforeEach(() => {
    cy.loginUI(); // Connexion mock (fonctionne)

    // Va sur une page produit (adapte l'ID si besoin)
    cy.visit('/#/products/1'); // ou clique sur un produit depuis accueil

    cy.url({ timeout: 15000 }).should('include', '/products/');
  });

  payloads.forEach((payload) => {
    it(`Ne doit pas exécuter le payload XSS : ${payload.substring(0, 30)}...`, () => {
      // Champ commentaire (ton data-cy exact)
      cy.get('[data-cy="review-input-comment"]', { timeout: 15000 })
        .should('be.visible')
        .clear()
        .type(payload + '{enter}');

      // Bouton envoyer (adapte si tu as un data-cy, sinon par texte)
      cy.get('button[type="submit"], button:contains("Envoyer"), button:contains("Publier")', { timeout: 10000 })
        .click();

      // Recharge la page produit pour vérifier stored XSS
      cy.reload();

      // Si alert pop → faille XSS
      cy.on('window:alert', (text) => {
        throw new Error(`FAILLE XSS DÉTECTÉE : ${text} avec payload ${payload}`);
      });

      // Pas d'alert après attente → safe
      cy.wait(2000);
    });
  });
});