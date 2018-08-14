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
                
        knex('pid').insert(pid)
            .then(resultado => {
                const cod_pid = resultado[0];
                const cod_status = 1;
                const { cod_lote, cod_velocidade, cod_instituicao_resp, cod_instituicao_pag  } = req.body;
            
                const gesac = {cod_pid, cod_lote, cod_velocidade, cod_status, cod_instituicao_resp, cod_instituicao_pag};
            
                return knex('gesac').insert(gesac)
                    .then(result => {
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
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { cod_gesac } = req.params;

        pontoPresencaDAO.visualizarPontoPresenca(cod_gesac, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Atualiza os dados de um Pontos de Presença.
    api.editaPontoPresenca = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const { cod_pid } = req.params;
        const { cod_ibge, nome, inep } = req.body;
        const pid = {cod_ibge, nome, inep};

        knex('pid').where('cod_pid', cod_pid).update(pid)
            .then(resultado => {
                const { cod_instituicao_resp, cod_instituicao_pag  } = req.body;
                const cod_lote = req.body.lote;
                const cod_velocidade = req.body.velocidade;
            
                const gesac = {cod_lote, cod_velocidade, cod_instituicao_resp, cod_instituicao_pag};
            
                return knex('gesac').where('cod_pid', cod_pid).update(gesac)
                    .then(result => {
                        knex.destroy();
                        res.status(200).end();
                })
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.sendStatus(500);
            });
    }


//---------------Callbacks de Endereco---------------//
    //Salva um novo Endereco.
    api.salvaPontoEndereco = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const endereco = req.body;

        const { cod_endereco, cod_gesac } = req.body;

        knex.select('cod_pid').from('gesac').where('cod_gesac', cod_gesac)
            .then(resultado => {
                const cod_pid = resultado[0].cod_pid;
                
                endereco.cod_pid = cod_pid;
                delete endereco.cod_gesac;

                if(cod_endereco === 1){
                    knex('endereco').insert(endereco)
                        .then(resultado => {
                            knex.destroy();
                            res.status(200).end();
                        })
                        // .catch(erro => {
                        //     console.log(erro);
                        //     knex.destroy();
                        //     res.status(500).send(app.api.erroPadrao());
                        // });
                } else {
                    let data_final = req.body.data_inicio;
                    
                    knex('endereco').insert(endereco)
                        .then(resultado => {
                            return knex('endereco').where('cod_endereco', cod_endereco-1).andWhere('cod_pid', cod_pid).update({ data_final })
                                .then(result => {
                                    knex.destroy();
                                    res.status(200).end();
                                })
                        })
                        // .catch(erro => {
                        //     console.log(erro);
                        //     knex.destroy();
                        //     res.status(500).send(app.api.erroPadrao());
                        // });
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
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { cod_gesac } = req.params;

        pontoPresencaDAO.listarPontoEndereco(cod_gesac, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Lista as informações do Endereço atual de um Pontos de Presença.
    api.listaPontoEnderecoAtual = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { cod_gesac } = req.params;
        
        pontoPresencaDAO.listarPontoEnderecoAtual(cod_gesac, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
   };

   //Apaga um Endereco.
//    api.apagaEndereco = (req, res) => {
//     const knex = app.conexao.conexaoBDKnex();
//     const { cod_endereco, cod_pid } = req.params;

//     knex('endereco').where('cod_endereco', cod_endereco).andWhere('cod_pid', cod_pid).delete()
//         .then(resultado => {
//             knex.destroy();
//             res.status(200).end();
//         })
//         .catch(erro => {
//             console.log(erro);
//             knex.destroy();
//             if(erro.errno == 1451){
//                 res.status(500).send('Este endereco não pode ser apagado pois existem outras informações associadas a ele.');
//             } else {
//                 res.status(500).send(app.api.erroPadrao());
//             }
//         });
// }   


//---------------Callbacks de Tipologia---------------//
    //Lista as Tipologias de um Pontos de Presença.
    api.listaPontoTipologia = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { cod_gesac } = req.params;

        pontoPresencaDAO.listarPontoTipologia(cod_gesac, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Salva uma nova Tipologia em um Ponto de Presença.
    api.salvaPontoTipologia = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const pontoTipologia = req.body;
        
        knex('pid_tipologia').insert(pontoTipologia)
            .then(resultado => {
                knex.destroy();
                res.status(200).end();
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
        const knex = app.conexao.conexaoBDKnex();
        const { cod_gesac, cod_tipologia } = req.params;
        knex('pid_tipologia')
            .where('cod_tipologia', cod_tipologia)
            .whereIn('cod_pid', function(){
                this.select('cod_pid')
                    .from('gesac')
                    .where('cod_gesac',  cod_gesac);
        })
        .delete()

//        knex('pid_tipologia').where('cod_pid', cod_pid).andWhere('cod_tipologia', cod_tipologia).delete()
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
    
    
//---------------Callbacks de Contato---------------//
    //Lista as informações de Contato para visualização em Pontos de Presença.
    api.visualizaPontoContato = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { cod_gesac } = req.params;

        pontoPresencaDAO.visualizarPontoContato(cod_gesac, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };
    

//---------------Callbacks de Solicitação---------------//
    //Lista as Solicitação com base no Id.
    api.listaSolicitacaoId = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { data_sistema, tipo_solicitacao, cod_gesac } = req.params;

        pontoPresencaDAO.listarSolicitacaoId(data_sistema, tipo_solicitacao, cod_gesac, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
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
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { cod_status } = req.params;

        pontoPresencaDAO.listarTipoSolicitacaoStatus(cod_status, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();        
    }
    
    //Salva uma nova Solicitação e atualiza o Status do Ponto (Gesac).
    api.salvaSolicitacao = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const cods_gesac = req.body.cod_gesac;
        const { tipo_solicitacao, num_oficio, data_oficio, num_doc_sei, cnpj_empresa } = req.body;
        let dados = [];

        for(let i=0; i<cods_gesac.length; i++){
            dados[i] = { cod_gesac: cods_gesac[i], tipo_solicitacao, num_oficio, data_oficio, num_doc_sei };
        }

        if(cnpj_empresa){
            console.log("Cadastra em analise");
            for(let i=0; i<cods_gesac.length; i++){
                dados[i].cnpj_empresa = cnpj_empresa;
            }

            knex('analise').insert(dados)
                .then(resultado => {
                    knex.destroy();
                    res.status(200).end();
                })
                .catch(erro => {
                    console.log(erro);
                    knex.destroy();
                    res.status(500).send(app.api.erroPadrao());
                });

        } else {
            console.log("Cadastra em solicitacao");
            knex('solicitacao').insert(dados)
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
    }
    

//---------------Callbacks de Analisar---------------//
    //Lista as informações de Análise para visualização em Pontos de Presença.
    api.visualizaPontoAnalise = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { cod_gesac } = req.params;

        pontoPresencaDAO.visualizarPontoAnalise(cod_gesac, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Atualiza os dados de uma Análise.
    api.editaAnalise = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const { cod_analise } = req.params;
        const analise = req.body;

        knex('analise').where('cod_analise', cod_analise).update(analise)
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

    //Lista uma Análise com base no Id.
    api.listaAnaliseId = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { cod_analise } = req.params;

        pontoPresencaDAO.listarAnaliseId(cod_analise, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };
    
    //Lista as informações de detalhes do Ponto de Presença de acordo com o id., Ruan que fez!
    api.detalhePontoPresenca = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { cod_gesac } = req.params;

        pontoPresencaDAO.detalhePontoPresenca(cod_gesac, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };


//---------------Callbacks de Interacao---------------//
    api.salvaInteracao = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const interacao = req.body;

        knex('interacao').insert(interacao)
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

    //Lista as informações de um Interação com base nos Ids.
    api.ListaInteracaoId = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { data, cod_gesac } = req.params;

        pontoPresencaDAO.ListarInteracaoId(data, cod_gesac, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };


//---------------Callbacks de Histórico---------------//
    //Lista os dados do Histórico do Pontos de Presença
    api.listaHistoricoPontoPresenca = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const pontoPresencaDAO = new app.infra.PontoPresencaDAO(connection);
        const { cod_gesac } = req.params;

        pontoPresencaDAO.listarHistoricoPontoPresenca(cod_gesac, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
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
    
    return api;    
}
