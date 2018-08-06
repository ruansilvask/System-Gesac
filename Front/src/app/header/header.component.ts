import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../services';
import { UsuarioService } from '../usuario/usuario.service';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  moduleId: 'module.id',
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

mostrarMenu = false;
usuario: any = {};
baixando: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private usuarioService: UsuarioService,
    private appService: AppService
  ) {

  }
  logout() {
    Swal({
      title: 'Você tem certeza?',
      html: `Você tem certeza que deseja sair?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair agora!',
      cancelButtonText: 'Não, continuar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.authenticationService.logout();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.appService.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  isLogado() {
    return this.authenticationService.isLogado();
  }

  verificarCode() {
    if (this.authenticationService.verificaUser() === '1') {
      return true;
    } else {
      return false;
    }
  }


  gerarExel() {
    if (this.baixando !== true) {
      this.baixando = true;
      const date = new Date();
      const dataDocumento = `${date.toISOString().slice(8, 10)}-${date.toISOString().slice(5, 7)}-${date.toISOString().slice(0, 4)}`;
      this.appService.getExcel()
      .subscribe(
        data => {
          saveAs(data, `SGsac ${dataDocumento}.xlsx`);
          this.baixando = false;
        },
        erro => Swal('Erro', 'Ocorreu um erro, por favor recarregue a página e tente novamente.' +
                    ' Se o erro persistir favor entrar em contato com a COSIS - 2027-6040.', 'error')
    );
  }
  }


  ngOnInit() {
    this.authenticationService.emitirUsuario.subscribe(
      res => {
      this.usuarioService.getUsuario(this.authenticationService.verificaUser())
        .subscribe(
          result => {
            this.usuario = result[0];
          }
        );
      }
    );
    if (this.authenticationService.verificaUser()) {
      this.usuarioService.getUsuario(this.authenticationService.verificaUser())
        .subscribe(
          result => {
            this.usuario = result[0];
          }
        );
    }
  }

}
