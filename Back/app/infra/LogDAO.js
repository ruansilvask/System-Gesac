class LogDAO {
	constructor(connection) {
		this._knex = connection;
    }
    //---------------Querys de Contato ---------------//
	//Insere Logs da tabela contato 
    logContato(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2};
        this._knex('log').insert(insertLog)
            .then(resultado => {})
            .catch(erro => {console.log(erro);});
    }

	//Insere Logs da tabela telefone 
    logTelefone(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2};
        this._knex('log').insert(insertLog)
            .then(resultado => {})
            .catch(erro => {console.log(erro);});
    }

	//Insere Logs da tabela pessoa 
    logPessoa(cod_usuario, nome_tabela, operacao, espelho, cod_int_1){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1};
        this._knex('log').insert(insertLog)
            .then(resultado => {})
            .catch(erro => {console.log(erro);});
    }

    //---------------Querys de Contrato ---------------//
	//Insere Logs da tabela contrato 
    logContrato(cod_usuario, nome_tabela, operacao, espelho, cod_contrato){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_contrato};
        this._knex('log').insert(insertLog)
            .then(resultado => {})
            .catch(erro => {console.log(erro);});
    }

    //---------------Querys de Empresa ---------------//
	//Insere Logs da tabela empresa 
    logEmpresa(cod_usuario, nome_tabela, operacao, espelho, cod_cnpj_1){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_cnpj_1};
        this._knex('log').insert(insertLog)
            .then(resultado => {})
            .catch(erro => {console.log(erro);});
    }

    //---------------Querys de Instituição Responsável ---------------//
	//Insere Logs da tabela instituicao_resp 
    logInstituicaoResponsavel(cod_usuario, nome_tabela, operacao, espelho, cod_int_1){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1};
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }

    //---------------Querys de Lote ---------------//
	//Insere Logs da tabela lote 
    logLote(cod_usuario, nome_tabela, operacao, espelho, cod_int_1){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1};
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }

    //---------------Querys de Ponto de Presença ---------------//
    //Insere Logs da tabela pid 
    logPid(cod_usuario, nome_tabela, operacao, espelho, cod_int_1){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1};
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }

    //Insere Logs da tabela gesac 
    logGesac(cod_usuario, nome_tabela, operacao, espelho, cod_int_1){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1};
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }

    //Insere Logs da tabela endereco 
    logEndereco(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2};
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }

    //Insere Logs da tabela pid_tipologia 
    logPidTipologia(cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1, cod_int_2};
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }
    
    //Insere Logs da tabela solicitacao     - cods_gesac recebe um array com todos códigos da requisição
    logSolicitacao(cod_usuario, nome_tabela, operacao, espelho, cod_data, cod_int_1, cods_gesac){
        let insertLog = [];
        for(let i=0; i<cods_gesac.length; i++){
            insertLog [i]= {cod_usuario, nome_tabela, operacao, espelho, cod_data, cod_int_1, cod_int_2: cods_gesac[i]};
        }
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }

    //Insere Logs da tabela analise     - cod_analise recebe um array com todos códigos da requisição
    logAnalise(cod_usuario, nome_tabela, operacao, espelho, cod_analise){
        let insertLog = [];
        if(Array.isArray(cod_analise)){
            for(let i=0; i<cod_analise.length; i++){                      
                insertLog [i] = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1: cod_analise[i]};
            }
        }
        else{
            insertLog [0] = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1: cod_analise};
        }
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }

    //Insere Logs da tabela interacao 
    logInteracao(cod_usuario, nome_tabela, operacao, espelho, cod_data, cod_int_1){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_data, cod_int_1};
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }

    //Insere Logs da tabela gesac_obs_acao     - cods_gesac recebe um array com todos códigos da requisição
    logGesacObsAcao(cod_usuario, nome_tabela, operacao, espelho, cods_gesac, cod_int_2){
        let insertLog = [];
        if(Array.isArray(cods_gesac)){
            for(let i=0; i<cods_gesac.length; i++){                      
                insertLog [i] = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1: cods_gesac[i], cod_int_2};
            }
        }
        else{
            insertLog [0] = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1: cods_gesac, cod_int_2};
        }
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }


    //---------------Querys de Representante Legal ---------------//
    //Insere Logs da tabela representante_legal 
    logRepresentanteLegal(cod_usuario, nome_tabela, operacao, espelho, cod_int_1){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1};
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }

    //---------------Querys de Tipologia ---------------//
    //Insere Logs da tabela tipologia 
    logTipologia(cod_usuario, nome_tabela, operacao, espelho, cod_int_1){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1};
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }

    //---------------Querys de Usuário ---------------//
    //Insere Logs da tabela usuario 
    logUsuario(cod_usuario, nome_tabela, operacao, espelho, cod_int_1){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1};
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }

    //---------------Querys de Velocidade ---------------//
    //Insere Logs da tabela velocidade 
    logVelocidade(cod_usuario, nome_tabela, operacao, espelho, cod_int_1){
        let insertLog = {cod_usuario, nome_tabela, operacao, espelho, cod_int_1};
        this._knex('log').insert(insertLog)
            .then(() => {})
            .catch(erro => {console.log(erro);});
    }
    
}

module.exports = () => {
	return LogDAO;
};