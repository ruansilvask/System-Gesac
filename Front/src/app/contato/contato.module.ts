import { NgModule } from '@angular/core';
import { SharedModule } from '../pipes/shared.module';

import { HttpModule } from '@angular/http';

import { ContatoComponent } from './contato.component';
import { ContatoService } from './contato.service';

@NgModule({
  imports: [
    SharedModule,
    HttpModule
  ],
  declarations: [
    ContatoComponent
  ],
  providers: [
    ContatoService
  ],
  exports: [
    ContatoComponent
  ]
})
export class ContatoModule { }
