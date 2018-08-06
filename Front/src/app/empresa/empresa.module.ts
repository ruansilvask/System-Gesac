import { NgModule } from '@angular/core';

import { EmpresaComponent } from './empresa.component';
import { EmpresaAdicionarEditarComponent } from './empresa-adicionar-editar/empresa-adicionar-editar.component';
import { EmpresaRoutingModule } from './empresa.routing.module';
import { EmpresaService } from './empresa.service';
import { ContatoModule } from '../contato/contato.module';
import { EmpresaDetalheComponent } from './empresa-detalhe/empresa-detalhe.component';
import { FilterEmpresaContatoPipe } from './filter-empresaContato.pipe';
import { SharedModule } from '../pipes/shared.module';

@NgModule({
  imports: [
    SharedModule,
    EmpresaRoutingModule,
    ContatoModule
  ],
  declarations: [
    EmpresaComponent,
    EmpresaAdicionarEditarComponent,
    EmpresaDetalheComponent,
    FilterEmpresaContatoPipe
  ],
  exports: [
    EmpresaComponent
  ],
  providers: [
    EmpresaService
  ]
})
export class EmpresaModule { }
