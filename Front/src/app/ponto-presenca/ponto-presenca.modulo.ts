import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../pipes/shared.module';
import '../util/rxjs-extensions';

import { PontoPresencaRoutingModule } from './ponto-presenca.routing.module';
import { PontoPresencaAddEditComponent } from './ponto-presenca-add-edit/ponto-presenca-add-edit.component';
import { PontoPresencaDetalheComponent } from './ponto-presenca-detalhe/ponto-presenca-detalhe.component';
import { PontoPresencaComponent } from './ponto-presenca.component';
import { PontoPresencaService } from './ponto-presenca.service';
import { ContatoModule } from './../contato/contato.module';

@NgModule({
    imports: [
        SharedModule,
        PontoPresencaRoutingModule,
        ContatoModule,
        HttpModule
    ],
    declarations: [
        PontoPresencaAddEditComponent,
        PontoPresencaComponent,
        PontoPresencaDetalheComponent,
    ],
    exports: [
        PontoPresencaComponent
    ],
    providers: [
        PontoPresencaService,
        HttpModule
    ],
  entryComponents : [
  ]
})

export class PontoPresencaModule { }
