import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule, SuiCheckboxModule, SuiRatingModule } from 'ng2-semantic-ui';
import { NgxMaskModule } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { FilterCnpjPipe } from './filter-cnpj.pipe';
import { FilterTelefonePipe } from './filter-telefone.pipe';
import { FilterSeiPipe } from './filter-sei.pipe';
import { FilterCepPipe } from './filter-cep.pipe';
import { FilterTipoTelPipe } from './filter-tipoTel.pipe';
import { FilterNumContratoPipe } from './filter-numContrato.pipe';
import { FilterPagadoraPipe } from './filter-pagadora.pipe';
import { FilterHistoricoAcoesPipe } from './filter-historico-acoes.pipe';
import { FilterPontoPresencaContatoPipe } from './filter-ponto-presenca-contato.pipe';
import { FilterRepresentantePipe } from './filter-representantes.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule,
    SuiCheckboxModule,
    SuiRatingModule,
    NgxMaskModule.forRoot(),
    CurrencyMaskModule
  ],
  declarations: [
    FilterCnpjPipe,
    FilterTelefonePipe,
    FilterTipoTelPipe,
    FilterSeiPipe,
    FilterCepPipe,
    FilterNumContratoPipe,
    FilterPagadoraPipe,
    FilterHistoricoAcoesPipe,
    FilterPontoPresencaContatoPipe,
    FilterRepresentantePipe
  ],
  exports: [
    CommonModule,
    SuiModule,
    FormsModule,
    SuiCheckboxModule,
    SuiRatingModule,
    ReactiveFormsModule,
    NgxMaskModule,
    CurrencyMaskModule,
    FilterCnpjPipe,
    FilterTelefonePipe,
    FilterTipoTelPipe,
    FilterSeiPipe,
    FilterCepPipe,
    FilterNumContratoPipe,
    FilterPagadoraPipe,
    FilterHistoricoAcoesPipe,
    FilterPontoPresencaContatoPipe,
    FilterRepresentantePipe
  ]
})
export class SharedModule {}
