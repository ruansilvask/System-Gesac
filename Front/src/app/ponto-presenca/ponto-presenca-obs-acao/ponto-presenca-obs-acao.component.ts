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
  resultSearchType = [];
  resultSearchObsAction = [];
  returnObsAction = [ {num: 1}];

  ObeservacaoPontoPresenca = {
    descricao: '',
    cod_obs: ''
  };

  constructor(
    private pontoPresencaService: PontoPresencaService
  ) { }

  getObsAcao() {
    this.pontoPresencaService.getObsAcao()
      .subscribe(
        res => this.obsAcao = res
            );
  }

  searchType(type) {
    this.resultSearchType = type;
    console.log(this.resultSearchType);
  }

  searchObsAction(obs) {
    this.resultSearchType = [this.resultSearchType, obs];
    console.log(this.resultSearchType);
  }

  ngOnInit() {
    this.getObsAcao();
    console.log(this.obsAcao);
  }

}
