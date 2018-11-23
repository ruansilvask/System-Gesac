import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt-BR');
import './util/rxjs-extensions';

import { SuiModule, SuiCheckboxModule, SuiRatingModule } from 'ng2-semantic-ui';
import { JwtInterceptor, AuthenticationService, JwtInterceptorService } from './services';

import { AuthGuard } from './guards/auth.guard.service';
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

import { ApiServiceEstadoMunicipio } from './api-services/api-services-estado-municipio';
import { ApiServicesPagination } from './api-services/api-services-pagination';
import { ApiServiceCnpj } from './api-services/api-services-cnpj';
import { ApiServicesData } from './api-services/api-services-data';
import { ApiServicesMsg } from './api-services/api-services-msg';
import { ApiServiceHandleError } from './api-services/api-service-handleError';
import { ApiServiceExcel } from './api-services/api-service-excel';
import { StorageService } from './services/storage.service';
import { Erro404Component } from './erro404/erro404.component';
import { ErrorInterceptorProvider } from './services/error.interceptor';
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
    FooterComponent,
    Erro404Component
  ],
  providers: [
    ApiServicesPagination,
    ApiServicesMsg,
    ApiServiceEstadoMunicipio,
    ApiServicesData,
    ApiServiceCnpj,
    ApiServiceExcel,
    ErrorInterceptorProvider,
    ApiServiceHandleError,
    JwtInterceptorService,
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    AuthenticationService,
    AuthService,
    StorageService,
    ContratoService,
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

