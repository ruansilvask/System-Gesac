import { PontoPresencaObsAcaoService } from './../ponto-presenca-obs-acao/ponto-presenca-obs-acao.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AuthenticationService } from '../../services';
import { ContatoService } from '../../contato/contato.service';
import { PontoPresenca } from '../ponto-presenca.model';
import { PontoPresencaService } from '../ponto-presenca.service';
import { ConfirmModal } from '../../modal/modal.component';
import { ApiServicesMsg } from '../../api-services/api-services-msg';
import { ApiServicesData } from '../../api-services/api-services-data';
import { ApiServiceEstadoMunicipio } from '../../api-services/api-services-estado-municipio';
import { Location } from '@angular/common';

import { SuiModalService } from 'ng2-semantic-ui';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ponto-presenca-add-edit',
  templateUrl: './ponto-presenca-add-edit.component.html',
  styleUrls: ['./ponto-presenca-add-edit.component.scss'],
  providers: [PontoPresencaObsAcaoService]
})
export class PontoPresencaAddEditComponent implements OnInit {
  obsAcoesCad: Object;
  obsAcoes: Object;
  fecharmodal = true;
  camposGraus = true;
  parametroIdentificador: any;
  modalObsAcao = false;
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
  *   Variaveis do de manipulacão das informacões de tipologia
  */
 tipologia: any;
 resp: any;
 removido: any;
 tipologiaremovida: any;
 tipologias: any;
 tipologiasGuardadas: any;

 /*
 * Variáveis globais
 */
  admin = false;
  codGesac: any;
  codEndereco: any;
  ufs: any;
  municipiosUf = [];
  municipios = [];
  lotes: any;
  velocidades: any;
  instituicoesResp: any;
  instituicoesRespPag: any[] = [];
  params: any;
  novoEndereco: boolean;
  mostrarBtn = true;

  enderecos: any;

  /*
*   Variaveis do formulario do Ponto de Presenca
*/
  pontoPresenca: PontoPresenca = {
    cod_gesac: '',
    cod_pid: '',
    nome: '',
    inep: '',
    num_contrato: '',
    cod_lote: '',
    cod_velocidade: '',
    uf: '',
    cod_ibge: '',
    cod_instituicao_resp: '',
    cod_instituicao_pag: ''
  };

/*
*   Variaveis de observação
*/
  ObeservacaoPontoPresenca = {
    descricao: '',
    cod_obs: ''
  };

  /*
*   Variaveis do formulario do Endereco
*/
  enderecoPontPre = {
    cod_endereco: null,
    endereco: '',
    numero: '',
    bairro: '',
    complemento: '',
    cep: '',
    area: '',
    latitude: null,
    longitude: null
  };

  enderecosAntigos: any = [];

  /*
  * Variáveis do Modal
  */
  condicao: string;

  /*
*   Variaveis do formulario de tipologia
*/
  tipologiaPontoPresenca = {
    cod_tipologia: ''
  };

  contratos: any;
  public eCheckReadonly: boolean;
  public eCheckDisabled: boolean;
  public firstActive: boolean;
  public secondActive: boolean;
  public thirdActive: boolean;
  public fourthActive: boolean;
  public desabilitarCampos = false;

  @Input()
  busca: string;
  @Output()
  buscaChange: EventEmitter<string> = new EventEmitter<string>();

  contatos: Observable<PontoPresenca[]>;
  private termosDaBusca: Subject<string> = new Subject<string>();

  constructor(
    private apiServicesMsg: ApiServicesMsg,
    private pontoPresencaService: PontoPresencaService,
    private modalService: SuiModalService,
    private contatoService: ContatoService,
    private pontoPresencaObsService: PontoPresencaObsAcaoService,
    private apiServiceEstadoMunicipio: ApiServiceEstadoMunicipio,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private apiServicesData: ApiServicesData,
    private location: Location
  ) {
    this.firstActive = true;
    // this.thirdActive = true;
  }

