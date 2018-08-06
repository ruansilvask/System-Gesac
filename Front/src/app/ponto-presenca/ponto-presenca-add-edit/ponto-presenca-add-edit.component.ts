import { ConfirmModal } from './../../modal/modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SuiModalService } from 'ng2-semantic-ui/dist/public';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AppService } from '../../app.service';
import { ContatoService } from '../../contato/contato.service';
import { PontoPresenca } from '../ponto-presenca.model';
import { PontoPresencaService } from '../ponto-presenca.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ponto-presenca-add-edit',
  templateUrl: './ponto-presenca-add-edit.component.html',
  styleUrls: ['./ponto-presenca-add-edit.component.scss']
})
export class PontoPresencaAddEditComponent implements OnInit {

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
  codGesac: any;
  codEndereco: any;
  ufs: any;
  municipios: any;
  lotes: any;
  velocidades: any;
  instituicoesResp: any;
  instituicoesRespPag: any[] = [];
  params: any;
  mostrarBotao: boolean;
  AlterEnd = false;
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

  /*
  * Variáveis do Modal
  */
  condicao: string;

  /*
*   Variaveis do formulario de tipologia
*/
  tipologiaPontoPresenca = {
    cod_tipologia: '',
  };

  contratos: any;
  public eCheckReadonly: boolean;
  public eCheckDisabled: boolean;
  public firstActive: boolean;
  public secondActive: boolean;
  public thirdActive: boolean;
  public fourthActive: boolean;
  public desabilitarCampos = false;

  @Input() busca: string;
  @Output() buscaChange: EventEmitter<string> = new EventEmitter<string>();

  contatos: Observable<PontoPresenca[]>;
  private termosDaBusca: Subject<string> = new Subject<string>();


  constructor(
    private appService: AppService,
    private pontoPresencaService: PontoPresencaService,
    private http: HttpClient,
    private router: Router,
    private modalService: SuiModalService,
    private contatoService: ContatoService,
    private route: ActivatedRoute
  ) {
    this.firstActive = true;
    // this.thirdActive = true;
  }


