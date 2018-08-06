import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

import { TipologiaService } from './tipologia.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SuiModalService } from 'ng2-semantic-ui';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipologia',
  templateUrl: './tipologia.component.html',
  styleUrls: ['./tipologia.component.scss']
})
export class TipologiaComponent implements OnInit {
  filtros = {
    nome: ''
  };
  desabilitado: any;
  tipologias: any;
  formTipologias: FormGroup;
  segmentDimmed: boolean;

  /*
  * Pagination
  */
 todasTipologias: any;
 totalItens = 0;
 itensPagina = 50;
 pagina = 1;

  constructor(
    private appService: AppService,
    private tipologiaService: TipologiaService,
    private formBuilder: FormBuilder,
    private modalService: SuiModalService
  ) {}

  ngOnInit() {
    this.desabilitado = true;
    this.formTipologias = this.formBuilder.group({
      cod_tipologia: [null],
      nome: [null]
    });
    this.getTipologias();
  }

  getTipologias() {
    this.segmentDimmed = true;
    this.tipologiaService
      .getTipologias()
      .subscribe(tipologias => {
        this.totalItens = tipologias.length;
        this.todasTipologias = this.appService.pagination(tipologias, this.itensPagina);
        this.tipologias = this.todasTipologias[0];
        this.segmentDimmed = false;
      });
  }

  removerTipologia(tipo) {
    Swal({
      title: 'Você tem certeza?',
      html: `Você tem certeza que deseja excluir esta tipologia?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Não, mater',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.tipologiaService
          .deleteTipologia(tipo.cod_tipologia)
          .subscribe(
            res => {
            this.getTipologias();
            this.appService.setMsg('success', 'Tipologia excluída com sucesso.', 3000);
          },
          erro => Swal('Erro', `${erro.error}`, 'error')
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.appService.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  salvarTipologia() {
    Swal({
      title: 'Você tem certeza?',
      html: `Você tem certeza que deseja cadastrar esta tipologia?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, cadastrar!',
      cancelButtonText: 'Não, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.tipologiaService.postTipologia(this.formTipologias)
        .subscribe(
          res => {
          this.getTipologias();
          this.formTipologias.reset();
          this.appService.setMsg('success', 'Tipologia cadastrada com sucesso.', 3000);
        },
        erro => Swal('Erro', `${erro.error}`, 'error')
      );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.appService.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  /*
  * Método para mudar a página da paginação
  */
 mudarPagina(pagina) {
  this.tipologias = this.todasTipologias[pagina - 1];
}

  desabilitarInput(i) {
    this.desabilitado = i;
  }

  editarTipologia(dados, i) {
    this.tipologiaService.putTipologia(dados)
    .subscribe(
      res => {
        this.desabilitado = !i;
        this.appService.setMsg('success', 'Tipologia editada com sucesso.', 3000);
      }
    );
  }

}
