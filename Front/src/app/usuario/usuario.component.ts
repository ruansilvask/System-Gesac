import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';


// import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services';
import { ApiServicesMsg } from '../api-services/api-services-msg';
import { ApiServicesPagination } from '../api-services/api-services-pagination';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  constructor(
    private apiServicesMsg: ApiServicesMsg,
    private authenticationService: AuthenticationService,
    private apiServicesPagination: ApiServicesPagination,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  filtros = {
    status: '',
    nome: '',
    login: '',
    email: ''
  };

  filteredOptions = [
    {status: 'Todos', value: 'Status'},
    {status: 'Ativo', value: 'Ativo'},
    {status: 'Inativo', value: 'Inativo'}
  ];

  usuarios: any[] = [];

  segmentDimmed: boolean;

  /*
  * Pagination
  */
  todosUsuarios: any;
  totalItens = 0;
  itensPagina = 50;
  pagina = 1;

  getUsuarios() {
    if (this.authenticationService.verificaUser() === '1') {
      this.usuarioService.getUsuarios()
        .subscribe(usuarios => {
        this.totalItens = usuarios.length;
        this.todosUsuarios = this.apiServicesPagination.pagination(usuarios, this.itensPagina);
        this.usuarios = this.todosUsuarios[0];
        this.segmentDimmed = false;
      });
    } else {
      this.router.navigate(['home']);
    }
  }

  removerUsuario(usuario) {
    // Swal({
    //   title: 'Você tem certeza?',
    //   html: `Você tem certeza que deseja deletar ${usuario.nome}.`,
    //   type: 'question',
    //   showCancelButton: true,
    //   confirmButtonText: 'Sim, deletar!',
    //   cancelButtonText: 'Não, mater',
    //   reverseButtons: true
    // }).then((result) => {
    //   if (result.value) {
    //     this.usuarioService.deleteUsuario(usuario.cod_usuario)
    //     .subscribe(
    //       res => {
    //         this.getUsuarios();
    //         this.apiServicesMsg.setMsg('success', `Usuário excluído com sucesso.`, 3000);
    //       },
    //       erro => Swal('Erro', `${erro.error}`, 'error')
    //     );
    //   } else if (result.dismiss === Swal.DismissReason.cancel) {
    //     this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
    //   }
    // });
    this.apiServicesMsg.setMsg('warning', `Você não tem permissão para executar esta ação.`, 5000);
  }

  /*
  * Método para mudar a página da paginação
  */
 mudarPagina(pagina) {
  this.usuarios = this.todosUsuarios[pagina - 1];
}

  ngOnInit() {
    this.segmentDimmed = true;
    setTimeout(() => {
      this.getUsuarios();
    }, 200);
  }
}
