import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { InstRespService } from './../instituicao-responsavel.service';
import { AppService } from '../../app.service';
import { ContatoService } from '../../contato/contato.service';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'app-instresp-add',
  templateUrl: './inst-resp-add-edit.component.html',
  styleUrls: ['./inst-resp-add-edit.component.scss']
})
export class InstRespAddEditComponent implements OnInit {
  gesacVinculado: any;
  modalVinculados: boolean;
  pagadoraError: boolean;
  btnInstResp: boolean;
  segmentDimmed: boolean;

  // variaveis de tabs
  instResp: boolean;
  contatos: boolean;
  respLegal: boolean;
  valorTab: number;

  // variáveis de instituição responsável
  formInstituicaoResp: any;
  params: any;
  instituicaoRespResponse: any;
  ufs: any = '';
  municipios: any = '';
  getMunicipio: any;

  // variáveis de contatos e representante legal
  getCheckAltor: boolean;
  repreLegalContatoSubmit: any;
  repreInativos = [];
  represetanteLegalTodos: any;
  contatoInstResps: any;
  selecao: number;
  repreLegalContato: any;
  templateValue: boolean;

  // formatação inicial do representante legal
  repreLegal: any = {
    cod_representante: null,
    cod_contato: null,
    cod_pessoa: null,
    data_inicial: undefined,
    data_final: undefined,
    status: ''
  };

  constructor(
    // public modalService: SuiModalService,
    private location: Location,
    private serviceInstiResp: InstRespService,
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private contatoService: ContatoService
  ) {}

  ngOnInit() {
    this.instResp = true;
    setTimeout(() => {
      this.ufs = this.appService.getEstados();
    }, 200);
    this.route.params.subscribe(res => (this.params = res));
    this.formInstituicaoResp = {
      cnpj_instituicao: null,
      nome: null,
      sigla: null,
      endereco: null,
      numero: null,
      bairro: null,
      complemento: null,
      cep: null,
      cod_ibge: null,
      dou: null,
      termo_coop: null,
      num_processo: null,
      pagadora: 0,
      uf: ''
    };
    if (this.params.id) {
      this.serviceInstiResp.getInstResp(this.params.id).subscribe(dados => {
        this.formInstituicaoResp = dados[0];

        setTimeout(() => {
          this.selectEstado(this.formInstituicaoResp.uf);
        }, 200);
      });
    }
    this.getCheckAltor = true;
  }

  // insituição responsavel submit do post e put.
  submitInstResp(form) {
    if (form.status !== 'INVALID') {

    if (this.formInstituicaoResp.cod_ibge === '') {
      this.formInstituicaoResp.cod_ibge = null;
    }
    if (this.idRepresentante()) {
      delete this.formInstituicaoResp.nome_municipio;
      delete this.formInstituicaoResp.uf;
      this.serviceInstiResp
        .putInstResp(this.params.id, this.formInstituicaoResp)
        .subscribe(
          res => {
            this.appService.setMsg(
              'success',
              'Instituição Responsável atualizada com sucesso',
              5000
            );
            this.contatos = true;
            this.instituicaoRespResponse = this.params.id;
          },
          erro => Swal('Erro', `${erro.error}`, 'error')
        );

      this.contatoService.getContatos(this.params.id, 'instituicao');
    } else {
      delete this.formInstituicaoResp.uf;
      this.serviceInstiResp
        .postInstResp(this.formInstituicaoResp)
        .subscribe(
          res => {
            this.appService.setMsg(
              'success',
              'Instituição Responsável adicionada com sucesso',
              5000
            );
            this.contatos = true;
            this.instituicaoRespResponse = res;
          },
          erro => Swal('Erro', `${erro.error}`, 'error')
        );
    }
  } else {
    this.appService.setMsg(
                'error',
                'Nome e Campo são obrigatórios',
                5000
              );
  }
  }

  // voltar para aba insituião responsavel e carregar os dados submetidos.
  voltarInstResp() {
      this.router.navigate(['instResp/edit', this.idRepresentante()]);
      this.serviceInstiResp.getInstResp(this.params.id);
      this.instResp = true;
  }

  /////////////////////////////////////////////////////////////////////////////////////
  // REPRESENTANTE LEGAL

