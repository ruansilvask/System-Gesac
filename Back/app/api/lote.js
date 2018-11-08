module.exports = function(app){
    let api = {};
    
    //Lista os Lotes de um Contrato.
    api.listaLoteContrato = (req, res) => {
        const { num_contrato } = req.params;

        if(num_contrato){
            const connection = app.conexao.conexaoBD();
            const loteDAO = new app.infra.LoteDAO(connection);
    
            loteDAO.listarLoteContrato(num_contrato, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Salva um novo Lote.
    api.salvaLote = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const lote = req.body;
        const logDAO = new app.infra.LogDAO(knex);
        
        knex('lote').insert(lote)
            .then(resultado => {
                logDAO.logLote(req.headers['cod_usuario'], 'lote', 'i', null, resultado[0]);
                knex.destroy();
                res.status(200).json(resultado[0]);
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    };

    //Atualiza os dados de uma Lote.
    api.editaLote = (req, res) => {
        const { cod_lote } = req.params;

        if(cod_lote){
            const lote = req.body;
            const connection = app.conexao.conexaoBD();
            const loteDAO = new app.infra.LoteDAO(connection);
            loteDAO.listarLoteLog (cod_lote, (erro, resultado) => {
                if(erro){
                    console.log(erro);
                    res.status(500).send(app.api.erroPadrao());
                }
                else{
                    const knex = app.conexao.conexaoBDKnex();
                    const logDAO = new app.infra.LogDAO(knex);
                    let espelho = resultado[0].espelho;
                    knex('lote').where('cod_lote', cod_lote).update(lote)
                        .then(resultado => {
                            logDAO.logLote(req.headers['cod_usuario'], 'lote', 'u', espelho, cod_lote);
                            knex.destroy();
                            res.status(200).json(lote);
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
    
    //Apaga um Lote.
    api.apagaLote = (req, res) => {
        const { cod_lote } = req.params;
        
        if(cod_lote){
            const connection = app.conexao.conexaoBD();
            const loteDAO = new app.infra.LoteDAO(connection);
            loteDAO.listarLoteLog(cod_lote, (erro, resultado) => {
                if(erro){
                    console.log(erro);
                    res.status(500).send(app.api.erroPadrao());                    
                }
                else{
                    const knex = app.conexao.conexaoBDKnex();
                    const logDAO = new app.infra.LogDAO(knex);
                    let espelho = resultado[0].espelho;
                    knex('lote').where('cod_lote', cod_lote).delete()
                        .then(resultado => {
                            logDAO.logLote(req.headers['cod_usuario'], 'lote', 'd', espelho, cod_lote);
                            knex.destroy();
                            res.status(200).end();
                        })
                        .catch(erro => {
                            console.log(erro);
                            knex.destroy();
                            if(erro.errno == 1451){
                                res.status(500).send('Este lote não pode ser apagado pois existem outras informações associadas a ele.');
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