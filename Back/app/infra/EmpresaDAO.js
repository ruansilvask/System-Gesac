function EmpresaDAO(connection){
	this._connection = connection;
}

//---------------Querys de Empresa---------------//
//Lista as Empresas.
EmpresaDAO.prototype.listarEmpresa = function(callback){
	this._connection.query('SELECT empresa.cnpj_empresa, empresa.empresa, municipio.nome_municipio, municipio.uf FROM empresa INNER JOIN municipio ON empresa.cod_ibge = municipio.cod_ibge', callback);
}

//Lista as Empresas com base no cnpj_empresa.
EmpresaDAO.prototype.listarEmpresaCnpj = function(cnpj_empresa, callback){
	this._connection.query(`SELECT empresa.*, empresa2.empresa AS empresa_pai, municipio.uf, municipio.nome_municipio FROM empresa INNER JOIN municipio ON empresa.cod_ibge = municipio.cod_ibge INNER JOIN empresa AS empresa2 ON empresa.cnpj_empresa_pai = empresa2.cnpj_empresa WHERE empresa.cnpj_empresa = ${cnpj_empresa}`, callback);
}

//Lista as Empresas Pai.
EmpresaDAO.prototype.listarEmpresaPai = function(callback){
	this._connection.query('SELECT cnpj_empresa, empresa FROM empresa WHERE cnpj_empresa = cnpj_empresa_pai', callback);
}


//---------------Querys de Contato---------------//
//Lista as informações dos Contatos de uma Empresa.
EmpresaDAO.prototype.visualizarEmpresaContato = function(cnpj_empresa, callback){
	this._connection.query(`SELECT pessoa.nome, contato.cargo, contato.obs, telefone.tipo, telefone.fone, telefone.email FROM empresa INNER JOIN contato ON empresa.cnpj_empresa = contato.cnpj_empresa INNER JOIN pessoa ON contato.cod_pessoa = pessoa.cod_pessoa	INNER JOIN telefone ON pessoa.cod_pessoa = telefone.cod_pessoa WHERE empresa.cnpj_empresa = ${cnpj_empresa}`, callback);
}

module.exports = () => {
	return EmpresaDAO;
};