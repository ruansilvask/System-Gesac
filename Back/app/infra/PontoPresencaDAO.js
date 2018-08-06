function PontoPresencaDAO(connection){
	this._connection = connection;
}

//---------------Querys de Pontos de Presença---------------//
//Lista os Pontos de Presença.
PontoPresencaDAO.prototype.listarPontoPresenca = function(callback){
	this._connection.query('SELECT gesac.cod_gesac, pid.nome, municipio.uf, municipio.nome_municipio, status.descricao, status.cod_status, GROUP_CONCAT(tipologia.nome SEPARATOR "; ") AS "tipologia" FROM gesac INNER JOIN pid ON gesac.cod_pid = pid.cod_pid INNER JOIN status ON gesac.cod_status = status.cod_status left JOIN pid_tipologia ON pid.cod_pid = pid_tipologia.cod_pid left JOIN tipologia ON pid_tipologia.cod_tipologia = tipologia.cod_tipologia INNER JOIN municipio ON pid.cod_ibge = municipio.cod_ibge group by pid_tipologia.cod_pid, gesac.cod_gesac order by gesac.cod_gesac;', callback);
}

//Lista as informações de Ponto para visualização em Pontos de Presença.
PontoPresencaDAO.prototype.visualizarPontoPresenca = function(cod_gesac, callback){
	this._connection.query(`SELECT pid.nome, municipio.cod_ibge, municipio.uf, pid.cod_pid, gesac.cod_gesac, pid.inep, lote.num_contrato, lote.cod_lote, gesac.cod_velocidade,gesac.cod_instituicao_pag, gesac.cod_instituicao_resp FROM gesac INNER JOIN pid ON gesac.cod_pid = pid.cod_pid INNER JOIN municipio ON pid.cod_ibge = municipio.cod_ibge INNER JOIN lote ON gesac.cod_lote = lote.cod_lote WHERE gesac.cod_gesac = ${cod_gesac}`, callback);
}

//SELECT PARA O DETALHE DO PONTO DE PRESENÇA, Ruan que fez!
PontoPresencaDAO.prototype.detalhePontoPresenca = function(cod_gesac, callback){
    this._connection.query(`SELECT pid.nome, CONCAT(municipio.nome_municipio, " - ", municipio.uf) AS municipio, municipio.cod_ibge, municipio.uf, status.descricao, gesac.cod_status, gesac.cod_gesac, pid.cod_pid, pid.inep, empresa.empresa, contrato.num_contrato, lote.lote, velocidade.descricao AS velocidade, (SELECT instituicao_resp.sigla FROM instituicao_resp INNER JOIN gesac ON instituicao_resp.cod_instituicao = gesac.cod_instituicao_resp WHERE gesac.cod_gesac = ${cod_gesac}) AS instituicao_resp, (SELECT instituicao_resp.sigla FROM instituicao_resp INNER JOIN gesac ON instituicao_resp.cod_instituicao = gesac.cod_instituicao_pag WHERE gesac.cod_gesac = ${cod_gesac}) AS instituicao_pag FROM gesac INNER JOIN pid ON gesac.cod_pid = pid.cod_pid INNER JOIN status ON gesac.cod_status = status.cod_status INNER JOIN municipio ON pid.cod_ibge = municipio.cod_ibge INNER JOIN lote ON gesac.cod_lote = lote.cod_lote INNER JOIN contrato ON lote.num_contrato = contrato.num_contrato INNER JOIN empresa ON contrato.cnpj_empresa = empresa.cnpj_empresa INNER JOIN velocidade ON gesac.cod_velocidade = velocidade.cod_velocidade WHERE gesac.cod_gesac = ${cod_gesac}`, callback);
}


//---------------Querys de Endereco ---------------//
//Lista as informações de todos os Endereço de um Ponto de Presença.
PontoPresencaDAO.prototype.listarPontoEndereco = function(cod_gesac, callback){
	this._connection.query(`SELECT endereco.* FROM endereco INNER JOIN pid ON endereco.cod_pid = pid.cod_pid INNER JOIN gesac ON pid.cod_pid = gesac.cod_pid WHERE gesac.cod_gesac = ${cod_gesac} ORDER BY cod_endereco DESC`, callback);
}

//Lista as informações do Endereço atual de um Pontos de Presença.
PontoPresencaDAO.prototype.listarPontoEnderecoAtual = function(cod_gesac, callback){
	this._connection.query(`SELECT endereco.* FROM endereco INNER JOIN pid ON endereco.cod_pid = pid.cod_pid INNER JOIN gesac ON pid.cod_pid = gesac.cod_pid WHERE gesac.cod_gesac = ${cod_gesac} AND endereco.data_final IS NULL`, callback);
}


//---------------Querys de Tipologia---------------//
//Lista as Tipologias de um Pontos de Presença.
PontoPresencaDAO.prototype.listarPontoTipologia = function(cod_gesac, callback){
	this._connection.query(`SELECT tipologia.* FROM gesac INNER JOIN pid ON gesac.cod_pid = pid.cod_pid INNER JOIN pid_tipologia ON pid.cod_pid = pid_tipologia.cod_pid INNER JOIN tipologia ON pid_tipologia.cod_tipologia = tipologia.cod_tipologia WHERE gesac.cod_gesac = ${cod_gesac}`, callback);
}


