function MunicipioDAO(connection){
	this._connection = connection;
}

//---------------Querys de Municipios---------------//
//Lista os Municipios.
MunicipioDAO.prototype.listarMunicipio = function(callback){
	this._connection.query('SELECT * FROM municipio ORDER BY uf, nome_municipio', callback);
}


//---------------Querys de Estados(UF)/Municipios---------------//
//Lista as UFs.
MunicipioDAO.prototype.listarUf = function(callback){
	this._connection.query('SELECT DISTINCT(uf) FROM municipio ORDER BY uf', callback);
}

module.exports = () => {
	return MunicipioDAO;
};