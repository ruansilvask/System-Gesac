module.exports = function(app){
    let api = {};

    //Salva um novo Contato.
    api.salvaContato = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const { cnpj_empresa, cod_instituicao, cod_gesac, cargo, obs, cod_pessoa, nome } = req.body; 
        let contato;
        const logDAO = new app.infra.LogDAO(knex);

        if(cnpj_empresa){
            contato = { cnpj_empresa, cod_pessoa, cargo, obs };
        } else if(cod_instituicao){
            contato =  { cod_instituicao, cod_pessoa, cargo, obs };
        } else if(cod_gesac){
            contato =  { cod_gesac, cod_pessoa, cargo, obs };
        }

        const connection = app.conexao.conexaoBD();
        const contatoDAO = new app.infra.ContatoDAO(connection);
        contatoDAO.listarPessoaLog(cod_pessoa, (erroPessoa, resultadoPessoa) => {
            if(erroPessoa){
                console.log(erroPessoa);
                res.status(500).send(app.api.erroPadrao()); 
            }
            else{
                knex('contato').insert(contato)
                    .then(resultado => {
                        logDAO.logContato(req.headers['cod_usuario'], 'contato', 'i', null, resultado[0], cod_pessoa);
                        const pessoa = { nome };
                        let espelho = resultadoPessoa[0].espelho;
                        knex('pessoa').where('cod_pessoa', cod_pessoa).update(pessoa)
                            .then(result => {
                                logDAO.logPessoa(req.headers['cod_usuario'], 'pessoa', 'u', espelho, cod_pessoa);
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
        });
        connection.end();
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
            const { cargo, obs, cod_pessoa, nome } = req.body;
            const contato = { cargo, obs};
            const connection = app.conexao.conexaoBD();
            const contatoDAO = new app.infra.ContatoDAO(connection);
            contatoDAO.listarContatoLog(cod_contato, (erro, resultado) => {
                contatoDAO.listarPessoaLog(cod_pessoa, (erroPessoa, resultadoPessoa) => {
                    if(erro || erroPessoa){
                        console.log(erro);
                        console.log(erroPessoa);
                        connection.end();
                        res.status(500).send(app.api.erroPadrao()); 
                    }
                    else{
                        const knex = app.conexao.conexaoBDKnex();
                        const logDAO = new app.infra.LogDAO(knex);
                        let espelho = resultado[0].espelho;
                        knex('contato').where('cod_contato', cod_contato).update(contato)
                            .then(resultado => {
                                const pessoa = { nome };
                                logDAO.logContato(req.headers['cod_usuario'], 'contato', 'u', espelho, cod_contato, cod_pessoa);
                                espelho = resultadoPessoa[0].espelho;

                                knex('pessoa').where('cod_pessoa', cod_pessoa).update(pessoa)
                                    .then(result => {
                                        logDAO.logPessoa(req.headers['cod_usuario'], 'pessoa', 'u', espelho, cod_pessoa);
                                        knex.destroy();
                                        connection.end();
                                        res.status(200).end();
                                    })
                            })
                            .catch(erro => {
                                console.log(erro);
                                knex.destroy();
                                connection.end();
                                res.status(500).send(app.api.erroPadrao());
                            });
                        }
                });
            });
        } else { res.status(400).send(app.api.erroPadrao()); }
    }

    //Apaga um Contato com base no cod_contato.
    api.apagaContato = (req, res) => {
        const { cod_contato , cod_pessoa } = req.params;

        if(cod_contato){
            const connection = app.conexao.conexaoBD();
            const contatoDAO = new app.infra.ContatoDAO(connection);
            contatoDAO.listarContatoLog(cod_contato, (erro, resultado) => {
                if(erro){
                    console.log(erro);
                    res.status(500).send(app.api.erroPadrao());  
                }
                else{
                    const knex = app.conexao.conexaoBDKnex();
                    const logDAO = new app.infra.LogDAO(knex);
                    let espelho = resultado[0].espelho;
                    knex('contato').where('cod_contato', cod_contato).delete()
                        .then(resultado => {
                            logDAO.logContato(req.headers['cod_usuario'], 'contato', 'd', espelho, cod_contato, cod_pessoa);
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
            });
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    }


//---------------Callbacks de Telefone---------------//
    //Salva um novo Telefone/Email.
    api.salvaTelefone = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const telefone = req.body;
        const logDAO = new app.infra.LogDAO(knex);
        
        knex('telefone').insert(telefone)
            .then(resultado => {
                logDAO.logTelefone(req.headers['cod_usuario'], 'telefone', 'i', null, telefone.cod_telefone, telefone.cod_pessoa);
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
            const telefone = req.body;
            console.log(req);
            console.log(req.body);
            
            
            const connection = app.conexao.conexaoBD();
            const contatoDAO = new app.infra.ContatoDAO(connection);
            contatoDAO.listarTelefoneLog(cod_telefone, cod_pessoa, (erro, resultado) => {
                if(erro){
                    console.log(erro);
                    res.status(500).send(app.api.erroPadrao()); 
                }
                else{
                    const knex = app.conexao.conexaoBDKnex();
                    const logDAO = new app.infra.LogDAO(knex);
                    let espelho = resultado[0].espelho;
                    knex('telefone').where('cod_telefone', cod_telefone).andWhere('cod_pessoa', cod_pessoa).update(telefone)
                        .then(resultado => {
                            logDAO.logTelefone(req.headers['cod_usuario'], 'telefone', 'u', espelho, cod_telefone, cod_pessoa);
                            knex.destroy();
                            res.status(200).end();
                        })
                        .catch(erro => {
                            console.log(erro);
                            knex.destroy();
                            res.status(500).send(app.api.erroPadrao());
                        });
                }
            });
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    }

    //Apaga um Telefone/Email.
    api.apagaTelefone = (req, res) => {
        const { cod_telefone, cod_pessoa } = req.params;

        if(cod_telefone && cod_pessoa){
            const connection = app.conexao.conexaoBD();
            const contatoDAO = new app.infra.ContatoDAO(connection);
            contatoDAO.listarTelefoneLog(cod_telefone, cod_pessoa, (erro, resultado) => {
                if(erro){
                    console.log(erro);
                    res.status(500).send(app.api.erroPadrao());  
                }
                else{
                    const knex = app.conexao.conexaoBDKnex();
                    const logDAO = new app.infra.LogDAO(knex);
                    let espelho = resultado[0].espelho;
                    knex('telefone').where('cod_telefone', cod_telefone).andWhere('cod_pessoa', cod_pessoa).delete()
                        .then(resultado => {
                            logDAO.logTelefone(req.headers['cod_usuario'], 'telefone', 'd', espelho, cod_telefone, cod_pessoa);
                            knex.destroy();
                            res.status(200).end();
                        })
                        .catch(erro => {
                            console.log(erro);
                            knex.destroy();
                            res.status(500).send(app.api.erroPadrao());
                        });
                }
            });
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    }


//---------------Callbacks de Pessoa---------------//
    //Salva uma nova Pessoa.
    api.salvaPessoa = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const pessoa = req.body;
        const logDAO = new app.infra.LogDAO(knex);
        
        knex('pessoa').insert(pessoa)
            .then(resultado => {
                logDAO.logPessoa(req.headers['cod_usuario'], 'pessoa', 'i', null, resultado[0]);
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
            const connection = app.conexao.conexaoBD();
            const contatoDAO = new app.infra.ContatoDAO(connection);
            contatoDAO.listarPessoaLog(cod_pessoa, (erro, resultado) => {
                if(erro){
                    console.log(erro);
                    res.status(500).send(app.api.erroPadrao());
                }
                else{
                    const knex = app.conexao.conexaoBDKnex();
                    const logDAO = new app.infra.LogDAO(knex);
                    let espelho = resultado[0].espelho;
                    knex('pessoa').where('cod_pessoa', cod_pessoa).delete()
                        .then(resultado => {
                            logDAO.logPessoa(req.headers['cod_usuario'], 'pessoa', 'd', espelho, cod_pessoa);
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
                }
            });
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    }
        
    return api;
};