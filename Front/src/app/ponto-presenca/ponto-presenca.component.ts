import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';

import { PontoPresencaService } from './ponto-presenca.service';
import { AppService } from '../app.service';
import { empty } from 'rxjs/observable/empty';
import { SuiLocalizationService } from '../../../node_modules/ng2-semantic-ui';
import pt from 'ng2-semantic-ui/locales/pt';

@Component({
  selector: 'app-ponto-presenca',
  templateUrl: './ponto-presenca.component.html',
  styleUrls: ['./ponto-presenca.component.scss']
})
export class PontoPresencaComponent implements OnInit, OnDestroy {

  ufsPP: any;
  municipiospp: any;
  tipologias: Object;
  empresas: Object;
  contador: number = null;
  listaGesac = [];
  pontosPresencaFiltrada: any;
  erroEmpresa: boolean;
  solicitacaoSubmit: any;
  /*
  * Variáveis do codigo ponto de presença do gesac
  */
  pontpresenCod_gesac: any[] = [];
  pontoPresencaStatus = [];

  selecionados = [];
  /*
  * Variáveis
   */
  botoesMSA: boolean;
  resp: any;
  multiplasSolicitacoes: any;
  pagina = 1;
  pontoFiltrado: any;
  /*
  * Variáveis do Modal
  */
  selcGesac = false;
  abrirNodal = false;
  condicao: string;
  marcados = false;
  marcadosInput = false;
  numMarcados = 0;
  statusDiferentes = false;
  analiseShow = false;
  pendenciaShow = false;

  SelecionarG = {
    campoN: ''
  };

  filtros = {
    gesac: '',
    uf: '',
    municipio: '',
    status: '',
    ponto: '',
    tipologia: ''
  };

  mSolicitacoes = {
    tipo_solicitacao: '',
    num_doc_sei: null,
    num_oficio: null,
    data_oficio: null,
    cnpj_empresa: ''
  };

  optionsPontoPre: any;


  toggle = false;
  pontosPresenca: any;
  segmentDimmed: boolean;
  test: any;
  ufs: any;
  municipios: any;

  paginacao: any;
  allArrays: any;
  numeroPagina = 50;
  totalItens = 0;
  pontoPresencaPag: any;

  constructor(
    private localizationService: SuiLocalizationService,
    private location: Location,
    private pontoPresencaService: PontoPresencaService,
    private appService: AppService
  ) {
    localizationService.load('pt', pt);
    localizationService.setLanguage('pt'); }

  goBack() {
    this.location.back();
  }

  loadPontoPre() {
    this.segmentDimmed = true;
    this.paginacao = this.pontoPresencaService.getPontoPresenca().subscribe(dados => {
      this.pontosPresenca = dados;
      this.pontpresenCod_gesac = [];
      this.pontoPresencaStatus = [];
      this.numMarcados = 0;
      this.botoesMSA = false;
      this.funcaoPaginacao(this.pontosPresenca);
    });
  }

  getEstados() {
    this.ufsPP = this.appService.getEstados();
  }

  selectEstado(uf) {
    this.municipios = this.appService.getMunicipios(uf);
  }

  getStatusPP() {
    this.pontoPresencaService.getStatusPP().subscribe(dados => {
      this.optionsPontoPre = dados;
      this.optionsPontoPre.unshift({cod_status: '', descricao: '' });
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.ufs = this.appService.getEstados();
    }, 500);
    this.loadPontoPre();
    this.botoesMSA = false;
    this.getStatusPP();
  }

  getEmpresas() {
    this.pontoPresencaService.getEmpresas().subscribe(dados => {
      this.empresas = dados;
    });
  }

  getTipologia() {
    this.pontoPresencaService.getTipologia().subscribe(dados => {
      this.tipologias = dados;
    });
  }

  page(pagina) {
    this.pontoPresencaPag = this.allArrays[pagina - 1];
    this.todosMarcados(this.allArrays);
  }

  todosMarcados(array) {
    let tem = true;
    for (let i = 0; i < this.allArrays.length; i++) {
      for (let u = 0; u < this.allArrays[i].length; u++) {
        if (!this.allArrays[i][u].check || this.allArrays[i][u].check === false) {
          tem = false;
          break;
        }
      }
    }
    (tem === true) ? this.marcados = true : this.marcados = false;
  }

  ngOnDestroy() {
    this.paginacao.unsubscribe();
  }


  funcaoPaginacao(array) {
    this.totalItens = array.length;
    this.allArrays = this.appService.pagination(
      array,
      this.numeroPagina
    );
    let pagina;
    this.page((pagina = 1));
    this.segmentDimmed = false;
  }


