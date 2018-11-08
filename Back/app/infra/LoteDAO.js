function LoteDAO(connection){
	this._connection = connection;
}

//Lista os Lotes de um Contrato.
LoteDAO.prototype.listarLoteContrato = function(num_contrato, callback){
	this._connection.query(`SELECT * FROM lote WHERE num_contrato = ${num_contrato}`, callback);
}

//Lista Lote concatenado com base no cod_lote.
LoteDAO.prototype.listarLoteLog = function(cod_lote, callback){
	this._connection.query(`SELECT CONCAT_WS('', cod_lote,";", num_contrato,";", lote) AS espelho FROM lote WHERE cod_lote = ${cod_lote}`, callback);
}

module.exports = () => {
	return LoteDAO;
};