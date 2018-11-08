function RepresentanteLegalDAO(connection){
	this._connection = connection;
}

//Lista os representanteLegal com base no cod_representante.
RepresentanteLegalDAO.prototype.listarRepresentanteLegal = function(cod_representante, callback){
	this._connection.query(`SELECT * FROM representante_legal WHERE cod_representante = ${cod_representante}`, callback);
}

//Lista os Representantes Legais de uma Instituicao Responsavel.
RepresentanteLegalDAO.prototype.listarRepresentanteLegalInst = function(cod_instituicao, callback){
	this._connection.query(`SELECT representante_legal.*, pessoa.*, CASE WHEN representante_legal.status = "A" THEN "Ativo" WHEN representante_legal.status = "I" THEN "Inativo" END AS "statusII" FROM representante_legal INNER JOIN contato ON representante_legal.cod_contato = contato.cod_contato AND representante_legal.cod_pessoa = contato.cod_pessoa INNER JOIN pessoa ON contato.cod_pessoa = pessoa.cod_pessoa WHERE contato.cod_instituicao = ${cod_instituicao} ORDER BY representante_legal.status DESC`, callback);
}

//Lista Representante Legal concatenado com base no cod_representante.
RepresentanteLegalDAO.prototype.listarRepresentanteLegalLog = function(cod_representante, callback){
	this._connection.query(`SELECT CONCAT_WS('', cod_representante,";", cod_contato,";", cod_pessoa,";", data_inicial,";", data_final,";", status) AS espelho FROM representante_legal WHERE cod_representante = ${cod_representante}`, callback);
}

module.exports = () => {
	return RepresentanteLegalDAO;
};