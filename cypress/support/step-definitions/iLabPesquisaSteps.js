/* global Given, Then, When */

import iLabPesquisa from '../page-objects/iLabPesquisa'
const ilabPesquisa = new iLabPesquisa

Given("que acesso o Google", () => {
    ilabPesquisa.acessarSite();
})

Given("digito {} no campo de busca", (value) => {
    ilabPesquisa.novaPesquisa(value);
})

Given("clico no botão Pesquisa Google", () => {
    ilabPesquisa.clicarPesquisar();
})

Given("vejo os resultados de pesquisa do Google com o site {}", (value) => {
    ilabPesquisa.validarResultado(value);
})
