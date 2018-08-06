import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { GESAC_API } from './app.api';

import Swal from 'sweetalert2';
import { AuthenticationService } from './services';

@Injectable()
export class AppService {
  private ufs: any;
  private municipios: any;
  private muniUfs: any;

  private newObjeto: any;
  private ObjetoFinal: any;
  private quantPag: number;
  private cont: number;

  private toast = (Swal as any).mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.emitirUsuario.subscribe(
      res => {
        this.http
        .get(`${GESAC_API}uf`).subscribe(ufs => this.ufs = ufs);

        this.http
        .get(`${GESAC_API}municipio`)
        .subscribe(municipios => (this.municipios = municipios));
      }
    );
  }

  setMsg(type, msg, time) {
      return this.toast({
        type: type,
        title: msg,
        timer: time
      });
    }

  getEstados() {
    return this.ufs;
  }


  getMunicipios(uf: any) {
    this.muniUfs = [];
    for (let i = 0; i < this.municipios.length; i++) {
      if (uf === this.municipios[i].uf) {
        this.muniUfs.push(this.municipios[i]);
      }
    }
    return this.muniUfs;
  }

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

  formatData(data) {
    return new DatePipe('en-US').transform(data, 'y-MM-dd');
  }

  handleError(err: any): Promise<any> {
    console.log('Error: ', err);
    return Promise.reject(err.message || err);
  }


  validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

   if (cnpj == '') {
      return false;
     }

   if (cnpj.length != 14) {
     return false;
   }

   // Elimina CNPJs invalidos conhecidos
   if (
     cnpj == '00000000000000' ||
     cnpj == '11111111111111' ||
     cnpj == '22222222222222' ||
     cnpj == '33333333333333' ||
     cnpj == '44444444444444' ||
     cnpj == '55555555555555' ||
     cnpj == '66666666666666' ||
     cnpj == '77777777777777' ||
     cnpj == '88888888888888' ||
     cnpj == '99999999999999'
   ) {
     return false;
   }

   // Valida DVs
   let tamanho = cnpj.length - 2;
   let numeros = cnpj.substring(0, tamanho);
   const digitos = cnpj.substring(tamanho);
   let soma = 0;
   let pos = tamanho - 7;
   for (let i = tamanho; i >= 1; i--) {
     soma += numeros.charAt(tamanho - i) * pos--;
     if (pos < 2) {
       pos = 9;
     }
   }
   let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
   if (resultado != digitos.charAt(0)) {
     return false;
   }

   tamanho = tamanho + 1;
   numeros = cnpj.substring(0, tamanho);
   soma = 0;
   pos = tamanho - 7;
   for (let i = tamanho; i >= 1; i--) {
     soma += numeros.charAt(tamanho - i) * pos--;
     if (pos < 2) {
       pos = 9;
     }
   }
   resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
   if (resultado != digitos.charAt(1)) {
     return false;
   }

   return true;
 }



  // rota para gerar o excel
  getExcel(): Observable<any> {
    return this.http.get(`${GESAC_API}geraExcel`, {
      responseType : 'blob',
      headers: new HttpHeaders().append('Content-Type', 'applicantion/json')
    })
    .map(res => res);
  }

}
