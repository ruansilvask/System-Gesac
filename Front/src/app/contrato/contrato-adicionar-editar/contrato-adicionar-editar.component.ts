import { ApiServicesData } from '../../api-services/api-services-data';
import { ApiServicesMsg } from '../../api-services/api-services-msg';
import {ApiServicesPagination } from '../../api-services/api-services-pagination';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { SuiLocalizationService } from 'ng2-semantic-ui';

import { ContratoService } from '../contrato.service';
import { EmpresaService } from '../../empresa/empresa.service';

import { Contrato } from '../contrato.model';
import pt from 'ng2-semantic-ui/locales/pt';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contrato-adicionar-editar',
  templateUrl: './contrato-adicionar-editar.component.html',
  styleUrls: ['./contrato-adicionar-editar.component.scss']
})
export class ContratoAdicionarEditarComponent implements OnInit {
  /*
  * INSTÂNCIAS DE VARIÁVEIS - INÍCIO
  *
  * Variáveis temporárias
  */
  fContratos: any;
  resposta: any;
  fVelocidade: any;

  /*
  * Valores iniciais dos formulários
  */
  bContratos: Contrato = {
    num_contrato: '',
    cnpj_empresa: '',
    quant_pontos: null,
    processo_sei: '',
    data_inicio: undefined,
    data_fim: undefined,
    empresa: ''
  };
  alterLote = {
    cod_lote: null,
    num_contrato: '',
    lote: ''
  };

  /*
  * Variáveis globais
  */
  selectEmpresa: any;
  params: any;
  searchLotes: any;
  lotesCadastrados: any[] = [];
  velocidadeArray: any;
  velo: any;

  /*
  * Váriáveis das tabs
  */
  contratos = true;
  lotes: boolean;

  /*
  * Variáveis dos inputs
  */
  desabilitarCampos = false;

  fAddContato: NgForm;

