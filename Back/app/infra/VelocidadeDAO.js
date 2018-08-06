function VelocidadeDAO(connection){
	this._connection = connection;
}

//Lista as Velocidades de um Lote.
VelocidadeDAO.prototype.listarVelocidadeLote = function(cod_lote, callback){
	this._connection.query(`SELECT * FROM velocidade WHERE cod_lote = ${cod_lote}`, callback);
}

module.exports = () => {
	return VelocidadeDAO;
};