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

  admin: boolean;
  bloquearNome: any;
  tipo_interacoes: any;

  removido: Object;
  obsAcoesCad: any;
  obsAcoes: Object;



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
  data_interacao = undefined;
  tipo_int: any;
  pessoasInterecao: any;
  tipo_interacao: any;

  errorJustificativa = false;
  justificativa = false;
  condicaoAnalise = false;
  historicoAnalises: any;
  abrirAnalisar = false;
  btnsAnalise = {
    descricao: '',
    tipo_solicitacao: ''
  };
  analiseDetalhe: any = {
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
    cod_obs: '',
    obs: '',
    latitude: null,
    longitude: null,
    justificativa: null
  };

  enderecoAntigo: any = {};

  camposGraus = true;
  latLongRadio = 'grau';

  latLong = {
    decimal: {
      latitude: '',
      longitude: ''
    },
    grau: {
      latitude: {
        latTipo: 'S',
        latGrau: null,
        latMin: null,
        latSeg: null
      },
      longitude: {
        longTipo: 'O',
        longGrau: null,
        longMin: null,
        longSeg: null
      }
    }
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
    if (localStorage.getItem('currentUserCode') === '1') {
      this.admin = true;
    }
    this.route.params.subscribe(params => {
      this.params = params.id;
    });

    this.getPontoPrensenca();
    this.getObsAcao();
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
    this.getInteração();
  }


  getPontoPrensenca() {
    this.route.params.subscribe(res => (this.params = res));
    this.pontoPresencaService
      .getDetalhePontoPresenca(this.params.id)
      .subscribe(dados => {
        this.codGesac = dados[0].cod_gesac;
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
  * Métodos para trazer a obs de ação do banco
  */
  getObsAcao() {
    this.pontoPresencaService.getObsAcao().subscribe(dados => {
      this.obsAcoes = dados;
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

  putAnalise(analise, codAnalise, aEndereco) {
    this.pontoPresencaService.putAnalise(analise.value, codAnalise).subscribe(
      res => {
        if (aEndereco) {
          if ((Number(this.latLong.decimal.latitude).toFixed(4) !== Number(this.enderecoAntigo.latitude).toFixed(4)) || (Number(this.latLong.decimal.longitude).toFixed(4) !== Number(this.enderecoAntigo.longitude).toFixed(4))) {
            this.enderecoAntigo.latitude = Number(this.latLong.decimal.latitude);
            this.enderecoAntigo.longitude = Number(this.latLong.decimal.longitude);
            this.enderecoAntigo.cod_endereco++;
            this.pontoPresencaService.postEndereco(this.enderecoAntigo)
              .subscribe(res => this.getPontoPrensencaEndereco(),
                erro => Swal('Erro', `${erro.error}`, 'error')
              );
          }
        }
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
      });
  }


  /*
  * Métodos para bloquear o nome da interação
*/

  nomeInteracao(objInt) {
    this.bloquearNome = objInt.tratamento;
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
    if (this.pontospresencas.cod_status === 5 || this.pontospresencas.cod_status === 6 || this.pontospresencas.cod_status === 7 || this.pontospresencas.cod_status === 8) {
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
    } else if (detalhe.acao === 'análise') {
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

    if (formInteracao.value.data_interacao <= new Date) {

      formInteracao.value.tipo_interacao = formInteracao.value.tipo_interacao.tipo_interacao;
      formInteracao.value.data_interacao = this.apiServicesData.formatData(formInteracao.value.data_interacao);
      formInteracao.value.cod_gesac = this.params.id;

      this.pontoPresencaService.postInteracao(formInteracao.value).subscribe(
        res => {
          this.getPontoHistorico(),
            this.apiServicesMsg.setMsg(
              'success',
              'Interação realizada com sucesso!',
              3000
            );
          formInteracao.reset();
        },
        erro => Swal('Erro', `${erro.error}`, 'error')
      );
    } else {
      Swal('Data Inválida', `A data da interação deve ser menor ou igual a data de hoje`, 'error');
    }
  }

  getInteração() {
    this.pontoPresencaService.getTipoInteracao().subscribe(
      res => {
        this.tipo_interacoes = res;
      }
    );

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
        this.latLong.decimal.latitude = this.analiseDetalhe.latitude;
        this.latLong.decimal.longitude = this.analiseDetalhe.longitude;
        this.decimalToGrau(this.analiseDetalhe.latitude, this.analiseDetalhe.longitude);
        this.enderecoAntigo.cod_gesac = res[0].cod_gesac;
        this.enderecoAntigo.cod_endereco = res[0].cod_endereco;
        this.enderecoAntigo.endereco = res[0].enderecoAtual;
        this.enderecoAntigo.numero = res[0].numero;
        this.enderecoAntigo.bairro = res[0].bairro;
        this.enderecoAntigo.cep = res[0].cep;
        this.enderecoAntigo.complemento = res[0].complemento;
        this.enderecoAntigo.area = res[0].area;
        this.enderecoAntigo.latitude = res[0].latitude;
        this.enderecoAntigo.longitude = res[0].longitude;
        this.enderecoAntigo.data_inicio = this.apiServicesData.formatData(new Date());
      }
    });
  }

  grauToDecimal() {
    let lat = null;
    let long = null;

    const latGrau = Number(this.latLong.grau.latitude.latGrau);
    const latMin = Number(this.latLong.grau.latitude.latMin);
    const latSeg = Number(this.latLong.grau.latitude.latSeg);
    const longGrau = Number(this.latLong.grau.longitude.longGrau);
    const longMin = Number(this.latLong.grau.longitude.longMin);
    const longSeg = Number(this.latLong.grau.longitude.longSeg);

    // Latitude
    if (!((latGrau === 0) && (latMin === 0) && (latSeg === 0))) {
      lat = (latGrau + ((latMin / 60) + (latSeg / 3600))).toFixed(6);
      if (this.latLong.grau.latitude.latTipo === 'S') {
        this.latLong.decimal.latitude = `-${lat.toString()}`;
      } else {
        this.latLong.decimal.latitude = `+${lat.toString()}`;
      }
    } else {
      this.latLong.decimal.latitude = '';
    }

    // Longitude
    if (!((longGrau === 0) && (longMin === 0) && (longSeg === 0))) {
      long = (longGrau + ((longMin / 60) + (longSeg / 3600))).toFixed(6);
      this.latLong.decimal.longitude = `-${long.toString()}`;
    } else {
      this.latLong.decimal.longitude = '';
    }
  }

  decimalToGrau(latitude, longitude) {
    let latGrau = null;
    let latMin = null;
    let latSeg = null;
    let latTipo = '';
    let longGrau = null;
    let longMin = null;
    let longSeg = null;
    const longTipo = 'O';
    let latitudeDecimal = Number(latitude);
    const longitudeDecimal = Number(longitude) * -1;

    (latitudeDecimal < 0) ? (latTipo = 'S', latitudeDecimal = latitudeDecimal * -1) : latTipo = 'N';

    if (latitude && !isNaN(latitude)) {
      // Grau Latitude
      latGrau = Math.trunc(latitudeDecimal);
      // Minutos Latitude
      latMin = Math.trunc((latitudeDecimal * 60) % 60);
      // Segundos Latitude
      latSeg = ((latitudeDecimal * 3600) % 60).toFixed(2);

      this.latLong.grau.latitude.latTipo = latTipo;
      this.latLong.grau.latitude.latGrau = latGrau;
      this.latLong.grau.latitude.latMin = latMin;
      this.latLong.grau.latitude.latSeg = latSeg;
    } else {
      this.latLong.grau.latitude.latTipo = '';
      this.latLong.grau.latitude.latGrau = null;
      this.latLong.grau.latitude.latMin = null;
      this.latLong.grau.latitude.latSeg = null;
    }
    if (longitude && !isNaN(longitude)) {
      // Grau Longitude
      longGrau = Math.trunc(longitudeDecimal);
      // Minutos Longitude
      longMin = Math.trunc((longitudeDecimal * 60) % 60);
      // Segundos Longitude
      longSeg = ((longitudeDecimal * 3600) % 60).toFixed(2);

      this.latLong.grau.longitude.longTipo = longTipo;
      this.latLong.grau.longitude.longGrau = longGrau;
      this.latLong.grau.longitude.longMin = longMin;
      this.latLong.grau.longitude.longSeg = longSeg;
    } else {
      this.latLong.grau.longitude.longTipo = '';
      this.latLong.grau.longitude.longGrau = null;
      this.latLong.grau.longitude.longMin = null;
      this.latLong.grau.longitude.longSeg = null;
    }
  }

  longIsValid(long) {
    if (long) {
      long = Number(long);
      return ((long > -75) && (long < -32));
    } else {
      return false;
    }
  }

  latIsValid(lat) {
    if (lat) {
      lat = Number(lat);
      return ((lat < 6) && (lat > -34));
    } else {
      return false;
    }
  }

  radioLatLong(value) {
    if (value === 'decimal') {
      this.camposGraus = false;
      this.grauToDecimal();
    } else {
      this.camposGraus = true;
      this.decimalToGrau(this.latLong.decimal.latitude, this.latLong.decimal.longitude);
    }
  }

  salvarAnalise(analise) {
    if (analise.value.latLongRadio === 'grau') {
      this.grauToDecimal();
    }

    analise.value.data_oficio = this.apiServicesData.formatData(
      analise.value.data_oficio
    );
    analise.value.data_instalacao = this.apiServicesData.formatData(
      analise.value.data_instalacao
    );

    analise.value.cod_gesac = this.params.id;
    analise.value.cnpj_empresa = this.analiseDetalhe.cnpj_empresa;

    if (this.latLongRadio === 'grau') {
      delete analise.value.latGrau;
      delete analise.value.latMin;
      delete analise.value.latSeg;
      delete analise.value.latTipo;
      delete analise.value.longGrau;
      delete analise.value.longMin;
      delete analise.value.longSeg;
      delete analise.value.longTipo;
      delete analise.value.latLongRadio;
    }
    else {
      delete analise.value.latitude;
      delete analise.value.longitude;
      delete analise.value.latLongRadio;
    }

    if (this.condicaoAnalise) {

      if (this.justificativa) {
        console.log(analise.value);

        analise.value.tipo_solicitacao = this.btnsAnalise.tipo_solicitacao[1];
        analise.value.justificativa = this.analiseDetalhe.justificativa;
        analise.value.aceite = false;

        if (!!analise.value.justificativa) {

          this.putAnalise(analise, this.analiseDetalhe.cod_analise, false);
          if (this.errorJustificativa = true) {
            this.errorJustificativa = false;
          }
        } else {
          this.errorJustificativa = true;
        }
      } else {
        console.log(this.enderecoAntigo);


        analise.value.tipo_solicitacao = this.btnsAnalise.tipo_solicitacao[0];
        analise.value.justificativa = null;
        analise.value.aceite = true;
        console.log(analise.value);
        this.putAnalise(analise, this.analiseDetalhe.cod_analise, true);
      }
    }

  }



}
