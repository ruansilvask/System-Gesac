import { ApiServicesData } from '../../api-services/api-services-data';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SuiModalService } from 'ng2-semantic-ui';

import { PontoPresencaService } from '../ponto-presenca.service';
import { NgForm } from '@angular/forms';
import { ContatoService } from '../../contato/contato.service';

import { ApiServicesMsg } from '../../api-services/api-services-msg';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-ponto-presenca-detalhe',
  templateUrl: './ponto-presenca-detalhe.component.html',
  styleUrls: ['./ponto-presenca-detalhe.component.scss']
})

export class PontoPresencaDetalheComponent implements OnInit {
  public selcPP: boolean;
  codGesac: any;
  empresas: Object;
  pontoHistorico: any;
  solicitacao: any;
  FecharCollapseAnalise: boolean;
  obrigatorio = false;

  abrirNodal = false;
  condicao: string;
  params: any;
  codPid: any;

  tipologias: any;
  contatos: any;
  interacao: any;
  pessoasInterecao: any;

  errorJustificativa = false;
  justificativa = false;
  condicaoAnalise = false;
  historicoAnalises: any;
  abrirAnalisar = false;
  btnsAnalise = {
    descricao: '',
    tipo_solicitacao: ''
  };
  analiseDetalhe = {
    aceite: null,
    cod_gesac: null,
    tipo_solicitacao: null,
    cod_analise: null,
    num_oficio: null,
    num_doc_sei: null,
    data_oficio: undefined,
    data_instalacao: undefined,
    cnpj_empresa: null,
    teste_vazao: null,
    tipp: null,
    estabelecimento: null,
    endereco: null,
    tecnico_resp: null,
    fotos: null,
    internet: null,
    nome_resp: null,
    assinatura_resp: null,
    telefone1: null,
    telefone2: null,
    email: null,
    // latitude: null,
    // longitude: null,
    obs: null,
    justificativa: null
  };

  /*
*   Variaveis da lista de ponto de presença
*/
  pontospresencas: any;

  /*
*   Variaveis da lista de Endereço
*/
  enderecos: any;

  options = [
    { name: 'Todos', acao: '' },
    { name: 'Análise', acao: 'análise' },
    { name: 'Interação', acao: 'interação' },
    { name: 'Solicitação', acao: 'solicitação' }
  ];

  hitorico: any;

