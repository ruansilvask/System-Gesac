import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';





@Injectable()
export class ApiServiceHandleError {


  handleError(err: any): Promise<any> {
    console.log('Error: ', err);
    return Promise.reject(err.message || err);
  }

}