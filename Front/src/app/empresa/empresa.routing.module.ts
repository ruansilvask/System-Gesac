import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { EmpresaComponent } from './empresa.component';
import { EmpresaAdicionarEditarComponent } from './empresa-adicionar-editar/empresa-adicionar-editar.component';
import { EmpresaDetalheComponent } from './empresa-detalhe/empresa-detalhe.component';

const EmpresaRoutes: Routes = [
  { path: '', component: EmpresaComponent },
  { path: 'novo', component: EmpresaAdicionarEditarComponent },
  { path: ':id', component: EmpresaAdicionarEditarComponent },
  { path: ':id/detalhe', component: EmpresaDetalheComponent }
];

@NgModule({
  imports: [RouterModule.forChild(EmpresaRoutes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule {}
