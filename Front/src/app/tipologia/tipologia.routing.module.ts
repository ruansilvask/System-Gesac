import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TipologiaComponent } from './tipologia.component';

const TipologiaRoutes = [
  { path: '', component: TipologiaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(TipologiaRoutes)],
  exports: [RouterModule]
})
export class TipologiaRoutingModule {}
