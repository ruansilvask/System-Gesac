const http = require('http')
    ,app = require('./config/express');

http.createServer(app).listen(310, function() {
    console.log('Servidor rodando na porta: estou rondando na portinha do THIAGO WILLIAM MONTOANI ' + this.address().port);
});

