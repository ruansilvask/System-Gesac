import { ApiServicesMsg } from '../../api-services/api-services-msg';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { EmpresaService } from '../empresa.service';
import { ContatoService } from '../../contato/contato.service';
import { ApiServiceCnpj } from '../../api-services/api-services-cnpj';
import { ApiServiceEstadoMunicipio } from '../../api-services/api-services-estado-municipio';

import { Empresa } from '../empresa.model';
import { SuiModalService } from 'ng2-semantic-ui';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresa-adicionar-editar',
  templateUrl: './empresa-adicionar-editar.component.html',
  styleUrls: ['./empresa-adicionar-editar.component.scss']
})
export class EmpresaAdicionarEditarComponent implements OnInit {

  /*
  * Variáveis fixas
  */
  local = 'empresa';
  codigo: string;
  params: any;

  /*
  * Variáveis globais
  */
 ufs: any;
 municipios: any;
 radio: string;
  empresasPai: Empresa[];

  /*
  * variáveis temporárias
  */
  consorcio: boolean;
  radioCons: string;

  /*
  * Variável das tabs
  */
 empresas = true;
 contatos: boolean;
 cnpjValido: boolean;

 /*
 * Variável de abilitar ou desabilitar campos
 */
  editCnpj = false;
  desabilitarRadio = false;

  /*
  * Váriável que guarda os dados do formulário
  */
  empresaForm: Empresa = {
    cnpj_empresa: '',
    cnpj_empresa_pai: '',
    cod_ibge: null,
    empresa: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    complemento: '',
    nome_municipio: '',
    uf: ''
  };

  constructor(
    private apiServicesMsg: ApiServicesMsg,
    private apiServiceEstadoMunicipio: ApiServiceEstadoMunicipio,
    private apiServiceCnpj: ApiServiceCnpj,
    private empresaService: EmpresaService,
    private contatoService: ContatoService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: SuiModalService
  ) {}

  /*
  * Método para mostrar o campo de empresa pai caso seja selecionado o radio com a opção não
  */
  radioConsorcio(consorcio) {
    if (consorcio === 'nao') {
        this.consorcio = true;
        this.empresaForm.cnpj_empresa_pai = '';
     } else {
        this.consorcio = false;
        this.empresaForm.cnpj_empresa_pai = this.empresaForm.cnpj_empresa;
      }
    }

  /*
  * Método para trazer os municípios de acordo com a uf selecionada
  */
  selectEstado(uf) {
    this.empresaForm.cod_ibge = null;
    this.municipios = this.apiServiceEstadoMunicipio.getMunicipios(uf);
  }

  /*
  * Método para formatar o objeto de empresa para ser enviado para o banco
  */
  formatEmpresa(form) {
    return {
      cnpj_empresa: form.cnpj_empresa,
      cnpj_empresa_pai: form.cnpj_empresa_pai,
      cod_ibge: form.cod_ibge,
      empresa: form.empresa,
      cep: form.cep,
      endereco: form.endereco,
      numero: form.numero,
      bairro: form.bairro,
      complemento: form.complemento
    };
  }

  /*
  * Método para adicionar/editar a empresa, caso seja passado um id na rota ocorrerá um put, caso contrario será um post
  */
  salvarEmpresa(form, consorcio) {
    if (this.radio === 'sim') {form.value.cnpj_empresa_pai = form.value.cnpj_empresa; }
    form = this.formatEmpresa(form.value);
    if (this.params.id) {
      this.empresaService.putEmpresa(this.params.id, form)
      .subscribe(res => {
        this.codigo = form.cnpj_empresa;
        this.contatoService.getContatos(this.codigo, 'empresa');
        this.contatos = true;
        this.apiServicesMsg.setMsg('success', 'Editado com sucesso.', 3000);
      });
    } else {
      this.empresaService.postEmpresa(form)
      .subscribe(res => {
        this.codigo = form.cnpj_empresa;
        this.contatoService.getContatos(this.codigo, 'empresa');
        this.contatos = true;
        this.apiServicesMsg.setMsg('success', 'Cadastrada com sucesso.', 3000);
      },
      erro =>
      Swal('Erro', `${erro.error}`, 'error')
    );
    }
  }

  /*
  * Método para retornar para a aba de adicionar/editar empresa
  */
  voltarEmpresa() {
    if (this.empresaForm.cnpj_empresa) {
      this.router.navigate(['empresa', this.empresaForm.cnpj_empresa]);
      this.empresas = true;
      this.ngOnInit();
    } else {
      this.router.navigate(['empresa/novo']);
      this.empresas = true;
    }
  }

  concluirEmpresa() {
    this.router.navigate(['/empresa']);
  }

  cnpjValid(cnpj) {
    this.cnpjValido = this.apiServiceCnpj.validarCNPJ(this.empresaForm.cnpj_empresa);
  }

  temCnpj(cnpj) {
    if (cnpj) {
      if (cnpj.length === 0) {
        return false;
      } else if (cnpj.length > 0) {
        return true;
      }
    }
  }

  getTabContatos() {
    if (this.params.id) {
      this.contatoService.getContatos(this.params.id, 'empresa');
    }
  }

  /*
  * Métodos que serão executados quando o componente é iniciado
  */
  ngOnInit() {
    /*
    * Método que pega o parâmetro da rota caso ele exista
    */
    this.route.params.subscribe(res => this.params = res);
    setTimeout(() => {
      /*
      * Trás os estados do banco
      */
      this.ufs = this.apiServiceEstadoMunicipio.getEstados();
      /*
      * Trás as empresas pai do banco
      */
      this.empresaService
        .getEmpresasPai()
        .subscribe(empresasPai => (this.empresasPai = empresasPai));

      /*
      * Condição para que caso exista parâmetro na rota será carregado os dados da empresa cadastrada
      */
      if (this.params.id) {
        this.empresaService.getEmpresa(this.params.id)
        .subscribe(dados =>  {
          if (dados.length === 0) {
            Swal({
              title: 'Erro',
              text: `Desculpe, mas esta empresa não existe! Deseja cadastrar uma nova empresa?`,
              type: 'warning',
              allowOutsideClick: false,
              showCancelButton: true,
              confirmButtonText: 'Sim',
              cancelButtonText: 'Não, voltar para empresas',
              reverseButtons: true
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['empresa/novo']);
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.router.navigate(['empresa']);
              }
            });
          } else {
            this.municipios = this.apiServiceEstadoMunicipio.getMunicipios(dados[0].uf);

            if (dados[0].cnpj_empresa === dados[0].cnpj_empresa_pai) {
              this.radioConsorcio('sim');
              this.radio = 'sim';
              this.desabilitarRadio = true;
            } else {
              this.radioConsorcio('nao');
              this.radio = 'nao';
            }

            this.empresaForm = dados[0];
          }
        });
        this.editCnpj = true;
      }
    }, 200);
  }
}
