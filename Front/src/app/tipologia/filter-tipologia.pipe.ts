import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTipologia'
})
export class FilterTipologiaPipe implements PipeTransform {
  valida: boolean;
  transform(tipologias: any, nome: any): any {
    if (!nome) {
      return tipologias;
    }
    return tipologias.filter(tipologia => {
      this.valida = true;
      if ((nome && tipologia.nome == null) ||
          (nome && !tipologia.nome.toLowerCase().includes(nome.toLowerCase()))) {this.valida = false; }
      return this.valida;
      });
    }
}

