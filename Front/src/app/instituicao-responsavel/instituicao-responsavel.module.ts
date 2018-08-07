import { NgModule } from '@angular/core';
import { SharedModule } from '../pipes/shared.module';

import { InstRespAddEditComponent } from './inst-resp-add-edit/inst-resp-add-edit.component';
import { InstRespComponent } from './instituicao-responsavel.component';
import { InstRespService } from './instituicao-responsavel.service';
import { InstRespRoutingModule } from './instituicao.responsavel.routing.module';
import { InstituicaoResponsavelDetalheComponent } from './instituicao-responsavel-detalhe/instituicao-responsavel-detalhe.component';
import { ContatoModule } from '../contato/contato.module';
import { FilterRepresentantePipe } from './filter-representantes.pipe';

@NgModule({
    imports: [
      SharedModule,
      InstRespRoutingModule,
      ContatoModule,
    ],
    declarations: [
        InstRespComponent,
        InstRespAddEditComponent,
        InstituicaoResponsavelDetalheComponent,
        FilterRepresentantePipe
    ],
    exports: [
        InstRespComponent
    ],
    entryComponents: [
        InstRespComponent
    ],
    providers: [
        InstRespService,
        FilterRepresentantePipe
        ]
})

export class InstRespModule { }
