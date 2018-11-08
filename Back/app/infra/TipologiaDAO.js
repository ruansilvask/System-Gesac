function TipologiaDAO(connection){
	this._connection = connection;
}

//Lista as Tipologias.
TipologiaDAO.prototype.listarTipologia = function(callback){
	this._connection.query('SELECT * FROM tipologia', callback);
}

//Lista Tipologia concatenada com base no cod_tipologia.
TipologiaDAO.prototype.listarTipologiaLog = function(cod_tipologia, callback){
	this._connection.query(`SELECT CONCAT_WS('', cod_tipologia,";", nome) AS espelho FROM tipologia WHERE cod_tipologia = ${cod_tipologia}`, callback);
}

module.exports = () => {
	return TipologiaDAO;
};