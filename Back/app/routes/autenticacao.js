module.exports = function(app){
    var autenticar = app.api.autenticar;

    app.route('/autentica')
        .post(autenticar.autentica);

    app.use('/gesac/*', autenticar.verificaToken);
}