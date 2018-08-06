import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numContrato'
})
export class FilterNumContratoPipe implements PipeTransform {
  transform(numContrato: any): any {
    if (numContrato) {
      return `${numContrato.slice(0, 2)}.${numContrato.slice(2, 6)}.${numContrato.slice(6, 8)}/${numContrato.slice(8, 12)}`;
    } else {
      return numContrato;
    }
  }
}
