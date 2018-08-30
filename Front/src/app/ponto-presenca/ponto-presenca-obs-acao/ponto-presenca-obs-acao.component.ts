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
  resultSearchObsAction = [];
  returnObsAction = [ {num: 1}];
  obeservacoesGuardadas: any;

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
    let obs = [];
    this.obsSelecionadas.forEach(e => {
      if (e.obs_acao) {
        e.obs_acao.forEach(a => obs.push(a));
      }
    });
    obs = obs.filter((item, pos, self) => self.indexOf(item) === pos);
    this.obeservacoesGuardadas = this.obsAcao.filter(e => {
      let valido = false;
      obs.forEach(a => {
        if (e.cod_obs.toString() === a.toString()) {
          valido = true;
          return false;
        }
      }
      );
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
    this.resultSearchObsAction =  obs;
  }
}
