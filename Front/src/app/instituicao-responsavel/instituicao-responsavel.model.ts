export class InstituicaoResp {
  cod_instituicao: number;
  cod_ibge: number;
  cnpj_instituicao: string;
  nome: string;
  sigla: string;
  pagadora: boolean;
  dou: string;
  termo_coop: string;
  num_processo: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  complemento: string;
}

export class RepLegal {
  cod_representante: number;
  cod_contato: number;
  cod_pessoa: number;
  data_inicial: Date;
  data_final: Date;
  status: any;
}
