import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { PontoPresencaService } from './../ponto-presenca.service';
import { ApiServicesMsg } from '../../api-services/api-services-msg';

import Swal from 'sweetalert2';
import { PontoPresencaObsAcaoService } from './ponto-presenca-obs-acao.service';

@Component({
  selector: 'app-obs-acao-single',
  templateUrl: './ponto-presenca-obs-acao.component.html',
  styleUrls: ['./ponto-presenca-obs-acao.component.scss']
})
export class PontoPresencaObsAcaoComponent implements OnInit {
  novo = false;
  allParams: any;
  removido: Object;
  codGesac: any;
  admin: boolean;
  obsAcoes: any;
  obsAcoesCad: any;
  params: any;
  gesac: any;

  obeservacaoPontoPresenca = {
    descricao: '',
    cod_obs: ''
  };

  constructor(
    private route: ActivatedRoute,
    private pontoPresencaService: PontoPresencaService,
    private apiServicesMsg: ApiServicesMsg,
    private pontoPresencaObsService: PontoPresencaObsAcaoService
  ) { }

  ngOnInit() {
    this.pontoPresencaService.atualizaObsAcao.subscribe(gesac => this.getObsAcaoporId(gesac));
    this.route.params.subscribe(res => (this.params = res));
    if (this.params.id) {
      this.allParams = this.params.id;
    } else {
      this.allParams = this.pontoPresencaObsService.getEmitirGesac();
    }

    this.getObsAcaoporId(this.allParams);
    this.getObsAcao();
    if (localStorage.getItem('currentUserCode') === '1') {
      this.admin = true;
    }
  }

  /*
* Método para salvar a observação
*/
  salvarObeservacao(fAddObeservacao) {
    let permitido = false;

    if (this.obsAcoesCad.length === 0) {
      permitido = true;
    } else if (this.obsAcoesCad.length > 0) {
      for (let i = 0; i < this.obsAcoesCad.length; i++) {

        // tslint:disable-next-line:triple-equals
        if (this.obsAcoesCad[i].cod_obs == fAddObeservacao.value.cod_obs) {
          permitido = false;
          break;
        } else {
          permitido = true;
        }
      }
    }

    if (permitido) {
      fAddObeservacao.value.cod_obs !== ''
        ? ((fAddObeservacao.value.cod_gesac = this.allParams),
          this.pontoPresencaService
            .salvarObsAcao(fAddObeservacao.value)
            .subscribe(dados => {
              this.getObsAcaoporId(this.allParams);
            }))
        : this.apiServicesMsg.setMsg(
          'error',
          'Não é possivel adicionar Observação de Ação vazio!!!',
          3000
        );
    } else {
      this.apiServicesMsg.setMsg('error', 'Observação já esta em uso!!!', 3000);
    }
  }

  /*
* Método para retornar observações do ponto
*/

  getObsAcaoporId(gesac) {
    console.log('alguma coisa', gesac);

    this.pontoPresencaService.getObsAcaoporId(gesac).subscribe(dados => {
      this.obsAcoesCad = dados;
    });
  }

  /*
* Método para retornar todas as observações
*/
  getObsAcao() {
    this.pontoPresencaService.getObsAcao().subscribe(dados => {
      this.obsAcoes = dados;
    });
  }

  /*
* Métodos para remover a Obs Ações da tela e do banco
*/
  removerObsAcao(obs) {
    Swal({
      title: 'Você tem certeza?',
      html: `Tem certeza que deseja remover a Obeservação de Ação <i>${
        obs.descricao
        }</i>?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Não, mater',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        if (this.allParams) {
          obs.cod_gesac = this.allParams;
          this.pontoPresencaService.removerObsAcao(obs).subscribe(
            res => {
              this.removido = res;
              this.getObsAcaoporId(this.allParams);
              this.apiServicesMsg.setMsg(
                'success',
                'Tipologia removida com sucesso.',
                3000
              );
            },
            erro => Swal('Erro', `${erro.error}`, 'error')
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }
}
