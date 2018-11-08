module.exports = function(app){
    let api = {};

    //Lista os representanteLegal com base no cod_representante.
    api.listaRepresentanteLegalId = (req, res) => {
        const { cod_representante } = req.params;

        if(cod_representante){
            const connection = app.conexao.conexaoBD();
            const representanteLegalDAO = new app.infra.RepresentanteLegalDAO(connection);
    
            representanteLegalDAO.listarRepresentanteLegal(cod_representante, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Lista os Representantes Legais de uma Instituicao Responsavel.
    api.listaRepresentanteLegalInst = (req, res) => {
        const { cod_instituicao } = req.params;

        if(cod_instituicao){
            const connection = app.conexao.conexaoBD();
            const representanteLegalDAO = new app.infra.RepresentanteLegalDAO(connection);
    
            representanteLegalDAO.listarRepresentanteLegalInst(cod_instituicao, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Salva um novo representanteLegal.
    api.salvaRepresentanteLegal = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const representanteLegal = req.body;
        const logDAO = new app.infra.LogDAO(knex);
        
        knex('representante_legal').insert(representanteLegal)
            .then(resultado => {
                logDAO.logRepresentanteLegal(req.headers['cod_usuario'], 'representante_legal', 'i', null, resultado[0]);
                knex.destroy();
                res.status(200).end();
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    };

    //Atualiza os dados de um representanteLegal.
    api.editaRepresentanteLegal = (req, res) => {
        const { cod_representante } = req.params;

        if(cod_representante){
            const representanteLegal = req.body;
            const connection = app.conexao.conexaoBD();
            const representanteLegalDAO = new app.infra.RepresentanteLegalDAO(connection);
            representanteLegalDAO.listarRepresentanteLegalLog(cod_representante, (erro, resultado) =>{
                if(erro){
                    console.log(erro);
                    res.status(500).send(app.api.erroPadrao()); 
                }
                else{
                    const knex = app.conexao.conexaoBDKnex();
                    const logDAO = new app.infra.LogDAO(knex);
                    let espelho = resultado[0].espelho;
                    knex('representante_legal').where('cod_representante', cod_representante).update(representanteLegal)
                        .then(resultado => {
                            logDAO.logRepresentanteLegal(req.headers['cod_usuario'], 'representante_legal', 'u', espelho, cod_representante);
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

    return api;
}