import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ContratoService } from './../contrato.service';
import { SuiModalService } from 'ng2-semantic-ui';


@Component({
  selector: 'app-contrato-detalhe',
  templateUrl: './contrato-detalhe.component.html',
  styleUrls: ['./contrato-detalhe.component.scss']
})
export class ContratoDetalheComponent implements OnInit {
  params: { [key: string]: any; };
  public firstActive: boolean;
  public secondActive: boolean;
  public thirdActive: boolean;
  public fourthActive: boolean;

  contratos: any = {};
  lotes: any;

  constructor(
    private route: ActivatedRoute,
    private contratoService: ContratoService,
    private router: Router,
    public modalService: SuiModalService
  ) {
    this.firstActive = true;
  }

  getContrato() {
    this.contratoService.getContrato(this.params.id).subscribe( dados => {
      this.contratos = dados[0];
    });
  }

  getVisuLote() {
    this.contratoService.getVisuLote(this.params.id)
    .subscribe(
      res => {
        this.lotes = res;
      },
      erro => console.error(erro)
    );
  }

  ngOnInit() {
    this.route.params.subscribe(res => this.params = res);
    this.getContrato();
    this. getVisuLote();
  }


}
