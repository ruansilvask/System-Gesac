import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

latido = false;
rodar = false;
clicks = 0;

  constructor() {}

  latiu() {
    this.latido = true;
    setTimeout(() => {
      this.latido = false;
    }, 200);
    this.clicks++;
    if (this.clicks % 42 === 0) {
      this.rodar = true;
      setTimeout(() => {
        this.rodar = false;
      }, 2000);
    }
  }

  ngOnInit() {
  }

}
