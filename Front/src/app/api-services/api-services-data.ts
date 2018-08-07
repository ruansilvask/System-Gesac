import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';



@Injectable()
export class ApiServicesData {

  constructor() {
  }

  formatData(data) {
    return new DatePipe('en-US').transform(data, 'y-MM-dd');
  }

}
