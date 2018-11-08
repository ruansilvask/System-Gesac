import { ApiServicesPagination } from '../api-services/api-services-pagination';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { SuiModalService } from 'ng2-semantic-ui';
import { ConfirmModal } from '../modal/modal.component';
import { ContatoService } from './contato.service';
import { Contato } from './contato.model';
import { NgForm } from '@angular/forms';
import { ApiServicesMsg } from '../api-services/api-services-msg';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss']
})
export class ContatoComponent implements OnInit {
  local: string;
  codContato: string;

  @Output() buscaChange: EventEmitter<string> = new EventEmitter<string>();
  private termosDaBusca: Subject<string> = new Subject<string>();
  contatos: Observable<any[]>;
  contatosRetorno: any;
  codTelefone: any;
  dadosPessoa: any;
  contatosCadastrados = [];
  formulario = {};
  telefone: any;
  trocarTelefone = false;
  editPessoasCadastradas = false;
  codContatoCadastrado: number;
  nomePessoa: string;

  contatoInfo = {
    nome: '',
    cargo: '',
    obs: ''
  };

  alterTelefone: any = {
    tipo: '',
    fone: '',
    email: ''
  };

  adicionarTelefone: any = {
    tipo: '',
    fone: '',
    email: ''
  };

  // Campos ngifs
  desabilitarCampos = false;
  aparecerInfContato = false;
  aparecerContatosCadastrados = false;

  /*
  * Pagination
  */
  allArrays: any;
  todosContatos: any;
  totalItens = 0;
  itensPagina = 10;
  pagina = 1;

  constructor(
    private apiServicesMsg: ApiServicesMsg,
    private contatoService: ContatoService,
    private modalService: SuiModalService,
    private apiServicesPagination: ApiServicesPagination
  ) {}

  /*
  * Método para mudar a página da paginação
  */
  page(pagina) {
    this.contatos = this.allArrays[pagina - 1];
  }

  isAdmin() {
    return (localStorage.getItem('currentUserCode') === '1') ? true : false;
  }

  funcaoPaginacao(array) {
    let pagina;
    this.totalItens = array.length;
    this.allArrays = this.apiServicesPagination.pagination(
      array,
      this.itensPagina
    );
    this.page((pagina = 1));
  }

  // GET E POSTS INICIO

  // GET E POST EMPRESA

  getContatosEmpresa(cnpjEmpresa) {
    this.contatoService.getContatosEmpresa(cnpjEmpresa).subscribe(contatos => {
      this.contatosCadastrados = contatos;
    });
  }

  postContatoEmpresa(form) {
    this.formulario = this.formatPost(this.local, this.dadosPessoa, this.codContato, form);
    this.postContatos(this.formulario);
  }

  // GET E POST PONTO

  getContatosPonto(codGesac) {
    this.contatoService.getContatosPonto(codGesac).subscribe(contatos => {
      this.contatosCadastrados = contatos;
    });
  }

  postContatoPonto(form) {
    this.formulario = this.formatPost(this.local, this.dadosPessoa, this.codContato, form);
    this.postContatos(this.formulario);
  }

  // GET E POST INSTITUICAO

  getContatosInstituicao(codInst) {
    this.contatoService.getContatosInstituicao(codInst).subscribe(contatos => {
      this.contatosCadastrados = contatos;
    });
  }

  postContatoInstituicao(form) {
    this.formulario = this.formatPost(this.local, this.dadosPessoa, this.codContato, form);
    this.postContatos(this.formulario);
  }

  formatPost(type, codPessoa, codContato, form) {
    let formatado = {};
    if (type === 'instituicao') {
      formatado = {
            cod_pessoa: codPessoa.cod_pessoa,
            cod_instituicao: codContato,
            nome: form.nome,
            cargo: form.cargo,
            obs: form.obs
          };
    } else if (type === 'ponto') {
      formatado = {
            cod_pessoa: codPessoa.cod_pessoa,
            cod_gesac: codContato,
            nome: form.nome,
            cargo: form.cargo,
            obs: form.obs
          };
    } else if (type === 'empresa') {
      formatado = {
            cod_pessoa: codPessoa.cod_pessoa,
            cnpj_empresa: codContato,
            nome: form.nome,
            cargo: form.cargo,
            obs: form.obs
          };
    }
    return formatado;
  }

