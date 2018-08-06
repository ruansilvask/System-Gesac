import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterRepre'
})
export class FilterRepresentantePipe implements PipeTransform {
  teste: any;
  repreLegaisFilter = [];
  cont: any;
  valida: boolean;

  transform(repreLegais: any): any {

    this.repreLegaisFilter = [];
    setTimeout(() => {

      if (repreLegais) {
        for (let i = 0; i < repreLegais.length; i++) {

          if (this.repreLegaisFilter.length !== 0) {
            this.valida = false;
            for (let b = 0; b < this.repreLegaisFilter.length; b++) {
              if (this.repreLegaisFilter[b].cod_pessoa === repreLegais[i].pessoa.cod_pessoa) {
                this.repreLegaisFilter[b].telefones.push(this.salvadorDali(repreLegais[i]));
                this.valida = true;
                break;
              }
            }
            if (this.valida === false ) {
              this.repreLegaisFilter.push(repreLegais[i].pessoa);
              this.repreLegaisFilter[this.repreLegaisFilter.length - 1].telefones = [];
              this.repreLegaisFilter[this.repreLegaisFilter.length - 1].telefones[0] = this.salvadorDali(repreLegais[i]);
            }
          } else {
            this.repreLegaisFilter.push(repreLegais[i].pessoa);
            this.repreLegaisFilter[0].telefones = [];
            this.repreLegaisFilter[0].telefones[0] = this.salvadorDali(repreLegais[i]);
          }
        }
      }
    }, 500);
      return this.repreLegaisFilter;

}

salvadorDali(repre) {
  return {
    cod_telefone: repre.cod_telefone,
    fone: repre.fone,
    email: repre.email,
    tipo: repre.tipoII
  };
}
}
