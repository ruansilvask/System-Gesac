import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class PontoPresencaObsAcaoService {

  emitirGesac = new EventEmitter<any>();

  private gesac: any;

  constructor() {}

  getEmitirGesac() {
    return this.gesac;
  }

  addEmitirGesac(gesac: any) {
    this.emitirGesac.emit(gesac);
    this.gesac = gesac;
  }
}
