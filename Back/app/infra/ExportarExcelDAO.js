function ExportarExcelDAO(connection){
	this._connection = connection;
}

//Lista os dados de Gesac para a primeira aba da planilha.
ExportarExcelDAO.prototype.listarGesacExcel = function(callback){
	this._connection.query('SELECT pid.cod_pid, gesac.cod_gesac, status.descricao AS status, municipio.uf, municipio.nome_municipio, municipio.cod_ibge, pid.nome AS ponto_presença, pid.inep, lote.lote, velocidade.descricao AS velocidade, velocidade.preco, i_resp.nome AS instituicao_responsavel, i_pag.nome AS instituicao_pagadora, GROUP_CONCAT(DISTINCT tipologia.nome) AS tipologias, GROUP_CONCAT(DISTINCT obs_acao.descricao) AS obs_acao, endereco.endereco, endereco.numero, endereco.bairro, endereco.cep, endereco.complemento, endereco.area, endereco.latitude, endereco.longitude FROM gesac INNER JOIN pid ON gesac.cod_pid = pid.cod_pid INNER JOIN status ON gesac.cod_status = status.cod_status INNER JOIN municipio ON pid.cod_ibge = municipio.cod_ibge INNER JOIN lote ON gesac.cod_lote = lote.cod_lote INNER JOIN velocidade ON gesac.cod_velocidade = velocidade.cod_velocidade INNER JOIN instituicao_resp AS i_resp ON gesac.cod_instituicao_resp = i_resp.cod_instituicao INNER JOIN instituicao_resp AS i_pag ON gesac.cod_instituicao_pag = i_pag.cod_instituicao LEFT JOIN pid_tipologia ON pid.cod_pid = pid_tipologia.cod_pid LEFT JOIN tipologia ON pid_tipologia.cod_tipologia = tipologia.cod_tipologia LEFT JOIN gesac_obs_acao ON gesac.cod_gesac = gesac_obs_acao.cod_gesac LEFT JOIN obs_acao ON gesac_obs_acao.cod_obs = obs_acao.cod_obs LEFT JOIN endereco ON pid.cod_pid = endereco.cod_pid WHERE endereco.data_final IS null GROUP BY gesac.cod_gesac', callback);
}

//Lista os dados de Gesac com base em cod_gesac para uma planilha.
ExportarExcelDAO.prototype.listarGesacIdExcel = function(cod_gesac, callback){
	this._connection.query(`SELECT pid.cod_pid, gesac.cod_gesac, status.descricao AS status, municipio.uf, municipio.nome_municipio, municipio.cod_ibge, pid.nome AS ponto_presença, pid.inep, lote.lote, velocidade.descricao AS velocidade, velocidade.preco, i_resp.nome AS instituicao_responsavel, i_pag.nome AS instituicao_pagadora, GROUP_CONCAT(DISTINCT tipologia.nome) AS tipologias, GROUP_CONCAT(DISTINCT obs_acao.descricao) AS obs_acao, endereco.endereco, endereco.numero, endereco.bairro, endereco.cep, endereco.complemento, endereco.area, endereco.latitude, endereco.longitude FROM gesac INNER JOIN pid ON gesac.cod_pid = pid.cod_pid INNER JOIN status ON gesac.cod_status = status.cod_status INNER JOIN municipio ON pid.cod_ibge = municipio.cod_ibge INNER JOIN lote ON gesac.cod_lote = lote.cod_lote INNER JOIN velocidade ON gesac.cod_velocidade = velocidade.cod_velocidade INNER JOIN instituicao_resp AS i_resp ON gesac.cod_instituicao_resp = i_resp.cod_instituicao INNER JOIN instituicao_resp AS i_pag ON gesac.cod_instituicao_pag = i_pag.cod_instituicao LEFT JOIN pid_tipologia ON pid.cod_pid = pid_tipologia.cod_pid LEFT JOIN tipologia ON pid_tipologia.cod_tipologia = tipologia.cod_tipologia LEFT JOIN gesac_obs_acao ON gesac.cod_gesac = gesac_obs_acao.cod_gesac LEFT JOIN obs_acao ON gesac_obs_acao.cod_obs = obs_acao.cod_obs LEFT JOIN endereco ON pid.cod_pid = endereco.cod_pid WHERE gesac.cod_gesac IN (${cod_gesac}) AND endereco.data_final IS null GROUP BY gesac.cod_gesac`, callback);
}

