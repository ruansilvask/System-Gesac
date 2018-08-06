import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { InstRespComponent } from './instituicao-responsavel.component';
import { InstRespAddEditComponent } from './inst-resp-add-edit/inst-resp-add-edit.component';
import { InstituicaoResponsavelDetalheComponent } from './instituicao-responsavel-detalhe/instituicao-responsavel-detalhe.component';

const InstRespRoutes: Routes = [
    {
        path: '',
        component: InstRespComponent
    },
    {
        path: 'novo',
        component: InstRespAddEditComponent
    },
    {
      path: 'edit/:id',
      component: InstRespAddEditComponent
    },
    {
      path: 'visu/:id',
      component: InstituicaoResponsavelDetalheComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(InstRespRoutes)
    ],
    exports: [
        RouterModule
    ]
})


export class InstRespRoutingModule {}
