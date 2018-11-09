import { HttpClient } from '@angular/common/http';
import { API } from '../app.api';
import { Injectable } from '@angular/core';
import { Usuario } from '../login/usuario';

@Injectable()
export class UsuarioService {

  constructor(
    private http: HttpClient
  ) { }

  getUsuarios() {
    return this.http.get<Usuario[]>(`${API.GESAC_API}usuario`);
  }

  getUsuario(codUsuario) {
    return this.http.get<Usuario>(`${API.GESAC_API}usuario/${codUsuario}`)
    .map(res => res);
  }

  getUsuarioByLogin(login) {
    return this.http.get<Usuario>(`${API.GESAC_API}usuario/login/${login}`)
    .map(res => res);
  }

  postUsuario(form) {
    return this.http.post(`${API.GESAC_API}usuario`, form)
    .map(res => res);
  }

  putUsuario(codUsuario, form) {
    return this.http.put(`${API.GESAC_API}usuario/${codUsuario}`, form)
    .map(res => res);
  }

  putAlterarSenha(codUsuario, form) {
    return this.http.put(`${API.GESAC_API}alteraSenha/${codUsuario}`, form)
    .map(res => res);
  }

  deleteUsuario(codUsuario) {
    return this.http.delete(`${API.GESAC_API}usuario/${codUsuario}`)
    .map(res => res);
  }

}
