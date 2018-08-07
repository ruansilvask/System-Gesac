module.exports = function(app){
    let api = {};
    
//---------------Callbacks de Municipios---------------//
    //Lista os Municipios.
    api.listaMunicipio = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const municipioDAO = new app.infra.MunicipioDAO(connection);
        const { uf } = req.params;

        municipioDAO.listarMunicipio(uf, (erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
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