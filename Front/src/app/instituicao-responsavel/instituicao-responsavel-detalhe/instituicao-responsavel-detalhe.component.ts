import { Component, OnInit, EventEmitter } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { InstRespService } from '../instituicao-responsavel.service';
import { ContatoService } from '../../contato/contato.service';

@Component({
  selector: 'app-instituicao-responsavel-detalhe',
  templateUrl: './instituicao-responsavel-detalhe.component.html',
  styleUrls: ['./instituicao-responsavel-detalhe.component.scss']
})
export class InstituicaoResponsavelDetalheComponent implements OnInit {
  contatosComRepre: any[];
  representantesLegais: any;
  contaInstRep: any;
  contatoInstituicao: any;
  modalActions = new EventEmitter<string>();
  representantes: any;
  inscricao: Subscription;
  instituicao: any[];
  instiResp: any;
  myValue = 0;
  id: any;
  contatosRepre: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private instRespService: InstRespService,
    private contatosService: ContatoService
  ) {}

  ngOnInit() {
    // função para pegar o id da rota
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.id = params['id'];

      this.instRespService.getInstResp(this.id).subscribe(res => {
        this.instiResp = res[0];
      });

      this.loadRepresentante();

      this.instRespService.getRepresentanteLegalId(this.id).subscribe((res: any) => {

// sort by name
        res.sort(function(a, b) {
          const statusA = a.status.toUpperCase(); // ignore upper and lowercase
          const statusB = b.status.toUpperCase(); // ignore upper and lowercase
          if (statusA < statusB) {
            return -1;
          }
          if (statusA > statusB) {
            return 1;
          }
          return 0;
        });
        this.representantesLegais = res;
      });

      this.instRespService.getContatoInstResp(this.id).subscribe(res => {
        this.loadCodPessoa(res);
      });
    });
  }

  loadCodPessoa(contatosInstResp) {
    this.contatosRepre = [];
    for (let i = 0; i < contatosInstResp.length; i++) {
      this.contatosService
        .getContatoById(contatosInstResp[i].cod_pessoa)
        .subscribe((res: any) => {
         if (res.length === 0) {
          this.contatosRepre[this.contatosRepre.length] = [];
          this.contatosRepre[this.contatosRepre.length - 1].pessoa = contatosInstResp[i];
         } else {
           for (let u = 0; u < res.length; u++) {
             this.contatosRepre[this.contatosRepre.length] = res[u];
             this.contatosRepre[this.contatosRepre.length - 1].pessoa = contatosInstResp[i];
           }
         }
        },
        erro => console.error(erro)
      );
    }
  }



  loadRepresentante() {
    this.instRespService
      .getRepresentanteLegalId(this.id)
      .subscribe(res => (this.representantes = res));
  }

  openModal() {}
}


