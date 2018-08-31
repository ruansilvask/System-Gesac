import { Pipe, PipeTransform, AfterContentChecked } from '@angular/core';

@Pipe({
  name: 'filterppContato'
})
export class FilterContatoPipe implements PipeTransform {
  teste: any;
  PontpreContatoFilter = [];
  cont: any;
  valida: boolean;

  transform(pontContato: any): any {
    this.PontpreContatoFilter = [];
      if (pontContato) {
        for (let i = 0; i < pontContato.length; i++) {
          if (this.PontpreContatoFilter.length !== 0) {
            this.valida = false;
            for (let b = 0; b < this.PontpreContatoFilter.length; b++) {
              if (this.PontpreContatoFilter[b].nome === pontContato[i].nome) {
                this.PontpreContatoFilter[b].telefone.push(this.salvadorDali(pontContato[i]));
                this.valida = true;
                break;
              }
            }
            if (this.valida === false ) {
              this.montaArray(pontContato[i]);
            }
          } else {
            this.montaArray(pontContato[i]);
          }
      }
      }
      return this.PontpreContatoFilter;
}

pessoa(pontContato) {
  return {
    nome:  pontContato.nome,
    cargo:  pontContato.cargo,
    obs: pontContato.obs,
    data: pontContato.data
  };
}

salvadorDali(contato) {
  return {
    fone: contato.fone,
    email: contato.email,
    tipo: contato.tipo
  };
}

montaArray(pontContato) {
  this.PontpreContatoFilter.push(this.pessoa(pontContato));
  this.PontpreContatoFilter[this.PontpreContatoFilter.length - 1].telefone = [];
  this.PontpreContatoFilter[this.PontpreContatoFilter.length - 1].telefone[0] = this.salvadorDali(pontContato);
}
}
