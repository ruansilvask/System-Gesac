function TipologiaDAO(connection){
	this._connection = connection;
}

//Lista as Tipologias.
TipologiaDAO.prototype.listarTipologia = function(callback){
	this._connection.query('SELECT * FROM tipologia', callback);
}

module.exports = () => {
	return TipologiaDAO;
};