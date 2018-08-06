import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Response } from '@angular/http';

import { GESAC_API } from '../app.api';
import { Empresa } from './empresa.model';

@Injectable()
export class EmpresaService {

  constructor(
    private http: HttpClient
  ) { }

  getEmpresas() {
    return this.http.get<Empresa[]>(`${GESAC_API}empresa`);
  }

  getEmpresa(cnpjEmpresa) {
    return this.http.get<Empresa[]>(`${GESAC_API}empresa/${cnpjEmpresa}`);
  }

  getEmpresasPai() {
    return this.http.get<Empresa[]>(`${GESAC_API}empresaPai`);
  }

  postEmpresa(form) {
    return this.http.post(`${GESAC_API}empresa`, form)
    .map((res: Response) => res);
  }

  putEmpresa(cnpjEmpresa, form) {
    return this.http.put(`${GESAC_API}empresa/${cnpjEmpresa}`, form)
    .map((res: Response) => res);
  }

  deleteEmpresa(cnpjEmpresa) {
    return this.http.delete(`${GESAC_API}empresa/${cnpjEmpresa}`)
    .map((res: Response) => res);
  }

  getEmpresaContatosId(cnpjEmpresa) {
    return this.http.get(`${GESAC_API}visuEmpresaContato/${cnpjEmpresa}`)
    .map((res: Response) => res);
  }


}
