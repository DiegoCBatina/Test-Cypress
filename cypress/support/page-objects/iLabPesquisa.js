// <reference types="Cypress" />

import iLabPesquisaElements from '../elements/iLabPesquisaElements'
const ilabelPesquisaElements = new iLabPesquisaElements
const url = Cypress.config("baseUrl")

class iLab {

    acessarSite() {
        cy.visit(url);
    }

    novaPesquisa(value) {
        cy.get(ilabelPesquisaElements.txtPesquisar()).type(value);
    }

    clicarPesquisar() {
        cy.get(ilabelPesquisaElements.btnPesquisar()).click();
    }

    validarResultado(value) {
        cy.contains(value).should('exist');
    }
}

export default iLab;