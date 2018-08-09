import { Component, OnInit, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';



import { InstRespService } from './instituicao-responsavel.service';
import Swal from 'sweetalert2';
import { ApiServicesMsg } from './../api-services/api-services-msg';
import { ApiServicesPagination } from './../api-services/api-services-pagination';

@Component({
  selector: 'app-instresp-resp',
  templateUrl: './instituicao-responsavel.component.html',
  styleUrls: ['./instituicao-responsavel.component.scss']
})
export class InstRespComponent implements OnInit {
  filtros = {
    cnpj: '',
    nome: '',
    sigla: '',
    pagadora: ''
  };
  instituicoesResp: any;
  collapValue: boolean;
  segmentDimmed: any;
  itens: any[] = ['1'];
  pagadoraFilter: any;

  optionsPontoPre: any = [
    {descricao : 'Sim', value : 1},
    {descricao : 'Não', value : 0},
    {descricao : 'Todos', value : 3}
];

  allArrays: any;
  numeroPagina = 50;
  totalItens = 0;
  instituicoesRespPag: any;
  select = 1;

  modalActions = new EventEmitter<string>();

  constructor(
    private apiServicesMsg: ApiServicesMsg,
    private location: Location,
    private instituicaoResponsavelService: InstRespService,
    private apiServicesPagination: ApiServicesPagination
  ) {}

  // Carregar Insituições responsaveis
  getInstituicoes() {
    this.instituicaoResponsavelService.getInstResps().subscribe(
      dados => {
      this.instituicoesResp = dados;
      this.funcaoPaginacao(this.instituicoesResp);
    });
  }

  funcaoPaginacao(array) {
    let pagina;
    this.totalItens = array.length;
    this.allArrays = this.apiServicesPagination.pagination(
      array,
      this.numeroPagina
    );
    this.page((pagina = 1));
    this.segmentDimmed = false;
  }

  deletarInstResp(instResp) {
    Swal({
      title: 'Você tem certeza?',
      html: `Você tem certeza que cadastrar esta tipologia?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Não, mater',
      reverseButtons: true
    }).then((result) => {
      if (instResp) {
        this.instituicaoResponsavelService.deleteInstResp(instResp.cod_instituicao).subscribe(
          res => {
            this.apiServicesMsg.setMsg('success', 'Instituições responsável excluída com sucesso.', 3000);
            this.getInstituicoes();
          },
          erro => Swal('Erro', `${erro.error}`, 'error')
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  page(pagina) {
    this.instituicoesRespPag = this.allArrays[pagina - 1];
  }

  filtroInstResp(filtros, pagadora): any {
    if (!filtros.cnpj && !filtros.nome && !filtros.sigla && !filtros.pagadora) {
      this.funcaoPaginacao(this.instituicoesResp);
    } else {
      let valida;
      const instResps = this.instituicoesResp.filter(resp => {
      // gambiarra para arrumar o filtro da pagadora
        if (filtros.pagadora.value !== 3){
          if(resp.pagadora === 1) {
            this.pagadoraFilter = 'Sim'
          }  else if(resp.pagadora === 0){
           this.pagadoraFilter = 'Não'
          } else {
           this.pagadoraFilter = ''
          }
        } else {
          filtros.pagadora = ''
        }
        valida = true;
        if ((filtros.cnpj && resp.cnpj_instituicao == null) ||
           (filtros.cnpj && !resp.cnpj_instituicao.toLowerCase().includes(filtros.cnpj.toLowerCase()))) {valida = false; }
        if (filtros.nome && !resp.nome.toLowerCase().includes(filtros.nome.toLowerCase())) {valida = false; }
        if (filtros.sigla && !resp.sigla.toLowerCase().includes(filtros.sigla.toLowerCase())) {valida = false; }
        if (filtros.pagadora && !this.pagadoraFilter.toLowerCase().includes(filtros.pagadora.descricao.toLowerCase())) {valida = false; }
        return valida;
      });
      this.funcaoPaginacao(instResps);
    }
  }

  ngOnInit() {
    this.segmentDimmed = true;
    this.getInstituicoes();
  }
}
