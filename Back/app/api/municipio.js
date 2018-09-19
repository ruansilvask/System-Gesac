module.exports = function(app){
    let api = {};
    
//---------------Callbacks de Municipios---------------//
    //Lista os Municipios.
    api.listaMunicipio = (req, res) => {
        const { uf } = req.params;

        if(uf){
            const connection = app.conexao.conexaoBD();
            const municipioDAO = new app.infra.MunicipioDAO(connection);
    
            municipioDAO.listarMunicipio(uf, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };
    

//---------------Callbacks de Estados(UF)/Municipios---------------//
    //Lista as UFs.
    api.listaUf = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const municipioDAO = new app.infra.MunicipioDAO(connection);

        municipioDAO.listarUf((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };
    
    return api;
};