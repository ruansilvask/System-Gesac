import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterppContratoLote'
})
export class FilterContratoLotePipe implements PipeTransform {
  teste: any;
  filterLotes = [];
  cont: any;
  valida: boolean;

  transform(lotes: any): any {
    this.filterLotes = [];

    if (lotes) {
      for (let i = 0; i < lotes.length; i++) {
        if (this.filterLotes.length !== 0) {
          this.valida = false;
          for (let b = 0; b < this.filterLotes.length; b++) {
            if (this.filterLotes[b].cod_lote === lotes[i].cod_lote) {
              this.filterLotes[b].velocidade.push(
                this.salvadorDali(lotes[i])
              );
              this.valida = true;
              break;
            }
          }
          if (this.valida === false) {
            this.montaArray(lotes[i]);
          }
        } else {
          this.montaArray(lotes[i]);
        }
      }
    }
    return this.filterLotes;
  }

  lote(contratoLote) {
    return {
      cod_lote: contratoLote.cod_lote,
      lote: contratoLote.lote
    };
  }

  salvadorDali(velLote) {
    return {
      cod_velocidade: velLote.cod_velocidade,
      descricao: velLote.descricao,
      preco: velLote.preco
    };
  }

  montaArray(contratoLote) {
    this.filterLotes.push(this.lote(contratoLote));
    this.filterLotes[this.filterLotes.length - 1].velocidade = [];
    this.filterLotes[
      this.filterLotes.length - 1
    ].velocidade[0] = this.salvadorDali(contratoLote);
  }
}
