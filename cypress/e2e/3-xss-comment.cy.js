describe('Sécurité - Test XSS dans espace commentaire (Stored)', () => {
  const payloads = [
    '<script>alert("XSS EcoBliss")</script>',
    '"><script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '<svg onload=alert(1)>',
    '\'"><script>alert(1)</script>',
  ];

  beforeEach(() => {
    cy.apiLogin();
    cy.visit(`/product/${1}`); // Page produit avec formulaire avis
  });

  payloads.forEach((payload) => {
    it(`Teste payload XSS : ${payload.substring(0, 30)}...`, () => {
      cy.get('textarea[name="comment"], #comment, [data-cy="review-text"]')
        .clear()
        .type(payload + '{enter}');

      cy.get('button:contains("Envoyer"), button[type="submit"]').click();

      // Recharge la page produit pour voir si Stored XSS s'exécute
      cy.visit(`/product/${1}`);

      // Si vulnérable → alert pop → Cypress capture
      cy.on('window:alert', (text) => {
        expect(text).to.contain('XSS');
        throw new Error('FAILLE XSS DÉTECTÉE ! Payload exécuté : ' + payload);
      });

      // Si pas d'alert → probablement safe
      cy.wait(1000); // Temps pour éventuel onload
    });
  });

  it('Doit échapper les balises HTML dans les avis affichés', () => {
    cy.visit(`/product/${1}`);
    cy.get('.review, .comment').should('not.contain', '<script>');
  });
});