import { Component, OnInit } from '@angular/core';
import { PontoPresencaService } from '../ponto-presenca.service';

@Component({
  selector: 'app-obs-acao',
  templateUrl: './ponto-presenca-obs-acao.component.html',
  styleUrls: ['./ponto-presenca-obs-acao.component.scss']
})
export class ObsAcaoComponent implements OnInit {

  filter = true;
  obs = false;
  obsAcao: any = [];
  observacao = '';

  constructor(
    private pontoPresencaService: PontoPresencaService
  ) { }

  getObsAcao() {
    this.pontoPresencaService.getObsAcao()
    .subscribe(
      res => this.obsAcao = res
    );
  }

  ngOnInit() {
    this.getObsAcao();
  }
}
