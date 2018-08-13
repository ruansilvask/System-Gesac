import { Pipe, PipeTransform, EventEmitter } from '@angular/core';

@Pipe({
  name: 'filterHistoricoAcoes'
})
export class FilterHistoricoAcoesPipe implements PipeTransform {
  historicoFiltrado: any;
  valida: Boolean;

  transform(historico, campo   ): any {
    if (!historico && !campo) {
      return historico;
    }

     this.historicoFiltrado = historico.filter(res => {
      this.valida = true;
      if (campo && !res.acao.toString().includes(campo.acao.toLowerCase())) {this.valida = false; }
      return this.valida;
     });

      return this.historicoFiltrado;
    }


}
