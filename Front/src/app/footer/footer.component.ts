import { AuthService } from '../login/auth.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services';

@Component({
  moduleId: 'module.id',
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {


mostrarFooter = false;

  constructor(
    private authService: AuthService,
    private authenticationService: AuthenticationService
  ) {

  }

  isLogado() {
    return this.authenticationService.isLogado();
  }

  ngOnInit() {
    this.authService.mostrarFooterEmitter.subscribe(
      mostrar => this.mostrarFooter = mostrar
    );
  }

}
