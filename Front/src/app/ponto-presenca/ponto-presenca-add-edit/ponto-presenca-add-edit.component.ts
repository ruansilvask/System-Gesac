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
  styleUrls: ['./ponto-presenca-add-edit.component.scss']
})
export class PontoPresencaAddEditComponent implements OnInit {
  fecharmodal = true;
  parametroIdentificador: any;
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
  mostrarBotao: boolean;

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

  enderecosAntigos: any;

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
    private apiServiceEstadoMunicipio: ApiServiceEstadoMunicipio,
    private pontoPresencaService: PontoPresencaService,
    private http: HttpClient,
    private router: Router,
    private modalService: SuiModalService,
    private contatoService: ContatoService,
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
    if (this.parametroIdentificador) {
      this.pontoPresencaService

      .getEnderecoDetalhe(this.parametroIdentificador)
      .subscribe(dados => {
        this.enderecosAntigos = dados;
        if (this.enderecosAntigos.length === 0) {
          this.mostrarBotao = true;
        } else {
          this.mostrarBotao = false;
        }
      });
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
            this.mostrarBotao = false;
          });
      } else {
        this.pontoPresencaService
          .postPontoPresenca(this.pontoPresenca)
          .subscribe(dados => {
            this.codGesac = dados;
            this.getPontoPrensencaId(dados);
            this.contatoService.getContatos(this.codGesac, 'ponto');
            this.secondActive = true;
            this.mostrarBotao = false;
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
    this.mostrarBotao = !this.mostrarBotao;
  }

  adicionarnewEnd() {
    this.mostrarBotao =  !this.mostrarBotao;
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
            latitude: null,
            longitude: null
          };
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
  /*
* Métodos para salvar/editar o Endereco no banco, caso seja passado um id na rota ocorrerá um put, caso contrario será um post
*/
  salvarEndereco(form) {
    // mostrar botão 'adicionar endereco' (quando clicado limpar os campos do endereco e setar variavel da clausula if)
    if (form.status !== 'INVALID') {
      this.enderecosAntigos.length !== 0
        ? (form.value.cod_endereco = this.enderecoPontPre.cod_endereco + 1)
        : (form.value.cod_endereco = 1);

      form.value.cod_gesac = this.codGesac;
      form.value.latitude = null;
      form.value.longitude = null;
      form.value.data_inicio = this.apiServicesData.formatData(new Date());
      this.pontoPresencaService.postEndereco(form.value).subscribe(dados => {
        this.cancelAddEndereco();
        this.getEnderecosAntigos();
        this.mostrarBotao = !this.mostrarBotao;
        this.apiServicesMsg.setMsg(
          'success',
          'Endereço cadastrado com sucesso.',
          3000
        );
      });
    } else {
      this.apiServicesMsg.setMsg(
        'error',
        'Um ou mais campos estão inválidos',
        5000
      );
    }
  }

  /*
* Método para retornar para a aba de adicionar/editar endereco
*/
  voltarEndereco() {
     if (this.params.id) {
      this.router.navigate(['pontPre', this.params.id]);
      this.mostrarBotao = true;
    } else if (this.params.detalheappeditPP) {
      this.mostrarBotao = true;
    } else  if (this.codGesac) {
      this.router.navigate(['pontPre', this.codGesac]);
      this.mostrarBotao = true;
    }  else {
      this.router.navigate(['pontPre/novo']);
    }
  }

  editEndAtul() {
    this.mostrarBotao = false;
  }

  /*
* Métodos para salvara tipologia no banco
*/
  salvarTiplogia(form) {
    if (this.parametroIdentificador) {
      this.tipologia = {
        cod_tipologia: this.tipologiaPontoPresenca.cod_tipologia,
        cod_pid: this.pontoPresenca.cod_pid
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
        if (this.codGesac) {
          this.pontoPresencaService
            .removeTipologiaId(this.codGesac, tipologia.cod_tipologia)
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
      this.router.navigate(['/pontPre']);
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
        this.fecharmodal = false;
        this.parametroIdentificador = this.params.detalheappeditPP;
      }

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
        }
    }, 200);
  }
}
