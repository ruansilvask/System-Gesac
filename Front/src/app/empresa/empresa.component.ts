import { ApiServicesMsg } from '../api-services/api-services-msg';
import { Component, OnInit } from '@angular/core';

import { SuiModalService } from 'ng2-semantic-ui';
import { EmpresaService } from './empresa.service';

import Swal from 'sweetalert2';

import { ApiServicesPagination } from '../api-services/api-services-pagination';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {
  filtros = {
    cnpj: '',
    empresa: '',
    municipio: '',
    uf: ''
  };
  segmentDimmed: boolean;
  empresas: any;
  allArrays: any;

  /*
  * Pagination
  */
  todasEmpresas: any;
  totalItens = 0;
  itensPagina = 50;
  pagina = 1;

  constructor(
    private apiServicesMsg: ApiServicesMsg,
    private empresaService: EmpresaService,
    private modalService: SuiModalService,
    private apiServicesPagination: ApiServicesPagination
  ) { }

  /*
  * Método para carregar as empresa do banco e fazer a paginação na tela
  */
  getEmpresas() {
    this.segmentDimmed = true;
    this.empresaService.getEmpresas().subscribe(empresas => {
      this.todasEmpresas = empresas;
      this.funcaoPaginacao(this.todasEmpresas);
    });
  }

  funcaoPaginacao(array) {
    let pagina;
    this.totalItens = array.length;
    this.allArrays = this.apiServicesPagination.pagination(
      array,
      this.itensPagina
    );
    this.page((pagina = 1));
    this.segmentDimmed = false;
  }

  /*
  * Método para deletar a empresa, caso a mesma não tenha contatos vinculados a ela
  */
  deletarEmpresa(empresa) {
    Swal({
      title: 'Você tem certeza?',
      html: `Você tem certeza que deseja deletar a empresa <i>${empresa.empresa}</i>?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Não, mater',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.empresaService
          .deleteEmpresa(empresa.cnpj_empresa)
          .subscribe(
            res => {
              this.getEmpresas();
              event.stopPropagation();
              this.apiServicesMsg.setMsg('success', 'Empresa deletada com sucesso.', 3000);
            },
            erro => Swal('Erro', `${erro.error}`, 'error')
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  /*
  * Método para mudar a página da paginação
  */
  page(pagina) {
    this.empresas = this.allArrays[pagina - 1];
  }

  /*
  * Método para mudar filtrar itens da página
  */
  filtroEmpresa(filtros): any {
    if (!filtros.cnpj && !filtros.empresa && !filtros.municipio && !filtros.uf) {
      this.funcaoPaginacao(this.todasEmpresas);
    } else {
      let valida;
      const empresas = this.todasEmpresas.filter(emp => {
        valida = true;
        if (filtros.cnpj && !emp.cnpj_empresa.toLowerCase().includes(filtros.cnpj.toLowerCase())) {valida = false; }
        if (filtros.empresa && !emp.empresa.toLowerCase().includes(filtros.empresa.toLowerCase())) {valida = false; }
        if (filtros.municipio && !emp.nome_municipio.toLowerCase().includes(filtros.municipio.toLowerCase())) {valida = false; }
        if (filtros.uf && !emp.uf.toLowerCase().includes(filtros.uf.toLowerCase())) {valida = false; }
        return valida;
      });
      this.funcaoPaginacao(empresas);
    }
  }

  /*
  * Métodos que serão executados quando o componente é iniciado
  */
  ngOnInit() {
    this.getEmpresas();
  }
}
