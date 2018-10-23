const sisLog = (knex, cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_data, cod_cnpj_1, cod_cnpj_2, cod_contrato) => {

	let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2, cod_data, cod_cnpj_1, cod_cnpj_2, cod_contrato};

	knex('log').insert(insertLog)
		.then(resultado => {
			knex.destroy();
			
		})
		.catch(erro => {
			console.log(erro);
			knex.destroy();
			
		});

	return false;
}

module.exports = () => {
	return sisLog;
};