import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sei'
})
export class FilterSeiPipe implements PipeTransform {
  transform(sei: any): any {
    if (sei) {
      return `${sei.slice(0, 5)}.${sei.slice(5, 11)}/${sei.slice(11, 15)}-${sei.slice(15, 17)}`;
    } else {
      return sei;
    }
  }
}