  unidades(valueInput, ponto) {
    if (valueInput === true) {
      this.numMarcados++;
      this.botoesMSA = true;
      if (this.numMarcados > 0) {
        this.pontpresenCod_gesac.push(ponto.cod_gesac);
        this.pontoPresencaStatus.push(ponto.cod_status);
      }
      this.todosMarcados(this.allArrays);
    } else {
      this.numMarcados--;
      if (this.numMarcados !== 0) {
        this.pontpresenCod_gesac.splice(this.pontpresenCod_gesac.indexOf(ponto.cod_gesac), 1);
        this.pontoPresencaStatus.splice(this.pontoPresencaStatus.indexOf(ponto.cod_status), 1);
        this.botoesMSA = true;
      } else {
        this.pontpresenCod_gesac.splice(this.pontpresenCod_gesac.indexOf(ponto.cod_gesac), 1);
        this.pontoPresencaStatus.splice(this.pontoPresencaStatus.indexOf(ponto.cod_status), 1);
        this.botoesMSA = false;
      }
      this.todosMarcados(this.allArrays);
    }
  }

  toggleAll(value) {
    if (value === true) {
      for (let i = 0; i < this.allArrays.length; i++) {
        for (let u = 0; u < this.allArrays[i].length; u++) {
          this.allArrays[i][u].check = true;
          this.pontpresenCod_gesac.push(this.allArrays[i][u].cod_gesac);
          this.pontoPresencaStatus.push(this.allArrays[i][u].cod_status);
        }
      }
      this.marcadosInput = true;
      this.botoesMSA = true;
    } else {
      for (let i = 0; i < this.allArrays.length; i++) {
        for (let u = 0; u < this.allArrays[i].length; u++) {
          this.allArrays[i][u].check = false;
        }
      }
      this.numMarcados = 0;
      this.marcadosInput = false;
      this.botoesMSA = false;
      this.pontpresenCod_gesac = [];
      this.pontoPresencaStatus = [];
    }
  }



  /*
 * Métodos feichar o modal
 */
  closeModal() {
    this.abrirNodal = false;
    this.selcGesac = false;
    this.contador = null;
  }

  /*
  * Métodos abrir o modal
  */
  modalGesacOpen() {
    this.selcGesac = true;
    this.getTipologia();
    this.getEstados();
  }

  openModal(multipla) {
    this.statusDiferentes = false;
    this.pontoPresencaStatus.filter(function (el) { return el !== empty; }).join('');
    for (let i = 0; i < this.pontoPresencaStatus.length; i++) {
      if (this.pontoPresencaStatus[i] !== undefined) {
        if (this.pontoPresencaStatus[0] !== this.pontoPresencaStatus[i]) {
          this.appService.setMsg('warning', 'Não é possivel executar esta ação, status diferentes.', 5000);
          this.statusDiferentes = true;
          break;
        }
      }
    }
    if (this.statusDiferentes === false) {
      this.pontoPresencaService.getStatusSolicitacoes(this.pontoPresencaStatus[0]).subscribe(dados => {
        this.multiplasSolicitacoes = dados;
        this.ActiveMsgReturnSolicitation();
      });
      if (multipla === 'msolicitacoes') {
        this.condicao = 'Múltiplas Solicitações';
        this.getEmpresas();
      }
    }
  }


  ActiveMsgReturnSolicitation() {
    if (this.multiplasSolicitacoes.length === 0) {
      this.appService.setMsg('warning', 'Não é possivel executar esta ação, pois não há solicitações possíveis para este Status!', 5000);
      this.abrirNodal = false;
    } else {
      this.abrirNodal = true;
    }
  }

  enviarMS(fmsolicitacoes: NgForm) {
    console.log(fmsolicitacoes.value);
    // fmsolicitacoes.value.data_oficio = this.appService.formatData(fmsolicitacoes.value.data_oficio);
    // if (!this.analiseShow) {
    //   delete fmsolicitacoes.value.cnpj_empresa;
    //   this.solicitacaoSubmit = true;
    // } else if (this.analiseShow && fmsolicitacoes.value.cnpj_empresa) {
    //   this.solicitacaoSubmit = true;
    // } else {
    //   this.solicitacaoSubmit = false;
    //   this.erroEmpresa = true;
    // }

    // if (this.solicitacaoSubmit) {
    //     fmsolicitacoes.value.cod_gesac = this.pontpresenCod_gesac;
    //     this.abrirNodal = false;
    //     this.analiseShow = false;
    //     this.pontoPresencaService.postMSolicitacoes(fmsolicitacoes.value).subscribe(resp => {
    //       this.resp = resp;
    //       this.mSolicitacoes = {
    //         tipo_solicitacao: '',
    //         num_doc_sei: null,
    //         num_oficio: null,
    //         data_oficio: null,
    //         cnpj_empresa: ''
    //       };
    //       fmsolicitacoes.reset();
    //       this.loadPontoPre();
    //     });
    //   }
  }

