import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEmpresa'
})
export class FilterEmpresaContatoPipe implements PipeTransform {
  teste: any;
  empresaContatoFilter = [];
  cont: any;
  valida: boolean;

  transform(empresaContato: any): any {

    this.empresaContatoFilter = [];


      if (empresaContato) {
        for (let i = 0; i < empresaContato.length; i++) {

          if (this.empresaContatoFilter.length !== 0) {

            this.valida = false;
            for (let b = 0; b < this.empresaContatoFilter.length; b++) {
              if (this.empresaContatoFilter[b].nome === empresaContato[i].nome) {
                this.empresaContatoFilter[b].telefone.push(this.salvadorDali(empresaContato[i]));
                this.valida = true;
                break;
              }
            }
            if (this.valida === false ) {
              this.montaArray(empresaContato[i]);
            }
          } else {
            this.montaArray(empresaContato[i]);
          }
      }
      }
      return this.empresaContatoFilter;

}

pessoa(empresaContato) {
  return {
    nome:  empresaContato.nome,
    cargo:  empresaContato.cargo,
    obs: empresaContato.obs
  };
}

salvadorDali(contato) {
  return {
    fone: contato.fone,
    email: contato.email,
    tipo: contato.tipo
  };
}

montaArray(empresaContato) {
  this.empresaContatoFilter.push(this.pessoa(empresaContato));
  this.empresaContatoFilter[this.empresaContatoFilter.length - 1].telefone = [];
  this.empresaContatoFilter[this.empresaContatoFilter.length - 1].telefone[0] = this.salvadorDali(empresaContato);
}
}