  // post de contatos

  postContatos(form) {
    this.contatoService.postContato(form).subscribe(
      contatos => {
        this.cancelarInfContato();
        this.funcaoContato('get', this.local, this.codContato);
        this.apiServicesMsg.setMsg(
          'success',
          'Contato cadastrado com sucesso.',
          3000
        );
      },
      erro => Swal('Erro', `${erro.error}`, 'error')
    );
  }

  funcaoContato(metodo, local, valor) {
    if (local === 'empresa') {
      if (metodo === 'get') {
        this.getContatosEmpresa(valor);
      } else if (metodo === 'post') {
        this.postContatoEmpresa(valor);
      }
    } else if (local === 'ponto') {
      if (metodo === 'get') {
        this.getContatosPonto(valor);
      } else if (metodo === 'post') {
        this.postContatoPonto(valor);
      }
    } else if (local === 'instituicao') {
      if (metodo === 'get') {
        this.getContatosInstituicao(valor);
      } else if (metodo === 'post') {
        this.postContatoInstituicao(valor);
      }
    }
  }

  // GET E POSTS FIM

  getContatos(codigo) {
    this.contatoService.getContatoById(codigo).subscribe(contatosRetorno => {
      this.contatosRetorno = contatosRetorno;
      this.aparecerInfContato = true;
    });
  }

  salvarCods(local, codContato) {
    this.local = local;
    this.codContato = codContato;
  }

  buscaPessoa(contatos: any): void {
    this.termosDaBusca.next(contatos);
    this.buscaChange.emit(contatos);
  }

  telefoneValido(form) {
    if ((form.fone && !form.tipo) || (!form.fone && form.tipo)) {
      this.apiServicesMsg.setMsg(
        'warning',
        'O tipo de telefone e o telefone devem estar preeenchidos.',
        4000
      );
      return false;
    } else if (!form.tipo && !form.fone && !form.email) {
      this.apiServicesMsg.setMsg(
        'warning',
        'Verifique se os campos não estão vazios.',
        3000
      );
      return false;
    } else {
      return true;
    }
  }

  addTelefone(fAddTel: NgForm) {
    this.codTelefone = null;
    if (this.contatosRetorno.length !== 0) {
      this.codTelefone =
        this.contatosRetorno[this.contatosRetorno.length - 1].cod_telefone + 1;
    } else {
      this.codTelefone = 1;
    }
    this.telefone = {
      cod_telefone: this.codTelefone,
      cod_pessoa: this.dadosPessoa.cod_pessoa,
      email: fAddTel.value.email,
      fone: fAddTel.value.fone,
      tipo: fAddTel.value.tipo
    };
    if (this.telefoneValido(this.telefone)) {
      this.contatoService.postTelefone(this.telefone).subscribe(
        res => {
          fAddTel.reset();
          this.getContatos(this.dadosPessoa.cod_pessoa);
          this.adicionarTelefone = {
            tipo: '',
            fone: '',
            email: ''
          };
          this.apiServicesMsg.setMsg(
            'success',
            'Telefone adicionado com sucesso.',
            3000
          );
        },
        erro => Swal('Erro', `${erro.error}`, 'error')
      );
    }
  }