  /*
  * Método para trazer os municípios de acordo com a uf selecionada
  */
  selectEstado(uf) {
    this.municipios = this.appService.getMunicipios(uf);
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
  selectContrato(pontoPresenca) {
    this.pontoPresencaService.getLotes(pontoPresenca).subscribe(lotes => {
      this.lotes = lotes;
    }
    );
  }

  /*
 * Método para trazer os velocidade de acordo com o lote selecionada
 */
  selectlote(pontoPresenca) {
    this.pontoPresencaService.getVelocidade(pontoPresenca).subscribe(velocidades => {
      this.velocidades = velocidades;
    }
    );
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
    *Método para trazer o endereco de ponto de presenca do bd
    */
  getPontoPrensencaEndereco() {
    this.pontoPresencaService.getEnderecoPorIdVisu(this.codGesac).subscribe(dados => {
      this.enderecoPontPre = dados[0];
    });
  }

  /*
  *Método para trazer os enderecos de ponto de presenca do bd
  */
  getPontoPrensencaEnderecosId(codGesac) {
    this.pontoPresencaService.getEnderecoPorIdVisu(codGesac).subscribe(dados => {
      this.enderecos = dados;
      // (dados.length !== 0) ? this.mostrarBotao = true : this.mostrarBotao = false;
    });
  }

  /*
  * Métodos para salvar/editar o Ponto de Presenca no banco, caso seja passado um id na rota ocorrerá um put, caso contrario será um post
  */
  salvarPontoPresenca(form) {
    delete this.pontoPresenca.uf;
    if (this.params.id) {
      form.value.cod_gesac = this.codGesac;
      this.pontoPresencaService.putPontoPresenca(this.pontoPresenca.cod_pid, form.value)
      .subscribe(dados => {
          this.resp = dados;
          this.contatoService.getContatos(this.params.id, 'ponto');
          this.secondActive = true;
          this.mostrarBtn();
        });
    } else {
      this.pontoPresencaService.postPontoPresenca(this.pontoPresenca).subscribe(dados => {
        this.codGesac = dados;
        this.contatoService.getContatos(this.codGesac, 'ponto');
        this.secondActive = true;
        this.mostrarBtn();
      });
    }
  }

  mostrarBtn() {
    (this.enderecos.length !== 0) ? this.mostrarBotao = true : this.mostrarBotao = false;
  }

  /*
  * Método para retornar para a aba de adicionar/editar Ponto de Presenca
  */
  voltarPontoPresenca() {
    this.firstActive = true;
    if (this.params.id) {
      this.router.navigate(['pontPre', this.params.id]);
      this.AlterEnd = false;
    } else if (this.codGesac) {
      this.router.navigate(['pontPre', this.codGesac]);
      this.AlterEnd = false;
      this.ngOnInit();
    } else {
      this.router.navigate(['pontPre/novo']);
    }
  }

  irTipologia() {
    if (this.enderecos.length > 0) {
      this.AlterEnd = false;
      this.thirdActive = true;
    } else {
      this.modalService
        .open(
          new ConfirmModal(
            'Erro',
            'Adicione um endereço para prosseguir.',
            'mini'
          )
        );
    }
  }

  cancelAddEndereco() {
    this.mostrarBotao = true;
    this.AlterEnd = false;
  }

  adicionarnewEnd() {
    this.mostrarBotao = false;
    this.AlterEnd = false;
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
  /*
* Métodos para salvar/editar o Endereco no banco, caso seja passado um id na rota ocorrerá um put, caso contrario será um post
*/
  salvarEndereco(form) {
    // mostrar botão "adicionar endereco" (quando clicado limpar os campos do endereco e setar variavel da clausula if)
    if (!this.AlterEnd) {
      (this.enderecos.length !== 0) ? form.value.cod_endereco = this.enderecos[0].cod_endereco + 1 : form.value.cod_endereco = 1;
      form.value.cod_pid = this.pontoPresenca.cod_pid;
      form.value.latitude = null;
      form.value.longitude = null;
      form.value.data_inicio = this.appService.formatData(new Date());
        this.pontoPresencaService.postEndereco(form.value).subscribe(dados => {
            this.getPontoPrensencaEnderecosId(this.codGesac);
            this.cancelAddEndereco();
        });

      } else {
        this.pontoPresencaService.putEndereco(this.codGesac, this.enderecos[0].cod_endereco, form.value)
          .subscribe(resp => {
              this.getPontoPrensencaEnderecosId(this.codGesac);
              this.cancelAddEndereco();
          });

      }

    }

  /*
  * Método para retornar para a aba de adicionar/editar endereco
  */
  voltarEndereco() {
    if (this.codGesac) {
      this.router.navigate(['pontPre', this.codGesac]);
      this.mostrarBotao = true;
    } else if (this.params.id) {
      this.router.navigate(['pontPre', this.params.id]);
      this.mostrarBotao = true;
    } else {
      this.router.navigate(['pontPre/novo']);
    }
  }


  editEndAtul() {
    this.AlterEnd = true;
    this.mostrarBotao = false;
    this.getPontoPrensencaEndereco();
  }

  /*
  * Métodos para salvara tipologia no banco
  */
  salvarTiplogia(form) {

    if (this.params.id) {
      this.tipologia = {
        cod_tipologia: this.tipologiaPontoPresenca.cod_tipologia,
        cod_pid: this.pontoPresenca.cod_pid
      };
      this.pontoPresencaService.postTipologia(this.tipologia).subscribe(resp => {
        this.resp = resp;
        this.tipologiaIdPontoPr();
      });
    } else {
      this.tipologia = {
        cod_tipologia: this.tipologiaPontoPresenca.cod_tipologia,
        cod_gesac: this.codGesac
      };
      this.pontoPresencaService.postTipologia(this.tipologia).subscribe(resp => {
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
      this.pontoPresencaService.getTipologiaPP(this.codGesac).subscribe(dados => {
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
      html: `Tem certeza que deseja remover a tiplogia <i>${tipologia.nome}</i>?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Não, mater',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        if (this.codGesac) {
          this.pontoPresencaService.removeTipologiaId(this.codGesac, tipologia.cod_tipologia)
          .subscribe(
            res => {
            this.removido = res;
            this.tipologiaIdPontoPr();
            this.appService.setMsg('success', 'Tipologia removida com sucesso.', 3000);
          },
          erro => Swal('Erro', `${erro.error}`, 'error')
        );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.appService.setMsg('error', 'Ação cancelada.', 3000);
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
    this.route.params.subscribe(res => this.params = res);
    setTimeout(() => {
      this.ufs = this.appService.getEstados();
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
        this.pontoPresencaService.getPontoPresencaPorId(this.params.id)
        .subscribe(dados => {
          this.municipios = this.appService.getMunicipios(dados[0].uf);
          this.selectContrato(dados[0].num_contrato);
          this.selectlote(dados[0].cod_lote);
          setTimeout(() => {
            this.pontoPresenca = dados[0];
            this.codGesac = dados[0].cod_gesac;
            this.tipologiaIdPontoPr();
              this.getPontoPrensencaEnderecosId(this.codGesac);
            }, 200);
          });
      }
    }, 200);

  }
}

