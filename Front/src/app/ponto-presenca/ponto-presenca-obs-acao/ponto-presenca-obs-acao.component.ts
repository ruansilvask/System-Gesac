import { Component, OnInit, Input } from '@angular/core';
import { PontoPresencaService } from '../ponto-presenca.service';

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
  obeservacoesGuardadas: any;
  cod_gesac = [];
  listRemoveObsAction: any;

  ObeservacaoPontoPresenca = {
    descricao: '',
    cod_obs: ''
  };

  constructor(
    private pontoPresencaService: PontoPresencaService
  ) { }

  ngOnInit() {
    this.getObsAcao();
  }

  gerarObs() {
    const obs = [];
    this.obsSelecionadas.forEach(e => {
      if (e.obs_acao) { e.obs_acao.forEach(a => obs.push(a)); }
    });
    obs = obs.filter((item, pos, self) => self.indexOf(item) === pos);
    this.obeservacoesGuardadas = this.obsAcao.filter(e => {
      let valido = false;
      obs.forEach(a =>
        if (e.cod_obs.toString() === a.toString()) { valido = true; return false; });
      return valido;
    });
  }

  getObsAcao() {
    this.pontoPresencaService.getObsAcao()
      .subscribe(
        res => {
          this.obsAcao = res;
          this.gerarObs();
        }
      );
  }

  searchObsAction(obs) {
    this.resultSearchObsAction = obs;
  }


  AddObsAction(fAddObeservacao, obsAcao) {
    for (let index = 0; index < obsAcao.length; index++) {
      this.cod_gesac[index] = obsAcao[index].cod_gesac;
    }
    fAddObeservacao.value.cod_gesac = this.cod_gesac;
    console.log(fAddObeservacao.value);
  }



  removerObeservacao(obsAction, obsSelecionadas) {
    for (let index = 0; index < obsSelecionadas.length; index++) {
      this.cod_gesac[index] = obsSelecionadas[index].cod_gesac;
    }

    this.listRemoveObsAction = {cod_gesac: this.cod_gesac, cod_obs: obsAction };
    // obsAction.value.cod_gesac = this.cod_gesac;
    // console.log( this.cod_gesac);
    // console.log(obsAction);
    console.log(this.listRemoveObsAction);

  }


}
