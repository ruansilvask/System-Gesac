import { NgModule } from '@angular/core';
import { SharedModule } from '../pipes/shared.module';

import { FilterTipologiaPipe } from './filter-tipologia.pipe';
import { TipologiaService } from './tipologia.service';
import { TipologiaRoutingModule } from './tipologia.routing.module';
import { TipologiaComponent } from './tipologia.component';
import { TipologiaEditarComponent } from './tipologia-editar/tipologia-editar.component';

@NgModule({
  imports: [
    SharedModule,
    TipologiaRoutingModule
  ],
  declarations: [
    TipologiaComponent,
    TipologiaEditarComponent,
    FilterTipologiaPipe
  ],
  exports: [TipologiaComponent],
  providers: [
    TipologiaService,
    FilterTipologiaPipe
  ]
})
export class TipologiaModule {}