  infoContato(contato: any) {
    if (this.desabilitarCampos === false) {
      if (this.existeContato(contato.cod_pessoa)) {
        for (let i = 0; i < this.contatosCadastrados.length; i++) {
          if (
            contato.cod_pessoa === this.contatosCadastrados[i].cod_pessoa
          ) {
            this.contatoService
              .getInfContato(this.contatosCadastrados[i].cod_contato)
              .subscribe(
                (res: any) => {
                  this.contatoInfo = {
                    nome: res.nome,
                    cargo: res.cargo,
                    obs: res.obs
                  };
                },
                erro => Swal('Erro', `${erro.error}`, 'error')
              );
            break;
          }
        }
        this.desabilitarCampos = true;
        this.dadosPessoa = {
          cod_pessoa: contato.cod_pessoa,
          nome: contato.nomePessoa
        };
        this.getContatos(contato.cod_pessoa);
      } else {
        this.contatoInfo = { nome: contato.nomePessoa, cargo: '', obs: '' };
        this.desabilitarCampos = true;
        this.dadosPessoa = {
          cod_pessoa: contato.cod_pessoa,
          nome: contato.nomePessoa
        };
        this.getContatos(contato.cod_pessoa);
    }
  }
}

  enviarNome(nome) {
    this.contatoService.postContatoPessoa(nome).subscribe(
      cod_pessoa => {
        this.contatoInfo.nome = nome;
        this.dadosPessoa = { cod_pessoa, nome };
        this.desabilitarCampos = true;
        this.aparecerInfContato = true;
        this.contatoInfo = { nome: nome, cargo: '', obs: '' };
        this.apiServicesMsg.setMsg(
          'success',
          'Pessoa cadastrada com sucesso.',
          3000
        );
      },
      erro => Swal('Erro', `${erro.error}`, 'error')
    );
  }

  // Informacaoes do contato

  cancelarInfContato() {
    this.editPessoasCadastradas = false;
    this.desabilitarCampos = false;
    this.aparecerInfContato = false;
    this.codContatoCadastrado = null;
    this.dadosPessoa = [];
    this.contatosRetorno = [];
    this.contatoInfo = {
      nome: '',
      cargo: '',
      obs: ''
    };
    this.adicionarTelefone = {
      tipo: '',
      fone: '',
      email: ''
    };
  }

  existeContato(codPessoa) {
    let existe = false;
    for (let i = 0; i < this.contatosCadastrados.length; i++) {
      if (codPessoa === this.contatosCadastrados[i].cod_pessoa) {
        this.codContatoCadastrado = this.contatosCadastrados[i].cod_contato;
        existe = true;
        break;
      }
    }
    if (existe === true) {
      return true;
    } else {
      return false;
    }
  }

  salvarContato(form) {
    if (!this.existeContato(this.dadosPessoa.cod_pessoa)) {
      this.contatoInfo.nome = form.value.nome;
      this.funcaoContato('post', this.local, form.value);
    } else {
      form.value.cod_pessoa = this.dadosPessoa.cod_pessoa;
      this.contatoService
        .putContatoCadastrado(this.codContatoCadastrado, form.value)
        .subscribe(
          res => {
            this.cancelarInfContato();
            this.funcaoContato('get', this.local, this.codContato);
            this.apiServicesMsg.setMsg(
              'success',
              'Dados editados com sucesso.',
              3000
            );
          },
          erro => Swal('Erro', `${erro.error}`, 'error')
        );
    }
  }

  AlterarTelefone(fPutTelefone: NgForm) {
    this.telefone = {
      email: fPutTelefone.value.email,
      fone: fPutTelefone.value.fone,
      tipo: fPutTelefone.value.tipo
    };
    if (this.telefoneValido(this.telefone)) {
      Swal({
        title: 'Você tem certeza?',
        text: `Você tem certeza que deseja alterar as informações deste contato?`,
        type: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, alterar!',
        cancelButtonText: 'Não, cancelar',
        reverseButtons: true
      }).then(result => {
        if (result.value) {
          this.contatoService
            .putTelefoneCadastrado(
              this.codTelefone,
              this.dadosPessoa.cod_pessoa,
              this.telefone
            )
            .subscribe(
              res => {
                this.abreFechaModal();
                this.getContatos(this.dadosPessoa.cod_pessoa);
                this.apiServicesMsg.setMsg(
                  'success',
                  'Informações alteradas com sucesso.',
                  3000
                );
              },
              erro => Swal('Erro', `${erro.error}`, 'error')
            );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
        }
      });
    }
  }

