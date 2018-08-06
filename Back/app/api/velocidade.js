module.exports = function(app){
    let api = {};
    
    //Lista as Velocidades de um Lote.
    api.listaVelocidadeLote = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const velocidadeDAO = new app.infra.VelocidadeDAO(connection);
        const { cod_lote } = req.params;

        velocidadeDAO.listarVelocidadeLote(cod_lote, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
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