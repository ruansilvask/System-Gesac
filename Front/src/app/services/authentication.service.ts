import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../app.api';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthenticationService {

  emitirUsuario = new EventEmitter();

    constructor(
      private http: HttpClient,
      private router: Router,
      private usuarioSevice: UsuarioService
    ) { }

    login(login: string, senha: string) {

        return this.http.post<any>(`${API.AUTH_API}autentica`, { login: login, senha: senha })
            .map(res => {
              if (res.token) {
                localStorage.setItem('currentUser', res.token);
                localStorage.setItem('currentCode', res.cod_usuario_cript);
                localStorage.setItem('currentUserCode', res.cod_usuario);
              }
              this.emitirUsuario.emit(res);
            });
    }

getToken() {
  return localStorage.getItem('currentUser');
}

getCode() {
  return localStorage.getItem('currentCode');
}

getUserCode() {
  return localStorage.getItem('currentUserCode');
}

verificaUser(): string {
  return localStorage.getItem('currentUserCode');
}

getUser() {
  this.usuarioSevice.getUsuario(this.verificaUser())
  .subscribe(res => {
    this.emitirUsuario.emit(res);
  });
}

logout() {
  if (localStorage.getItem('currentUserCode')) {
    this.http.post(`${API.GESAC_API}deslogar`, {cod_usuario: localStorage.getItem('currentUserCode')})
    .subscribe(
      res => this.cleanLocalStorage(),
      erro => this.cleanLocalStorage()
    );
  } else {
    this.cleanLocalStorage();
  }
}

cleanLocalStorage() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentCode');
  localStorage.removeItem('currentUserCode');
  this.router.navigate(['login']);
}

isLogado() {
  if (localStorage.getItem('currentUser')) {
    return true;
  } else {
    return false;
  }
}

}
