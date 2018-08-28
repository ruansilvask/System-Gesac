import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import 'rxjs/add/operator/map';

import { API } from '../app.api';
import { Contrato } from './contrato.model';
import { Lote } from './lote.model';

@Injectable()
export class ContratoService {

  constructor(
    private http: HttpClient
  ) { }

  // CONTRATOS

  getContratos() {
    return this.http.get<Contrato[]>(`${API.GESAC_API}contrato`);
  }

  getContrato(idContrato) {
    return this.http.get<Contrato[]>(`${API.GESAC_API}contrato/${idContrato}`);
  }

  postContrato(form) {
    return this.http.post(`${API.GESAC_API}contrato`, form)
    .map((res: Response) => res);
  }

  putContrato(idContrato, form) {
    return this.http.put(`${API.GESAC_API}contrato/${idContrato}`, form)
    .map((res: Response) => res);
  }

  // LOTES

  getLotes(numContrato) {
    return this.http.get<Lote[]>(`${API.GESAC_API}loteContrato/${numContrato}`);
  }

  postLote(num_contrato, lote) {
    return this.http.post(`${API.GESAC_API}lote`, {num_contrato, lote})
    .map((res: Response) => res);
  }

  putLote(codLote, lote) {
    return this.http.put(`${API.GESAC_API}lote/${codLote}`, {lote})
    .map((res: Response) => res);
  }

  deleteLote(codLote) {
    return this.http.delete(`${API.GESAC_API}lote/${codLote}`)
    .map((res: Response) => res);
  }

  getVisuLote(codContrato) {
    return this.http.get(`${API.GESAC_API}visuContratoLote/${codContrato}`)
    .map((res: Response) => res);
  }

// VELOCIDADE

  getVelocidade(codLote) {
    return this.http.get(`${API.GESAC_API}velocidade/${codLote}`)
    .map((res: Response) => res);
  }


  postVelocidade(form) {
    return this.http.post(`${API.GESAC_API}velocidade`, form)
    .map((res: Response) => res);
  }


}
