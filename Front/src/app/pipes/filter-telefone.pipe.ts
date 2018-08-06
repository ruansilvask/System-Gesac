import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone'
})
export class FilterTelefonePipe implements PipeTransform {
  transform(tel: any): any {
    if (tel) {
        if (tel.length === 10) {
            return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6, 10)}`;
        } else if (tel.length === 11) {
            return `(${tel.slice(0, 2)}) ${tel.slice(2, 3)} ${tel.slice(3, 7)}-${tel.slice(7, 11)}`;
        } else {
          return tel;
        }
    } else {
      return '-';
    }
  }
}
