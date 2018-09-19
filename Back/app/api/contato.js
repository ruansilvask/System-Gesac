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
    
    //Lista os Contatos com base em uma String (nome ou telefone) digitada.
    api.listaContato = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const contatoDAO = new app.infra.ContatoDAO(connection);
        const { contato } = req.params;

        contatoDAO.listarContato(contato, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Lista as informações de uma Pessoa e seus Telefones.
    api.listaContatoInfo = (req, res) => {
        const { cod_pessoa } = req.params;

        if(cod_pessoa){
            const connection = app.conexao.conexaoBD();
            const contatoDAO = new app.infra.ContatoDAO(connection);

            contatoDAO.listarContatoInfo(cod_pessoa, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });

            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Lista os Contatos de uma Instituicao Responsavel.
    api.listaContatoInstituicao = (req, res) => {
        const { cod_instituicao } = req.params;

        if(cod_instituicao){
            const connection = app.conexao.conexaoBD();
            const contatoDAO = new app.infra.ContatoDAO(connection);

            contatoDAO.listarContatoInstituicao(cod_instituicao, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });

            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Lista os Contatos de uma Empresa.
    api.listaContatoEmpresa = (req, res) => {
        const { cnpj_empresa } = req.params;

        if(cnpj_empresa){
            const connection = app.conexao.conexaoBD();
            const contatoDAO = new app.infra.ContatoDAO(connection);

            contatoDAO.listarContatoEmpresa(cnpj_empresa, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });

            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Lista os Contatos de um Pontos de Presença.
    api.listaContatoPonto = (req, res) => {
        const { cod_gesac } = req.params;

        if(cod_gesac){
            const connection = app.conexao.conexaoBD();
            const contatoDAO = new app.infra.ContatoDAO(connection);

            contatoDAO.listarContatoPonto(cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });

            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Lista as informações de um Contatos.
    api.listaContatoDados = (req, res) => {
        const { cod_contato } = req.params;

        if(cod_contato){
            const connection = app.conexao.conexaoBD();
            const contatoDAO = new app.infra.ContatoDAO(connection);

            contatoDAO.listarContatoDados(cod_contato, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado[0]);
            });

            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Atualiza os dados de um Contato.
    api.editaContato = (req, res) => {
        const { cod_contato } = req.params;

        if(cod_contato){
            const knex = app.conexao.conexaoBDKnex();
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
        } else { res.status(400).send(app.api.erroPadrao()); }
    }

    //Apaga um Contato com base no cod_contato.
    api.apagaContato = (req, res) => {
        const { cod_contato } = req.params;

        if(cod_contato){
            const knex = app.conexao.conexaoBDKnex();

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
        } else { res.status(400).send(app.api.erroPadrao()); }
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
        const { cod_telefone, cod_pessoa } = req.params;

        if(cod_telefone && cod_pessoa){
            const knex = app.conexao.conexaoBDKnex();
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
        } else { res.status(400).send(app.api.erroPadrao()); }
    }

    //Apaga um Telefone/Email.
    api.apagaTelefone = (req, res) => {
        const { cod_telefone, cod_pessoa } = req.params;

        if(cod_telefone && cod_pessoa){
            const knex = app.conexao.conexaoBDKnex();

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
        } else { res.status(400).send(app.api.erroPadrao()); }
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

    //Apaga uma Pessoa.
    api.apagaPessoa = (req, res) => {
        const { cod_pessoa } = req.params;

        if(cod_pessoa){
            const knex = app.conexao.conexaoBDKnex();

            knex('pessoa').where('cod_pessoa', cod_pessoa).delete()
                .then(resultado => {
                    knex.destroy();
                    res.status(200).end();
                })
                .catch(erro => {
                    console.log(erro);
                    knex.destroy();
                    if(erro.errno == 1451){
                        res.status(500).send('Esta pessoa não pode ser apagada pois existem outras informações associadas a ela.');
                    } else {
                        res.status(500).send(app.api.erroPadrao());
                    }
                });
        } else { res.status(400).send(app.api.erroPadrao()); }
    }
        
    return api;
};