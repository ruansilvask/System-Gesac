function InstituicaoResponsavelDAO(connection){
	this._connection = connection;
}

//Lista as Instituicoes Responsavel.
InstituicaoResponsavelDAO.prototype.listarInstituicaoResponsavel = function(callback){
	this._connection.query('SELECT cod_instituicao, cnpj_instituicao, nome, sigla, pagadora FROM instituicao_resp', callback);
}

//Lista as Instituicoes Pagadora (Tela de Ponto Presença).
InstituicaoResponsavelDAO.prototype.listarInstituicaoPagadora = function(callback){
	this._connection.query('SELECT cod_instituicao, nome, sigla as sigla_pagadora FROM instituicao_resp WHERE pagadora = 1', callback); //1 = True
}

//Lista os Gesacs relacionados a uma Instituicao Responsavel.
InstituicaoResponsavelDAO.prototype.listarInstituicaoGesac = function(cod_instituicao, callback){
	this._connection.query(`SELECT gesac.cod_gesac FROM gesac WHERE gesac.cod_instituicao_resp = ${cod_instituicao}`, callback);
}

//Lista as Instituicoes Responsavel com base no cod_instiuicao.
InstituicaoResponsavelDAO.prototype.listarInstituicaoResponsavelId = function(cod_instituicao, callback){
	this._connection.query(`SELECT instituicao_resp.*, municipio.uf, municipio.nome_municipio FROM instituicao_resp LEFT JOIN municipio ON instituicao_resp.cod_ibge = municipio.cod_ibge WHERE cod_instituicao = ${cod_instituicao}`, callback);
}

module.exports = () => {
	return InstituicaoResponsavelDAO;
};