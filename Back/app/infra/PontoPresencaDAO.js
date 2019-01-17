function PontoPresencaDAO(connection){
	this._connection = connection;
}

//---------------Querys de Pontos de Presença---------------//
//Lista os Pontos de Presença.
PontoPresencaDAO.prototype.listarPontoPresenca = function(callback){
	this._connection.query('SELECT gesac.cod_gesac, pid.nome, municipio.uf, municipio.nome_municipio, status.descricao, status.cod_status, GROUP_CONCAT(tipologia.nome SEPARATOR "; ") AS "tipologia" FROM gesac INNER JOIN pid ON gesac.cod_pid = pid.cod_pid INNER JOIN status ON gesac.cod_status = status.cod_status LEFT JOIN pid_tipologia ON pid.cod_pid = pid_tipologia.cod_pid LEFT JOIN tipologia ON pid_tipologia.cod_tipologia = tipologia.cod_tipologia INNER JOIN municipio ON pid.cod_ibge = municipio.cod_ibge GROUP BY pid_tipologia.cod_pid, gesac.cod_gesac ORDER BY gesac.cod_gesac', callback);
}

//Lista as informações de Ponto para visualização em Pontos de Presença.
PontoPresencaDAO.prototype.visualizarPontoPresenca = function(cod_gesac, callback){
	this._connection.query(`SELECT pid.nome, municipio.cod_ibge, municipio.uf, pid.cod_pid, gesac.cod_gesac, pid.inep, lote.num_contrato, lote.cod_lote, gesac.cod_velocidade,gesac.cod_instituicao_pag, gesac.cod_instituicao_resp FROM gesac INNER JOIN pid ON gesac.cod_pid = pid.cod_pid INNER JOIN municipio ON pid.cod_ibge = municipio.cod_ibge INNER JOIN lote ON gesac.cod_lote = lote.cod_lote WHERE gesac.cod_gesac = ${cod_gesac}`, callback);
}

//SELECT PARA O DETALHE DO PONTO DE PRESENÇA, Ruan que fez!
PontoPresencaDAO.prototype.detalhePontoPresenca = function(cod_gesac, callback){
    this._connection.query(`SELECT pid.nome, CONCAT(municipio.nome_municipio, " - ", municipio.uf) AS municipio, municipio.cod_ibge, municipio.uf, status.descricao, gesac.cod_status, gesac.cod_gesac, pid.cod_pid, pid.inep, empresa.empresa, contrato.num_contrato, lote.lote, velocidade.descricao AS velocidade, (SELECT instituicao_resp.sigla FROM instituicao_resp INNER JOIN gesac ON instituicao_resp.cod_instituicao = gesac.cod_instituicao_resp WHERE gesac.cod_gesac = ${cod_gesac}) AS instituicao_resp, (SELECT instituicao_resp.sigla FROM instituicao_resp INNER JOIN gesac ON instituicao_resp.cod_instituicao = gesac.cod_instituicao_pag WHERE gesac.cod_gesac = ${cod_gesac}) AS instituicao_pag FROM gesac INNER JOIN pid ON gesac.cod_pid = pid.cod_pid INNER JOIN status ON gesac.cod_status = status.cod_status INNER JOIN municipio ON pid.cod_ibge = municipio.cod_ibge INNER JOIN lote ON gesac.cod_lote = lote.cod_lote INNER JOIN contrato ON lote.num_contrato = contrato.num_contrato INNER JOIN empresa ON contrato.cnpj_empresa = empresa.cnpj_empresa INNER JOIN velocidade ON gesac.cod_velocidade = velocidade.cod_velocidade WHERE gesac.cod_gesac = ${cod_gesac}`, callback);
}

//Lista PID concatenado com base no cod_pid.
PontoPresencaDAO.prototype.listarPidLog = function(cod_pid, callback){
	this._connection.query(`SELECT CONCAT_WS('', cod_pid,";", cod_ibge,";", nome,";", inep) AS espelho FROM pid WHERE cod_pid = ${cod_pid}`, callback);
}

