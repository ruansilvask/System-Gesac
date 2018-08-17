import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
        return this.http.post<any>(`http://172.25.117.3:310/autentica`, { login: login, senha: senha })
            .map(res => {
              if (res.token) {
                localStorage.setItem('currentUser', res.token);
                localStorage.setItem('currentUserCode', res.cod_usuario);
              }
              this.emitirUsuario.emit(res);
            });
    }

getToken() {
  return localStorage.getItem('currentUser');
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
  localStorage.removeItem('currentUser');
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
