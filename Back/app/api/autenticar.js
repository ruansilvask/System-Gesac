var jwt = require('jsonwebtoken');

module.exports = function(app){
    let api = {};

    //Valida o Login do Usuário e cria o Token de acesso. 
    api.autentica = (req, res) => {
    	const knex = app.conexao.conexaoBDKnex();
        var user = req.body;

        knex.select('*').from('usuario').where('login', user.login)
            .then(resultado => {
                knex.destroy();
                if(resultado[0]){
                    if(resultado[0].status === 'A'){
                        if(resultado[0].senha === user.senha){
                            var token = jwt.sign({login: resultado[0].login}, app.get('secret'), { expiresIn: 43200 }); //28800s = 8H
                            res.set({'x-access-token': token});
                            res.status(200).json({token, 'cod_usuario': resultado[0].cod_usuario, 'nome': resultado[0].nome});

                        } else { res.status(401).send('Senha incorreta'); }

                    } else { res.status(401).send('Este login está inativo.'); }

                } else { res.status(401).send('Este login não existe.'); }

            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    };

    //Verifica o Token de acesso do Usuário.
    api.verificaToken = (req, res, next) => {
        var token = req.headers['x-access-token'];
        
        if(req.headers['access-control-request-headers'])
        return next();
        
        if(token){
            jwt.verify(token, app.get('secret'), (erro, decoded) => {
                if(erro){
                    return res.sendStatus(401);
                }else{
                    req.usuario = decoded;
                    next();
                }
            });
        }else{
            return res.sendStatus(401);
        }
        
    };

    return api;
}