module.exports = function(app){
    let api = {};
    
    //Lista as Velocidades de um Lote.
    api.listaVelocidadeLote = (req, res) => {
        const { cod_lote } = req.params;

        if(cod_lote){
            const connection = app.conexao.conexaoBD();
            const velocidadeDAO = new app.infra.VelocidadeDAO(connection);
    
            velocidadeDAO.listarVelocidadeLote(cod_lote, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Salva uma nova Velocidade.
    api.salvaVelocidade = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const velocidade = req.body;
        
        knex('velocidade').insert(velocidade)
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

    return api;
};