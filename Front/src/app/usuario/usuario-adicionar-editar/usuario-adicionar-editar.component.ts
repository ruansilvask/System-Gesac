import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioService } from './../usuario.service';
import { SuiModalService } from 'ng2-semantic-ui';
import Swal from 'sweetalert2';
import { AppService } from '../../app.service';
import { AuthenticationService } from '../../services';

@Component({
  selector: 'app-usuario-adicionar-editar',
  templateUrl: './usuario-adicionar-editar.component.html',
  styleUrls: ['./usuario-adicionar-editar.component.scss']
})
export class UsuarioAdicionarEditarComponent implements OnInit {

  senhaPreenchida = false;
  params: any;
  edicao: boolean = null;
  trocarSenha = false;
  senhaCorreta = false;
  msg: any;

  usuario = {
    nome: '',
    login: '',
    senha: '',
    email: '',
    status: '',
    senhaNovamente: ''
  };

  constructor(
    private appService: AppService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  getUsuarioById(codUsuario) {
    this.usuarioService.getUsuario(codUsuario)
        .subscribe(usuario => {
          this.usuario = usuario[0];
        });
  }

  salvarUsuario(fAddUsuario: NgForm) {
    if (this.params.id) {
      if (this.authenticationService.verificaUser() === '1') {
        this.usuarioService.putUsuario(this.params.id, fAddUsuario.value)
        .subscribe(
          res => {
            this.authenticationService.getUser();
            this.router.navigate(['usuario']);
            this.appService.setMsg('success', `As alterações foram salvas com sucesso.`, 3000);
          },
          erro => Swal('Erro', `${erro.error}`, 'error')
        );
      } else {
        this.appService.setMsg('warning', `Você não tem permissão para editar usuário.`, 3000);
      }
    } else {
      if (this.authenticationService.verificaUser() === '1') {
      if (fAddUsuario.value.senha === fAddUsuario.value.senhaNovamente) {
        delete fAddUsuario.value.senhaNovamente;
        this.usuarioService.postUsuario(fAddUsuario.value)
        .subscribe(
          res => {
            this.router.navigate(['usuario']);
            this.appService.setMsg('success', `Usuário adicionado com sucesso.`, 3000);
          },
          erro => Swal('Erro', `${erro.error}`, 'error')
        );
      } else {
        this.appService.setMsg('warning', `As senhas não coincidem.`, 5000);
      }
    } else {
      this.appService.setMsg('warning', `Você não tem permissão para adicionar usuário.`, 3000);
    }
    }
  }

  inserirSenha (value) {
    (value) ? (this.senhaPreenchida = true) : this.senhaPreenchida = false;
  }

  AlterarSenha(formSenha) {
    if (formSenha.value.senha === formSenha.value.senhaNovamente) {
      delete formSenha.value.senhaNovamente;
      this.usuarioService.putAlterarSenha(this.params.id, formSenha.value)
      .subscribe(
        res =>  {
          this.msg = res;
          this.appService.setMsg('success', `${this.msg.msg}`, 3000);
              this.trocarSenha = false;
            },
        erro => this.appService.setMsg('warning', `${erro.error}`, 5000)
      );
    } else {
      this.appService.setMsg('warning', `A "Nova senha" não coincide com "Digite a nova senha novamente".`, 5000);
    }
  }

  abreFechaModal() {
    this.trocarSenha = !this.trocarSenha;
  }

  verificarsenha (value, form) {
    (value === form) ? this.senhaCorreta = true : this.senhaCorreta = false;
  }

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.params = res;
      if (this.params.id) {
        this.getUsuarioById(this.params.id);
        this.edicao = true;
        this.senhaCorreta = true;
      } else {
        this.edicao = false;
      }
    });
  }

}
