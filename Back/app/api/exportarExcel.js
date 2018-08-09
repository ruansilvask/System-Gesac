var excel = require('node-excel-export');

module.exports = (app) => {
    var api = {};
    
    api.exportaExcel = function(req, res){
        const connection = app.conexao.conexaoBD();
        const exportarExcelDAO = new app.infra.ExportarExcelDAO(connection);
        
        exportarExcelDAO.listarDadosExcel((erro, resultado) => {
            if(erro){
                console.log(erro);
                res.status(500).send(app.api.erroPadrao());
            }else{
                const styles = {
                    header: {
                        fill: {
                            fgColor: {
                                rgb: '538DD5'
                            }
                        },
                        font: {
                            color: {
                                rgb: 'FFFFFF'
                            },
                            sz: 14,
                            bold: true
                        },
                        alignment: {
                            horizontal: 'center'
                        }
                    } 
                };
                const heading = [];

                const specification = {
                    cod_pid: {
                        displayName: 'PID', 
                        headerStyle: styles.header, 
                        cellStyle: '',
                        width: 70
                    },
                    cod_gesac: {
                        displayName: 'GESAC',
                        headerStyle: styles.header,
                        cellStyle: '',
                        width: 70 
                    },
                    status: {
                        displayName: 'Status',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 110 
                    },
                    uf: {
                        displayName: 'UF',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 50 
                    },
                    nome_municipio: {
                        displayName: 'Município',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 185 
                    },
                    cod_ibge: {
                        displayName: 'Código IBGE',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 105 
                    },
                    ponto_presença: {
                        displayName: 'Ponto de Presença',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 600 
                    },
                    inep: {
                        displayName: 'INEP',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 100 
                    },
                    lote: {
                        displayName: 'Lote',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 70 
                    },
                    velocidade: {
                        displayName: 'Velocidade',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 100 
                    },
                    preco: {
                        displayName: 'Preço',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 70 
                    },
                    instituicao_responsavel: {
                        displayName: 'Instituição Responsável',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 190 
                    },
                    instituicao_pagadora: {
                        displayName: 'Instituição Pagadora',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 170 
                    },
                    tipologias: {
                        displayName: 'Tipologia',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 200 
                    },
                    endereco: {
                        displayName: 'Endereço',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 500
                    },
                    numero: {
                        displayName: 'Número',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 100 
                    },
                    bairro: {
                        displayName: 'Bairro',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 220 
                    },
                    cep: {
                        displayName: 'CEP',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 100
                    },
                    complemento: {
                        displayName: 'Complemento',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 220 
                    },
                    area: {
                        displayName: 'Área',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 70 
                    },
                    latitude: {
                        displayName: 'Latitude',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 100 
                    },
                    longitude: {
                        displayName: 'Longitude',
                        headerStyle: styles.header,
                        cellStyle: '', 
                        width: 100
                    }
                }

                const dataset = resultado;

                const merges = [];
                const report = excel.buildExport(
                    [
                        {
                            name: 'SGesac',
                            heading: heading,
                            merges: merges,
                            specification: specification,
                            data: dataset
                        }
                    ]
                );

                res.attachment('SGesac.xlsx');
                return res.send(report);
            }
        });

        connection.end();
    };
    
    return api;
};