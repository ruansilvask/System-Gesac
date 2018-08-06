import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ContratoService } from './contrato.service';
import { SuiModalService } from 'ng2-semantic-ui';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.scss']
})
export class ContratoComponent implements OnInit {
  filtros = {
    empresa: '',
    contrato: '',
    pontos: '',
    procSei: '',
  };

// fortmatoProceei = ['00000.000000/0000-00'];

excluiModal: any;
segmentDimmed: boolean;
contratos: any;
allArrays: any;

  /*
  * Pagination
  */
  todosContratos: any;
  totalItens = 0;
  itensPagina = 50;
  pagina = 1;

  constructor(
    private contratoService: ContratoService,
    private location: Location,
    private appService: AppService
  ) {}

  funcaoPaginacao(array) {
    let pagina;
    this.totalItens = array.length;
    this.allArrays = this.appService.pagination(
      array,
      this.itensPagina
    );
    this.page((pagina = 1));
    this.segmentDimmed = false;
  }

  goBack() {
    this.location.back();
  }

  page(pagina) {
    this.contratos = this.allArrays[pagina - 1];
  }

  filterChange(term) {
    this.filtros = term;
  }

  /*
  * Método para mudar filtrar itens da página
  */
 filtroContrato(filtros): any {
  if (!filtros.empresa && !filtros.contrato && !filtros.pontos && !filtros.procSei) {
    this.funcaoPaginacao(this.todosContratos);
  } else {
    let valida;
    const contrats = this.todosContratos.filter(contrat => {
      valida = true;
      if (filtros.empresa && !contrat.empresa.toLowerCase().includes(filtros.empresa.toLowerCase())) {valida = false; }
      if (filtros.contrato && !contrat.num_contrato.toLowerCase().includes(filtros.contrato.toLowerCase())) {valida = false; }
      if (filtros.pontos && !contrat.quant_pontos.toString().toLowerCase().includes(filtros.pontos.toLowerCase())) {valida = false; }
      if (filtros.procSei && !contrat.processo_sei.toLowerCase().includes(filtros.procSei.toLowerCase())) {valida = false; }
      return valida;
    });
    this.funcaoPaginacao(contrats);
  }
}

  ngOnInit() {
    this.segmentDimmed = true;
    setTimeout(() => {
      this.contratoService.getContratos().subscribe(contratos => {
        this.todosContratos = contratos;
        this.funcaoPaginacao(this.todosContratos);
      });
    }, 200);
  }
}
