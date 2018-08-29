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

  ObeservacaoPontoPresenca = {
    descricao: '',
    cod_obs: ''
  };

  constructor(
    private pontoPresencaService: PontoPresencaService
  ) { }

  ngOnInit() {
    this.getObsAcao();
    console.log(this.obsSelecionadas);
  }

  getObsAcao() {
    this.pontoPresencaService.getObsAcao()
      .subscribe(
        res => this.obsAcao = res
            );
  }

 

  searchObsAction(obs) {
    this.resultSearchObsAction =  obs;
    console.log(this.resultSearchObsAction);
  }


}
