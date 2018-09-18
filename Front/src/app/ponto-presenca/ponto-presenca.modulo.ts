import { PontoPresencaObsAcaoService } from './ponto-presenca-obs-acao/ponto-presenca-obs-acao.service';
import { PontoPresencaObsAcaoComponent } from './ponto-presenca-obs-acao/ponto-presenca-obs-acao.component';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../pipes/shared.module';
import '../util/rxjs-extensions';


import { FilterHistoricoAcoesPipe } from '../pipes/filter-historico-acoes.pipe';

import { PontoPresencaRoutingModule } from './ponto-presenca.routing.module';
import { PontoPresencaAddEditComponent } from './ponto-presenca-add-edit/ponto-presenca-add-edit.component';
import { PontoPresencaDetalheComponent } from './ponto-presenca-detalhe/ponto-presenca-detalhe.component';
import { PontoPresencaComponent } from './ponto-presenca.component';
import { PontoPresencaService } from './ponto-presenca.service';
import { ContatoModule } from '../contato/contato.module';
import { ObsAcaoComponent } from './ponto-presenca-multiplas-obs-acao/ponto-presenca-multiplas-obs-acao.component';

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
        ObsAcaoComponent,
        PontoPresencaObsAcaoComponent
    ],
    exports: [
        PontoPresencaComponent
    ],
    providers: [
        PontoPresencaObsAcaoService,
        PontoPresencaService,
        HttpModule
    ],
    entryComponents: [
    ]
})

export class PontoPresencaModule { }