  abreFechaModal() {
    this.trocarTelefone = !this.trocarTelefone;
  }

  editarTelefonesCadastrados(telefone) {
    this.alterTelefone = {
      tipo: telefone.tipo,
      fone: telefone.fone,
      email: telefone.email
    };
    this.codTelefone = telefone.cod_telefone;
    this.trocarTelefone = true;
  }

  /*
  * Metodo exclui o telefone selecionado
  */
  deletarTelefoneCadastrado(telefone) {
    Swal({
      title: 'Você tem certeza?',
      text: `Você tem certeza que deseja excluir o número ${telefone.fone} de ${
        telefone.nome
      } da lista de telefones?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Não, manter',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.contatoService
          .deletarTelefoneCadastrado(telefone.cod_telefone, telefone.cod_pessoa)
          .subscribe(
            res => {
              this.getContatos(this.dadosPessoa.cod_pessoa);
              this.apiServicesMsg.setMsg(
                'success',
                'Telefone excluído com sucesso.',
                3000
              );
            },
            erro => Swal('Erro', `${erro.error}`, 'error')
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  /*
  * Metodo que abre a tela para o contato ser editado
  */
  editarContatoCadastrado(contato) {
    this.codContatoCadastrado = contato.cod_contato;
    this.contatoInfo = { nome: contato.nome, cargo: contato.cargo, obs: contato.obs };
    this.dadosPessoa = { cod_pessoa: contato.cod_pessoa, nome: contato.nome };
    this.editPessoasCadastradas = true;
    this.desabilitarCampos = true;
    this.getContatos(contato.cod_pessoa);
  }

  /*
  * Metodo exclui o contato selecionado caso o mesmo nao esteja vinculado
  */
  deletarContatoCadastrado(contato) {
    Swal({
      title: 'Você tem certeza?',
      text: `Você tem certeza que deseja excluir ${
        contato.nome
      } da lista de contatos?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Não, manter',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.contatoService
          .deletarContatoCadastrado(contato.cod_contato, contato.cod_pessoa)
          .subscribe(
            res => {
              this.funcaoContato('get', this.local, this.codContato);
              this.cancelarInfContato();
              this.apiServicesMsg.setMsg(
                'success',
                'Contato excluído com sucesso.',
                3000
              );
            },
            erro => Swal('Erro', `${erro.error}`, 'error')
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  /*
  * Metodo exclui a pessoa caso ela não possua telefones cadastrados ou
  * esteja vinculada a ponto de presença, inst responsavel ou empresa
  */
  deletePessoa(contato) {
    Swal({
      title: 'Você tem certeza?',
      text: `Você tem certeza que deseja excluir ${contato.nomePessoa}?`,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Não, manter',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.contatoService.deletarPessoa(contato.cod_pessoa)
        .subscribe(
          res => {
            this.buscaPessoa(this.nomePessoa);
            this.apiServicesMsg.setMsg('success', 'Pessoa excluída com sucesso.', 3000);
        },
          erro => Swal('Erro', `${erro.error}`, 'error')
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.apiServicesMsg.setMsg('error', 'Ação cancelada.', 3000);
      }
    });
  }

  // Tabela dos contatos cadastrados no banco

  ngOnInit() {
    this.termosDaBusca
      .debounceTime(500) // aguarde por 500ms para emitir novos eventos
      .switchMap(
        term =>
          term
            ? this.contatoService.buscaPessoa(term)
            : Observable.of<Contato[]>([])
      )
      .subscribe(
        res => {
          this.todosContatos = res;
          this.funcaoPaginacao(this.todosContatos);
        },
        erro => console.error(erro)
      );

    this.contatoService.emitirCodContatos.subscribe(codigo => {
      if (codigo.codContato !== '') {
        this.funcaoContato('get', codigo.local, codigo.codContato);
      }
      this.salvarCods(codigo.local, codigo.codContato);
      this.cancelarInfContato();
    });
  }
}
