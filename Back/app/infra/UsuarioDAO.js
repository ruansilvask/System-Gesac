function UsuarioDAO(connection){
	this._connection = connection;
}

//Lista todos os Usuários.
UsuarioDAO.prototype.listarUsuario = function(callback){
	this._connection.query('SELECT usuario.*, CASE WHEN usuario.status = "A" THEN "Ativo" WHEN usuario.status = "I" THEN "Inativo" END AS "statusII" FROM usuario', callback);
}

//Lista os Usuários com base no cod_usuario.
UsuarioDAO.prototype.listarUsuarioId = function(cod_usuario, callback){
	this._connection.query(`SELECT * FROM usuario WHERE cod_usuario = ${cod_usuario}`, callback);
}

module.exports = () => {
	return UsuarioDAO;
};