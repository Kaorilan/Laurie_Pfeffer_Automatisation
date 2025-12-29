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
    cy.loginUI();

    cy.visit('/#/reviews');

    cy.url({ timeout: 15000 }).should('include', '/reviews/');
  });

  payloads.forEach((payload) => {
    it(`Ne doit pas exécuter le payload XSS : ${payload.substring(0, 30)}...`, () => {
      
      cy.get('[data-cy="review-input-comment"]', { timeout: 15000 })
        .should('be.visible')
        .clear()
        .type(payload + '{enter}');

      // Bouton envoyer (adapte si tu as un data-cy, sinon par texte)
      cy.get('button[type="submit"], button:contains("Publier")', { timeout: 10000 })
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