function ContratoDAO(connection){
	this._connection = connection;
}

//---------------Querys de Contratos ---------------//
//Lista os Contratos da tela de Contratos.
ContratoDAO.prototype.listarContrato = function(callback){
	this._connection.query('SELECT CONCAT(contrato.num_contrato, " - ", empresa.empresa) AS "nome_empresa", empresa.empresa, contrato.num_contrato, contrato.quant_pontos, contrato.processo_sei FROM contrato INNER JOIN empresa ON contrato.cnpj_empresa = empresa.cnpj_empresa', callback);
}

//Lista o Contrato com base no ID.
ContratoDAO.prototype.listarContratoId = function(num_contrato, callback){
	this._connection.query(`SELECT contrato.*, empresa.empresa FROM contrato INNER JOIN empresa ON contrato.cnpj_empresa = empresa.cnpj_empresa WHERE num_contrato = ${num_contrato}`, callback);
}

//Lista Contrato concatenada com base no num_contrato.
ContratoDAO.prototype.listarContratoLog = function(num_contrato, callback){
	this._connection.query(`SELECT CONCAT_WS('', num_contrato,";", cnpj_empresa,";", quant_pontos,";", processo_sei,";", data_inicio,";", data_fim) AS espelho FROM contrato WHERE num_contrato = ${num_contrato}`, callback);
}


//---------------Querys de Lotes ---------------//
//Lista os Lotes e suas Velocidades de um Contrato.
ContratoDAO.prototype.visualizarContratoLote = function(num_contrato, callback){
	this._connection.query(`SELECT * FROM lote INNER JOIN velocidade ON lote.cod_lote = velocidade.cod_lote WHERE num_contrato = ${num_contrato}`, callback);
}

module.exports = () => {
	return ContratoDAO;
};