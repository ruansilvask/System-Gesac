import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { AppService } from './../app.service';
import { GESAC_API } from '../app.api';
import { Tipologia } from './tipologia.model';



@Injectable()
export class TipologiaService {
  constructor(
    private http: HttpClient,
    private appService: AppService
  ) {}

  getTipologias() {
    return this.http
      .get<Tipologia>(`${GESAC_API}tipologia`)
      .catch(this.appService.handleError);
  }

  postTipologia(dados) {
    return this.http
      .post(`${GESAC_API}tipologia`, dados.value)
      .map((res: Response) => res);
  }

  deleteTipologia(id) {
    return this.http
      .delete(`${GESAC_API}tipologia/${id}`)
      .map((res: Response) => res);
  }

  putTipologia(dados) {
    return this.http
      .put(`${GESAC_API}tipologia/${dados.cod_tipologia}`, dados)
      .map((res: Response) => res);
  }

}

