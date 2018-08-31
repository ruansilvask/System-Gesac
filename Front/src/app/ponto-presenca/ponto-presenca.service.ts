import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/map';

import { API } from '../app.api';
import { PontoPresenca } from './ponto-presenca.model';
import { Contrato } from '../contrato/contrato.model';
import { InstituicaoResp } from '../instituicao-responsavel/instituicao-responsavel.model';

@Injectable()
export class PontoPresencaService {
  private headers: Headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  /*
  * Protocolos HTTP do Ponto de presenca
  */

  /*
  * Protocolo HTTP do ponto de presenca para trazer do banco
  */
  getPontoPresenca() {
    return this.http
      .get<PontoPresenca>(`${API.GESAC_API}pontoPresenca`)
      .map(res => res);
  }

  /*
  * Protocolo HTTP do ponto de presenca para trazer do banco pelo id
  */
  getPontoPresencaPorId(id: number) {
    return this.http
      .get<PontoPresenca>(`${API.GESAC_API}visuPontoPresenca/${id}`)
      .map(res => res);
  }
  /*
   * Protocolo HTTP para trazer o historico do ponto presença passando o cod_gesac
   */
  getPontoHistorico(cod_gesac) {
    return this.http
      .get(`${API.GESAC_API}pontoHistorico/${cod_gesac}`)
      .map(res => res);
  }

  /*
  * Protocolo HTTP do ponto de presenca para trazer os detalhes do banco pelo id
  */
  getDetalhePontoPresenca(cod_gesac) {
    return this.http
      .get(`${API.GESAC_API}detPontoPresenca/${cod_gesac}`)
      .map(res => res);
  }

  /*
  * Protocolo HTTP do ponto de presenca para salvar no banco
  */
  postPontoPresenca(form) {
    return this.http
      .post<PontoPresenca>(`${API.GESAC_API}pontoPresenca`, form)
      .map(res => res);
  }

  /*
* Protocolo HTTP do Ponto de presenca para editar as informacões no banco
*/
  putPontoPresenca(id, form) {
    return this.http.put<PontoPresenca>(
      `${API.GESAC_API}pontoPresenca/${id}`, form
    );
  }

  /*
* Protocolos HTTP de Endereco
*/

  /*
  * Protocolo HTTP do Endereco para trazer do banco pelo id, para a tela de detalhe do pp
  */
  getEnderecoDetalhe(idGesac) {
    return this.http
      .get(`${API.GESAC_API}pontoEndereco/${idGesac}`)
      .map(res => res);
  }


  /*
  * Protocolo HTTP do Endereco para salvar no banco
  */
  postEndereco(form) {
    console.log(form);
    return this.http
      .post<PontoPresenca>(`${API.GESAC_API}pontoEndereco`, form)
      .map(res => res);
  }

  /*
* Protocolo HTTP do Endereco para editar as informacões no banco
*/
  putEndereco(id, codEnd, form) {
    return this.http
      .put(`${API.GESAC_API}pontoEndereco/${id}/${codEnd}`, form)
      .map(res => res);
  }

  /*
* Protocolo HTTP do Endereco para remover endereço no banco
*/

  deleteEnderecoPonto(cod_endereco, gesac) {
    return this.http
    .delete(`${API.GESAC_API}pontoEndereco/${cod_endereco}/${gesac}`)
    .map(res => res);
  }

  /*
  * Protocolo HTTP do Contrato para trazer do banco
  */
  getContratos() {
    return this.http.get<Contrato[]>(`${API.GESAC_API}contrato`).map(res => res);
  }

  /*
  * Protocolo HTTP de Empresa para trazer do banco
  */
  getEmpresas() {
    return this.http.get(`${API.GESAC_API}empresa`).map(res => res);
  }

  /*
  * Protocolo HTTP do Lote para trazer no banco pelo id contrato
  */
  getLotes(numContrato) {
    return this.http
      .get(`${API.GESAC_API}loteContrato/${numContrato}`)
      .map(res => res);
  }

  /*
  * Protocolo HTTP do Velocidade para trazer no banco pelo id Lote
  */
  getVelocidade(codLote) {
    return this.http
      .get(`${API.GESAC_API}velocidade/${codLote}`)
      .map((res: Response) => res);
  }

  /*
  * Protocolo HTTP do Instituicão Responsavel para trazer do banco
  */
  getInstResps() {
    return this.http
      .get<InstituicaoResp[]>(`${API.GESAC_API}instituicaoResponsavel`)
      .map(res => res);
  }


  /*
  * Protocolo HTTP do Status para trazer do banco
  */
 getStatusPP() {
  return this.http
  .get(`${API.GESAC_API}listStatusPP`)
  .map(res => res);
}



  /*
* Protocolos HTTP de Tipologia
*/

  /*
  * Protocolo HTTP do Tipologia para trazer do banco
  */
  getTipologia() {
    return this.http.get(`${API.GESAC_API}tipologia`).map(res => res);
  }

  /*
  * Protocolo HTTP do Tipologia para salvar no banco
  */
  postTipologia(form) {
    return this.http.post(`${API.GESAC_API}pontoTipologia`, form).map(res => res);
  }

