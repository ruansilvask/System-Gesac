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
        
        knex('representante_legal').insert(representanteLegal)
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

    //Atualiza os dados de um representanteLegal.
    api.editaRepresentanteLegal = (req, res) => {
        const { cod_representante } = req.params;

        if(cod_representante){
            const knex = app.conexao.conexaoBDKnex();
            const representanteLegal = req.body;
    
            knex('representante_legal').where('cod_representante', cod_representante).update(representanteLegal)
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

    return api;
}