# TPC6
## 05 de Abril 2026

### Por:
    - Gonçalo Rocha Sousa Freitas
    - A104350
<img src="../foto.png" alt="foto" width="300">

### Resumo:
	TPC6: uma aplicação dedicada ao cinema americano
	Neste trabalho, montei uma orquestração de serviços para criar uma App de cinema:
		. Transferi o dataset de cinema;
		. Analisei o que era pedido e apliquei ao dataset as alterações que considerei necessárias;
		. Importei o dataset para o MongoDB, ficando com 3 coleções: filmes, atores e generos;
		. Desenvolvi uma API de dados simples para essas 3 coleções;
		. Tal como foi mostrado na aula, separei os serviços em containers docker e criei uma
		orquestração para a API de dados;
		. Criei um servidor aplicacional que responde aos seguintes pedidos:
			GET /filmes - devolve uma página HTML com uma tabela que inclui os campos do filme: id, título, ano, número de atores no elenco e número de géneros associados ao filme; cada linha aponta para a página individual do filme;
			GET /filmes/:id - devolve uma página HTML com toda a informação do filme;
			GET /atores - devolve uma página HTML com uma tabela que inclui os campos do ator: id, nome, número de filmes em que participou; cada linha aponta para a página individual do ator;
			GET /atores/:id - devolve uma página HTML com toda a informação do ator;
			GET /generos - devolve uma página HTML com uma tabela que inclui os campos do género: id, designação, número de filmes associados ao género;
		. Criei um docker para a interface;
		. Orquestrei tudo num docker compose.
		
### Lista de Resultados
