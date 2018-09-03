import { Component, OnInit, Input } from '@angular/core';
import { PontoPresencaService } from '../ponto-presenca.service';
import { ApiServicesMsg } from './../../api-services/api-services-msg';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-obs-acao',
  templateUrl: './ponto-presenca-obs-acao.component.html',
  styleUrls: ['./ponto-presenca-obs-acao.component.scss']
})
export class ObsAcaoComponent implements OnInit {

  @Input() obsSelecionadas: any;
  obsAcao: any = [];
  observacao = '';
  filterObsAction = '';
  resultSearchObsAction = [];
  returnObsAction = [{ num: 1 }];
  gesacObs: any;
  cod_gesac = [];
  removerCodsObs: any;
  listRemoveObsAction: any;

  ObeservacaoPontoPresenca = {
    descricao: '',
    cod_obs: ''
  };

  constructor(
    private pontoPresencaService: PontoPresencaService,
    private apiServicesMsg: ApiServicesMsg
  ) { }

  gerarObs(res) {
    this.removerCodsObs = this.obsAcao.filter(e => {
      let valido = false;
      res.forEach(a => {
        if (e.cod_obs.toString() === a.toString()) {
          valido = true;
          return false;
        }
      }
      );
      return valido;
    });
  }

  getObsSelecionadas(obsSelecionadas) {
    this.pontoPresencaService.getObsAcaoSelecionadas(obsSelecionadas)
    .subscribe(
      res => {
        this.formatObs(res);
      },
      erro => console.error(erro)
    );
  }

  formatObs(array) {
      array.forEach(element => {
        if (element.cod_obs) {
          element.cod_obs = element.cod_obs.split(',');
        }
      });
      this.gesacObs = array;
      this.gerarPrimeiraObs();
  }

  gerarPrimeiraObs() {
    let obs = [];
    this.gesacObs.forEach(element => {
      if (element.cod_obs) {
        element.cod_obs.forEach(element2 => obs.push(element2));
      }
    } );
    if (obs) {
      obs = obs.filter((item, pos, self) => self.indexOf(item) === pos).sort();
      this.gerarObs(obs);
    }
  }

  getObsAcao() {
    this.pontoPresencaService.getObsAcao()
      .subscribe(
        res => {
          this.obsAcao = res;
        },
        erro => console.error(erro)
      );
  }

  searchObsAction(obs) {
    this.resultSearchObsAction = obs;
  }


  AddObsAction(codObs) {
    const form: any = {};
    form.cod_gesac = [];
    this.gesacObs.forEach(element => {
      if (element.cod_obs) {
        let temObs = false;
        element.cod_obs.forEach(el => {
          if (el.toString() === codObs.value.cod_obs.toString()) {
            temObs = true;
            return false;
          }
        });
        if (!temObs) { form.cod_gesac.push(element.cod_gesac); }
      } else {
        form.cod_gesac.push(element.cod_gesac);
      }
    });
    form.cod_obs = codObs.value.cod_obs;
    this.pontoPresencaService.salvarObsAcao(form)
    .subscribe(
      res => this.getObsSelecionadas(this.obsSelecionadas),
      erro => console.error(erro)
    );
  }



  removerObeservacao(obsAction, cods_gesac) {
    this.listRemoveObsAction = {cod_gesac: cods_gesac, cod_obs: obsAction };
    this.pontoPresencaService.removerObsAcao(this.listRemoveObsAction)
    .subscribe(
      res => {
        this.apiServicesMsg.setMsg('success', 'Observação para ação excluída com sucesso.', 3000);
        this.getObsSelecionadas(this.obsSelecionadas);
      },
      erro => console.error(erro)
    );
  }

  ngOnInit() {
    this.getObsAcao();
    this.getObsSelecionadas(this.obsSelecionadas);
  }

}
