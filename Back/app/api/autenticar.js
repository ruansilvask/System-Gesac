var jwt = require('jsonwebtoken');

//let usuarioLogado = [];

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
                    //if(!(usuarioLogado.some(i=>i==resultado[0].cod_usuario))){
                        if(resultado[0].status === 'A'){
                            if(resultado[0].senha === user.senha){
                                var token = jwt.sign({login: resultado[0].login, cod_usuario: resultado[0].cod_usuario}, app.get('secret'), { expiresIn: 43200 }); //28800s = 8H
                                res.set({'x-access-token': token});

                                var date = new Date();
                                var dataLogin = `${date.toISOString().slice(0,4)}-${date.toISOString().slice(5,7)}-${date.toISOString().slice(8,10)} ${date.toISOString().slice(11,13)-3}.${date.toISOString().slice(14,16)}.${date.toISOString().slice(17,19)}`;
    
                                console.log(`O usuário ${resultado[0].nome} acabou de logar.  ${dataLogin}`);
    
                                //usuarioLogado.push(resultado[0].cod_usuario);
                                res.status(200).json({token});
    
                            } else { console.log('Senha Incorreta.'); res.status(401).send('Senha incorreta'); }
    
                        } else { console.log('Login inativo'); res.status(401).send('Este login está inativo.'); }
                   // } else { res.status(401).send('Este usuário já está logado.'); }
                } else { console.log('Login não existe'); res.status(401).send('Este login não existe.'); }

            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    };

    //Exibe o nome do usuário que deslogou.
    api.desloga = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const cod_usuario = req.body.cod_usuario;

        knex.select('cod_usuario', 'nome').from('usuario').where('cod_usuario', cod_usuario)
            .then(resultado => {
                var date = new Date();
                var dataLogof = `${date.toISOString().slice(0,4)}-${date.toISOString().slice(5,7)}-${date.toISOString().slice(8,10)} ${date.toISOString().slice(11,13)-3}.${date.toISOString().slice(14,16)}.${date.toISOString().slice(17,19)}`;

               // usuarioLogado.splice(usuarioLogado.indexOf(resultado[0].cod_usuario), 1)

                console.log(`O usuário ${resultado[0].nome} acabou de deslogar. ${dataLogof}`);
                res.status(200).end();
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });
    }

    //Verifica o Token de acesso do Usuário.
    api.verificaToken = (req, res, next) => {
        let token = req.headers['x-access-token'];
        let cod_usuario = req.headers['cod_usuario'];
        
        if(req.headers['access-control-request-headers'])
        return next();
        
        if(token){
            jwt.verify(token, app.get('secret'), (erro, decoded) => {
                if(erro){
                    return res.sendStatus(401);
                }else{
                    if(cod_usuario == decoded.cod_usuario){
                        req.usuario = decoded;
                        next();
                    }else{
                        return res.sendStatus(401);
                    }
                }
            });
        } else {
            return res.sendStatus(401);
        }
        
    };

    return api;
}