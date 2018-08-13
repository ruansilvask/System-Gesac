import { HttpClient } from '@angular/common/http';
import { GESAC_API } from '../app.api';
import { Injectable } from '@angular/core';
import { Usuario } from '../login/usuario';

@Injectable()
export class UsuarioService {

  constructor(
    private http: HttpClient
  ) { }

  getUsuarios() {
    return this.http.get<Usuario[]>(`${GESAC_API}usuario`);
  }

  getUsuario(codUsuario) {
    return this.http.get<Usuario>(`${GESAC_API}usuario/${codUsuario}`)
    .map(res => res);
  }

  postUsuario(form) {
    return this.http.post(`${GESAC_API}usuario`, form)
    .map(res => res);
  }

  putUsuario(codUsuario, form) {
    return this.http.put(`${GESAC_API}usuario/${codUsuario}`, form)
    .map(res => res);
  }

  putAlterarSenha(codUsuario, form) {
    return this.http.put(`${GESAC_API}alteraSenha/${codUsuario}`, form)
    .map(res => res);
  }

  deleteUsuario(codUsuario) {
    return this.http.delete(`${GESAC_API}usuario/${codUsuario}`)
    .map(res => res);
  }

}
