module.exports = function(app){
    let api = {};
    
    //Lista as Tipologias.
    api.listaTipologia = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const tipologiaDAO = new app.infra.TipologiaDAO(connection);

        tipologiaDAO.listarTipologia((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Salva uma nova Tipologia.
    api.salvaTipologia = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const tipologia = req.body;
        const logDAO = new app.infra.LogDAO(knex);
        
        knex('tipologia').insert(tipologia)
            .then(resultado => {
                logDAO.logTipologia(req.headers['cod_usuario'], 'tipologia', 'i', null, resultado[0]);
                knex.destroy();
                res.status(200).end();
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    };
    
    //Atualiza os dados de uma Tipologia.
    api.editaTipologia = (req, res) => {
        const { cod_tipologia } = req.params;

        if(cod_tipologia){
            const tipologia = req.body;
            const connection = app.conexao.conexaoBD();
            const tipologiaDAO = new app.infra.TipologiaDAO(connection);
            tipologiaDAO.listarTipologiaLog (cod_tipologia, (erro, resultado) =>{
                if(erro){
                    console.log(erro);
                    res.status(500).send(app.api.erroPadrao());
                }
                else{
                    const knex = app.conexao.conexaoBDKnex();
                    const logDAO = new app.infra.LogDAO (knex);
                    let espelho = resultado[0].espelho;
                    knex('tipologia').where('cod_tipologia', cod_tipologia).update(tipologia)
                        .then(resultado => {
                            logDAO.logTipologia(req.headers['cod_usuario'], 'tipologia', 'u', espelho, cod_tipologia);
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
    
    //Apaga uma Tipologia.
    api.apagaTipologia = (req, res) => {
        const { cod_tipologia } = req.params;

        if(cod_tipologia){
            const connection = app.conexao.conexaoBD();
            const tipologiaDAO = new app.infra.TipologiaDAO(connection);
            tipologiaDAO.listarTipologiaLog(cod_tipologia, (erro, resultado) => {
                if(erro){
                    console.log(erro);
                    res.status(500).send(app.api.erroPadrao());
                }
                else{
                    const knex = app.conexao.conexaoBDKnex();
                    const logDAO = new app.infra.LogDAO(knex);
                    let espelho = resultado[0].espelho;
                    knex('tipologia').where('cod_tipologia', cod_tipologia).delete()
                        .then(resultado => {
                            logDAO.logTipologia(req.headers['cod_usuario'], 'tipologia', 'd', espelho, cod_tipologia);
                            knex.destroy();
                            res.status(200).end();
                        })
                        .catch(erro => {
                            console.log(erro);
                            knex.destroy();
                            if(erro.errno == 1451){
                                res.status(500).send('Esta tipologia não pode ser apagada pois existem outras informações associadas a ela.');
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