import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoTel'
})
export class FilterTipoTelPipe implements PipeTransform {
  transform(tipo: any): any {
    if (tipo) {
        if (tipo === 'M') {
            return 'Móvel';
        } else if (tipo === 'C') {
            return 'Casa';
        } else if (tipo === 'T') {
            return 'Trabalho';
        } else {
            return '-';
        }
    } else {
      return '-';
    }
  }
}
