module.exports = function(app){
    let api = {};

    //Lista todos os Usuários.
    api.listaUsuario = (req, res) => {
        const connection = app.conexao.conexaoBD();
        const usuarioDAO = new app.infra.UsuarioDAO(connection);

        usuarioDAO.listarUsuario((erro, resultado) => {
            erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
        });

        connection.end();
    };

    //Lista os Usuários com base no cod_usuario.
    api.listaUsuarioId = (req, res) => {
        const { cod_usuario } = req.params; 

        if(cod_usuario){
            const connection = app.conexao.conexaoBD();
            const usuarioDAO = new app.infra.UsuarioDAO(connection);
    
            usuarioDAO.listarUsuarioId(cod_usuario, (erro, resultado) => {
                erro ? (console.log(erro), res.status(500).send(app.api.erroPadrao())) : res.status(200).json(resultado);
            });
    
            connection.end();
        } else { res.status(400).send(app.api.erroPadrao()); }
    };

    //Salva um novo Usuário.
    api.salvaUsuario = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const usuario = req.body;
        const logDAO = new app.infra.LogDAO(knex);
        
        knex('usuario').insert(usuario)
            .then(resultado => {
                logDAO.logUsuario(req.headers['cod_usuario'], 'usuario', 'i', null, resultado[0]);
                knex.destroy();
                res.status(200).end();
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                if(erro.errno == 1062){
                    res.status(500).send('Este login já está cadastrado.');
                } else {
                    res.status(500).send(app.api.erroPadrao());
                }
            });
    };

    //Atualiza os dados de um Usuário.
    api.editaUsuario = (req, res) => {
        const { cod_usuario } = req.params;

        if(cod_usuario){
            const usuario = req.body;
            const connection = app.conexao.conexaoBD();
            const usuarioDAO = new app.infra.UsuarioDAO(connection);
            usuarioDAO.listarUsuarioLog(cod_usuario, (erro, resultado) =>{
                if(erro){
                    console.log(erro);
                    res.status(500).send(app.api.erroPadrao());
                }
                else{
                    const knex = app.conexao.conexaoBDKnex();
                    const logDAO = new app.infra.LogDAO(knex);
                    let espelho = resultado[0].espelho;
                    knex('usuario').where('cod_usuario', cod_usuario).update(usuario)
                        .then(resultado => {
                            logDAO.logUsuario(req.headers['cod_usuario'], 'usuario', 'u', espelho, cod_usuario);
                            knex.destroy();
                            res.status(200).end();
                        })
                        .catch(erro => {
                            console.log(erro);
                            knex.destroy();
                            if(erro.errno == 1062){
                                res.status(500).send('Este login já está cadastrado.');
                            } else {
                                res.status(500).send(app.api.erroPadrao());
                            }
                        });
                }
            });
            connection.end();
        }else { res.status(400).send(app.api.erroPadrao()); }
    }

    //Alteração de Senha.
    api.alteraSenha = (req, res) => {
        const knex = app.conexao.conexaoBDKnex();
        const { cod_usuario } = req.params;
        const { senhaAntiga, senha } = req.body;

        knex.select('*').from('usuario').where('cod_usuario', cod_usuario)
            .then(resultado => {
                if(senhaAntiga === resultado[0].senha){
                    if(senha === resultado[0].senha){
                        res.status(500).send('A nova senha não pode ser igual a senha atual.');
                        knex.destroy();
                    } else {
                        const connection = app.conexao.conexaoBD();
                        const usuarioDAO = new app.infra.UsuarioDAO(connection);
                        usuarioDAO.listarUsuarioLog(cod_usuario, (erro,resultadoLog) => {
                            if(erro){
                                console.log(erro);
                                res.status(500).send(app.api.erroPadrao());
                                knex.destroy();
                            }
                            else{
                                const logDAO = new app.infra.LogDAO (knex);
                                let espelho = resultadoLog[0].espelho;
                                return knex('usuario').where('cod_usuario', cod_usuario).update({ senha })
                                    .then(resultado => {
                                        logDAO.logUsuario(req.headers['cod_usuario'], 'usuario', 'u', espelho, cod_usuario);
                                        knex.destroy();
                                        res.status(200).json({msg : 'Senha Alterada com Sucesso.'});
                                    })
                                    .catch(erro => {
                                        console.log(erro);
                                        knex.destroy();
                                        res.status(500).send('Erro ao Alterar a Senha.');
                                    });
                            }
                        });
                        connection.end();
                    }
                } else {
                    knex.destroy();
                    res.status(500).send('Senha Antiga Incorreta.');
                }
            })
            .catch(erro => {
                console.log(erro);
                knex.destroy();
                res.status(500).send(app.api.erroPadrao());
            });

        
    }

    return api;
}