  /*
  * Protocolo HTTP do Tipologia para trazer no banco pelo id pid
  */
  getTipologiaPP(id) {
    return this.http
      .get(`${API.GESAC_API}pontoTipologia/${id}`)
      .map(res => res);
  }

  /*
  * Protocolo HTTP do Tipologia para remover no banco pelo id do pid e da Tipologia
  */
  removeTipologiaId(id, cod_tipologia) {
    return this.http
      .delete(`${API.GESAC_API}pontoTipologia/${id}/${cod_tipologia}`)
      .map((res: Response) => res);
  }

  /*
  * Protocolo HTTP do Msolicitacões para salvar no banco
  */
  postMSolicitacoes(form) {
    return this.http.post(`${API.GESAC_API}pontoSolicitacao`, form).map(res => res);
  }
  /*
  * Protocolo HTTP do Msolicitacões para salvar no banco
  */
  getMSolicitacoes() {
    return this.http.get(`${API.GESAC_API}pontoSolicitacao`).map(res => res);
  }
  /*
 * Protocolo HTTP do Contatos do Ponto para trazer do banco
 */
  getContatosPonto(cod_gesac) {
    return this.http
      .get(`${API.GESAC_API}visuPontoContato/${cod_gesac}`)
      .map(res => res);
  }

  /*
  * Protocolo HTTP do status para trazer solicitações
  */
  getStatusSolicitacoes(cod_status) {
    return this.http
      .get(`${API.GESAC_API}pontoSolicitacaoStatus/${cod_status}`)
      .map(res => res);
  }

  /*
  * Protocolo HTTP do status para trazer solicitações
  */
  postInteracao(formInterecao) {
    return this.http
      .post(`${API.GESAC_API}pontoInteracao`, formInterecao)
      .map(res => res);
  }

  /*
    * Protocolo HTTP do detalhe da interacao
    */

   getHistoricoInteracao(cod_interacao, cod_gesac) {
    return this.http
      .get(`${API.GESAC_API}pontoInteracao/${cod_interacao}/${cod_gesac}`)
      .map(res => res);
  }

  /*
    * Protocolo HTTP para capturar tipo de interacao
    */

   getTipoInteracao() {
    return this.http
      .get(`${API.GESAC_API}pontoInteracao`)
      .map(res => res);
  }
  /*
    * Protocolo HTTP do detalhe da Solicitacao
    */

   getHistoricoSolicitacao(data, cod_gesac, tipo_solicitacao) {
    return this.http
      .get(
        `${API.GESAC_API}pontoSolicitacao/${data}/${tipo_solicitacao}/${cod_gesac}`
      )
      .map(res => res);
  }

  /*
    * Protocolo HTTP da analise
    */

  getAnaliseID(cod_gesac) {
    return this.http
      .get(`${API.GESAC_API}visuPontoAnalise/${cod_gesac}`)
      .map(res => res);
  }

  /*
    * Protocolo HTTP para inserir uma nova analise
    */

  postAnalise(form) {
    return this.http.post(`${API.GESAC_API}pontoAnalise`, form).map(res => res);
  }

  /*
    * Protocolo HTTP para editar a analise
    */

  putAnalise(form, codAnalise) {
    return this.http
      .put(`${API.GESAC_API}pontoAnalise/${codAnalise}`, form)
      .map(res => res);
  }

/*
    * Protocolo HTTP retornar os historico da analise
    */

  getHistoricoAnalise(cod_analise) {
    return this.http
      .get(`${API.GESAC_API}pontoAnalise/${cod_analise}`)
      .map(res => res);
  }



  /*
  * OBSERVAÇÔES AÇÕES
  */

  /*
  * Protocolo HTTP para inserir uma nova analise
  */
   getObsAcao() {
    return this.http.get(`${API.GESAC_API}obsAcao`).map(res => res);
  }

  /*
  * Protocolo HTTP para inserir uma nova analise
  */
 getObsAcaoSelecionadas(arrayCodsGsacs) {
  let params = new HttpParams();
  params = params.append('cod_gesac', arrayCodsGsacs);
  return this.http.get(`${API.GESAC_API}multObsAcao`, {params: params}).map(res => res);
}


   /*
    * Protocolo HTTP para inserir uma nova analise
    */

   salvarObsAcao(form) {
    return this.http.post(`${API.GESAC_API}obsAcao`, form).map(res => res);
  }

     /*
    * Protocolo HTTP para inserir uma nova analise
    */

   getObsAcaoporId(cod_gesac) {
    return this.http
      .get(`${API.GESAC_API}obsAcao/${cod_gesac}`)
      .map(res => res);
  }

/*
    * Protocolo HTTP retornar os historico da analise
    */

  removerObsAcao(form) {
    let params = new HttpParams();
    params = params.append('cod_gesac', form.cod_gesac);
    params = params.append('cod_obs', form.cod_obs);
    return this.http
      .delete(`${API.GESAC_API}obsAcao`, {params: params})
      .map(res => res);
  }

}
