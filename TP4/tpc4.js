
var http = require('http')
var url = require('url')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates.js')           // Necessario criar e colocar na mesma pasta
var static = require('./static.js')                 // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Rebuilds nested EMD object from flat form data
function buildEmdObject(data) {
    var emd = {
        nome: {
            primeiro: data['nome.primeiro'] || '',
            último: data['nome.último'] || ''
        },
        dataEMD:    data.dataEMD || data.data || '',
        idade:      parseInt(data.idade) || 0,
        género:     data.género || '',
        morada:     data.morada || '',
        modalidade: data.modalidade || '',
        clube:      data.clube || '',
        email:      data.email || '',
        federado:   data.federado === 'true' || data.federado === true,
        resultado:  data.resultado === 'true' || data.resultado === true
    }
    if (data.id)    emd.id    = data.id
    if (data.index) emd.index = parseInt(data.index)
    return emd
}

// Server creation

var treinosServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        var q = url.parse(req.url, true)
        switch(req.method){
            case "GET": 
                // GET /emd ------------------------------------------------------------------
                if(q.pathname == '/' || q.pathname == '/emd'){
                    var sort = q.query._sort || "nome.primeiro"
                    var order = q.query._order || "asc"
                    var aux = 0
                    
                    if (sort == "nome.primeiro" && order == "asc") {
                        aux = 0
                    }
                    else if (sort == "nome.primeiro" && order == "desc") {
                        aux = 1
                    }
                    else if (sort == "dataEMD" && order == "asc") {
                        aux = 2
                    }
                    else if (sort == "dataEMD" && order == "desc") {
                        aux = 3
                    }

                    axios.get("http://localhost:3000/emd?_sort=" + sort + "&_order=" + order)
                    .then(resp => {
                        var emd = resp.data 
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdListPage(emd, d, sort, aux))
                    })
                }
                
                // GET /emd/register ---------------------------------------------------------
                else if(q.pathname == '/emd/register'){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(templates.emdRegisterPage(d))
                }

                // GET /emd/edit/:id ---------------------------------------------------------
                else if(/^\/emd\/edit\/[0-9a-zA-Z_-]+$/.test(q.pathname)){
                    var idEmd = q.pathname.split('/')[3]
                    axios.get('http://localhost:3000/emd/' + idEmd)
                    .then(resp => {
                        var emd = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdEditPage(emd, d))
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Não foi possível obter o registo...</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end('<address><a href="/">Voltar</a></address>')
                    })
                }

                // GET /emd/id ---------------------------------------------------------
                else if(/^\/emd\/[0-9a-zA-Z_-]+$/.test(q.pathname)){
                    var idEmd = q.pathname.split('/')[2]
                    axios.get('http://localhost:3000/emd/' + idEmd)
                    .then(resp => {
                        var emd = resp.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write(templates.emdIDPage(emd, d))
                        res.end('<address><a href="/">Voltar</a></address>')
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Não foi possível obter o registo...</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end('<address><a href="/">Voltar</a></address>')
                    })
                }
                //GET /emd/apagar/:id----------------------------------------------------------
                else if(/\/emd\/apagar\/[0-9a-zA-Z_-]+$/.test(q.pathname)){
                    var idEmd = q.pathname.split('/')[3]
                    axios.delete('http://localhost:3000/emd/' + idEmd)
                    .then(resp => {
                        res.writeHead(302, {'Location': '/'}) // Redireciona para a lista
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                        res.write('<p>Não foi possível apagar o registo...</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end('<address><a href="/">Voltar</a></address>')
                    })
                }

                break
            case "POST":
                // POST 
                if(q.pathname == '/emd'){
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.post('http://localhost:3000/emd', buildEmdObject(result))
                            .then(resp => {
                                res.write('<p>Registo inserido com sucesso: ' + JSON.stringify(resp.data) + '</p>')
                                res.end('<address><a href="/">Voltar</a></address>')
                            })
                            .catch(erro => {
                                res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write('<p>Não foi possível criar o registo...</p>')
                                res.write('<p>' + erro + '</p>')
                                res.end('<address><a href="/">Voltar</a></address>')
                            })
                        }
                        else{
                            res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p>Dados do formulário em formato desconhecido...</p>')
                            res.end('<address><a href="/">Voltar</a></address>')
                        }
                    })
                }
                else if(/\/emd\/edit\/[0-9a-zA-Z_-]+$/.test(q.pathname)){
                    var idEmd = q.pathname.split('/')[3]
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.put('http://localhost:3000/emd/' + idEmd, buildEmdObject(result))
                            .then(resp => {
                                res.write('<p>Registo atualizado com sucesso: ' + JSON.stringify(resp.data) + '</p>')
                                res.end('<address><a href="/">Voltar</a></address>')
                            })
                            .catch(erro => {
                                res.writeHead(505, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write('<p>Não foi possível atualizar o registo...</p>')
                                res.write('<p>' + erro + '</p>')
                                res.end('<address><a href="/">Voltar</a></address>')
                            })
                        }
                        else{
                            res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'})
                            res.write('<p>Dados do formulário em formato desconhecido...</p>')
                            res.end('<address><a href="/">Voltar</a></address>')
                        }
                    })
                }
                break
                
            default: 
                // Outros metodos nao sao suportados
        }
    }
})

treinosServer.listen(7777, ()=>{
    console.log("Servidor EMD a escutar na porta 7777...")
})

