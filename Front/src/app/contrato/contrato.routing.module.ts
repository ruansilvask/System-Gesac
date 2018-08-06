import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContratoComponent } from './contrato.component';
import { ContratoDetalheComponent } from './contrato-detalhe/contrato-detalhe.component';
import { ContratoAdicionarEditarComponent } from './contrato-adicionar-editar/contrato-adicionar-editar.component';

const ContratoRoutes: Routes = [
  { path: '', component: ContratoComponent },
  { path: 'novo', component: ContratoAdicionarEditarComponent },
  { path: ':id', component: ContratoAdicionarEditarComponent },
  { path: ':id/detalhe', component: ContratoDetalheComponent }
];

@NgModule({
  imports: [RouterModule.forChild(ContratoRoutes)],
  exports: [RouterModule]
})
export class ContratoRoutingModule {}
