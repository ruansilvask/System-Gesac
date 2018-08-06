import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cep'
})
export class FilterCepPipe implements PipeTransform {

  transform(cep: any): any {
    if (cep) {
      return `${cep.slice(0,  5)}-${cep.slice(5,  8)}`;
    } else {
      return cep;
    }
  }
}
