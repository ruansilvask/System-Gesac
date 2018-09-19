module.exports = function(app){
    let api = {};
    
    //Lista as Instituicoes Responsavel.
    api.listaInstituicaoResponsavel = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const instituicaoResponsavelDAO = new app.infra.InstituicaoResponsavelDAO(connection);

        instituicaoResponsavelDAO.listarInstituicaoResponsavel((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Lista as Instituicoes Pagadora (Tela de Ponto Presença).
    api.listaInstituicaoPagadora = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const instituicaoResponsavelDAO = new app.infra.InstituicaoResponsavelDAO(connection);

        instituicaoResponsavelDAO.listarInstituicaoPagadora((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Lista os Gesacs relacionados a uma Instituicao Responsavel.
    api.listaInstituicaoGesac = (req, res) => {
        const { cod_instituicao } = req.params;

        if(cod_instituicao){
            const connection = app.conexao.conexaoBD();
            const instituicaoResponsavelDAO = new app.infra.InstituicaoResponsavelDAO(connection);
    
            instituicaoResponsavelDAO.listarInstituicaoGesac(cod_instituicao, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Salva uma nova Instituicao Responsavel.
    api.salvaInstituicaoResponsavel = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const instituicaoResponsavel = req.body;
         
        knex('instituicao_resp').insert(instituicaoResponsavel)
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

    //Lista as Instituicoes Responsavel com base no cod_instiuicao.
    api.listaInstituicaoResponsavelId = (req, res) => {
        const { cod_instituicao } = req.params;

        if(cod_instituicao){
            const connection = app.conexao.conexaoBD();
            const instituicaoResponsavelDAO = new app.infra.InstituicaoResponsavelDAO(connection);
    
            instituicaoResponsavelDAO.listarInstituicaoResponsavelId(cod_instituicao, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }        
    };

    //Atualiza os dados de uma Instituicoes Responsavel.
    api.editaInstituicaoResponsavel = (req, res) => {
        const { cod_instituicao } = req.params;

        if(cod_instituicao){
            const knex = app.conexao.conexaoBDKnex();
            const instituicaoResponsavel = req.body;
    
            knex('instituicao_resp').where('cod_instituicao', cod_instituicao).update(instituicaoResponsavel)
                .then(resultado => {
                    knex.destroy();
                    res.status(200).end();
                })
                .catch(erro => {
                    console.log(erro);
                    knex.destroy();
                    res.status(500).send(app.api.erroPadrao())
                });
        } else { res.status(400).send(app.api.erroPadrao()); }
    }

    //Apaga uma Instituicao Responsavel.
    api.apagaInstituicaoResponsavel = (req, res) => {
        const { cod_instituicao } = req.params;

        if(cod_instituicao){
            const knex = app.conexao.conexaoBDKnex();

            knex('instituicao_resp').where('cod_instituicao', cod_instituicao).delete()
                .then(resultado => {
                    knex.destroy();
                    res.status(200).end();
                })
                .catch(erro => {
                    console.log(erro);
                    knex.destroy();
                    if(erro.errno == 1451){
                        res.status(500).send('Esta instituição responsável não pode ser apagada pois existem outras informações associadas a ela.');
                    } else {
                        res.status(500).send(app.api.erroPadrao());
                    }
                });
        } else { res.status(400).send(app.api.erroPadrao()); }
    }
        
    return api;
};