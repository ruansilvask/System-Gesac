import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { UsuarioComponent } from './usuario.component';
import { UsuarioAdicionarEditarComponent } from './usuario-adicionar-editar/usuario-adicionar-editar.component';

const UsuarioRoutes: Routes = [
    {
        path: '',
        component: UsuarioComponent
    },
    {
        path: 'novo',
        component: UsuarioAdicionarEditarComponent
    },
    {
        path: ':id',
        component: UsuarioAdicionarEditarComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(UsuarioRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class UsuarioRoutingModule {}
