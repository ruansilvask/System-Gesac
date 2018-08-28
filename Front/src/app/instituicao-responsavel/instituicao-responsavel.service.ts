import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Response } from '@angular/http';

import { API } from '../app.api';
import { InstituicaoResp } from './instituicao-responsavel.model';

@Injectable()
export class InstRespService {
  idRepLegalPut: any;

  constructor(private http: HttpClient) {}

  // INSTITUIÇÃO RESPONSAVEL

  // Protocolo HTTP para lista todas as insituições responsaveis
  getInstResps() {
    return this.http
      .get<InstituicaoResp[]>(`${API.GESAC_API}instituicaoResponsavel`)
      .map(res => res);
  }

  // Protocolo HTTP para lista a instituição responsavel, passando o codigo ID
  getInstResp(idInstResp) {
    return this.http
      .get<InstituicaoResp>(`${API.GESAC_API}instituicaoResponsavel/${idInstResp}`)
      .map(res => res);
  }

  // Protocolo HTTP para atualiza instituição responsavel
  putInstResp(idIR, form) {
    return this.http
    .put(`${API.GESAC_API}instituicaoResponsavel/${idIR}`, form)
    .map(res => res);
  }

  //  Protocolo HTTP parav salva a instituição responsavel
  postInstResp(valor) {
    return this.http
      .post<InstituicaoResp>(`${API.GESAC_API}instituicaoResponsavel`, valor)
      .map(res => res);
  }


  //  Protocolo HTTP para remove a instituição responsavel
  deleteInstResp(idInstResp) {
    return this.http
      .delete(`${API.GESAC_API}instituicaoResponsavel/${idInstResp}`)
      .map(res => res);
  }

  // REPRESENTANTE LEGAL

  //  Protocolo HTTP para lista todos os contatos da instituição responsavel

  getRepresentanteLegalId(idRepresentante) {
    return this.http
      .get(`${API.GESAC_API}representanteLegalInst/${idRepresentante}`)
      .map(res => res);
  }

  // Protocolo HTTP para inserir o representante legal da institução responsável
  postRepLegalInstResp(dados) {
    return this.http
      .post(`${API.GESAC_API}representanteLegal`, dados)
      .map(res => res);
  }

  //  Protocolo HTTP para atualizar o representate da institução responsável, passando o objeto e o ID Instituição
  putRepLegalInstResp(dados, id) {
    return this.http
    .put(`${API.GESAC_API}representanteLegal/${id}`, dados)
    .map((res: Response) => res);
  }

  //  Protocolo HTTP para capturar os contato representante legal

  getContatoInstResp(idContatoInstResp) {
    return this.http
      .get(`${API.GESAC_API}contatoInstituicao/${idContatoInstResp}`)
      .map(res => res);
  }

    //  Protocolo HTTP trazer todos os cod_gesacs vinculados a instituição responsável
  getPagadora(instRespID) {
    return this.http
      .get(`${API.GESAC_API}instituicaoGesac/${instRespID}`)
      .map(res => res);
  }


}
