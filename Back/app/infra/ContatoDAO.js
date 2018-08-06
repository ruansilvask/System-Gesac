function ContatoDAO(connection){
	this._connection = connection;
}

//Lista os Contatos com base em uma String (nome) digitada.
ContatoDAO.prototype.listarContato = function(nomePessoa, callback){
	this._connection.query(`SELECT pessoa.cod_pessoa, pessoa.nome AS "nomePessoa", CONCAT(IFNULL(empresa.empresa, ''), IFNULL(instituicao_resp.nome, ''), IFNULL(pid.nome, '')) AS entidade FROM pessoa LEFT JOIN contato ON pessoa.cod_pessoa = contato.cod_pessoa LEFT JOIN empresa ON contato.cnpj_empresa = empresa.cnpj_empresa LEFT JOIN instituicao_resp ON contato.cod_instituicao = instituicao_resp.cod_instituicao LEFT JOIN gesac ON contato.cod_gesac = gesac.cod_gesac LEFT JOIN pid ON gesac.cod_pid = pid.cod_pid WHERE pessoa.nome LIKE '%${nomePessoa}%'`, callback);
}

//Lista as informações de uma Pessoa e seus Telefones.
ContatoDAO.prototype.listarContatoInfo = function(cod_pessoa, callback){
	this._connection.query(`SELECT pessoa.*, telefone.*, CASE WHEN telefone.tipo = "C" THEN "Casa" WHEN telefone.tipo = "T" THEN "Trabalho" WHEN telefone.tipo = "M" THEN "Móvel" END AS "tipoII" FROM pessoa INNER JOIN telefone ON pessoa.cod_pessoa = telefone.cod_pessoa WHERE pessoa.cod_pessoa = ${cod_pessoa} ORDER BY telefone.cod_telefone`, callback);
}

//Lista os Contatos de uma Instituicao Responsavel.
ContatoDAO.prototype.listarContatoInstituicao = function(cod_instituicao, callback){
	this._connection.query(`SELECT pessoa.cod_pessoa, contato.cod_contato, pessoa.nome, contato.cargo, contato.obs FROM instituicao_resp INNER JOIN contato ON instituicao_resp.cod_instituicao = contato.cod_instituicao INNER JOIN pessoa ON contato.cod_pessoa = pessoa.cod_pessoa WHERE instituicao_resp.cod_instituicao = ${cod_instituicao}`, callback);
}

//Lista os Contatos de uma Empresa.
ContatoDAO.prototype.listarContatoEmpresa = function(cnpj_empresa, callback){
	this._connection.query(`SELECT pessoa.cod_pessoa, contato.cod_contato, pessoa.nome, contato.cargo, contato.obs FROM empresa INNER JOIN contato ON empresa.cnpj_empresa = contato.cnpj_empresa INNER JOIN pessoa ON contato.cod_pessoa = pessoa.cod_pessoa WHERE empresa.cnpj_empresa = ${cnpj_empresa}`, callback);
}

//Lista os Contatos de um Pontos de Presença.
ContatoDAO.prototype.listarContatoPonto = function(cod_gesac, callback){
	this._connection.query(`SELECT pessoa.cod_pessoa, contato.cod_contato, pessoa.nome, contato.cargo, contato.obs FROM gesac INNER JOIN contato ON gesac.cod_gesac = contato.cod_gesac INNER JOIN pessoa ON contato.cod_pessoa = pessoa.cod_pessoa WHERE gesac.cod_gesac = ${cod_gesac}`, callback);
}

//Lista as informações de um Contatos.
ContatoDAO.prototype.listarContatoDados = function(cod_contato, callback){
	this._connection.query(`SELECT contato.cargo, contato.obs, pessoa.nome FROM contato INNER JOIN pessoa ON contato.cod_pessoa = pessoa.cod_pessoa WHERE cod_contato = ${cod_contato}`, callback);
}

module.exports = () => {
	return ContatoDAO;
};