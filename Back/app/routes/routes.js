module.exports = function(app){

    let pontoPresenca = app.api.pontoPresenca;
    let contato = app.api.contato;
    let instituicaoResponsavel = app.api.instituicaoResponsavel;
    let representanteLegal = app.api.representanteLegal;
    let empresa = app.api.empresa;
    let contrato = app.api.contrato;
    let lote = app.api.lote;
    let velocidade = app.api.velocidade;
    let tipologia = app.api.tipologia;
    let municipio = app.api.municipio;
    let usuario = app.api.usuario;
    let exportar = app.api.exportarExcel;


//*************** Rotas em pontoPresenca ***************//
    //Ponto de Presença
    app.route('/gesac/pontoPresenca')
        .get(pontoPresenca.listaPontoPresenca)
        .post(pontoPresenca.salvaPontoPresenca);

    app.route('/gesac/visuPontoPresenca/:cod_gesac')
        .get(pontoPresenca.visualizaPontoPresenca);

    app.route('/gesac/pontoPresenca/:cod_pid')
        .put(pontoPresenca.editaPontoPresenca);

    //Endereço
    app.route('/gesac/pontoEndereco')
        .post(pontoPresenca.salvaPontoEndereco);

    app.route('/gesac/pontoEndereco/:cod_gesac')
        .get(pontoPresenca.listaPontoEndereco);
    
    app.route('/gesac/pontoEnderecoAtual/:cod_gesac')
        .get(pontoPresenca.listaPontoEnderecoAtual);
        
    //Tipologia
    app.route('/gesac/pontoTipologia/:cod_gesac')
        .get(pontoPresenca.listaPontoTipologia);

    app.route('/gesac/pontoTipologia')
        .post(pontoPresenca.salvaPontoTipologia);

    app.route('/gesac/pontoTipologia/:cod_gesac/:cod_tipologia')
        .delete(pontoPresenca.apagaPontoTipologia);

    //Contato
    app.route('/gesac/visuPontoContato/:cod_gesac')
        .get(pontoPresenca.visualizaPontoContato);

    //Solicitação
    app.route('/gesac/pontoSolicitacao')
        .get(pontoPresenca.listaTipoSolicitacao)
        .post(pontoPresenca.salvaSolicitacao);

    app.route('/gesac/pontoSolicitacao/:data_sistema/:tipo_solicitacao/:cod_gesac')
        .get(pontoPresenca.listaSolicitacaoId);

    app.route('/gesac/pontoSolicitacaoStatus/:cod_status')
        .get(pontoPresenca.listaTipoSolicitacaoStatus);

    //Analisar
    app.route('/gesac/visuPontoAnalise/:cod_gesac')
        .get(pontoPresenca.visualizaPontoAnalise);

    app.route('/gesac/pontoAnalise/:cod_analise')
        .get(pontoPresenca.listaAnaliseId)
        .put(pontoPresenca.editaAnalise);

    //Interacao
    app.route('/gesac/pontoInteracao')
        .post(pontoPresenca.salvaInteracao);

    app.route('/gesac/pontoInteracao/:data/:cod_gesac')
        .get(pontoPresenca.ListaInteracaoId);

    //Histórico
    app.route('/gesac/pontoHistorico/:cod_gesac')
        .get(pontoPresenca.listaHistoricoPontoPresenca);

    //Status
    app.route('/gesac/listStatusPP')
        .get(pontoPresenca.listaTodosStatus);
    
//-----Detalhe-------------------------------------------------, Ruan que fez!
    app.route('/gesac/detPontoPresenca/:cod_gesac')
        .get(pontoPresenca.detalhePontoPresenca);


//*************** Rotas em contato ***************//
    app.route('/gesac/contato')
        .post(contato.salvaContato);

    app.route('/gesac/contato/:nomePessoa')
        .get(contato.listaContato);

    app.route('/gesac/contatoInfo/:cod_pessoa')
        .get(contato.listaContatoInfo);

    app.route('/gesac/contatoInstituicao/:cod_instituicao')
        .get(contato.listaContatoInstituicao);

    app.route('/gesac/contatoEmpresa/:cnpj_empresa')
        .get(contato.listaContatoEmpresa);

    app.route('/gesac/contatoPonto/:cod_gesac')
        .get(contato.listaContatoPonto);

    app.route('/gesac/contato/:cod_contato')
        .put(contato.editaContato)
        .delete(contato.apagaContato);

    app.route('/gesac/contatoDados/:cod_contato')
        .get(contato.listaContatoDados);

    app.route('/gesac/telefone')
        .post(contato.salvaTelefone);

    app.route('/gesac/telefone/:cod_telefone/:cod_pessoa')
        .put(contato.editaTelefone)
        .delete(contato.apagaTelefone);

    app.route('/gesac/pessoa')
        .post(contato.salvaPessoa);


//*************** Rotas em instituicaoResponsavel ***************//
    app.route('/gesac/instituicaoResponsavel')
        .get(instituicaoResponsavel.listaInstituicaoResponsavel)
        .post(instituicaoResponsavel.salvaInstituicaoResponsavel);

    app.route('/gesac/instituicaoResponsavel/:cod_instituicao')
        .get(instituicaoResponsavel.listaInstituicaoResponsavelId)
        .put(instituicaoResponsavel.editaInstituicaoResponsavel)
        .delete(instituicaoResponsavel.apagaInstituicaoResponsavel);

    app.route('/gesac/instituicaoGesac/:cod_instituicao')
        .get(instituicaoResponsavel.listaInstituicaoGesac);

    app.route('/gesac/instituicaoPagadora')
        .get(instituicaoResponsavel.listaInstituicaoPagadora);


//*************** Rotas em representanteLegal ***************//
    app.route('/gesac/representanteLegal')
        .post(representanteLegal.salvaRepresentanteLegal);

    app.route('/gesac/representanteLegalInst/:cod_instituicao')
        .get(representanteLegal.listaRepresentanteLegalInst);

    app.route('/gesac/representanteLegal/:cod_representante')
        .get(representanteLegal.listaRepresentanteLegalId)
        .put(representanteLegal.editaRepresentanteLegal)


//*************** Rotas em empresa ***************//
    //Empresa
    app.route('/gesac/empresa')
        .get(empresa.listaEmpresa)
        .post(empresa.salvaEmpresa);

    app.route('/gesac/empresa/:cnpj_empresa')
        .get(empresa.listaEmpresaCnpj)
        .put(empresa.editaEmpresa)
        .delete(empresa.apagaEmpresa);

    app.route('/gesac/empresaPai')
        .get(empresa.listaEmpresaPai);

    //Contato
    app.route('/gesac/visuEmpresaContato/:cnpj_empresa')
        .get(empresa.visualizaEmpresaContato);


//*************** Rotas em contrato ***************//
    //Contrato
    app.route('/gesac/contrato')
        .get(contrato.listaContrato)
        .post(contrato.salvaContrato);

    app.route('/gesac/contrato/:num_contrato')
        .get(contrato.listaContratoId)
        .put(contrato.editaContrato);

    //Lote
    app.route('/gesac/visuContratoLote/:num_contrato')
        .get(contrato.visualizaContratoLote);


//*************** Rotas em lote ***************//
    app.route('/gesac/lote')
        .post(lote.salvaLote);
    
    app.route('/gesac/lote/:cod_lote')
        .put(lote.editaLote)
        .delete(lote.apagaLote);

    app.route('/gesac/loteContrato/:num_contrato')
        .get(lote.listaLoteContrato);


//*************** Rotas em velocidade ***************//
    app.route('/gesac/velocidade')
        .post(velocidade.salvaVelocidade);
    
    app.route('/gesac/velocidade/:cod_lote')
        .get(velocidade.listaVelocidadeLote);


//*************** Rotas em tipologia ***************//
    app.route('/gesac/tipologia')
        .get(tipologia.listaTipologia)
        .post(tipologia.salvaTipologia);

    app.route('/gesac/tipologia/:cod_tipologia')
        .put(tipologia.editaTipologia)
        .delete(tipologia.apagaTipologia);


//*************** Rotas em municipio ***************//
    app.route('/gesac/municipio')
        .get(municipio.listaMunicipio)

    app.route('/gesac/uf')
        .get(municipio.listaUf);

        
//*************** Rotas em usuario ***************//
    app.route('/gesac/usuario')
        .get(usuario.listaUsuario)
        .post(usuario.salvaUsuario);

    app.route('/gesac/usuario/:cod_usuario')
        .get(usuario.listaUsuarioId)
        .put(usuario.editaUsuario)

    app.route('/gesac/alteraSenha/:cod_usuario')
        .put(usuario.alteraSenha);


//*************** Rotas em exportarExcel ***************//
    app.route('/gesac/geraExcel')
        .get(exportar.exportaExcel);


}