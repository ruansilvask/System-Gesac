import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { GESAC_API } from '../app.api';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ApiServiceEstadoMunicipio {


  private ufs: any;
  private municipios: any;
  private muniUfs: any;


  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.emitirUsuario.subscribe(res => {
      this.getUfs();
    });

    if (authenticationService.isLogado()) {
      this.getUfs();
    }
  }

  getUfs() {
    this.http
      .get(`${GESAC_API}uf`)
      .subscribe(ufs => (this.ufs = ufs));
  }

  getEstados() {
    return this.ufs;
  }

  getMunicipios(uf) {
    this.muniUfs = [];
    this.http
      .get(`${GESAC_API}municipio/${uf}`)
      .subscribe(municipios => {
        this.municipios = municipios;
        for (let i = 0; i < this.municipios.length; i++) {
          if (uf === this.municipios[i].uf) {
            this.muniUfs.push(this.municipios[i]);
          }
        }
      });
    return this.muniUfs;
  }



}
