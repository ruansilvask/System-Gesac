import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../services';

import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { StorageService } from '../services/storage.service';

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
    private storageService: StorageService,
    private authenticationService: AuthenticationService

  ) { }

  ngOnInit() {
    // reset login status
    if (this.storageService.getLocalUser() !== null) {
      this.router.navigate(['/home']);
    } else {
      this.authenticationService.logout();
    }
  }

  fazerLogin() {
    this.authenticationService.login(this.usuario.nome, this.usuario.senha)
      .subscribe(
        res => {
          this.authenticationService.successfulLogin(res.token);
          this.router.navigate(['/home']);
        },
        erro => Swal('Erro', erro.error, 'error'));
  }


}