  /*
  * Método para trazer os municípios de acordo com a uf selecionada
  */
  selectEstado(uf) {
    if (uf) {
      this.municipios = this.apiServiceEstadoMunicipio.getMunicipios(uf);
    }
    this.pontoPresenca.cod_ibge = '';
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
      lat = ( latGrau + ( (latMin / 60) + (latSeg / 3600) )).toFixed(6);
      if ( this.latLong.grau.latitude.latTipo === 'S' ) {
        this.latLong.decimal.latitude = `-${lat.toString()}`;
      } else {
        this.latLong.decimal.latitude = `+${lat.toString()}`;
      }
    } else {
      this.latLong.decimal.latitude = '';
    }

    // Longitude
    if (!((longGrau === 0) && (longMin === 0) && (longSeg === 0))) {
      long = (longGrau + ( ( longMin / 60) + ( longSeg / 3600) )).toFixed(6);
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

  /*
 * Método para o contrato do banco
 */
  contatosPontoPre() {
    this.pontoPresencaService.getContratos().subscribe(contratos => {
      this.contratos = contratos;
    });
  }

  /*
 * Método para trazer os lotes de acordo com o contrtato selecionada
 */
  selectContrato(num_contrato) {
    if (num_contrato) {
      this.pontoPresencaService.getLotes(num_contrato).subscribe(lotes => {
        this.lotes = lotes;
      });
    }
    this.pontoPresenca.cod_lote = '';
    this.pontoPresenca.cod_velocidade = '';
  }

  /*

  * Método para trazer os velocidade de acordo com o lote selecionada
  */
  selectlote(num_lote) {
    if (num_lote) {
      this.pontoPresencaService
        .getVelocidade(num_lote)
        .subscribe(velocidades => {
          this.velocidades = velocidades;
        });
    }
    this.pontoPresenca.cod_velocidade = '';
  }

  /*
   * Método para trazer a Instituicão Responsavel do banco, filtra a parte da Instituicão Responsavel para trazer a Instituicão Pagadora
   */
  instituicaoResponsavel() {
    this.pontoPresencaService.getInstResps().subscribe(instituicoesResp => {
      this.instituicoesResp = instituicoesResp;
      for (let i = 0, j = 0; i < this.instituicoesResp.length; i++) {
        if (this.instituicoesResp[i].pagadora === 1) {
          this.instituicoesRespPag[j] = this.instituicoesResp[i];
          j++;
        }
      }
    });
  }

  /*
  * Métodos para popular o drop down em ponto de presenca
  */
  tipologiaPontoPr() {
    this.pontoPresencaService.getTipologia().subscribe(tipologias => {
      this.tipologias = tipologias;
    });
  }


  /*
    *Método para trazer o Ponto de Presença pelo id do bd
    */
  getPontoPrensencaId(dados) {
    if (dados) {
      this.pontoPresencaService

        .getPontoPresencaPorId(dados)
        // tslint:disable-next-line:no-shadowed-variable
        .subscribe(dados => {
          this.pontoPresenca = dados[0];
        });
    }
  }
  /*
    *Método para trazer os endereços antigos
    */
  getEnderecosAntigos() {
    if (this.params.id || this.codGesac) {
      this.pontoPresencaService

      .getEnderecoDetalhe(this.params.id || this.codGesac)
      .subscribe(dados => {
        this.enderecosAntigos = dados;
        if (this.enderecosAntigos.length === 0) {
          this.novoEndereco = true;
        } else {
          this.novoEndereco = false;
        }
      });
    } else {
      this.novoEndereco = true;
    }
  }

  /*
* Métodos para salvar/editar o Ponto de Presenca no banco, caso seja passado um id na rota ocorrerá um put, caso contrario será um post
*/
  salvarPontoPresenca(form) {
    if (form.status !== 'INVALID') {
      if (this.parametroIdentificador) {
        form.value.cod_gesac = this.codGesac;
        this.pontoPresencaService
          .putPontoPresenca(this.pontoPresenca.cod_pid, form.value)
          .subscribe(dados => {
            this.resp = dados;
            this.contatoService.getContatos(this.parametroIdentificador, 'ponto');
            this.secondActive = true;
            this.getEnderecosAntigos();
            // this.getObsAcao();
            // this.getObsAcaoporId(this.params.id ||  this.codGesac);
          });
      } else {
        this.pontoPresencaService
          .postPontoPresenca(this.pontoPresenca)
          .subscribe(dados => {
            this.codGesac = dados;
            this.pontoPresencaObsService.addEmitirGesac(this.codGesac || this.parametroIdentificador);
            this.getPontoPrensencaId(dados);
            this.contatoService.getContatos(this.codGesac, 'ponto');
            this.secondActive = true;
            this.novoEndereco = true;
          });
      }
    } else {
      this.apiServicesMsg.setMsg(
        'error',
        'Um ou mais campos estão inválidos',
        5000
      );
    }
  }



  removerEnderecos(enderecoAntigo, index) {
    this.pontoPresencaService.deleteEnderecoPonto(enderecoAntigo.cod_endereco, this.parametroIdentificador)
      .subscribe(
        res => {
          this.enderecosAntigos.splice(index, 1);
          this.apiServicesMsg.setMsg(
            'success',
            'Endereco removido com sucesso.',
            3000
          );
        },
        erro => Swal('Erro', `${erro.error}`, 'error')
      );
  }

  /*
* Método para retornar para a aba de adicionar/editar Ponto de Presenca
*/
  voltarPontoPresenca() {
    if (this.params.id) {
      this.router.navigate(['pontPre', this.params.id]);
      this.firstActive = true;
    } else if (this.params.detalheappeditPP) {
      this.firstActive = true;
    } else if (this.codGesac) {
      this.router.navigate(['pontPre', this.codGesac]);
      this.ngOnInit();
      this.firstActive = true;
    } else {
      this.router.navigate(['pontPre/novo']);
      this.firstActive = true;
    }
  }

  irTipologia() {
    if (this.enderecosAntigos.length !== 0) {
      this.thirdActive = true;
    } else {
      this.modalService.open(
        new ConfirmModal(
          'Erro',
          'Adicione um endereço para prosseguir.',
          'mini'
        )
      );
    }
  }

  cancelAddEndereco() {
    this.novoEndereco = !this.novoEndereco;
  }

  adicionarnewEnd() {
    this.novoEndereco =  !this.novoEndereco;
    if (this.enderecosAntigos.lenght !== 0) {
      for (let i = 0; i < this.enderecosAntigos.length; i++) {
        if (!this.enderecosAntigos[i].data_final) {
          this.enderecoPontPre = {
            cod_endereco: this.enderecosAntigos[i].cod_endereco,
            endereco: this.enderecosAntigos[i].endereco,
            numero: this.enderecosAntigos[i].numero,
            bairro: this.enderecosAntigos[i].bairro,
            complemento: this.enderecosAntigos[i].complemento,
            cep: this.enderecosAntigos[i].cep,
            area: this.enderecosAntigos[i].area,
            latitude: this.enderecosAntigos[i].latitude,
            longitude: this.enderecosAntigos[i].longitude
          };
          this.latLongRadio = 'grau';
          this.camposGraus = true;
          this.latLong.decimal.latitude = this.enderecosAntigos[i].latitude;
          this.latLong.decimal.longitude = this.enderecosAntigos[i].longitude;
          this.decimalToGrau(this.enderecosAntigos[i].latitude, this.enderecosAntigos[i].longitude);
        }
      }
    } else {
      this.enderecoPontPre = {
        cod_endereco: '',
        endereco: '',
        numero: '',
        bairro: '',
        complemento: '',
        cep: '',
        area: '',
        latitude: null,
        longitude: null
      };
    }
  }

  longIsValid (long) {
    if (long) {
      long = Number(long);
      return ((long > -75) && (long < -32));
    } else {
      return false;
    }
  }

  latIsValid (lat) {
    if (lat) {
      lat = Number(lat);
      return ((lat < 6) && (lat > -34));
    } else {
      return false;
    }
  }
  /*
* Métodos para salvar/editar o Endereco no banco, caso seja passado um id na rota ocorrerá um put, caso contrario será um post
*/
  salvarEndereco(form) {
    // mostrar botão 'adicionar endereco' (quando clicado limpar os campos do endereco e setar variavel da clausula if)
    if (form.status !== 'INVALID') {
      if (form.value.latLongRadio === 'grau') {
        this.grauToDecimal();
      }
      const validLat = this.latIsValid(this.latLong.decimal.latitude);
      const validLong = this.longIsValid(this.latLong.decimal.longitude);
      if (validLat && validLong) {
        const formEnvio: any = {};
      if (form.value.latLongRadio === 'grau') {
        this.grauToDecimal();
      }
      this.enderecosAntigos.length !== 0
        ? (form.value.cod_endereco = this.enderecoPontPre.cod_endereco + 1)
        : (form.value.cod_endereco = 1);

      formEnvio.cod_endereco = form.value.cod_endereco;
      formEnvio.cod_gesac = this.codGesac;
      formEnvio.endereco = form.value.endereco;
      formEnvio.numero = form.value.numero;
      formEnvio.bairro = form.value.bairro;
      formEnvio.cep = form.value.cep;
      formEnvio.complemento = form.value.complemento;
      formEnvio.area = form.value.area;
      formEnvio.latitude = this.latLong.decimal.latitude || null;
      formEnvio.longitude = this.latLong.decimal.longitude || null;
      formEnvio.data_inicio = this.apiServicesData.formatData(new Date());

      this.pontoPresencaService.postEndereco(formEnvio).subscribe(dados => {
        this.cancelAddEndereco();
        this.getEnderecosAntigos();
        this.novoEndereco = !this.novoEndereco;
        if (this.params.id) {
          this.obsAcaoModal();
          // this.getObsAcao();
        }
        this.apiServicesMsg.setMsg(
          'success',
          'Endereço cadastrado com sucesso.',
          3000
        );
      });
      } else {
        if (!validLat || !validLong) {
          if (!(this.latLong.decimal.latitude) || !(this.latLong.decimal.longitude)) {
            this.apiServicesMsg.setMsg('warning', `Os campos de latitude e longitude devem estar preenchidos.`, 3000);
          } else {
            if (form.value.latLongRadio === 'grau' ) {
              this.apiServicesMsg.setMsg('warning', `A latitude deve estar entre N 6º 00' 00" e S 34º 00' 00"
                                                     e a longitude deve estar entre O 32º 00' 00" e O 75º 00' 00".`, 10000);
            } else {
              this.apiServicesMsg.setMsg('warning', `A latitude deve estar entre +6.000000 e -34.000000
                                                     e a longitude deve estar entre -75.000000 e -32.000000.`, 10000);
            }
          }
        }
      }
    } else {
      this.apiServicesMsg.setMsg(
        'error',
        'Um ou mais campos estão inválidos',
        5000
      );
    }
  }

  /*
 * Métodos para abrir modal de observação ação
 */
obsAcaoModal() {
    this.modalObsAcao = true;
}

obsAcaoContato() {
  if (!this.params.id) {
    this.modalObsAcao = true;
  }
}


  /*
* Método para retornar observações
*/

// getObsAcao() {
//   this.pontoPresencaService.getObsAcao().subscribe(dados => {
//     this.obsAcoes = dados;
//   });
// }


  /*
* Método fehcar modal
*/

closeModal() {
  this.modalObsAcao = false;
}


  /*
* Método para retornar para a aba de adicionar/editar endereco
*/
  voltarEndereco() {
     if (this.params.id) {
      this.router.navigate(['pontPre', this.params.id]);
      this.novoEndereco = true;
    } else if (this.params.detalheappeditPP) {
      this.novoEndereco = true;
    } else  if (this.codGesac) {
      this.router.navigate(['pontPre', this.codGesac]);
      this.novoEndereco = true;
    }  else {
      this.router.navigate(['pontPre/novo']);
    }
  }

  editEndAtul() {
    this.novoEndereco = false;
  }

  /*
* Métodos para salvara tipologia no banco
*/
  salvarTiplogia(form) {
    if (this.parametroIdentificador) {
      this.tipologia = {
        cod_tipologia: this.tipologiaPontoPresenca.cod_tipologia,
        cod_gesac: this.parametroIdentificador
      };
      this.pontoPresencaService
        .postTipologia(this.tipologia)
        .subscribe(resp => {
          this.resp = resp;
          this.tipologiaIdPontoPr();
        });
    } else {
      this.tipologia = {
        cod_tipologia: this.tipologiaPontoPresenca.cod_tipologia,
        cod_gesac: this.codGesac
      };
      this.pontoPresencaService
        .postTipologia(this.tipologia)
        .subscribe(resp => {
          this.resp = resp;
          this.tipologiaIdPontoPr();
        });
    }
  }

  /*
* Métodos para trazer a tiplogia pelo id do ponto de presenca do gesac
*/
  tipologiaIdPontoPr() {
    if (this.codGesac) {
      this.pontoPresencaService
        .getTipologiaPP(this.codGesac)
        .subscribe(dados => {
          this.tipologiasGuardadas = dados;
        });
    }
  }

  /*
* Métodos para remover a tipologia da tela e do banco
*/
  removerTipologia(tipologia) {
    Swal({
      title: 'Você tem certeza?',
      html: `Tem certeza que deseja remover a tiplogia <i>${
        tipologia.nome
        }</i>?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Não, mater',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        if (this.parametroIdentificador) {
          this.pontoPresencaService
            .removeTipologiaId(this.parametroIdentificador, tipologia.cod_tipologia)
            .subscribe(
              res => {
                this.removido = res;
                this.tipologiaIdPontoPr();
                this.apiServicesMsg.setMsg(
                  'success',
                  'Tipologia removida com sucesso.',
                  3000
                );
              },
              erro => Swal('Erro', `${erro.error}`, 'error')
            );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  backPP() {
    // if (this.params.id) {
      this.router.navigate(['/pontPre']);
    // } else if (this.params.detalheappeditPP) {
    //   this.router.navigate(['/pontPre', this.params.detalheappeditPP, 'detalhe']);
    // }
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

  /*
* Métodos que serão executados quando o componente é iniciado
*/
  ngOnInit(): void {
    if ( localStorage.getItem('currentUserCode') === '1' ) {
      this.admin = true;
    }
    this.route.params.subscribe(res => (this.params = res));

    setTimeout(() => {
      this.ufs = this.apiServiceEstadoMunicipio.getEstados();
      /*
 * Trás os estados do banco
 */
      this.contatosPontoPre();
      this.instituicaoResponsavel();
      this.tipologiaPontoPr();

      /*
  * Condicão para que caso exista parâmetro na rota será carregado os dados da empresa cadastrada
  */

      if (this.params.id) {
        this.parametroIdentificador = this.params.id;
      } else if (this.params.detalheappeditPP) {
        this.mostrarBtn = false;
        this.fecharmodal = false;
        this.parametroIdentificador = this.params.detalheappeditPP;
      }


      // this.pontoPresencaObsService.gesacEmiter.subscribe();

      if (this.parametroIdentificador) {
        this.codGesac = this.parametroIdentificador;
        this.pontoPresencaService
          .getPontoPresencaPorId(this.parametroIdentificador)
          .subscribe(dados => {
            this.municipios = this.apiServiceEstadoMunicipio.getMunicipios(
              dados[0].uf
            );
            this.selectContrato(dados[0].num_contrato);
            this.selectlote(dados[0].cod_lote);
            setTimeout(() => {
              this.pontoPresenca = dados[0];
              this.tipologiaIdPontoPr();
            }, 200);
          });
          this.getEnderecosAntigos();
          this.contatoService.getContatos(this.parametroIdentificador, 'ponto');
        }
    }, 200);
  }
}