  /*
  * Opções para a máscara de dinheiro
  * prefix(prefixo: string)
  * thousands(separador da casa das centenas: string)
  * decimal(separador da casa dos decimais: string)
  * precision(número de casas após a vírgula: number)
  * allowNegative(se aceita números negativos ou não: boolean)
  * align(posição da máscara no input: string)
  */
  currencyOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    precision: 2,
    allowNegative: false,
    align: 'left'
  };

  /*
  * Pagination
  */
  todosLotesCadastrados: any;
  totalItens = 0;
  itensPagina = 50;
  pagina = 1;

  /*
  * INSTÂNCIAS DE VARIÁVEIS - FIM
  */

  constructor(
    private apiServicesMsg: ApiServicesMsg,
    private localizationService: SuiLocalizationService,
    private apiServicesPagination: ApiServicesPagination,
    private empresaService: EmpresaService,
    private contratoService: ContratoService,
    private route: ActivatedRoute,
    private apiServicesData: ApiServicesData,
    private router: Router
  ) {
    localizationService.load('pt', pt);
    localizationService.setLanguage('pt');
  }

  /* ADICIONAR CONTRATO - INÍCIO
  * Método que salva no banco os dados do contrato caso seja um novo contrato ou atualiza os dados
  * caso o contrato já exista
  */
  salvarContato(form) {
    form.value.data_inicio = this.apiServicesData.formatData(form.value.data_inicio);
    form.value.data_fim = this.apiServicesData.formatData(form.value.data_fim);
    this.fContratos = form.value;
    if (this.params.id) {
      this.contratoService
        .putContrato(this.params.id, form.value)
        .subscribe(
          res => {
            this.irParaLote(this.params.id);
            this.apiServicesMsg.setMsg('success', 'Contrato editado com sucesso.', 3000);
          },
          erro => Swal('Erro', `${erro.error}`, 'error')
        );
    } else {
      this.contratoService
        .postContrato(form.value)
        .subscribe(
          res => {
            this.irParaLote(form.value.num_contrato);
            this.apiServicesMsg.setMsg('success', 'Contrato cadastrado com sucesso.', 3000);
          },
          erro => Swal('Erro', `${erro.error}`, 'error')
        );
    }
  }

  /*
  * Método que carrega os dados do contrato
  */
  getContrato(codContrato) {
    this.contratoService
      .getContrato(codContrato)
      .subscribe(
        dados => {
          if (dados.length === 0) {
            Swal({
              title: 'Erro',
              html: `Este contrato não existe! Deseja cadastrar um novo contrato?`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sim, deletar!',
              cancelButtonText: 'Não, mater',
              reverseButtons: true
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['contrato/novo']);
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.router.navigate(['contrato']);
              }
            });
          } else {
            dados[0].data_inicio = new Date(dados[0].data_inicio);
            dados[0].data_fim = new Date(dados[0].data_fim);
            this.bContratos = dados[0];
          }
        }
      );
  }

  /*
  * Método que redireciona para lote e carega os lotes de acordo com o contrato contrato
  */
  irParaLote(numContrato) {
    this.getLotes(numContrato);
    this.lotes = true;
  }

  /*
  * Método para adicionar novos lotes no cotrato
  */
  enviarNome(formAddLote: NgForm) {
    Swal({
      title: 'Você tem certeza?',
      html: `Você tem certeza que deseja adicionar ${formAddLote.value.nomeLote}?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, adicionar!',
      cancelButtonText: 'Não, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.contratoService
          .postLote(this.fContratos.num_contrato, formAddLote.value.nomeLote)
          .subscribe(
            res => {
            this.alterLote = {
              cod_lote: res,
              num_contrato: this.fContratos.num_contrato,
              lote: formAddLote.value.nomeLote
            };
            this.getLotes(this.fContratos.num_contrato);
            formAddLote.reset();
            this.velocidadeArray = [];
            this.desabilitarCampos = true;
            this.apiServicesMsg.setMsg('success', 'Lote adicionado com sucesso.', 3000);
            },
            erro => Swal('Erro', `${erro.error}`, 'error')
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  /*
  * ADICIONAR CONTRATO - FIM
  *
  * Método para adicionar novas velocidades ao lote
  */
  addVelocidade(formLotes: NgForm) {
    Swal({
      title: 'Você tem certeza?',
      html: `Você tem certeza que deseja adicionar esta velocidade ao lote ${this.alterLote.lote}?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, adicionar!',
      cancelButtonText: 'Não, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.fVelocidade = {
          cod_lote: this.alterLote.cod_lote,
          descricao: formLotes.value.descricao,
          preco: formLotes.value.preco
        };
        this.contratoService.postVelocidade(this.fVelocidade)
        .subscribe(
          res => {
          this.getVelocidades(this.alterLote.cod_lote);
          formLotes.reset();
          delete this.fVelocidade;
          this.apiServicesMsg.setMsg('success', 'Velocidade adicionada com sucesso.', 3000);
          },
          erro => Swal('Erro', `${erro.error}`, 'error')
      );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  /*
  * Método para fechar a janela de informações do lote
  */
  cancelarInfLote() {
    delete this.alterLote;
    this.desabilitarCampos = false;
  }

  /*
  * Método para carregar os lotes do contrato
  */
  getLotes(numContrato) {
    this.contratoService
      .getLotes(numContrato)
      .subscribe(lotesCadastrados => {
          this.totalItens = lotesCadastrados.length;
          this.todosLotesCadastrados = this.apiServicesPagination.pagination(lotesCadastrados, this.itensPagina);
          this.lotesCadastrados = this.todosLotesCadastrados[0];
      });
  }

  /*
  * Método para carregar as velocidades de acordo com o codigo do lote escolhido
  */
  getVelocidades(codLote) {
    this.contratoService.getVelocidade(codLote).subscribe(res => {
      this.velocidadeArray = res;
    });
  }

  /*
  * Método para abrir a janela de informações do lote para edição do mesmo
  */
  visuLote(lote) {
      this.alterLote = lote;
      this.getVelocidades(lote.cod_lote);
      this.desabilitarCampos = true;
  }

  /*
  * INFORMAÇÕES DO LOTE - FIM
  *
  * TABELA DE LOTES CADASTRADOS - INÍCIO
  * Método para editar o nome do lote
  */
  alterarLote(lote: NgForm) {
    Swal({
      title: 'Você tem certeza?',
      html: `Você tem certeza que deseja alterar o nome deste lote?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, alterar!',
      cancelButtonText: 'Não, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.contratoService
          .putLote(this.alterLote.cod_lote, lote.value.lote)
          .subscribe(
            res => {
            this.resposta = res;
            this.alterLote.lote = this.resposta.lote;
            lote.reset();
            this.getLotes(this.alterLote.num_contrato);
            this.apiServicesMsg.setMsg('success', 'Nome alterado com sucesso.', 3000);
            },
            erro => Swal('Erro', `${erro.error}`, 'error')
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
      }
  });
  }

  /*
  * Método para deletar o lote caso o mesmo não tenha velocidades cadastradas
  */
  deleteLote(lote) {
    Swal({
      title: 'Você tem certeza?',
      html: `Você tem certeza que deseja excluir ${lote.lote}?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Não, mater',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.contratoService.deleteLote(lote.cod_lote).subscribe(
          res => {
          this.getLotes(this.fContratos.num_contrato);
          this.cancelarInfLote();
          this.apiServicesMsg.setMsg('success', 'Lote excluído com sucesso.', 3000);
          },
          erro => Swal('Erro', `${erro.error}`, 'error')
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  /*
  * TABELA DE LOTES CADASTRADOS - FIM
  *
  * Método para retornar para a aba de edição do contrato
  */
  voltarContrato() {
    if (this.fContratos.num_contrato) {
      this.router.navigate(['contrato', this.fContratos.num_contrato]);
      this.getContrato(this.fContratos.num_contrato);
      this.contratos = true;
    } else {
      this.router.navigate(['contrato/novo']);
      this.getContrato(this.fContratos.num_contrato);
      this.contratos = true;
    }
  }

  /*
  * Método para concluir o cadastro do contrato
  */
  concluirContrato() {
    if (this.desabilitarCampos === true) {
      Swal({
        title: 'Você tem certeza?',
        html: `Você tem certeza que deseja concluir lote sem salvar as alterações?`,
        type: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, ir para contratos!',
        cancelButtonText: 'Não, continuar nesta página',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/contrato']);
        }
      });
    } else { this.router.navigate(['/contrato']); }
  }

  temProcSei(procSei) {
    if (procSei) {
      if (procSei.length === 0) {
        return false;
      } else if (procSei.length > 0) {
        return true;
      }
    }
  }

  /*
  * Método para alterar a página da tabela de lotes cadastrados
  */
  mudarPagina(pagina) {
    this.lotesCadastrados = this.todosLotesCadastrados[pagina - 1];
  }

  /*
  * Métodos que serão executados quando o componente é iniciado
  */
  ngOnInit() {
    /*
    * Verifica se existe parâmetro na rota e se existir adiciona o parâmetro em uma variável
    */
    this.route.params.subscribe(res => (this.params = res));

    setTimeout(() => {
      /*
      * Método que carrega as empresas que podem ser escolhidas no cadastro do contrato
      */
      this.empresaService
        .getEmpresasPai()
        .subscribe(dados => {this.selectEmpresa = dados; });

      /*
      * Caso exista parâmetro na rota, irá ser carregado os dados do contrato
      */
      if (this.params.id) {
        this.getContrato(this.params.id);
      }
    }, 200);
  }
}
