//Carrega o modulo do mysql.
const mysql = require('mysql');

//Cria a conexão com o Banco de Dados.
const connectMYSQL = () => {
	return mysql.createConnection({
			host: 'localhost',
			user: 'root',
<<<<<<< HEAD
			password: 'root',
			database: 'gesac_db'
=======
			password: '',
			database: 'gesac_db' 
>>>>>>> 84494f07bac0034e55346c8e96223fb8344181bd
	});
};

//Retorna a conexão.
module.exports = () => {
	return connectMYSQL;
};