//Lista GESAC concatenado com base no cod_gesac.
PontoPresencaDAO.prototype.listarGesacLog = function(cod_gesac, callback){
	this._connection.query(`SELECT CONCAT_WS('', cod_gesac,";", cod_pid,";", cod_lote,";", cod_velocidade,";", cod_status,";", cod_instituicao_resp,";", cod_instituicao_pag) AS espelho FROM gesac WHERE cod_gesac = ${cod_gesac}`, callback);
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

//Lista GESAC concatenado com base no cod_gesac.
PontoPresencaDAO.prototype.listarEnderecoLog = function(cod_endereco, cod_pid, callback){
	this._connection.query(`SELECT CONCAT_WS('', cod_endereco,";", cod_pid,";", endereco,";", numero,";", bairro,";", cep,";", complemento,";", area,";", latitude,";", longitude,";", data_inicio,";", data_final) AS espelho FROM endereco WHERE cod_endereco = ${cod_endereco} AND cod_pid = ${cod_pid}`, callback);
}


//---------------Querys de Tipologia---------------//
//Lista as Tipologias de um Pontos de Presença.
PontoPresencaDAO.prototype.listarPontoTipologia = function(cod_gesac, callback){
	this._connection.query(`SELECT tipologia.* FROM gesac INNER JOIN pid ON gesac.cod_pid = pid.cod_pid INNER JOIN pid_tipologia ON pid.cod_pid = pid_tipologia.cod_pid INNER JOIN tipologia ON pid_tipologia.cod_tipologia = tipologia.cod_tipologia WHERE gesac.cod_gesac = ${cod_gesac}`, callback);
}


//---------------Querys de Contato---------------//
//Lista as informações de Contato para visualização em Pontos de Presença.
PontoPresencaDAO.prototype.visualizarPontoContato = function(cod_gesac, callback){
	this._connection.query(`SELECT pessoa.nome, contato.cargo, contato.obs, telefone.tipo, telefone.fone, telefone.email, max(interacao.data_interacao) AS data FROM gesac INNER JOIN contato ON gesac.cod_gesac = contato.cod_gesac INNER JOIN pessoa ON contato.cod_pessoa = pessoa.cod_pessoa LEFT JOIN telefone ON pessoa.cod_pessoa = telefone.cod_pessoa LEFT JOIN interacao ON pessoa.cod_pessoa = interacao.cod_pessoa AND interacao.tipo_interacao <> 1 AND interacao.tipo_interacao <> 3 WHERE contato.cod_gesac = ${cod_gesac} GROUP BY telefone.cod_telefone, telefone.cod_pessoa;`, callback);
}


//---------------Querys de Solicitação---------------//
//Lista as Solicitação com base no Id.
PontoPresencaDAO.prototype.listarSolicitacaoId = function(data_sistema, tipo_solicitacao, cod_gesac, callback){
	this._connection.query(`SELECT solicitacao.*, tipo_solicitacao.descricao FROM solicitacao INNER JOIN tipo_solicitacao ON solicitacao.tipo_solicitacao = tipo_solicitacao.tipo_solicitacao WHERE solicitacao.data_sistema = '${data_sistema}' AND solicitacao.tipo_solicitacao = ${tipo_solicitacao} AND solicitacao.cod_gesac = ${cod_gesac}`, callback);
}

 //Lista os tipos de Solicitações de um Status de um Ponto de Presença.
PontoPresencaDAO.prototype.listarTipoSolicitacaoStatus = function(cod_status, callback){
	this._connection.query(`SELECT * FROM permissao INNER JOIN tipo_solicitacao ON permissao.tipo_solicitacao = tipo_solicitacao.tipo_solicitacao WHERE permissao.cod_status = ${cod_status} and permissao.tipo_permissao <> 2`, callback);
}

 //Lista os tipos de Solicitações de um Status de um Ponto de Presença.
PontoPresencaDAO.prototype.listarTipoSolicitacao = function(cod_status, callback){
	this._connection.query(`SELECT * FROM tipo_solicitacao`, callback);
}


//---------------Querys de Analisar---------------//
//Lista as informações de Análise para visualização em Pontos de Presença.
PontoPresencaDAO.prototype.visualizarPontoAnalise = function(cod_gesac, callback){
	this._connection.query(`SELECT group_concat(tipo_solicitacao.tipo_solicitacao SEPARATOR ';') AS solicitacao, group_concat(tipo_solicitacao.descricao SEPARATOR ';') AS descricao, permissao.tipo_permissao, endereco.cod_endereco, endereco.endereco as enderecoAtual, endereco.numero, endereco.bairro, endereco.cep, endereco.complemento, endereco.area, endereco.latitude, endereco.longitude, analise.* FROM analise INNER JOIN gesac ON analise.cod_gesac = gesac.cod_gesac INNER JOIN status ON gesac.cod_status = status.cod_status INNER JOIN permissao ON status.cod_status = permissao.cod_status INNER JOIN tipo_solicitacao ON permissao.tipo_solicitacao = tipo_solicitacao.tipo_solicitacao INNER JOIN pid ON gesac.cod_pid = pid.cod_pid LEFT JOIN endereco ON pid.cod_pid = endereco.cod_pid AND endereco.data_final IS NULL WHERE analise.cod_gesac = ${cod_gesac} AND analise.aceite IS NULL` , callback);
}

//Lista uma Análise com base no Id.
PontoPresencaDAO.prototype.listarAnaliseId = function(cod_analise, callback){
	this._connection.query(`SELECT analise.*, empresa.empresa, pessoa.nome, tipo_solicitacao.descricao FROM analise INNER JOIN empresa ON analise.cnpj_empresa = empresa.cnpj_empresa LEFT JOIN pessoa ON analise.cod_pessoa_resp = pessoa.cod_pessoa INNER JOIN tipo_solicitacao ON analise.tipo_solicitacao = tipo_solicitacao.tipo_solicitacao WHERE analise.cod_analise = ${cod_analise}`, callback);
}

//Lista uma Análise concatenado com base no cod_analise.
PontoPresencaDAO.prototype.listarAnaliseLog = function(cod_analise, callback){
	this._connection.query(`SELECT CONCAT_WS('', cod_analise,";", cod_gesac,";", cnpj_empresa,";", tipo_solicitacao,";", cod_pessoa_resp,";", num_oficio,";", num_doc_sei,";", data_oficio,";", data_instalacao,";", data_analise,";", assinatura_resp,";", teste_vazao,";", estabelecimento,";", endereco,";", tipp,";", fotos,";", internet,";", tecnico_resp,";", obs,";", aceite,";", justificativa) AS espelho FROM analise WHERE cod_analise = ${cod_analise}`, callback);
}


//---------------Querys de Interação---------------//
//Lista os Tipos de Interação.
PontoPresencaDAO.prototype.ListarTipoInteracao = function(callback){
	this._connection.query('SELECT * FROM tipo_interacao', callback);
}

//Lista as informações de um Interação com base nos Ids.
PontoPresencaDAO.prototype.ListarInteracaoId = function(data, cod_gesac, callback){
	this._connection.query(`SELECT interacao.*, pessoa.nome, tipo_interacao.descricao FROM interacao LEFT JOIN pessoa ON interacao.cod_pessoa = pessoa.cod_pessoa INNER JOIN tipo_interacao ON interacao.tipo_interacao = tipo_interacao.tipo_interacao WHERE interacao.data = '${data}' AND interacao.cod_gesac = ${cod_gesac}`, callback);
}


//---------------Querys de Histórico---------------//
//Lista os dados do Histórico do Pontos de Presença
PontoPresencaDAO.prototype.listarHistoricoPontoPresenca = function(cod_gesac, callback){
	this._connection.query(`SELECT * FROM ((SELECT "solicitação" AS acao, solicitacao.data_sistema AS data, solicitacao.tipo_solicitacao, NULL AS cod_analise, usuario.nome FROM solicitacao LEFT JOIN log ON solicitacao.data_sistema = log.cod_data AND solicitacao.tipo_solicitacao = log.cod_int_1 AND solicitacao.cod_gesac = log.cod_int_2 AND log.nome_tabela = 'solicitacao' LEFT JOIN usuario ON log.cod_usuario = usuario.cod_usuario WHERE solicitacao.cod_gesac = ${cod_gesac}) UNION ALL (SELECT "interação", interacao.data, NULL, NULL, usuario.nome FROM interacao LEFT JOIN log ON interacao.data = log.cod_data AND interacao.cod_gesac = log.cod_int_1 AND log.nome_tabela = 'interacao' LEFT JOIN usuario ON log.cod_usuario = usuario.cod_usuario WHERE interacao.cod_gesac = ${cod_gesac}) UNION ALL (SELECT "análise", analise.data_analise, NULL, analise.cod_analise, usuario.nome FROM analise LEFT JOIN log ON analise.cod_analise = log.cod_int_1 AND log.operacao = 'u' AND log.nome_tabela = 'analise' LEFT JOIN usuario ON log.cod_usuario = usuario.cod_usuario WHERE analise.cod_gesac = ${cod_gesac})) AS tab ORDER BY tab.data DESC`, callback);
}


//---------------Querys de Status---------------//
 //Lista todos os Status de um Ponto de Presença.
 PontoPresencaDAO.prototype.listarTodosStatus = function(callback){
	this._connection.query('SELECT * FROM status', callback);
}


//---------------Querys de Observação de Ação---------------//
//Lista todas as Observações de Ação.
 PontoPresencaDAO.prototype.listarObsAcao = function(callback){
	this._connection.query('SELECT * FROM obs_acao', callback);
}

//Lista as Observações de Ação de um Ponto de presença.
PontoPresencaDAO.prototype.listarObsAcaoId = function(cod_gesac, callback){
	this._connection.query(`SELECT obs_acao.* FROM obs_acao INNER JOIN gesac_obs_acao ON obs_acao.cod_obs = gesac_obs_acao.cod_obs INNER JOIN gesac ON gesac_obs_acao.cod_gesac = gesac.cod_gesac WHERE gesac.cod_gesac = ${cod_gesac}`, callback);
}

//Lista as Observações de Ação de vários Ponto de presença.
PontoPresencaDAO.prototype.listarMultObsAcaoId = function(cod_gesac, callback){
	this._connection.query(`SELECT gesac.cod_gesac, GROUP_CONCAT(obs_acao.cod_obs) AS 'cod_obs' FROM gesac LEFT JOIN gesac_obs_acao ON gesac.cod_gesac = gesac_obs_acao.cod_gesac LEFT JOIN obs_acao ON gesac_obs_acao.cod_obs = obs_acao.cod_obs WHERE gesac.cod_gesac IN (${cod_gesac}) GROUP BY cod_gesac`, callback);
}

module.exports = () => {
	return PontoPresencaDAO;
};