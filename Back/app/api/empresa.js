module.exports = function(app){
    let api = {};
    
//---------------Callbacks de Empresa---------------//
    //Lista as Empresas.
    api.listaEmpresa = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const empresaDAO = new app.infra.EmpresaDAO(connection);

        empresaDAO.listarEmpresa((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };
    
    //Lista as Empresas com base no cnpj_empresa.
    api.listaEmpresaCnpj = (req, res) => {
        const { cnpj_empresa } = req.params;

        if(cnpj_empresa){
            const connection = app.conexao.conexaoBD();
            const empresaDAO = new app.infra.EmpresaDAO(connection);
    
            empresaDAO.listarEmpresaCnpj(cnpj_empresa, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Lista as Empresas Pai.
    api.listaEmpresaPai = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const empresaDAO = new app.infra.EmpresaDAO(connection);

        empresaDAO.listarEmpresaPai((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Salva uma nova Empresa.
    api.salvaEmpresa = (req, res) => {
    	const knex = app.conexao.conexaoBDKnex();
        const empresa = req.body;
        
        knex('empresa').insert(empresa)
            .then(resultado => {
                knex.destroy();
                res.status(200).json(resultado[0]);
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                if(erro.errno == 1062){
                    res.status(500).send('Este CNPJ já está cadastrado.');
                } else {
                    res.status(500).send(app.api.erroPadrao());
                }
            });
    };

    //Atualiza os dados de uma Empresa.
    api.editaEmpresa = (req, res) => {
        const { cnpj_empresa } = req.params;

        if(cnpj_empresa){
            const knex = app.conexao.conexaoBDKnex();
            const empresa = req.body;
    
            knex('empresa').where('cnpj_empresa', cnpj_empresa).update(empresa)
                .then(resultado => {
                    knex.destroy();
                    res.status(200).end();
                })
                .catch(erro => {
                    console.log(erro);
                    knex.destroy();
                    res.status(500).send(app.api.erroPadrao());
                });
        } else { res.status(400).send(app.api.erroPadrao()); }
    }

    //Apaga uma Empresa.
    api.apagaEmpresa = (req, res) => {
        const { cnpj_empresa } = req.params;

        if(cnpj_empresa){
            const knex = app.conexao.conexaoBDKnex();

            knex('empresa').where('cnpj_empresa', cnpj_empresa).delete()
                .then(resultado => {
                    knex.destroy();
                    res.status(200).end();
                })
                .catch(erro => {
                    console.log(erro);
                    knex.destroy();
                    if(erro.errno == 1451){
                        res.status(500).send('Esta empresa não pode ser apagada pois existem outras informações associadas a ela.');
                    } else {
                        res.status(500).send(app.api.erroPadrao());
                    }
                });
        } else { res.status(400).send(app.api.erroPadrao()); }
    }


//---------------Callbacks de Contato---------------//
    //Lista as informações dos Contatos de uma Empresa.
    api.visualizaEmpresaContato = (req, res) => {
        const { cnpj_empresa } = req.params;

        if(cnpj_empresa){
            const connection = app.conexao.conexaoBD();
            const empresaDAO = new app.infra.EmpresaDAO(connection);
    
            empresaDAO.visualizarEmpresaContato(cnpj_empresa, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };
    
    return api;
};