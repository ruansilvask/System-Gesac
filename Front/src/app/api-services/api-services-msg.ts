import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import Swal from 'sweetalert2';

import 'rxjs/add/operator/map';

@Injectable()
export class ApiServicesMsg {

  private toast = (Swal as any).mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

  setMsg(type, msg, time) {
    return this.toast({
      type: type,
      title: msg,
      timer: time
    });
  }

  constructor() {
  }
}
