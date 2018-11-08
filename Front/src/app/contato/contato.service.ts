
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';

import { Response } from '@angular/http';
import { API } from '../app.api';
import { Contato } from './contato.model';

@Injectable()
export class ContatoService {

  emitirCodContatos = new EventEmitter();

  constructor(
    private http: HttpClient
  ) { }

// INICIO GETS E POST CONTATOS

// GET E POST EMPRESA

  getContatos(codContato, local) {
    this.emitirCodContatos.emit({codContato, local});
  }

  postContatoEmpresa(form) {
    return form;
  }

// GET E POST PONTO

  getContatosEmpresa(cnpjEmpresa) {
    return this.http
    .get<Contato[]>(`${API.GESAC_API}contatoEmpresa/${cnpjEmpresa}`)
    .map(res => res);
  }

  postContatoPonto(form) {
    return form;
  }

// GET E POST INSTITUICAO

  getContatosInstituicao(codInstituicao) {
    return this.http
    .get<Contato[]>(`${API.GESAC_API}contatoInstituicao/${codInstituicao}`)
    .map(res => res);
  }

  postContatoInstituicao(form) {
    return form;
  }

  // GET DE CONTATOS

  postContato(form) {
    return this.http
    .post<Contato>(`${API.GESAC_API}contato`, form)
    .map(res => res);
  }

  // FIM GETS E POST CONTATOS


  // POST TELEFONE

  postTelefone(form) {
    return this.http
    .post(`${API.GESAC_API}telefone`, form)
    .map(res => res);
  }


  getContatosPonto(codGesac) {
    return this.http
    .get<Contato[]>(`${API.GESAC_API}contatoPonto/${codGesac}`)
    .map(res => res);
  }

  buscaPessoa(term: string) {
    term = term.replace(/\//g, '%2F');
    term = term.replace(/\?/g, '%3F');
    term = term.replace(/\#/g, '%23');
    term = term.replace(/\%/g, '%25');
    term = term.replace(/\'/g, ' ');
    term = term.replace(/\ /g, '%20');
    return this.http
      .get<Contato[]>(`${API.GESAC_API}contato/${term}`)
      .map(res => res);
  }

  getContatoById(id: number) {
    return this.http
      .get<Contato>(`${API.GESAC_API}contatoInfo/${id}`)
      .map(res => res);
  }

  getInfContato(codContato) {
    return this.http
      .get(`${API.GESAC_API}contatoDados/${codContato}`)
      .map(res => res);
  }

  postContatoPessoa(nome) {
    return this.http
      .post(`${API.GESAC_API}pessoa`, {nome})
      .map((res: Response) => res)
      .map(res => res);
  }

  deletarContatoCadastrado(codContato, codPessoa) {
    return this.http
      .delete(`${API.GESAC_API}contato/${codContato}/${codPessoa}`)
      .map(res => res);
  }

  deletarTelefoneCadastrado(codTelefone, codPessoa) {
    return this.http
      .delete(`${API.GESAC_API}telefone/${codTelefone}/${codPessoa}`)
      .map(res => res);
  }

  deletarPessoa(codPessoa) {
    return this.http
      .delete(`${API.GESAC_API}pessoa/${codPessoa}`)
      .map(res => res);
  }

  putTelefoneCadastrado(codTelefone, codPessoa, form) {
    return this.http
    .put(`${API.GESAC_API}telefone/${codTelefone}/${codPessoa}`, form)
      .map(res => res);
  }

  putContatoCadastrado(codContato, form) {
    return this.http
    .put(`${API.GESAC_API}contato/${codContato}`, form)
      .map(res => res);
  }
}
