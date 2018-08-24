import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-obs-acao',
  templateUrl: './ponto-presenca-obs-acao.component.html',
  styleUrls: ['./ponto-presenca-obs-acao.component.scss']
})
export class ObsAcaoComponent implements OnInit {

  filter = true;
  obs = false;

  constructor() { }

  ngOnInit() {
  }

}
