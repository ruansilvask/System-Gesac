import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../empresa.service';
import { ContatoService } from '../../contato/contato.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SuiModalService } from 'ng2-semantic-ui';

@Component({
  selector: 'app-empresa-detalhe',
  templateUrl: './empresa-detalhe.component.html',
  styleUrls: ['./empresa-detalhe.component.scss']
})
export class EmpresaDetalheComponent implements OnInit {


  params: any;
  empresas: any;
  contatosEmpresas: any;

  constructor(
    private empresaService: EmpresaService,
    private contatoService: ContatoService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: SuiModalService) { }


  getEmpresa() {
    this.empresaService.getEmpresa(this.params.id).subscribe(dados => {
      this.empresas = dados[0];
      this.getEmpresaContatosId(dados[0].cnpj_empresa);
    });
  }
  getEmpresaContatosId(cnpj_empresa) {
    this.empresaService.getEmpresaContatosId(cnpj_empresa).subscribe(dados => {
      this.contatosEmpresas = dados;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(res => this.params = res);
    this.getEmpresa();
  }
}


