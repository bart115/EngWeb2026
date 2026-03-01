const axios = require('axios') 
const http = require('http')

// --- Funções utilitárias

function pagina(titulo, corpo){
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <title>${titulo}</title>
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
    </head>
    <body class="w3-light-grey">

        <div class="w3-container w3-indigo">
            <h1>${titulo}</h1>
        </div>

        <div class="w3-container w3-margin-top">
            ${corpo}
        </div>

    </body>
    </html>
    `
}

function link(href, texto){
    return `<a href="${href}">${texto}</a>`
}

function card(titulo, conteudo){
    return `
    <div class="w3-card-4 w3-white w3-margin-bottom">
        <header class="w3-container w3-blue">
            <h3>${titulo}</h3>
        </header>
        <div class="w3-container w3-padding">
            ${conteudo}
        </div>
    </div>
    `
}

function lista(items){
    if(items.length === 0)
        return `<p><i>Sem registos.</i></p>`

    return `
      <ul class="w3-ul w3-hoverable">
        ${items.map(i => `<li>${i}</li>`).join("")}
      </ul>
    `
}

function listaLinks(items){
    if(items.length === 0)
        return `<p><i>Sem registos.</i></p>`

    return `
      <ul class="w3-ul w3-hoverable">
        ${items.map(i => `<li><a href="${i.href}">${i.text}</a></li>`).join("")}
      </ul>
    `
}

function botaoVoltar(){
    return `<a class="w3-button w3-teal w3-margin-top" href="/">Voltar</a>`
}

async function getAlunos(){
    const resp = await axios.get("http://localhost:3000/alunos?_sort=nome")
    return resp.data
}

async function getAluno(id){
    const resp = await axios.get("http://localhost:3000/alunos/" + id)
    return resp.data
}

async function getCursos(){
    const resp = await axios.get("http://localhost:3000/cursos?_sort=id")
    return resp.data
}

async function getCurso(id){
    const resp = await axios.get("http://localhost:3000/cursos/" + id)
    return resp.data
}

async function getInstrumentos(){
    const resp = await axios.get("http://localhost:3000/instrumentos?_sort=id")
    return resp.data
}

async function getInstrumento(id){
    const resp = await axios.get("http://localhost:3000/instrumentos?q=" + id)
    return resp.data[0]
}


http.createServer(async function (req, res) {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)
    
    switch (req.method) {
        case "GET":
            // --- Página inicial
            if (req.url == "/") {
                try {
                    corpo = card("Lista de dados consultáveis", listaLinks([
                        {href: "/alunos", text: "Alunos"},
                        {href: "/cursos", text: "Cursos"},
                        {href: "/instrumentos", text: "Instrumentos"}
                    ]))
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina("Escola de Musica", corpo))
                    }
                catch(e) {
                    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina("Erro", `<p>Ocorreu um erro: ${e}.</p>`))
                }
            }
            else if (req.url == '/alunos') {
                try {
                    var alunos = await getAlunos();
                    var linhas = alunos.map(a => `<tr>
                        <td><a href="/alunos/${a.id}">${a.id}</a></td>
                        <td><a href="/alunos/${a.id}">${a.nome}</a></td>
                        <td><a href="/cursos/${a.curso}">${a.curso}</a></td>
                        <td>${a.anoCurso}</td>
                        <td><a href="/instrumentos/${a.instrumento}">${a.instrumento}</a></td>
                        </tr>`).join("");
                    
                    corpo = `
                    ${card("Lista de Alunos", `
                    <table class="w3-table w3-striped w3-bordered w3-hoverable">
                        <tr class="w3-light-grey">
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Curso</th>
                            <th>Ano do Curso</th>
                            <th>Instrumento</th>
                        </tr>
                        ${linhas}
                    </table>`)}
                    ${botaoVoltar()}
                    `
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina("Alunos", corpo))
                }
                catch(e) {
                    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina("Erro", `<p>Ocorreu um erro: ${e}.</p>`))
                }
            }
            else if (req.url == '/cursos') {
                try {
                var cursos = await getCursos();
                var linhas = cursos.map(c => `<tr>
                    <td><a href="/cursos/${c.id}">${c.id}</a></td>
                    <td><a href="/cursos/${c.id}">${c.designacao}</a></td>
                    <td>${c.duracao} anos</td>
                    <td><a href="/instrumentos/${c.instrumento['#text']}">${c.instrumento['#text']}</a></td>
                    </tr>`).join("");
                
                corpo = `
                ${card("Lista de Cursos", `
                <table class="w3-table w3-striped w3-bordered w3-hoverable">
                    <tr class="w3-light-grey">
                        <th>ID</th>
                        <th>Designação</th>
                        <th>Duração</th>
                        <th>Instrumento</th>
                    </tr>
                    ${linhas}
                </table>`)}
                ${botaoVoltar()}
                `
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(pagina("Cursos", corpo))
                }
                catch(e) {
                    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina("Erro", `<p>Ocorreu um erro: ${e}.</p>`))
                }
            }
            else if (req.url == '/instrumentos') {
                try {
                    var instrumentos = await getInstrumentos();
                    var linhas = instrumentos.map(i => `<tr>
                        <td><a href="/instrumentos/${i['#text']}">${i.id}</a></td>
                        <td><a href="/instrumentos/${i['#text']}">${i['#text']}</a></td>
                        </tr>`).join("");
                    
                    corpo = `
                    ${card("Lista de Instrumentos", `
                    <table class="w3-table w3-striped w3-bordered w3-hoverable">
                        <tr class="w3-light-grey">
                            <th>ID</th>
                            <th>Designação</th>
                        </tr>
                        ${linhas}
                    </table>`)}
                    ${botaoVoltar()}
                    `
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina("Instrumentos", corpo))
                }
                catch(e) {
                    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina("Erro", `<p>Ocorreu um erro: ${e}.</p>`))
                }
            }
            else if (req.url.startsWith('/instrumentos/')) {
                try {
                    var id = req.url.split('/')[2];
                    var instrumento = await getInstrumento(id);
                    var corpo = `
                    ${card("Detalhes do Instrumento", `
                        <p><b>ID:</b> ${instrumento.id}</p>
                        <p><b>Designação:</b> ${instrumento['#text']}</p>
                    `)}
                    ${botaoVoltar()}
                    `
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina("Instrumento " + instrumento['#text'], corpo))
                }
                catch(e) {
                    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina("Erro", `<p>Ocorreu um erro: ${e}.</p>`))
                }
            }
            else if (req.url.startsWith('/alunos/')) {
                try {
                    var id = req.url.split('/')[2];
                    var aluno = await getAluno(id);
                    var corpo = `
                    ${card("Detalhes do Aluno", `
                        <p><b>ID:</b> ${aluno.id}</p>
                        <p><b>Nome:</b> ${aluno.nome}</p>
                        <p><b>Curso:</b> <a href="/cursos/${aluno.curso}">${aluno.curso}</a></p>
                        <p><b>Ano do Curso:</b> ${aluno.anoCurso}</p>
                        <p><b>Instrumento:</b> <a href="/instrumentos/${aluno.instrumento}">${aluno.instrumento}</a></p>
                    `)}
                    ${botaoVoltar()}
                    `
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina(aluno.nome, corpo))
                }
                catch(e) {
                    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina("Erro", `<p>Ocorreu um erro: ${e}.</p>`))
                }
            }
            else if (req.url.startsWith('/cursos/')) {
                try {
                    var id = req.url.split('/')[2];
                    var curso = await getCurso(id);
                    var corpo = `
                    ${card("Detalhes do Curso", `
                        <p><b>ID:</b> ${curso.id}</p>
                        <p><b>Designação:</b> ${curso.designacao}</p>
                        <p><b>Duração:</b> ${curso.duracao} anos</p>
                        <p><b>Instrumento:</b> <a href="/instrumentos/${curso.instrumento['#text']}">${curso.instrumento['#text']}</a></p>
                    `)}
                    ${botaoVoltar()}
                    `
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina(curso.designacao, corpo))
                }
                catch(e) {
                    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(pagina("Erro", `<p>Ocorreu um erro: ${e}.</p>`))
                }
            }
            else {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end(`<p>Recurso não encontrado: ${req.url}.</p>`)
            }
            break

        default:
            res.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(`<p>Método não suportado:${req.method}.</p>`)
        }          
}).listen(10158, () => console.log("Servidor à escuta na porta 10158..."))