//---------------Querys de Contato---------------//
//Lista as informações de Contato para visualização em Pontos de Presença.
PontoPresencaDAO.prototype.visualizarPontoContato = function(cod_gesac, callback){
	this._connection.query(`SELECT pessoa.nome, contato.cargo, contato.obs, telefone.tipo, telefone.fone, telefone.email, interacao.data FROM gesac INNER JOIN contato ON gesac.cod_gesac = contato.cod_gesac INNER JOIN pessoa ON contato.cod_pessoa = pessoa.cod_pessoa LEFT JOIN telefone ON pessoa.cod_pessoa = telefone.cod_pessoa LEFT JOIN interacao ON pessoa.cod_pessoa = interacao.cod_pessoa WHERE gesac.cod_gesac = ${cod_gesac};`, callback);
}


//---------------Querys de Solicitação---------------//
//Lista as Solicitação com base no Id.
PontoPresencaDAO.prototype.listarSolicitacaoId = function(data_sistema, tipo_solicitacao, cod_gesac, callback){
	this._connection.query(`SELECT solicitacao.*, tipo_solicitacao.descricao FROM solicitacao INNER JOIN tipo_solicitacao ON solicitacao.tipo_solicitacao = tipo_solicitacao.tipo_solicitacao WHERE solicitacao.data_sistema = '${data_sistema}' AND solicitacao.tipo_solicitacao = ${tipo_solicitacao} AND solicitacao.cod_gesac = ${cod_gesac}`, callback);
}

 //Lista os tipos de Solicitações de um Status de um Ponto de Presença.
PontoPresencaDAO.prototype.listarTipoSolicitacaoStatus = function(cod_status, callback){
	this._connection.query(`SELECT * FROM permissao INNER JOIN tipo_solicitacao ON permissao.tipo_solicitacao = tipo_solicitacao.tipo_solicitacao WHERE permissao.cod_status = ${cod_status} and permissao.tipo_permissao = 1`, callback);
}

 //Lista os tipos de Solicitações de um Status de um Ponto de Presença.
PontoPresencaDAO.prototype.listarTipoSolicitacao = function(cod_status, callback){
	this._connection.query(`SELECT * FROM tipo_solicitacao`, callback);
}


//---------------Querys de Analisar---------------//
//Lista as informações de Análise para visualização em Pontos de Presença.
PontoPresencaDAO.prototype.visualizarPontoAnalise = function(cod_gesac, callback){
	this._connection.query(`SELECT group_concat(tipo_solicitacao.tipo_solicitacao separator ';') as solicitacao, group_concat(tipo_solicitacao.descricao separator ';') as descricao, permissao.tipo_permissao, analise.* FROM analise inner join gesac on analise.cod_gesac = gesac.cod_gesac inner join status on gesac.cod_status = status.cod_status inner join permissao on status.cod_status = permissao.cod_status inner join tipo_solicitacao on permissao.tipo_solicitacao = tipo_solicitacao.tipo_solicitacao WHERE analise.cod_gesac = ${cod_gesac} AND analise.aceite is null`, callback);
}

//Lista uma Análise com base no Id.
PontoPresencaDAO.prototype.listarAnaliseId = function(cod_analise, callback){
	this._connection.query(`SELECT analise.*, empresa.empresa FROM analise INNER JOIN empresa ON analise.cnpj_empresa = empresa.cnpj_empresa WHERE analise.cod_analise = ${cod_analise}`, callback);
}


//---------------Querys de Interação---------------//
//Lista as informações de um Interação com base nos Ids.
PontoPresencaDAO.prototype.ListarInteracaoId = function(data, cod_gesac, callback){
	this._connection.query(`SELECT interacao.*, pessoa.nome FROM interacao LEFT JOIN pessoa ON interacao.cod_pessoa = pessoa.cod_pessoa WHERE interacao.data = '${data}' AND interacao.cod_gesac = ${cod_gesac}`, callback);
}


//---------------Querys de Histórico---------------//
//Lista os dados do Histórico do Pontos de Presença
PontoPresencaDAO.prototype.listarHistoricoPontoPresenca = function(cod_gesac, callback){
	this._connection.query(`SELECT * FROM ((SELECT "solicitação" AS acao, solicitacao.data_sistema AS data, solicitacao.tipo_solicitacao, NULL AS cod_analise FROM solicitacao WHERE solicitacao.cod_gesac = ${cod_gesac}) UNION ALL (SELECT "interação", interacao.data, NULL, NULL FROM interacao WHERE interacao.cod_gesac = ${cod_gesac}) UNION ALL (SELECT "analise", analise.data_analise, NULL, analise.cod_analise FROM analise WHERE analise.cod_gesac = ${cod_gesac})) AS tab ORDER BY tab.data DESC`, callback);
}


//---------------Querys de Status---------------//
 //Lista todos os Status de um Ponto de Presença.
 PontoPresencaDAO.prototype.listarTodosStatus = function(callback){
	this._connection.query(`SELECT * FROM status`, callback);
}

module.exports = () => {
	return PontoPresencaDAO;
};