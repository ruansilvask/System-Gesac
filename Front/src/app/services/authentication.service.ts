import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../app.api';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { StorageService } from './storage.service';

@Injectable()
export class AuthenticationService {

  emitirUsuario = new EventEmitter();

  helper: JwtHelper = new JwtHelper();

    constructor(
      private http: HttpClient,
      private router: Router,
      private storageService: StorageService
    ) {}

  login(login: string, senha: string) {
      return this.http.post<any>(`${API.AUTH_API}autentica`, { login: login, senha: senha });
  }

  successfulLogin(authorizationValue) {
    const token = authorizationValue;
    const localUser = {
      token: token,
      user: this.helper.decodeToken(token).login,
      coduser: this.helper.decodeToken(token).cod_usuario
    };
    this.storageService.setLocalUser(localUser);
  }

  verificaUser() {
    const token = this.storageService.getLocalUser().token;
    return this.helper.decodeToken(token).cod_usuario;
  }

  logout() {
    this.storageService.setLocalUser(null);
    this.router.navigate(['/login']);
  }

  isLogado () {
    if (this.storageService.getLocalUser()) {
      return true;
    } else {
      return false;
    }
  }

}