  ActiveInputAnalise(mSolicitacoes) {
    if ( mSolicitacoes === '6' || mSolicitacoes === '7' || mSolicitacoes === '8' || mSolicitacoes === '9') {
      this.analiseShow = true;
    } else if (mSolicitacoes === '25' || mSolicitacoes === '26' || mSolicitacoes === '27') {
      this.pendenciaShow = true;
    } else {
      this.analiseShow = false;
      this.pendenciaShow = false
    }
  }

  selecoesGesacs(campo, fmselecionarGesac: NgForm) {
    if (campo) {
      this.listaGesac = campo.split('\n');
      this.listaGesac.sort((a, b) => {
        return a - b;
      });
      this.listaGesac = this.listaGesac.filter(function (item, pos, self) {
        return self.indexOf(item) === pos;
      });
      fmselecionarGesac.reset();
    }
    this.toggleAll(false);
    // this.contador = 0;
    // let i = 0;
    // let k = 0;
    // let j = 0;
    // for (k; k < this.listaGesac.length; k++) {
    //   if (this.listaGesac[k] !== '') {
    //     for (i; i < this.allArrays.length; i++) {
    //       if (j === 50) { j = 0; }
    //       for (j; j < this.allArrays[i].length; j++) {
    //         if (Number(this.listaGesac[k]) === this.allArrays[i][j].cod_gesac) {
    //           this.allArrays[i][j].check = true;
    //           this.pontpresenCod_gesac.push(this.allArrays[i][j].cod_gesac);
    //           this.pontoPresencaStatus.push(this.allArrays[i][j].cod_status);
    //           this.numMarcados++;
    //           this.contador++;
    //           k++;
    //         }
    //       }
    //     }
    //   }
    // }
    this.filterGsac(this.listaGesac, this.selecionados);
    if (this.allArrays) {
      this.botoesMSA = true;
    }
    this.selcGesac = false;
    this.selecionados = [];
    this.listaGesac = [];
  }

  filterGsac(arrayGsac, arraySelecionados) {
    let ponto = this.pontosPresenca;
    if (arrayGsac.length > 0) {
      ponto = ponto.filter(pontoPres => {
        if (arrayGsac.some(gsac => gsac === pontoPres.cod_gesac.toString())) {
          this.pontpresenCod_gesac.push(pontoPres.cod_gesac);
          this.pontoPresencaStatus.push(pontoPres.cod_status);
          this.numMarcados++;
          pontoPres.check = true;
          return true;
        } else {
          return false;
        }
      });
    }
    if (arraySelecionados.length > 0) {
      ponto = ponto.filter(pontoPres => {
        if (arraySelecionados.some(selec => pontoPres.tipologia && pontoPres.tipologia.includes(selec.nome))) {
          this.pontpresenCod_gesac.push(pontoPres.cod_gesac);
          this.pontoPresencaStatus.push(pontoPres.cod_status);
          this.numMarcados++;
          pontoPres.check = true;
          return true;
        } else {
          if (this.pontpresenCod_gesac) {
            this.pontpresenCod_gesac.splice(this.pontpresenCod_gesac.indexOf(pontoPres.cod_gesac), 1);
            this.pontoPresencaStatus.splice(this.pontoPresencaStatus.indexOf(pontoPres.cod_status), 1);
            this.numMarcados--;
            pontoPres.check = false;
          }
          return false;
        }
      });
    }
    this.pontpresenCod_gesac = this.pontpresenCod_gesac.filter((item, pos, self) => self.indexOf(item) === pos);
    this.pontoPresencaStatus = this.pontoPresencaStatus.filter((item, pos, self) => self.indexOf(item) === pos);
    this.numMarcados = this.pontpresenCod_gesac.length;
    this.funcaoPaginacao(ponto);
  }


  filtroPonto(filtros): any {
    if (!filtros.gesac && !filtros.uf && !filtros.municipio && !filtros.status && !filtros.ponto && !filtros.tipologia) {
      this.funcaoPaginacao(this.pontosPresenca);
    } else {
      let valida;
      const ponto = this.pontosPresenca.filter(pontoPres => {
        valida = true;
        if (filtros.gesac && !pontoPres.cod_gesac.toString().includes(filtros.gesac.toLowerCase())) { valida = false; }
        if (filtros.uf && !pontoPres.uf.toLowerCase().includes(filtros.uf.toLowerCase())) { valida = false; }
        if (filtros.municipio && !pontoPres.nome_municipio.toLowerCase().includes(filtros.municipio.toLowerCase())) { valida = false; }
        if (filtros.status.descricao &&
          pontoPres.descricao.toLowerCase() !== filtros.status.descricao.toLowerCase()) { valida = false; }
        if (filtros.ponto && !pontoPres.nome.toLowerCase().includes(filtros.ponto.toLowerCase())) { valida = false; }
        if ((filtros.tipologia && pontoPres.tipologia == null) ||
          (filtros.tipologia && !pontoPres.tipologia.toLowerCase().includes(filtros.tipologia.toLowerCase()))) { valida = false; }
        return valida;
      });
      this.funcaoPaginacao(ponto);
    }
  }

}


