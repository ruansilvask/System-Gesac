import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pagadora'
})
export class FilterPagadoraPipe implements PipeTransform {

  transform(pagadora: any): any {
    if (pagadora === 1) {
      return 'Sim';
    } else if (pagadora === 2) {
      return 'Não';
    } else {
      return 'Erro de filtro';
    }

  }
}
