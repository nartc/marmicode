describe('FrameComponent', () => {
  it('should apply horizontal scroll if code overflows', () => {
    cy.visit('/iframe.html?id=frame--overflow');
    cy.getByDataRole('code-block').should('contain', '# Get a farm.');
    cy.snapshot();
  });

  it('should highlight code on click', () => {
    cy.visit('/iframe.html?id=frame--highlight');
    cy.getByDataRole('code-highlight').should('not.exist');
    cy.snapshot();
    cy.getByDataRole('highlight-link').first().click();
    cy.getByDataRole('code-highlight').should('exist');
    cy.snapshot();
  });
});
