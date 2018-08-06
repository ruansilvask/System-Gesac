function LoteDAO(connection){
	this._connection = connection;
}

//Lista os Lotes de um Contrato.
LoteDAO.prototype.listarLoteContrato = function(num_contrato, callback){
	this._connection.query(`SELECT * FROM lote WHERE num_contrato = ${num_contrato}`, callback);
}

module.exports = () => {
	return LoteDAO;
};