
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';

import { Response } from '@angular/http';
import { GESAC_API } from '../app.api';
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
    .get<Contato[]>(`${GESAC_API}contatoEmpresa/${cnpjEmpresa}`)
    .map(res => res);
  }

  postContatoPonto(form) {
    return form;
  }

// GET E POST INSTITUICAO

  getContatosInstituicao(codInstituicao) {
    return this.http
    .get<Contato[]>(`${GESAC_API}contatoInstituicao/${codInstituicao}`)
    .map(res => res);
  }

  postContatoInstituicao(form) {
    return form;
  }

  // GET DE CONTATOS

  postContato(form) {
    return this.http
    .post<Contato>(`${GESAC_API}contato`, form)
    .map(res => res);
  }

  // FIM GETS E POST CONTATOS


  // POST TELEFONE

  postTelefone(form) {
    return this.http
    .post(`${GESAC_API}telefone`, form)
    .map(res => res);
  }


  getContatosPonto(codGesac) {
    return this.http
    .get<Contato[]>(`${GESAC_API}contatoPonto/${codGesac}`)
    .map(res => res);
  }

  buscaPessoa(term: string) {
    return this.http
      .get<Contato[]>(`${GESAC_API}contato/${term}`)
      .map(res => res);
  }

  getContatoById(id: number) {
    return this.http
      .get<Contato>(`${GESAC_API}contatoInfo/${id}`)
      .map(res => res);
  }

  getInfContato(codContato) {
    return this.http
      .get(`${GESAC_API}contatoDados/${codContato}`)
      .map(res => res);
  }

  postContatoPessoa(nome) {
    return this.http
      .post(`${GESAC_API}pessoa`, {nome})
      .map((res: Response) => res)
      .map(res => res);
  }

  deletarContatoCadastrado(codContato) {
    return this.http
      .delete(`${GESAC_API}contato/${codContato}`)
      .map(res => res);
  }

  deletarTelefoneCadastrado(codTelefone, codPessoa) {
    return this.http
      .delete(`${GESAC_API}telefone/${codTelefone}/${codPessoa}`)
      .map(res => res);
  }

  putTelefoneCadastrado(codTelefone, codPessoa, form) {
    return this.http
    .put(`${GESAC_API}telefone/${codTelefone}/${codPessoa}`, form)
      .map(res => res);
  }

  putContatoCadastrado(codContato, form) {
    return this.http
    .put(`${GESAC_API}contato/${codContato}`, form)
      .map(res => res);
  }
}