  constructor(
    private apiServicesMsg: ApiServicesMsg,
    private modalService: SuiModalService,
    private pontoPresencaService: PontoPresencaService,
    private contatoService: ContatoService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private apiServicesData: ApiServicesData
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.params = params.id;
    });
    this.getPontoPrensenca();
    this.getContatosInteracao();
    setTimeout(() => {
      this.analiseCollapse();
      this.getContatosPonto();
      this.getPontoPrensencaEndereco();
      this.tipologiaIdPontoPr();
    }, 500);
    this.getAnaliseByID();
    this.getEmpresas();
    this.getPontoHistorico();
  }

  getPontoPrensenca() {
    this.route.params.subscribe(res => (this.params = res));
    this.pontoPresencaService
    .getDetalhePontoPresenca(this.params.id)
    .subscribe(dados => {
      this.codGesac = dados[0].cod_gesac;
      // this.params.id = dados[0].cod_pid;
      this.pontospresencas = dados[0];
      });
  }

  getPontoPrensencaEndereco() {
    this.pontoPresencaService
      .getEnderecoDetalhe(this.codGesac)
      .subscribe(dados => {
        this.enderecos = dados;
      });
  }

  /*
  * Métodos para trazer a tiplogia pelo id do ponto de presença do pid
  */
  tipologiaIdPontoPr() {
    this.pontoPresencaService
      .getTipologiaPP(this.params.id)
      .subscribe(dados => {
        this.tipologias = dados;
      });
  }
  /*
  * Métodos para trazer a contato pelo id do ponto de presença do pid
  */
  getContatosPonto() {
    this.pontoPresencaService
      .getContatosPonto(this.params.id)
      .subscribe(dados => {
        this.contatos = dados;
      });
  }

  /*
  * Métodos para trazer a descrição da interação
  */
  getHistoricoInteracao(codInterecao, cod_gesac) {
    codInterecao = this.correcaoDataInt(codInterecao);
    this.pontoPresencaService
      .getHistoricoInteracao(codInterecao, cod_gesac)
      .subscribe(res => {
        this.interacao = res[0];
        this.abrirNodal = true;
      });
  }

  /*
 * Métodos para trazer a descrição da Solicitação
 */
  getHistoricoSolicitacao(data, cod_gesac, tipo_solicitacao) {
    data = this.correcaoDataInt(data);
    this.pontoPresencaService
      .getHistoricoSolicitacao(data, cod_gesac, tipo_solicitacao)
      .subscribe(res => {
        this.solicitacao = res[0];
        this.abrirNodal = true;
      });
  }

  /*
* Métodos para atualizar a analise
*/

  putAnalise(analise, codAnalise) {
    this.pontoPresencaService.putAnalise(analise.value, codAnalise).subscribe(
      res => {
        analise.reset();
        this.getAnaliseByID();
        this.abrirAnalisar = false;
        this.justificativa = false;
        this.FecharCollapseAnalise = false;
        this.apiServicesMsg.setMsg(
          'success',
          'Análise atualizada com sucesso',
          5000
        );
      },
      erro => Swal('Erro', `${erro.error}`, 'error')
    );
  }

  /*
* Métodos para inserir uma nova analise
*/
  postAnalise(analise) {
    this.pontoPresencaService.postAnalise(analise).subscribe(
      res => {
        this.getPontoHistorico(),
          this.apiServicesMsg.setMsg(
            'success',
            'Análise atualizada com sucesso',
            5000
          );
      },
      erro => Swal('Erro', `${erro.error}`, 'error')
    );
  }

  /*
* Métodos para trazer o historico da analie
*/

  getHistoricoAnalise(analise) {
    this.pontoPresencaService
      .getHistoricoAnalise(analise.cod_analise)
      .subscribe(res => {
        this.historicoAnalises = res[0];
        this.abrirNodal = true;
      });
  }

  /*
 * Métodos para corrigir a data a ser enviada para o banco
 */
  correcaoDataInt(data) {
    data = new Date(data);
    const hora = data.toString().slice(15, 24);
    data = this.apiServicesData.formatData(data);
    data += hora;
    return data;
  }

  /*
   * Métodos para listar as pessoas da interação
   */
  getContatosInteracao() {
    this.contatoService
      .getContatosPonto(this.params.id)
      .subscribe(res => (this.pessoasInterecao = res));
  }

  /*
 * Métodos para listar todo o historico de interacao, analise e solicitação
 */
  getPontoHistorico() {
    this.pontoPresencaService
      .getPontoHistorico(this.params.id)
      .subscribe(res => {
        this.pontoHistorico = res;
        // delete  this.pontoHistorico[0].data;
        // delete  this.pontoHistorico[0].cod_analise;
        // delete  this.pontoHistorico[0].tipo_solicitacao;
        // this.pontoHistorico[0].name = this.pontoHistorico[0].acao;

        // this.options[0] = this.pontoHistorico[0];
        // let x = 0;

        //   for (let i = 0; i < this.pontoHistorico.length; i++) {
        //     if (this.options[x].acao !== this.pontoHistorico[i].acao) {
        //       this.options[x + 1] = this.pontoHistorico[i];
        //       this.options[x + 1].name = this.pontoHistorico[i].acao;


        //       delete this.options[x + 1].data;
        //       delete this.options[x + 1].cod_analise;
        //       delete this.options[x + 1].tipo_solicitacao;
        //       x ++;
        //     }
        //   }

      });
  }

  /*
 * Métodos para listar todo o historico de interacao, analise e solicitação
 */
  getEmpresas() {
    this.pontoPresencaService.getEmpresas().subscribe(dados => {
      this.empresas = dados;
    });
  }

  /*
 * Métodos para fechar o modal
 */
  closeModal() {
    this.abrirNodal = false;
    this.selcPP = false;
  }


  /*
 * Métodos para abrir ou fechar collapse da Analise
 */
  analiseCollapse() {
    // tslint:disable-next-line:max-line-length
    if (this.pontospresencas.cod_status === 5 || this.pontospresencas.cod_status === 6 || this.pontospresencas.cod_status === 7 || this.pontospresencas.cod_status === 8 ) {
      this.abrirAnalisar = true;
      this.FecharCollapseAnalise = true;
    } else {
      this.FecharCollapseAnalise = false;
    }
  }

   /*
  * Métodos abrir o modal de add/edit ponto de presença
  */
 modalAddEditPPOpen() {
  this.selcPP = true;
}

  /*
 * Métodos para abrir o modal e selecionar o template de interação ou analise ou solicitação
 */
  openModal(acao, detalhe) {
    this.condicao = acao;
    if (detalhe.acao === 'interação') {
      this.getHistoricoInteracao(detalhe.data, this.params.id);
    } else if (detalhe.acao === 'analise') {
      this.getHistoricoAnalise(detalhe);
    } else {
      this.getHistoricoSolicitacao(
        detalhe.data,
        this.params.id,
        detalhe.tipo_solicitacao
      );
    }
  }


  // Função para cadastrar a interação
  submitInteracao(formInteracao: NgForm) {
    formInteracao.value.cod_gesac = this.params.id;
    this.pontoPresencaService.postInteracao(formInteracao.value).subscribe(
      res => {
        this.getPontoHistorico(),
          this.apiServicesMsg.setMsg(
            'success',
            'Interação realizada com sucesso!',
            3000
          );
      },
      erro => Swal('Erro', `${erro.error}`, 'error')
    );
    formInteracao.reset();
    // })
  }

  // Função para pegar a analise
  getAnaliseByID() {
    this.pontoPresencaService.getAnaliseID(this.params.id).subscribe(res => {
      if (res[0]) {
        //  this.abrirAnalisar = true;
        this.analiseDetalhe = res[0];
        this.condicaoAnalise = true;

        if (res[0].data_oficio) {
          this.analiseDetalhe.data_oficio = new Date(res[0].data_oficio);
        } else {
          this.analiseDetalhe.data_oficio = undefined;
        }

        if (res[0].data_instalacao) {
          this.analiseDetalhe.data_instalacao = new Date(
            res[0].data_instalacao
          );
        } else {
          this.analiseDetalhe.data_instalacao = undefined;
        }

        if (!!res[0].descricao && !!res[0].solicitacao) {
          this.btnsAnalise.descricao = res[0].descricao.split(';');
          this.btnsAnalise.tipo_solicitacao = res[0].solicitacao.split(';');
        }
      }
    });
  }

  salvarAnalise(analise) {
    console.log(analise._directives[21]);


    // analise.value.data_oficio = this.apiServicesData.formatData(
    //   analise.value.data_oficio
    // );
    // analise.value.data_instalacao = this.apiServicesData.formatData(
    //   analise.value.data_instalacao
    // );

    // analise.value.cod_gesac = this.params.id;
    // analise.value.cnpj_empresa = this.analiseDetalhe.cnpj_empresa;


    // if (this.condicaoAnalise) {

    //   if (this.justificativa) {
    //     analise.value.tipo_solicitacao = this.btnsAnalise.tipo_solicitacao[1];
    //     analise.value.justificativa = this.analiseDetalhe.justificativa;
    //     analise.value.aceite = false;

    //       if (!!analise.value.justificativa) {

    //         this.putAnalise(analise, this.analiseDetalhe.cod_analise);
    //        if ( this.errorJustificativa = true) {
    //         this.errorJustificativa = false;
    //        }
    //       } else {
    //         this.errorJustificativa = true;
    //       }
    //   } else {
    //     analise.value.tipo_solicitacao = this.btnsAnalise.tipo_solicitacao[0];
    //     analise.value.justificativa = null;
    //     analise.value.aceite = true;
    //     this.putAnalise(analise, this.analiseDetalhe.cod_analise);
    //   }
    // }

  }


  onClick(value, submit) {
    this.obrigatorio = !this.obrigatorio;
  }

}
