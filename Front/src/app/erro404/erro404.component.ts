import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { API } from '../app.api';

@Component({
  selector: 'app-erro404',
  templateUrl: './erro404.component.html',
  styleUrls: ['./erro404.component.scss']
})
export class Erro404Component implements OnInit {

  previousUrl: any = {};
  baseUrl = API.GESAC_API.slice(0, -1);

  constructor(router: Router) {
    router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe(e => {
      this.previousUrl = e;
    });
  }
  ngOnInit() {
  }

}
