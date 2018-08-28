import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../pipes/shared.module';
import '../util/rxjs-extensions';


import { FilterHistoricoAcoesPipe } from '../pipes/filter-historico-acoes.pipe';
import { FilterPontoPresencaContatoPipe } from '../pipes/filter-contato.pipe';

import { PontoPresencaRoutingModule } from './ponto-presenca.routing.module';
import { PontoPresencaAddEditComponent } from './ponto-presenca-add-edit/ponto-presenca-add-edit.component';
import { PontoPresencaDetalheComponent } from './ponto-presenca-detalhe/ponto-presenca-detalhe.component';
import { PontoPresencaComponent } from './ponto-presenca.component';
import { PontoPresencaService } from './ponto-presenca.service';
import { ContatoModule } from '../contato/contato.module';
import { RouterModule } from '@angular/router';
import { ObsAcaoComponent } from './ponto-presenca-obs-acao/ponto-presenca-obs-acao.component';

@NgModule({
    imports: [
        SharedModule,
        PontoPresencaRoutingModule,
        ContatoModule,
        HttpModule
    ],
    declarations: [
        PontoPresencaComponent,
        PontoPresencaAddEditComponent,
        PontoPresencaDetalheComponent,
        ObsAcaoComponent
    ],
    exports: [
        PontoPresencaComponent
    ],
    providers: [
        PontoPresencaService,
        HttpModule
    ],
    entryComponents: [
    ]
})

export class PontoPresencaModule { }
