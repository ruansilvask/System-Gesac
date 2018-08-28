import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { API } from '../app.api';



@Injectable()
export class ApiServiceExcel {

  constructor(
    private http: HttpClient
  ) {}

 getExcel(): Observable<any> {
    return this.http
      .get(`${API.GESAC_API}geraExcel`, {
        responseType: 'blob',
        headers: new HttpHeaders().append('Content-Type', 'applicantion/json')
      })
      .map(res => res);
  }

}
