import { Router } from '@angular/router';
import { EventEmitter, Injectable } from '@angular/core';

import { Usuario } from './usuario';

@Injectable()
export class AuthService {

  private usuarioAutenticado = false;

  mostrarMenuEmitter = new EventEmitter<boolean>();
  mostrarFooterEmitter = new EventEmitter<boolean>();

  constructor(private router: Router) { }


  fazerLogin(usuario: Usuario) {

    if (usuario.nome === 'admin' && usuario.senha === 'admin') {

      this.usuarioAutenticado = true;

      this.mostrarMenuEmitter.emit(true);
      this.mostrarFooterEmitter.emit(true);

      this.router.navigate(['']);

    } else {
      this.usuarioAutenticado = false;
      this.mostrarFooterEmitter.emit(false);
    }

  }

  usuarioEstaAutenticado() {
    return this.usuarioAutenticado;
  }
}
