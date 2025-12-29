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

    
    cy.get('a, button')
      .contains(/avis|reviews/i)
      .should('be.visible')
      .click();

    
    cy.url({ timeout: 15000 }).should('include', '/reviews'); 

    
    cy.get('[data-cy="review-input-comment"]', { timeout: 15000 })
      .should('be.visible');
  });

  payloads.forEach((payload) => {
    it(`Ne doit pas exécuter le payload XSS : ${payload.substring(0, 30)}...`, () => {
      cy.get('[data-cy="review-input-comment"]')
        .clear()
        .type(payload + '{enter}');

      
      cy.get('button[type="submit"], button:contains("Publier"), button:contains("Envoyer")', { timeout: 10000 })
        .click();

     
      cy.reload();

      
      cy.on('window:alert', (text) => {
        throw new Error(`FAILLE XSS DÉTECTÉE : ${text} avec payload ${payload}`);
      });

     
      cy.wait(2000);
    });
  });
});