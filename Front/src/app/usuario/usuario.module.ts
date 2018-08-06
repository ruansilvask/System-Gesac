import { NgModule } from '@angular/core';
import { SharedModule } from '../pipes/shared.module';

import { FilterUsuarioPipe } from './filter-usuario.pipe';
import { UsuarioRoutingModule } from './usuario.routing.module';
import { UsuarioService } from './usuario.service';
import { UsuarioComponent } from './usuario.component';
import { UsuarioAdicionarEditarComponent } from './usuario-adicionar-editar/usuario-adicionar-editar.component';

@NgModule({
  imports: [
    SharedModule,
    UsuarioRoutingModule
  ],
  declarations: [
    UsuarioComponent,
    UsuarioAdicionarEditarComponent,
    FilterUsuarioPipe
  ],
  exports: [
    UsuarioComponent
  ],
  providers: [
    FilterUsuarioPipe,
    UsuarioService
  ]
})
export class UsuarioModule { }
