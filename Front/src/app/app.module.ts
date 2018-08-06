import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt-BR');
import './util/rxjs-extensions';

import { SuiModule, SuiCheckboxModule, SuiRatingModule } from 'ng2-semantic-ui';
import { JwtInterceptor, AuthenticationService } from './services/index';

import { AuthGuard } from './guards/auth.guard.service';
import { AppService } from './app.service';
import { ContratoService } from './contrato/contrato.service';
import { AuthService } from './login/auth.service';

import { AppRoutingModule } from './app.routing.module';
import { ParticlesModule } from 'angular-particle';

import { AppComponent } from './app.component';
import { ConfirmModalComponent } from './modal/modal.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UsuarioService } from './usuario/usuario.service';


@NgModule({
  imports: [
    BrowserModule,
    SuiModule,
    SuiCheckboxModule,
    SuiRatingModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ParticlesModule
  ],
  declarations: [
    AppComponent,
    ConfirmModalComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent
  ],
  providers: [
    AppService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    ContratoService,
    AuthService,
    AuthenticationService,
    AuthGuard,
    UsuarioService
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents : [
    ConfirmModalComponent
  ]
})
export class AppModule { }

