import { FilterContratoLotePipe } from './filter-contrato-lote.pipe';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { ContratoComponent } from './contrato.component';
import { ContratoAdicionarEditarComponent } from './contrato-adicionar-editar/contrato-adicionar-editar.component';
import { ContratoDetalheComponent } from './contrato-detalhe/contrato-detalhe.component';
import { ContratoRoutingModule } from './contrato.routing.module';
import { EmpresaService } from '../empresa/empresa.service';
import { SharedModule } from '../pipes/shared.module';

@NgModule({
    imports: [
        SharedModule,
        ContratoRoutingModule,
    ],
    declarations: [
        ContratoComponent,
        ContratoDetalheComponent,
        ContratoAdicionarEditarComponent,
        FilterContratoLotePipe
    ],
    exports: [
        ContratoComponent
    ],
    providers: [
        EmpresaService,
        HttpModule,
        FilterContratoLotePipe
    ]
})

export class ContratoModule { }
