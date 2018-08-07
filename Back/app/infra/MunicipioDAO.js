function MunicipioDAO(connection){
	this._connection = connection;
}

//---------------Querys de Municipios---------------//
//Lista os Municipios da UF.
MunicipioDAO.prototype.listarMunicipio = function(uf, callback){
	console.log(uf);
	this._connection.query(`SELECT cod_ibge, nome_municipio, uf FROM municipio WHERE uf = "${uf}"`, callback);
	// SELECT * FROM municipio ORDER BY uf, nome_municipio -- Select anterior, trocado dia 06/08/18
}


//---------------Querys de Estados(UF)/Municipios---------------//
//Lista as UFs.
MunicipioDAO.prototype.listarUf = function(callback){
	this._connection.query('SELECT DISTINCT(uf) FROM municipio ORDER BY uf', callback);
}

module.exports = () => {
	return MunicipioDAO;
};