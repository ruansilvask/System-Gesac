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
        
        knex('usuario').insert(usuario)
            .then(resultado => {
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
            const knex = app.conexao.conexaoBDKnex();
            const usuario = req.body;
    
            knex('usuario').where('cod_usuario', cod_usuario).update(usuario)
                .then(resultado => {
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
                    } else {
                        return knex('usuario').where('cod_usuario', cod_usuario).update({ senha })
                            .then(resultado => {
                                knex.destroy();
                                res.status(200).json({msg : 'Senha Alterada com Sucesso.'});
                            })
                            .catch(erro => {
                                console.log(erro);
                                knex.destroy();
                                res.status(500).send('Erro ao Alterar a Senha.');
                            });
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