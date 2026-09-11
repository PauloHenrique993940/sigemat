describe("operação do SIGEMAT", () => {
  it("permite acessar o painel e navegar até os CICOMs", () => {
    cy.visit("/");
    cy.get('input[type="email"]').type("servidor@ssp.ba.gov.br");
    cy.get('input[type="password"]').type("senha-de-teste");
    cy.contains("button", "Acessar ambiente").click();

    cy.contains("CICOMs cadastrados").should("be.visible");
    cy.contains("button", "CICOMs").click({ force: true });
    cy.contains("h1", "CICOMs").should("be.visible");
    cy.contains("CICOM Alagoinhas").should("be.visible");
  });
});
