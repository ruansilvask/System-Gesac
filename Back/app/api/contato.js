module.exports = function(app){
    let api = {};

    //Salva um novo Contato.
    api.salvaContato = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const { cnpj_empresa, cod_instituicao, cod_gesac, cargo, obs, cod_pessoa, nome } = req.body; 
        let contato;

        if(cnpj_empresa){
            contato = { cnpj_empresa, cod_pessoa, cargo, obs };
        } else if(cod_instituicao){
            contato =  { cod_instituicao, cod_pessoa, cargo, obs };
        } else if(cod_gesac){
            contato =  { cod_gesac, cod_pessoa, cargo, obs };
        }
        
        knex('contato').insert(contato)
            .then(resultado => {
                const pessoa = { nome };
                
                knex('pessoa').where('cod_pessoa', cod_pessoa).update(pessoa)
                    .then(result => {
                        knex.destroy();
                        res.status(200).end();
                    })
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    };
    
    //Lista os Contatos com base em uma String (nome) digitada.
    api.listaContato = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const contatoDAO = new app.infra.ContatoDAO(connection);
        const { nomePessoa } = req.params;

        contatoDAO.listarContato(nomePessoa, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Lista as informações de uma Pessoa e seus Telefones.
    api.listaContatoInfo = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const contatoDAO = new app.infra.ContatoDAO(connection);
        const { cod_pessoa } = req.params;

        contatoDAO.listarContatoInfo(cod_pessoa, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Lista os Contatos de uma Instituicao Responsavel.
    api.listaContatoInstituicao = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const contatoDAO = new app.infra.ContatoDAO(connection);
        const { cod_instituicao } = req.params;

        contatoDAO.listarContatoInstituicao(cod_instituicao, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Lista os Contatos de uma Empresa.
    api.listaContatoEmpresa = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const contatoDAO = new app.infra.ContatoDAO(connection);
        const { cnpj_empresa } = req.params;

        contatoDAO.listarContatoEmpresa(cnpj_empresa, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Lista os Contatos de um Pontos de Presença.
    api.listaContatoPonto = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const contatoDAO = new app.infra.ContatoDAO(connection);
        const { cod_gesac } = req.params;

        contatoDAO.listarContatoPonto(cod_gesac, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Lista as informações de um Contatos.
    api.listaContatoDados = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const contatoDAO = new app.infra.ContatoDAO(connection);
        const { cod_contato } = req.params;

        contatoDAO.listarContatoDados(cod_contato, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado[0]);
        });

        connection.end();
    };

    //Atualiza os dados de um Contato.
    api.editaContato = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const { cod_contato } = req.params;
        const { cargo, obs, cod_pessoa, nome } = req.body;

        const contato = { cargo, obs};

        knex('contato').where('cod_contato', cod_contato).update(contato)
            .then(resultado => {
                const pessoa = { nome };

                knex('pessoa').where('cod_pessoa', cod_pessoa).update(pessoa)
                    .then(result => {
                        knex.destroy();
                        res.status(200).end();
                    })
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    }

    //Apaga um Contato com base no cod_contato.
    api.apagaContato = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const { cod_contato } = req.params;

        knex('contato').where('cod_contato', cod_contato).delete()
            .then(resultado => {
                knex.destroy();
                res.status(200).end();
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                if(erro.errno == 1451){
                    res.status(500).send('Este contato não pode ser apagado pois existem outras informações associadas a ele.');
                } else {
                    res.status(500).send(app.api.erroPadrao());
                }
            });
    }


//---------------Callbacks de Telefone---------------//
    //Salva um novo Telefone/Email.
    api.salvaTelefone = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const telefone = req.body;
        
        knex('telefone').insert(telefone)
            .then(resultado => {
                knex.destroy();
                res.status(200).end();
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    };

    //Atualiza os dados de um Telefone.
    api.editaTelefone = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const { cod_telefone, cod_pessoa } = req.params;
        const telefone = req.body;

        knex('telefone').where('cod_telefone', cod_telefone).andWhere('cod_pessoa', cod_pessoa).update(telefone)
            .then(resultado => {
                knex.destroy();
                res.status(200).end();
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    }

    //Apaga um Telefone/Email.
    api.apagaTelefone = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const { cod_telefone, cod_pessoa } = req.params;

        knex('telefone').where('cod_telefone', cod_telefone).andWhere('cod_pessoa', cod_pessoa).delete()
            .then(resultado => {
                knex.destroy();
                res.status(200).end();
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    }


//---------------Callbacks de Pessoa---------------//
    //Salva uma nova Pessoa.
    api.salvaPessoa = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const pessoa = req.body;
        
        knex('pessoa').insert(pessoa)
            .then(resultado => {
                knex.destroy();
                res.status(200).json(resultado[0]);
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    };
        
    return api;
};