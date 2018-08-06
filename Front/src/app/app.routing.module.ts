import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home', component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pontPre',
    loadChildren: 'app/ponto-presenca/ponto-presenca.modulo#PontoPresencaModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'contrato',
    loadChildren: 'app/contrato/contrato.module#ContratoModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'instResp',
    loadChildren: 'app/instituicao-responsavel/instituicao-responsavel.module#InstRespModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'tipologia',
    loadChildren: 'app/tipologia/tipologia.module#TipologiaModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'usuario',
    loadChildren: 'app/usuario/usuario.module#UsuarioModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'empresa',
    loadChildren: 'app/empresa/empresa.module#EmpresaModule',
    canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
