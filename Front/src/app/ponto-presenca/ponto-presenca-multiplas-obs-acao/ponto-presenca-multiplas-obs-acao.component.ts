import { Component, OnInit, Input } from '@angular/core';
import { PontoPresencaService } from '../ponto-presenca.service';
import { ApiServicesMsg } from './../../api-services/api-services-msg';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-obs-acao',
  templateUrl: './ponto-presenca-multiplas-obs-acao.component.html',
  styleUrls: ['./ponto-presenca-multiplas-obs-acao.component.scss']
})
export class ObsAcaoComponent implements OnInit {
  @Input()
  obsSelecionadas: any;
  obsAcao: any = [];
  observacao = '';
  filterObsAction = '';
  resultSearchObsAction = [];
  searchObs = '';
  gesacObs: any = [];
  cod_gesac = [];
  removerCodsObs: any = [];
  listRemoveObsAction: any;

  observacaoPontoPresenca = {
    descricao: '',
    cod_obs: ''
  };

  constructor(
    private pontoPresencaService: PontoPresencaService,
    private apiServicesMsg: ApiServicesMsg
  ) {}

  gerarObs(res) {
    this.removerCodsObs = this.obsAcao.filter(e => {
      let valido = false;
      res.forEach(a => {
        if (e.cod_obs.toString() === a.toString()) {
          valido = true;
          return false;
        }
      });
      return valido;
    });
  }

  getObsSelecionadas(obsSelecionadas) {
    if (obsSelecionadas.length > 0) {
      this.pontoPresencaService
        .getObsAcaoSelecionadas(obsSelecionadas)
        .subscribe(
          res => {
            this.formatObs(res);
          },
          erro => console.error(erro)
        );
    } else {
      this.gesacObs = [];
      this.removerCodsObs = [];
    }
  }

  formatObs(array) {
    array.forEach(element => {
      if (element.cod_obs) {
        element.cod_obs = element.cod_obs.split(',');
      }
    });
    this.gesacObs = array;
    this.gerarPrimeiraObs();
  }

  gerarPrimeiraObs() {
    let obs = [];
    this.gesacObs.forEach(element => {
      if (element.cod_obs) {
        element.cod_obs.forEach(element2 => obs.push(element2));
      }
    });
    if (obs) {
      obs = obs.filter((item, pos, self) => self.indexOf(item) === pos).sort();
      this.gerarObs(obs);
    }
  }

  getObsAcao() {
    this.pontoPresencaService.getObsAcao().subscribe(
      res => {
        this.obsAcao = res;
      },
      erro => console.error(erro)
    );
  }

filtrarGesacs(gesac){
  return this.gesacObs.filter(element => {
    let valido = false;
    if (element.cod_obs) {
      element.cod_obs.forEach(el => {
        if (el.toString() === gesac.toString()) {
          valido = true;
          return false;
        }
      });
    }
    return valido;
  });
}

  searchObsAction(obs) {
    this.getObsSelecionadas(this.obsSelecionadas);
    setTimeout(() => {
      let array = [];
      array = this.filtrarGesacs(obs);
      this.gesacObs = array;
      this.getObsSelecionadas(this.pegarSomenteCodsGesac(this.gesacObs));
    }, 500);
  }

  filtrarPagina(obs){
    this.pontoPresencaService.filtrarObsAcao(this.pegarSomenteCodsGesac(this.filtrarGesacs(obs)));
  }

  pegarSomenteCodsGesac(array) {
    const newArray = [];
    array.forEach(element => {
      newArray.push(element.cod_gesac);
    });
    return newArray;
  }

  searchTodos() {
    this.searchObs = '';
    this.getObsSelecionadas(this.obsSelecionadas);
  }

  AddObsAction(codObs) {
    if (codObs.value.cod_obs) {
      if (this.gesacObs.length > 0) {
        const form: any = {};
        form.cod_gesac = [];
        this.gesacObs.forEach(element => {
          if (element.cod_obs) {
            let temObs = false;
            element.cod_obs.forEach(el => {
              if (el.toString() === codObs.value.cod_obs.toString()) {
                temObs = true;
                return false;
              }
            });
            if (!temObs) {
              form.cod_gesac.push(element.cod_gesac);
            }
          } else {
            form.cod_gesac.push(element.cod_gesac);
          }
        });
        form.cod_obs = codObs.value.cod_obs;
        if (form.cod_gesac.length > 0) {
          Swal({
            title: 'Você tem certeza?',
            html: `Tem certeza que deseja adicionar esta observação para ação?
      Ela será adicionada em todos os GESACS selecionados que não a possuem.`,
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, adicionar!',
            cancelButtonText: 'Não, cancelar',
            reverseButtons: true
          }).then(result => {
            if (result.value) {
              this.pontoPresencaService
                .salvarObsAcao(form)
                .subscribe(
                  res =>
                    this.getObsSelecionadas(
                      this.pegarSomenteCodsGesac(this.gesacObs)
                    ),
                  erro => console.error(erro)
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
            }
          });
        } else {
          this.apiServicesMsg.setMsg(
            'warning',
            'Todos os códigos GESAC já possuem essa observação para ação.',
            3000
          );
        }
      } else {
        this.apiServicesMsg.setMsg(
          'warning',
          'Sem GESACS para inserir esta observação para ação.',
          3000
        );
      }
    }
  }

  removerobservacao(obsAction, cods_gesac) {
    Swal({
      title: 'Você tem certeza?',
      html: `Tem certeza que deseja remover esta observação para ação?
      Ela será removida de todos os GESACS selecionados que a possuem.`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Não, manter',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.listRemoveObsAction = {
          cod_gesac: this.pegarSomenteCodsGesac(cods_gesac),
          cod_obs: obsAction
        };
        this.pontoPresencaService
          .removerObsAcao(this.listRemoveObsAction)
          .subscribe(
            res => {
              this.apiServicesMsg.setMsg(
                'success',
                'Observação para ação excluída com sucesso.',
                3000
              );
              this.getObsSelecionadas(
                this.pegarSomenteCodsGesac(this.gesacObs)
              );
            },
            erro => Swal('Erro', `${erro.error}`, 'error')
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  ngOnInit() {
    this.getObsAcao();
    setTimeout(() => {
      this.getObsSelecionadas(this.obsSelecionadas);
    }, 500);
  }
}
