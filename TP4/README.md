# TPC4
## 2 de Março 2026

### Por:
    - Gonçalo Rocha Sousa Freitas
    - A104350
<img src="../foto.png" alt="foto" width="300">

### Resumo:
    Neste trabalho, o objetivo foi desenvolver uma aplicação web para gestão de Exames Médico-Desportivos (EMD).
    O dataset dos EMD foi carregado num json-server, que serve como API de dados.
    Foi implementado um servidor aplicacional em Node.js capaz de tratar os seguintes pedidos:

-    GET / ou GET /emd - devolve a página inicial contendo uma tabela com a listagem de todos
        os EMD, exibindo os campos: nome do atleta, data, modalidade e resultado;
-    GET /emd/:id - apresenta uma página com um card detalhado com todas as informações
        relativas ao EMD selecionado;

    Na tabela principal, cada linha é clicável e permite navegar para a página individual do respetivo EMD.
    A página de detalhe de cada EMD inclui um botão "Voltar" no rodapé para regressar à listagem.
    Adicionalmente, foram incluídos dois botões no topo da tabela: um para ordenar os registos
    por data (ordem decrescente) e outro para ordenar por nome (ordem crescente).

    Para além disso, foram implementadas as seguintes rotas adicionais:
-        GET /emd/registo - apresenta um formulário para introdução dos dados de um novo EMD;
-        GET /emd/editar/:id - apresenta um formulário pré-preenchido para modificar os dados
        de um registo existente;
-        GET /emd/apagar/:id - remove o registo correspondente da base de dados e redireciona
        o utilizador para a página principal;
-        GET /emd/stats - gera uma página de estatísticas com as distribuições dos registos
        agrupados por: sexo, modalidade, clube, resultado e estado de federado;
-       POST /emd - adiciona um novo registo à base de dados e redireciona para a página inicial;
-        POST /emd/:id - atualiza um registo existente na base de dados e redireciona para a
        página inicial.

### Lista de Resultados
* [Lista_EMDS](output/trlist.html)
* [1 EMD](output/emdID.html)
* [Forms_adicionar](output/form.html)