  // adiciona e atualiza o representante responsavel
  submitRepLegal(formRepreLegal: NgForm) {

    // IF para verificar se caso não tenha selecionado nenum representante legal, será atualizado a ativo selecionado.
    if (
      this.repreLegalContatoSubmit !== undefined &&
      this.selecao === undefined
    ) {
      this.selecao = 2;
    }

    // Verifica todos os representantes legais, caso tenha um ativo, será setado 2 na seleção para editar
    for (let i = 0; i < this.represetanteLegalTodos.length; i++) {
      if (
        this.represetanteLegalTodos[i].status === 'A' &&
        this.represetanteLegalTodos[i].cod_pessoa === this.repreLegalContato
      ) {
        this.selecao = 2;
      }
    }

    if (this.repreLegalContato === null) {
      this.selecao = null;
    }

    // If para inserir o primeiro representante legal
    if (this.selecao === 1) {
      this.postRepreLegal();
    } else if (this.selecao === 2) {
      // Else para editar e atualizar o representante legal atual e passando os anteriores para inativo
      for (let i = 0; i < this.represetanteLegalTodos.length; i++) {
        if (
          this.repreLegalContatoSubmit.cod_pessoa ===
            this.represetanteLegalTodos[i].cod_pessoa &&
          this.represetanteLegalTodos[i].status === 'A'
        ) {
          if (
            this.repreLegalContatoSubmit.data_final === null ||
            this.repreLegalContatoSubmit.data_final === undefined
          ) {
          } else {
            this.repreLegalContatoSubmit.status = 'I';
          }

          this.putRepreLegal(
            this.repreLegalContatoSubmit,
            this.represetanteLegalTodos[i].cod_representante
          );
          break;
        } else if (
          this.repreLegalContatoSubmit.cod_pessoa ===
            this.represetanteLegalTodos[i].cod_pessoa &&
          this.represetanteLegalTodos[i].status === 'I'
        ) {
          this.paraInativo();

          this.repreLegalContatoSubmit.data_inicial = this.repreLegal.data_inicial;
          this.repreLegalContatoSubmit.data_final = this.repreLegal.data_final;
          if (
            this.repreLegalContatoSubmit.data_final === null ||
            this.repreLegalContatoSubmit.data_final === undefined
          ) {
            this.repreLegalContatoSubmit.status = 'A';
          } else {
            this.repreLegalContatoSubmit.status = 'I';
          }

          this.putRepreLegal(
            this.repreLegalContatoSubmit,
            this.represetanteLegalTodos[i].cod_representante
          );
          break;
        }
      }
    } else if (this.selecao === 3) {
      // if para adicionar um novo representate legal
      this.paraInativo();
      this.repreLegal.cod_contato = this.repreLegalContatoSubmit.cod_contato;
      this.repreLegal.cod_pessoa = this.repreLegalContatoSubmit.cod_pessoa;
      this.repreLegal.status = 'A';
      this.postRepreLegal();
    }

    this.getCheckAltor = true;
    setTimeout(() => {
      this.serviceInstiResp
        .getRepresentanteLegalId(this.idRepresentante())
        .subscribe((res: any) => {
          this.repreInativos = [];
          let j = 0;
          let reset = false;
          for (let i = 0; i < res.length; i++) {
            if (res[i].status === 'I') {
              this.repreInativos[j] = res[i];
              j++;
            }
            if (res[i].status === 'A') {
              this.repLegal();
              reset = false;
            } else {
              reset = true;
            }
          }
          if (reset === true) {
            formRepreLegal.reset();
            this.templateValue = false;
          }
        });
    }, 200);
  }

  repLegal() {
    this.serviceInstiResp
      .getContatoInstResp(this.idRepresentante())
      .subscribe(res => {
        this.contatoInstResps = res;
      });
    this.getRepreLegalFun(this.idRepresentante());
  }

  // Função que passa todos os representantes legais para inativo
  paraInativo() {
    for (let i = 0; i < this.represetanteLegalTodos.length; i++) {
      if (this.represetanteLegalTodos[i].status === 'A') {
        this.represetanteLegalTodos[i].status = 'I';

        if (this.represetanteLegalTodos[i].data_final === null) {
          this.represetanteLegalTodos[
            i
          ].data_final = this.appService.formatData(new Date());
        }

        this.putRepreLegal(
          this.represetanteLegalTodos[i],
          this.represetanteLegalTodos[i].cod_representante
        );
      }
    }
  }

  // funções para requisições HTTP para o service
  putRepreLegal(dados, id) {
    delete dados.cargo;
    delete dados.nome;
    delete dados.cnpj_empresa;
    delete dados.cod_gesac;
    delete dados.cod_instituicao;
    delete dados.cargo;
    delete dados.obs;
    delete dados.statusII;

    dados.data_inicial = this.appService.formatData(dados.data_inicial);
    dados.data_final = this.appService.formatData(dados.data_final);

    this.serviceInstiResp.putRepLegalInstResp(dados, id).subscribe(
      res => {
        this.appService.setMsg(
          'success',
          `Representante legal atualizado com sucesso`,
          5000
        );
      },
      erro => {
        Swal('Erro', `${erro.error}`, 'error');
      }
    );
  }

  postRepreLegal() {
    this.repreLegalContatoSubmit.status = 'A';

    this.repreLegalContatoSubmit.data_inicial = this.appService.formatData(
      this.repreLegal.data_inicial
    );
    this.repreLegalContatoSubmit.data_final = this.appService.formatData(
      this.repreLegal.data_final
    );

    delete this.repreLegalContatoSubmit.nome;
    delete this.repreLegalContatoSubmit.obs;
    delete this.repreLegalContatoSubmit.cargo;
    delete this.repreLegalContatoSubmit.statusII;

    this.serviceInstiResp
      .postRepLegalInstResp(this.repreLegalContatoSubmit)
      .subscribe(res => {
        this.appService.setMsg('success', `Representante legal adicionado com sucesso`, 5000 );
      },
      erro => {
        Swal('Erro', `${erro.error}`, 'error');
      }
    );
  }

