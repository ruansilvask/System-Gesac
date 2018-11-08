module.exports = function(app){
    let api = {};
    
//---------------Callbacks de Contratos---------------//
    //Lista os Contratos da tela de Contratos.
    api.listaContrato = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const contratosDAO = new app.infra.ContratoDAO(connection);

        contratosDAO.listarContrato((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };
    
    //Lista o Contrato com base no ID.
    api.listaContratoId = (req, res) => {
        const { num_contrato } = req.params;

        if(num_contrato){
            const connection = app.conexao.conexaoBD();
            const contratosDAO = new app.infra.ContratoDAO(connection);

            contratosDAO.listarContratoId(num_contrato, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });

            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Salva um novo Contrato.
    api.salvaContrato = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const contrato = req.body;
        const logDAO = new app.infra.LogDAO(knex);
        
        knex('contrato').insert(contrato)
            .then(resultado => {
                logDAO.logContrato(req.headers['cod_usuario'], 'contrato', 'i', null, contrato.num_contrato);
                knex.destroy();
                res.status(200).end();
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                if(erro.errno == 1062){
                    res.status(500).send('Este número de contrato já está cadastrado.');
                } else {
                    res.status(500).send(app.api.erroPadrao());
                }
            });
    };

    //Atualiza os dados de um Contrato.
    api.editaContrato = (req, res) => {
        const { num_contrato } = req.params;

        if(num_contrato){
            const contrato = req.body;
            const connection = app.conexao.conexaoBD();
            const contratoDAO = new app.infra.ContratoDAO(connection);
            contratoDAO.listarContratoLog (num_contrato, (erro, resultado) => {
                if(erro){
                    console.log(erro);
                    res.status(500).send(app.api.erroPadrao());
                }
                else{
                    const knex = app.conexao.conexaoBDKnex();
                    const logDAO = new app.infra.LogDAO(knex);
                    let espelho = resultado[0].espelho;
                    knex('contrato').where('num_contrato', num_contrato).update(contrato)
                        .then(resultado => {
                            logDAO.logContrato(req.headers['cod_usuario'], 'contrato', 'u', espelho, contrato.num_contrato);
                            knex.destroy();
                            res.status(200).end();
                        })
                        .catch(erro => {
                            console.log(erro);
                            knex.destroy();
                            if(erro.errno == 1062){
                                res.status(500).send('Este número de contrato já está cadastrado.');
                            } else if(erro.errno == 1451){
                                res.status(500).send('Esta número de contrato não pode ser alterado pois existem outras informações associadas a ele.');
                            } else {
                                res.status(500).send(app.api.erroPadrao());
                            }
                        });
                }
            });
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    }

//---------------Callbacks de Lotes---------------//
    //Lista os Lotes e suas Velocidades de um Contrato.
    api.visualizaContratoLote = (req, res) => {
        const { num_contrato } = req.params;

        if(num_contrato){
            const connection = app.conexao.conexaoBD();
            const contratosDAO = new app.infra.ContratoDAO(connection);
    
            contratosDAO.visualizarContratoLote(num_contrato, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });

            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
        
    };
        
    return api;
};