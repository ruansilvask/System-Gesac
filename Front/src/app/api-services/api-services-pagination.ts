import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import 'rxjs/add/operator/map';




@Injectable()
export class ApiServicesPagination {
  private newObjeto: any;
  private ObjetoFinal: any;
  private quantPag: number;
  private cont: number;

  constructor() {}

  pagination(objeto: any, size: number) {
    this.newObjeto = [];
    this.ObjetoFinal = [];
    this.cont = 0;
    this.quantPag = Math.ceil(objeto.length / size);
    for (let i = 0; i < this.quantPag; i++) {
      for (let z = 0; z < size; z++) {
        if (this.cont >= objeto.length) {
          break;
        } else {
          this.newObjeto.push(objeto[this.cont]);
          this.cont++;
        }
      }
      this.ObjetoFinal[i] = this.newObjeto;
      this.newObjeto = [];
    }
    return this.ObjetoFinal;
  }
}
