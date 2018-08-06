//Carrega o modulo do knex.
var knex = require('knex');

//Cria conexão com o Banco de Dados MySql.
var connectKnex = function(){
    return knex({
        client: 'mysql',
        connection: {
            host : 'localhost',
            user : 'root',
            password : '',
            database : 'gesac_db'
        }
    });
}

//Retorna a conexão.
module.exports = function(){
	return connectKnex;
};