  getRepreLegalFun(id) {
    this.serviceInstiResp.getRepresentanteLegalId(id).subscribe((res: any) => {
      this.represetanteLegalTodos = res;
      if (res.length > 0) {
        this.templateValue = true;
      } else {
        this.templateValue = false;
      }
      let j = 0;
      for (let i = 0; i < res.length; i++) {
        if (res[i].data_inicial !== null) {
          res[i].data_inicial = new Date(res[i].data_inicial);
        } else {
          res[i].data_inicial = new Date();
        }

        if (res[i].data_final !== null) {
          res[i].data_final = new Date(res[i].data_final);
        }
        if (res[i].status === 'A') {
          this.repreLegal = res[i];
          this.repreLegalContatoSubmit = res[i];
          this.repreLegalContato = res[i].cod_pessoa;
          this.templateValue = true;
        } else if (res[i].status === 'I') {
          this.repreInativos[j] = res[i];
          j++;
        }

        if (!(res[i].status === 'A') && res[i].status === 'I') {
          this.templateValue = false;
        }
      }
    });
  }

  //  função para selecionar os valores 1, 2 e 3. que são responsáveis por
  //  fazer a seleção entre atualizar e adicionar na função submitRepLegal()
  checkData(id) {
    this.serviceInstiResp
      .getRepresentanteLegalId(this.idRepresentante())
      .subscribe(res => (this.represetanteLegalTodos = res));
    this.getCheckAltor = false;
    let postAtivoChange = false;
    if (this.represetanteLegalTodos.length === 0) {
      for (let i = 0; i < this.contatoInstResps.length; i++) {
        if (this.contatoInstResps[i].cod_pessoa === id) {
          this.repreLegalContatoSubmit = this.contatoInstResps[i];
          this.repreLegalContatoSubmit.data_inicial = this.repreLegal.data_inicial;
          this.repreLegal.data_inicial = new Date();
          this.selecao = 1;
        }
      }
    } else {
      for (let i = 0; i < this.represetanteLegalTodos.length; i++) {
        if (id === this.represetanteLegalTodos[i].cod_pessoa) {
          this.repreLegalContatoSubmit = this.represetanteLegalTodos[i];
          this.repreLegal.data_inicial = this.represetanteLegalTodos[
            i
          ].data_inicial;
          this.repreLegal.data_final = this.represetanteLegalTodos[
            i
          ].data_final;
          this.selecao = 2;
          postAtivoChange = false;
          this.templateValue = true;
          break;
        } else {
          postAtivoChange = true;
        }
      }
    }
    if (postAtivoChange === true) {
      for (let i = 0; i < this.contatoInstResps.length; i++) {
        if (this.contatoInstResps[i].cod_pessoa === id) {
          this.repreLegalContatoSubmit = this.contatoInstResps[i];
          this.selecao = 3;
          this.templateValue = false;
          this.repreLegal.data_inicial = new Date();
          this.repreLegal.data_final = null;
        }
      }
    }
  }

  idRepresentante() {
    if (this.params.id) {
      return this.params.id;
    } else {
      return this.instituicaoRespResponse;
    }
  }

  cnpj(formInstRep: NgForm) {
    setTimeout(() => {
      if (
        formInstRep.value.cnpj_instituicao.length > 0 &&
        formInstRep.value.cnpj_instituicao.length < 14
      ) {
        this.btnInstResp = false;
      } else {
        if (formInstRep.value.cnpj_instituicao.length === 0) {
          this.btnInstResp = true;
        } else {
          if (this.appService.validarCNPJ(formInstRep.value.cnpj_instituicao)) {
            this.btnInstResp = true;
          } else {
            this.btnInstResp = false;
          }
        }
      }
    }, 50);
  }

  checkPagadora(checkPagadora) {
    this.segmentDimmed = true;
    this.serviceInstiResp.getPagadora(this.params.id).subscribe((res: any) => {
      if (res.length > 0) {
        this.gesacVinculado = res;
        this.formInstituicaoResp.pagadora = 1;
        // checkPagadora.control.disable();
        this.pagadoraError = true;
      }
    });
    this.segmentDimmed = false;
  }

  copiarGesac(gesac) {
    // let gesacClipBoard = null
    // for(var i = 0; i < gesac.length; i++) {
    //   if(gesacClipBoard === null) {
    //     gesacClipBoard = gesac[i].cod_gesac + '/n'
    //   } else {
    //     gesacClipBoard = gesacClipBoard + gesac[i].cod_gesac + '/n' ;
    //   }
    // }
    // gesacClipBoard.select()
    // try{
    // return document.execCommand('copy');
    // }
  }

  selectEstado(uf) {
    this.municipios = this.appService.getMunicipios(uf);
  }

  goBack() {
    this.location.back();
  }
}
