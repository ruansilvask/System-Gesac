import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnpj'
})
export class FilterCnpjPipe implements PipeTransform {
  transform(cnpj: any): any {
    if (cnpj) {
      if (cnpj.length === 14) {
        return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5,8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
      } else if (cnpj === 'null' || cnpj === null) {
        return '';
      } else {
        return cnpj;
      }
    }
  }
}
