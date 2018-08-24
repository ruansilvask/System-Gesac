import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../services';

import { Usuario } from './usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  returnUrl: string;
  usuario: Usuario = new Usuario();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService

  ) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  fazerLogin() {
    this.authenticationService.login(this.usuario.nome, this.usuario.senha)
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        erro => Swal('Erro', `${erro.error}`, 'error')
      );
  }


}