//Lista os dados de Contato para a segunda aba da planilha.
ExportarExcelDAO.prototype.listarContatoExcel = function(callback){
	this._connection.query('SELECT contato.cod_gesac, pessoa.cod_pessoa, pessoa.nome, contato.cargo, contato.obs, GROUP_CONCAT(telefone.fone SEPARATOR " ; ") AS telefones, GROUP_CONCAT(telefone.email SEPARATOR " ; ")  AS emails FROM contato LEFT JOIN gesac ON contato.cod_gesac = gesac.cod_gesac INNER JOIN pessoa ON contato.cod_pessoa = pessoa.cod_pessoa LEFT JOIN telefone ON pessoa.cod_pessoa = telefone.cod_pessoa GROUP BY contato.cod_contato ORDER BY contato.cod_gesac', callback);
}

//Lista os dados de Solicitação para a terceira aba da planilha.
ExportarExcelDAO.prototype.listarSolicitacaoExcel = function(callback){
	this._connection.query('SELECT solicitacao.cod_gesac, tipo_solicitacao.tipo_solicitacao, tipo_solicitacao.descricao AS solicitacao, status.descricao AS status, solicitacao.motivo, solicitacao.num_oficio, solicitacao.data_oficio, solicitacao.num_doc_sei, solicitacao.data_sistema FROM solicitacao INNER JOIN tipo_solicitacao ON solicitacao.tipo_solicitacao = tipo_solicitacao.tipo_solicitacao INNER JOIN status ON tipo_solicitacao.muda_cod_status = status.cod_status', callback);
}

//Lista os dados de Interação para a quarta aba da planilha.
ExportarExcelDAO.prototype.listarInteracaoExcel = function(callback){
	this._connection.query('SELECT interacao.cod_gesac, tipo_interacao.descricao, interacao.assunto, interacao.relato, interacao.data_interacao, interacao.data, pessoa.cod_pessoa, pessoa.nome FROM interacao INNER JOIN tipo_interacao ON interacao.tipo_interacao = tipo_interacao.tipo_interacao LEFT JOIN pessoa ON interacao.cod_pessoa = pessoa.cod_pessoa ORDER BY interacao.data DESC', callback);
}

//Lista os dados da Análise para a quinta aba da planilha.
ExportarExcelDAO.prototype.listarAnaliseExcel = function(callback){
	this._connection.query(`SELECT relatorio_analise.* FROM (SELECT analise.*, usuario.nome, tipo_solicitacao.descricao FROM analise LEFT JOIN log ON analise.cod_analise = log.cod_int_1 AND log.nome_tabela = 'analise' AND operacao = 'u' INNER JOIN usuario ON log.cod_usuario = usuario.cod_usuario INNER JOIN tipo_solicitacao ON tipo_solicitacao.tipo_solicitacao = substring_index(substring_index(log.espelho, ';', 4), ';', -1) WHERE aceite IS NOT NULL ORDER BY analise.cod_gesac) AS relatorio_analise INNER JOIN (SELECT max(analise.cod_analise) as ultima_analise, tipo_solicitacao.descricao FROM analise	LEFT JOIN log ON analise.cod_analise = log.cod_int_1 AND log.nome_tabela = 'analise' AND operacao = 'u'	INNER JOIN usuario ON log.cod_usuario = usuario.cod_usuario	INNER JOIN tipo_solicitacao ON tipo_solicitacao.tipo_solicitacao = substring_index(substring_index(log.espelho, ';', 4), ';', -1) WHERE aceite IS NOT NULL GROUP BY analise.cod_gesac, tipo_solicitacao.tipo_solicitacao ORDER BY analise.cod_gesac) AS ultima_analise ON relatorio_analise.cod_analise = ultima_analise.ultima_analise GROUP BY relatorio_analise.cod_gesac, relatorio_analise.descricao`, callback);
	// SELECT ANTERIOR (ABAIXO), TRAZIA TODAS AS ANÁLISES JÁ REALIZADAS NO SISTEMA. O SELECT ATUAL (ACIMA) TRAZ AS ÚLTIMAS ANÁLISES DE CADA UM DOS 4 TIPOS DE ANÁLISE
	// SELECT analise.*, usuario.nome, tipo_solicitacao.descricao FROM analise	LEFT JOIN log ON analise.cod_analise = log.cod_int_1 AND log.nome_tabela = 'analise' AND operacao = 'u'	INNER JOIN usuario ON log.cod_usuario = usuario.cod_usuario	INNER JOIN tipo_solicitacao ON tipo_solicitacao.tipo_solicitacao = substring_index(substring_index(log.espelho, ';', 4), ';', -1) WHERE aceite IS NOT NULL order by analise.cod_gesac;
}

module.exports = () => {
	return ExportarExcelDAO;
};