function ExportarExcelDAO(connection){
	this._connection = connection;
}

//Lista os dados que serão exportados para uma planilha do excel.
ExportarExcelDAO.prototype.listarDadosExcel = function(callback){
	this._connection.query(`SELECT pid.cod_pid, gesac.cod_gesac, status.descricao AS status, municipio.uf, municipio.nome_municipio, municipio.cod_ibge, pid.nome AS ponto_presença, pid.inep, lote.lote, velocidade.descricao AS velocidade, velocidade.preco, i_resp.nome AS instituicao_responsavel, i_pag.nome AS instituicao_pagadora, GROUP_CONCAT(tipologia.nome) AS tipologias, endereco.endereco, endereco.numero, endereco.bairro, endereco.complemento, endereco.area, endereco.latitude, endereco.longitude FROM gesac INNER JOIN pid ON gesac.cod_pid = pid.cod_pid INNER JOIN status ON gesac.cod_status = status.cod_status INNER JOIN municipio ON pid.cod_ibge = municipio.cod_ibge INNER JOIN lote ON gesac.cod_lote = lote.cod_lote INNER JOIN velocidade ON gesac.cod_velocidade = velocidade.cod_velocidade INNER JOIN instituicao_resp AS i_resp ON gesac.cod_instituicao_resp = i_resp.cod_instituicao INNER JOIN instituicao_resp AS i_pag ON gesac.cod_instituicao_pag = i_pag.cod_instituicao LEFT JOIN pid_tipologia ON pid.cod_pid = pid_tipologia.cod_pid LEFT JOIN tipologia ON pid_tipologia.cod_tipologia = tipologia.cod_tipologia LEFT JOIN endereco ON pid.cod_pid = endereco.cod_pid WHERE endereco.data_final IS null GROUP BY gesac.cod_gesac`, callback);
}

module.exports = () => {
	return ExportarExcelDAO;
};