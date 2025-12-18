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
    cy.visit(`/product/${1}`); // Adapte l'URL si besoin
  });

  payloads.forEach((payload) => {
    it(`Ne doit pas exécuter le payload XSS : ${payload.substring(0, 30)}...`, () => {
      cy.get('textarea[name="comment"], textarea#comment, [data-cy="review-text"]')
        .clear()
        .type(payload);

      cy.get('button:contains("Envoyer"), button[type="submit"]')
        .click();

      // Recharge pour vérifier stored XSS
      cy.reload();

      // Si alert pop → faille
      cy.on('window:alert', () => {
        throw new Error(`FAILLE XSS DÉTECTÉE avec payload : ${payload}`);
      });

      // Pas d'alert → safe
      cy.wait(1000);
    });
  });
});