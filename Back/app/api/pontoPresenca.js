module.exports = function(app){
    let api = {};
    

//---------------Callbacks de Pontos de Presença---------------//
    //Lista os Pontos de Presença.
    api.listaPontoPresenca = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);

        pontoPresencaDAO.listarPontoPresenca((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };
    
    //Salva um Pontos de Presença.
    api.salvaPontoPresenca = (req, res) => {
    	const knex = app.conexao.conexaoBDKnex();
        const { cod_ibge, nome, inep } = req.body;
        const pid = {cod_ibge, nome, inep};
        const logDAO = new app.infra.LogDAO(knex);
                
        knex('pid').insert(pid)
            .then(resultado => {
                const cod_pid = resultado[0];
                logDAO.logPid(req.headers['cod_usuario'], 'pid', 'i', null, cod_pid);
                const cod_status = 1;
                const { cod_lote, cod_velocidade, cod_instituicao_resp, cod_instituicao_pag  } = req.body;
                const gesac = {cod_pid, cod_lote, cod_velocidade, cod_status, cod_instituicao_resp, cod_instituicao_pag};
            
                return knex('gesac').insert(gesac)
                    .then(result => {
                        logDAO.logGesac(req.headers['cod_usuario'], 'gesac', 'i', null, result[0]);
                        knex.destroy();
                        res.status(200).json(result[0]);
                })
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    };

    //Lista as informações de Ponto para visualização em Pontos de Presença.
    api.visualizaPontoPresenca = (req, res) => {
        const { cod_gesac } = req.params;

        if(cod_gesac){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
    
            pontoPresencaDAO.visualizarPontoPresenca(cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Atualiza os dados de um Pontos de Presença.
    api.editaPontoPresenca = (req, res) => {
        const { cod_pid } = req.params;

        if(cod_pid){
            const { cod_ibge, nome, inep, cod_gesac } = req.body;
            const pid = {cod_ibge, nome, inep};
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
            pontoPresencaDAO.listarPidLog(cod_pid, (erro, resultado) => {
                pontoPresencaDAO.listarGesacLog(cod_gesac, (erroGesac, resultadoGesac) => {
                    if(erro || erroGesac){
                        console.log(erro);
                        console.log(erroGesac);
                        connection.end();
                        res.status(500).send(app.api.erroPadrao()); 
                    }
                    else{
                        const knex = app.conexao.conexaoBDKnex();
                        const logDAO = new app.infra.LogDAO(knex);
                        let espelho = resultado[0].espelho;
                        knex('pid').where('cod_pid', cod_pid).update(pid)
                            .then(resultado => {
                                const { cod_instituicao_resp, cod_instituicao_pag  } = req.body;
                                const cod_lote = req.body.lote;
                                const cod_velocidade = req.body.velocidade;
                                const gesac = {cod_lote, cod_velocidade, cod_instituicao_resp, cod_instituicao_pag};
                                logDAO.logPid(req.headers['cod_usuario'], 'pid', 'u', espelho, cod_pid);
                                espelho = resultadoGesac[0].espelho;

                                return knex('gesac').where('cod_pid', cod_pid).update(gesac)
                                    .then(result => {
                                        logDAO.logGesac(req.headers['cod_usuario'], 'gesac', 'u', espelho, cod_gesac);
                                        knex.destroy();
                                        connection.end();
                                        res.status(200).end();
                                })
                            })
                            .catch(erro => {
                                console.log(erro);
                                knex.destroy();
                                connection.end();
                                res.sendStatus(500);
                            });
                    }
                });
            });
        } else { res.status(400).send(app.api.erroPadrao()); }
    }


//---------------Callbacks de Endereco---------------//
    //Salva um novo Endereco.
    api.salvaPontoEndereco = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const endereco = req.body;
        const { cod_endereco, cod_gesac } = req.body;
        const logDAO = new app.infra.LogDAO(knex);

        knex.select('cod_pid').from('gesac').where('cod_gesac', cod_gesac)
            .then(resultado => {
                const cod_pid = resultado[0].cod_pid;
                
                endereco.cod_pid = cod_pid;
                delete endereco.cod_gesac;

                if(cod_endereco === 1){
                    knex('endereco').insert(endereco)
                        .then(resultado => {
                            logDAO.logEndereco(req.headers['cod_usuario'], 'endereco', 'i', null, cod_endereco, cod_pid);
                            knex.destroy();
                            res.status(200).end();
                        })
                } else {
                    let data_final = req.body.data_inicio;
                    
                    knex('endereco').insert(endereco)
                        .then(resultado => {
                            logDAO.logEndereco(req.headers['cod_usuario'], 'endereco', 'i', null, cod_endereco, cod_pid);
                            return knex('endereco').where('cod_endereco', cod_endereco-1).andWhere('cod_pid', cod_pid).update({ data_final })
                                .then(result => {
                                    knex.destroy();
                                    res.status(200).end();
                                })
                        })
                }
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    };
    
    //Lista as informações de todos os Endereço de um Ponto de Presença.
    api.listaPontoEndereco = (req, res) => {
        const { cod_gesac } = req.params;

        if(cod_gesac){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
    
            pontoPresencaDAO.listarPontoEndereco(cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Lista as informações do Endereço atual de um Pontos de Presença.
    api.listaPontoEnderecoAtual = (req, res) => {
        const { cod_gesac } = req.params;

        if(cod_gesac){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
            
            pontoPresencaDAO.listarPontoEnderecoAtual(cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
   };

   //Apaga um Endereco.
   api.apagaEndereco = (req, res) => {
        const { cod_endereco, cod_gesac } = req.params;

        if(cod_endereco && cod_gesac){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
            
            const knex = app.conexao.conexaoBDKnex();
            knex.select('cod_pid').from('gesac').where('cod_gesac', cod_gesac)
                .then(resultado => {
                    const cod_pid = resultado[0].cod_pid
                    pontoPresencaDAO.listarEnderecoLog(cod_endereco, cod_pid, (erroEndereco, resultadoEndereco) => {
                        if(erroEndereco){
                            console.log(erroEndereco);
                            res.status(500).send(app.api.erroPadrao());  
                        }
                        else{
                            logDAO = new app.infra.LogDAO(knex);
                            let espelho = resultadoEndereco[0].espelho;
                            return knex('endereco').where('cod_endereco', cod_endereco).andWhere('cod_pid', cod_pid).delete()
                                .then(resultado => {
                                    logDAO.logEndereco(req.headers['cod_usuario'], 'endereco', 'd', espelho, cod_endereco, cod_pid);
                                    knex.destroy();
                                    res.status(200).end();
                                })
                        }
                    });
                    connection.end();
                })
                .catch(erro => {
                    console.log(erro);
                    knex.destroy();
                    res.status(500).send(app.api.erroPadrao());
                });
        } else { res.status(400).send(app.api.erroPadrao()); }
    }   


//---------------Callbacks de Tipologia---------------//
    //Lista as Tipologias de um Pontos de Presença.
    api.listaPontoTipologia = (req, res) => {
        const { cod_gesac } = req.params;

        if(cod_gesac){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
    
            pontoPresencaDAO.listarPontoTipologia(cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Salva uma nova Tipologia em um Ponto de Presença.
    api.salvaPontoTipologia = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const pontoTipologia = req.body;
        const logDAO = new app.infra.LogDAO(knex);

        knex.select('cod_pid').from('gesac').where('cod_gesac', pontoTipologia.cod_gesac)
            .then(resultado => {
                delete pontoTipologia.cod_gesac;
                pontoTipologia.cod_pid = resultado[0].cod_pid;
                return knex('pid_tipologia').insert(pontoTipologia)
                    .then(resultado => {
                        logDAO.logPidTipologia(req.headers['cod_usuario'], 'pid_tipologia', 'i', null, pontoTipologia.cod_pid, pontoTipologia.cod_tipologia);
                        knex.destroy();
                        res.status(200).end();
                    })
                })
                .catch(erro => {
                    console.log(erro);
                    knex.destroy();
                    if(erro.errno == 1062){
                        res.status(500).send('Esta tipologia já está cadastrado neste ponto de presença.');
                    } else {
                        res.status(500).send(app.api.erroPadrao());
                    }
                });
    };

    //Apaga uma Tipologia de um Ponto de Presença.
    api.apagaPontoTipologia = (req, res) => {
        const { cod_gesac, cod_tipologia } = req.params;
        
        if(cod_gesac && cod_tipologia){
            const knex = app.conexao.conexaoBDKnex();
            const logDAO = new app.infra.LogDAO(knex);
            
            knex.select('cod_pid').from('gesac').where('cod_gesac', cod_gesac)
                .then(resultadoSelect => {
                    return knex('pid_tipologia').where('cod_tipologia', cod_tipologia).andWhere('cod_pid', resultadoSelect[0].cod_pid).delete()
                        .then(resultadoDelete => {
                            logDAO.logPidTipologia(req.headers['cod_usuario'], 'pid_tipologia', 'd', null, resultadoSelect[0].cod_pid, cod_tipologia);
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
    
    
//---------------Callbacks de Contato---------------//
    //Lista as informações de Contato para visualização em Pontos de Presença.
    api.visualizaPontoContato = (req, res) => {
        const { cod_gesac } = req.params;

        if(cod_gesac){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
    
            pontoPresencaDAO.visualizarPontoContato(cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };
    

//---------------Callbacks de Solicitação---------------//
    //Lista as Solicitação com base no Id.
    api.listaSolicitacaoId = (req, res) => {
        const { data_sistema, tipo_solicitacao, cod_gesac } = req.params;

        if(data_sistema && tipo_solicitacao && cod_gesac){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
    
            pontoPresencaDAO.listarSolicitacaoId(data_sistema, tipo_solicitacao, cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Lista todos os Tipos de Solicitação.
    api.listaTipoSolicitacao = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);

        pontoPresencaDAO.listarTipoSolicitacao((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Lista os tipos de Solicitações de um Status de um Ponto de Presença.
    api.listaTipoSolicitacaoStatus = (req, res) => {
        const { cod_status } = req.params;

        if(cod_status){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
    
            pontoPresencaDAO.listarTipoSolicitacaoStatus(cod_status, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();   
        } else { res.status(400).send(app.api.erroPadrao()); }
    }
    
    //Salva uma nova Solicitação e atualiza o Status do Ponto (Gesac).
    api.salvaSolicitacao = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const cods_gesac = req.body.cod_gesac;
        const { tipo_solicitacao, num_oficio, data_oficio, num_doc_sei, cnpj_empresa, motivo } = req.body;
        const logDAO = new app.infra.LogDAO(knex);
        let dados = [];
        const connection = app.conexao.conexaoBD();

        for(let i=0; i<cods_gesac.length; i++){
            dados[i] = { cod_gesac: cods_gesac[i], tipo_solicitacao, num_oficio, data_oficio, num_doc_sei };
        }

        if(cnpj_empresa){
            for(let i=0; i<cods_gesac.length; i++){
                dados[i].cnpj_empresa = cnpj_empresa;
            }

            knex('analise').insert(dados)
                .then(resultado => {
                    let cod_analise = [];
                    let contador = resultado[0];
                    for(let i=0; i<dados.length; i++){
                        cod_analise[i] = contador;
                        contador++;                        
                    }                
                    logDAO.logAnalise(req.headers['cod_usuario'], 'analise', 'i', null, cod_analise);
                    knex.destroy();
                    res.status(200).end();
                })
                .catch(erro => {
                    console.log(erro);
                    knex.destroy();
                    res.status(500).send(app.api.erroPadrao());
                });

        } else {
            if(motivo){
                for(let i=0; i<cods_gesac.length; i++){
                    dados[i].motivo = motivo;
                }
            }
            
            knex('solicitacao').returning('cod_gesac').insert(dados)
                .then(resultado => {                  
                    return knex.select('data_sistema').from('solicitacao').orderBy('data_sistema', 'desc').limit(1)
                        .then(resultadoSelect => {
                            var date = new Date(resultadoSelect[0].data_sistema);
                            var data_sistema = `${date.toISOString().slice(0,4)}-${date.toISOString().slice(5,7)}-${date.toISOString().slice(8,10)} ${date.toISOString().slice(11,13)-(date.getTimezoneOffset()/60)}:${date.toISOString().slice(14,16)}:${date.toISOString().slice(17,19)}`;
                            logDAO.logSolicitacao(req.headers['cod_usuario'], 'solicitacao', 'i', null, data_sistema, tipo_solicitacao, cods_gesac);
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
    }
    

//---------------Callbacks de Analisar---------------//
    //Lista as informações de Análise para visualização em Pontos de Presença.
    api.visualizaPontoAnalise = (req, res) => {
        const { cod_gesac } = req.params;

        if(cod_gesac){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);        
    
            pontoPresencaDAO.visualizarPontoAnalise(cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Atualiza os dados de uma Análise.
    api.editaAnalise = (req, res) => {
        const { cod_analise } = req.params;

        if(cod_analise){
            const analise = req.body;
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
            pontoPresencaDAO.listarAnaliseLog(cod_analise, (erro, resultado) => {
                if(erro){
                    console.log(erro);
                    res.status(500).send(app.api.erroPadrao());
                }
                else{
                    const knex = app.conexao.conexaoBDKnex();
                    const logDAO = new app.infra.LogDAO(knex);
                    let espelho = resultado[0].espelho;
                    knex('analise').where('cod_analise', cod_analise).update(analise)
                        .then(resultado => {
                            logDAO.logAnalise(req.headers['cod_usuario'], 'analise', 'u', espelho, cod_analise);
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

    //Lista uma Análise com base no Id.
    api.listaAnaliseId = (req, res) => {
        const { cod_analise } = req.params;

        if(cod_analise){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);        
    
            pontoPresencaDAO.listarAnaliseId(cod_analise, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };
    
    //Lista as informações de detalhes do Ponto de Presença de acordo com o id., Ruan que fez!
    api.detalhePontoPresenca = (req, res) => {
        const { cod_gesac } = req.params;

        if(cod_gesac){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
    
            pontoPresencaDAO.detalhePontoPresenca(cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };


//---------------Callbacks de Interacao---------------//
    //Lista os Tipos de Interação.
    api.ListaTipoInteracao = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);

        pontoPresencaDAO.ListarTipoInteracao((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Salva uma nova Interação
    api.salvaInteracao = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const interacao = req.body;
        const logDAO = new app.infra.LogDAO(knex);

        knex('interacao').insert(interacao)
            .then(resultado => {
                return knex.select('data').from('interacao').orderBy('data', 'desc').limit(1)
                    .then(resultadoSelect => {
                        var date = new Date(resultadoSelect[0].data);
                        var data_sistema = `${date.toISOString().slice(0,4)}-${date.toISOString().slice(5,7)}-${date.toISOString().slice(8,10)} ${date.toISOString().slice(11,13)-(date.getTimezoneOffset()/60)}:${date.toISOString().slice(14,16)}:${date.toISOString().slice(17,19)}`;
                        logDAO.logInteracao(req.headers['cod_usuario'], 'interacao', 'i', null, data_sistema, interacao.cod_gesac);
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

    //Lista as informações de um Interação com base nos Ids.
    api.ListaInteracaoId = (req, res) => {
        const { data, cod_gesac } = req.params;

        if(data && cod_gesac){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
    
            pontoPresencaDAO.ListarInteracaoId(data, cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };


//---------------Callbacks de Histórico---------------//
    //Lista os dados do Histórico do Pontos de Presença
    api.listaHistoricoPontoPresenca = (req, res) => {
        const { cod_gesac } = req.params;

        if(cod_gesac){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
    
            pontoPresencaDAO.listarHistoricoPontoPresenca(cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };


//---------------Callbacks de Status---------------//
    //Lista todos os status para visualização em Pontos de Presença.
    api.listaTodosStatus = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);

        pontoPresencaDAO.listarTodosStatus((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };


//---------------Callbacks de Observação de Ação---------------//
    //Lista todas as Observações de Ação.
    api.listaObsAcao = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);

        pontoPresencaDAO.listarObsAcao((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Salva uma Observação de Ação em um ou vários Pontos de Presença.
    api.salvaObservacao = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const obs_acao = req.body;
        let gesac_obs_acao = [];
        const logDAO = new app.infra.LogDAO(knex);

        if(Array.isArray(obs_acao.cod_gesac)){
            for(let i=0; i<obs_acao.cod_gesac.length; i++){
                gesac_obs_acao[i] = {cod_gesac: obs_acao.cod_gesac[i], cod_obs: obs_acao.cod_obs};
            }
        } else {
            gesac_obs_acao[0] = {cod_gesac: obs_acao.cod_gesac, cod_obs: obs_acao.cod_obs};
        }

        knex('gesac_obs_acao').insert(gesac_obs_acao)
            .then(resultado => {
                logDAO.logGesacObsAcao(req.headers['cod_usuario'], 'gesac_obs_acao', 'i', null, obs_acao.cod_gesac, obs_acao.cod_obs);
                knex.destroy();
                res.status(200).end();
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    };

    //Lista as Observações de Ação de um Ponto de presença.
    api.listaObsAcaoId = (req, res) => {
        const { cod_gesac } = req.params;

        if(cod_gesac){
            const connection = app.conexao.conexaoBD();
            const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
    
            pontoPresencaDAO.listarObsAcaoId(cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        }        
    };

    //Lista as Observações de Ação de vários Ponto de presença.
    api.listaMultObsAcaoId = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { cod_gesac } = req.query;

        if(cod_gesac){
            pontoPresencaDAO.listarMultObsAcaoId(cod_gesac, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end(); 
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Apaga uma Observação de Ação de um Ponto de Presença.
    api.apagaObsAcao = (req, res) => {
        const cod_usuario = req.headers['cod_usuario'];

        if(cod_usuario == 1){
            const { cod_gesac, cod_obs } = req.query;

            if(cod_gesac && cod_obs){
                const knex = app.conexao.conexaoBDKnex();
                let gesac_obs_acao = [];
                const logDAO = new app.infra.LogDAO(knex);
        
                if(cod_gesac){
                    const cods_gesac = cod_gesac.split(",");
        
                    if(Array.isArray(cods_gesac)){
                        for(let i=0; i<cods_gesac.length; i++){
                            gesac_obs_acao[i] = [cods_gesac[i], cod_obs];
                        }
                    } else {
                        gesac_obs_acao[0] = [cod_gesac, cod_obs];
                    }
        
                    knex('gesac_obs_acao').whereIn(['cod_gesac', 'cod_obs'], gesac_obs_acao).delete()
                        .then(resultado => {
                            logDAO.logGesacObsAcao(req.headers['cod_usuario'], 'gesac_obs_acao', 'd', null, cods_gesac, cod_obs);
                            knex.destroy();
                            res.status(200).end();
                        })
                        .catch(erro => {
                            console.log(erro);
                            knex.destroy();
                            res.status(500).send(app.api.erroPadrao());
                        });   
        
                } else { res.status(400).send(app.api.erroPadrao()); }
            } else { res.status(400).send(app.api.erroPadrao()); };
        } else { res.status(418).send('Este usuário não possui permisão para excluir essa Observações para ação.'); }
    }
    
    return api;    
}
