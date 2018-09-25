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
        
        knex('tipologia').insert(tipologia)
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
    
    //Atualiza os dados de uma Tipologia.
    api.editaTipologia = (req, res) => {
        const { cod_tipologia } = req.params;

        if(cod_tipologia){
            const knex = app.conexao.conexaoBDKnex();
            const tipologia = req.body;
    
            knex('tipologia').where('cod_tipologia', cod_tipologia).update(tipologia)
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
    
    //Apaga uma Tipologia.
    api.apagaTipologia = (req, res) => {
        const { cod_tipologia } = req.params;

        if(cod_tipologia){
            const knex = app.conexao.conexaoBDKnex();

            knex('tipologia').where('cod_tipologia', cod_tipologia).delete()
                .then(resultado => {
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
        } else { res.status(400).send(app.api.erroPadrao()); }
    }

    return api;
};