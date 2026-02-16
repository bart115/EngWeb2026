const http = require('http')
const axios = require('axios');

http.createServer(function (req, res) {
res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
if (req.url == '/reparacoes') {
    axios.get('http://localhost:3000/reparacoes?_sort=data,nome&_order=desc,asc')
        .then(resp => {
            html = `<table border="1">
            <tr>
                <th>Nome</th>
                <th>NIF</th>
                <th>Data</th>
                <th>Viatura</th>
                <th>Matricula</th>
                <th>Nº Intervencoes</th>
            </tr>`
            dados = resp.data;
            dados.forEach(a => {
                html += `<tr>
                <td>${a.nome}</td>
                <td>${a.nif}</td>
                <td>${a.data}</td>
                <td>${a.viatura.marca}, ${a.viatura.modelo}</td>
                <td>${a.viatura.matricula}</td>
                <td>${a.nr_intervencoes}</td>
                </tr>`
            });
            html += `</table>`
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end(html);
        })
        .catch(error => {
            res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
            res.end("<pre>" + JSON.stringify(error) + "</pre>")
        }); 
} 
else if (req.url == '/intervencoes') {
    axios.get('http://localhost:3000/reparacoes')
        .then(resp => {
            html = `<table border="1">
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Nº Intervenções</th>
            </tr>`
            dados = resp.data;
            let todasIntervencoes = [];
            let n_intervencoes = [];
            dados.forEach(a => {
                a.intervencoes.forEach(i => {
                    if (!todasIntervencoes.find(x => x.codigo === i.codigo)) {
                        todasIntervencoes.push(i);
                    }
                    n_intervencoes[i.codigo] = (n_intervencoes[i.codigo] || 0) + 1;
                });
            });
            todasIntervencoes.sort((a, b) => a.codigo.localeCompare(b.codigo));
            
            todasIntervencoes.forEach(i => {
                html += `<tr>
                <td>${i.codigo}</td>
                <td>${i.nome}</td>
                <td>${i.descricao}</td>
                <td>${n_intervencoes[i.codigo] || 0}</td>
                </tr>`
            });
            html += `</table>`
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end(html);
        })
        .catch(error => {
            res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
            res.end("<pre>" + JSON.stringify(error) + "</pre>")
        }); 
} 
else if (req.url == '/viaturas') {
    axios.get('http://localhost:3000/reparacoes')
        .then(resp => {
            html = `<table border="1">
            <tr>
                <th>Marca</th>
                <th>Nº Intervenções</th>
            </tr>
            `
            dados = resp.data;
            let marcas = [];
            marcasModelos = [];
            let modelos = [];
            let n_intervencoes = [];
            dados.forEach(a => {
                if (!marcas.includes(a.viatura.marca)) {
                    marcas.push(a.viatura.marca);
                }
                if (!modelos.includes(a.viatura.modelo)) {
                    modelos.push(a.viatura.modelo);
                    marcasModelos.push({marca: a.viatura.marca, modelo: a.viatura.modelo});
                }
                n_intervencoes[a.viatura.marca] = (n_intervencoes[a.viatura.marca] || 0) + 1;
                n_intervencoes[a.viatura.modelo] = (n_intervencoes[a.viatura.modelo] || 0) + 1;
            });
            marcas.sort((a, b) => a.localeCompare(b));
            modelos.sort((a, b) => a.localeCompare(b));
            
            marcas.forEach(m => {
                html += `<tr>
                <td>${m}</td>
                <td>${n_intervencoes[m] || 0}</td>
                </tr>`
            });
            html += `</table>`
            html += `
            <hr/>
            <table border="1">
            <tr>
                <th>Modelo</th>
                <th>Marca</th>  
                <th>Nº Intervenções</th>
            </tr>
            `       
            modelos.forEach(m => {
                html += `<tr>
                <td>${m}</td>
                <td>${marcasModelos.find(x => x.modelo === m)?.marca || ''}</td>
                <td>${n_intervencoes[m] || 0}</td>
                </tr>`
            });
            html += `</table>`
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end(html);
        })
        .catch(error => {
            res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
            res.end("<pre>" + JSON.stringify(error) + "</pre>")
        }); 
} 
else{
    res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'})
    res.end("<p>Query inválida.</p>")
}
}).listen(7777)

console.log('Servidor rodando em http://localhost:7777/')