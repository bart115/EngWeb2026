#!/bin/bash
echo "A importar dados iniciais para o MongoDB..."
mongoimport --db cinema --collection filmes --type json --file /docker-entrypoint-initdb.d/filmes.json --jsonArray
mongoimport --db cinema --collection atores --type json --file /docker-entrypoint-initdb.d/atores.json --jsonArray
mongoimport --db cinema --collection generos --type json --file /docker-entrypoint-initdb.d/generos.json --jsonArray
echo "Importação concluída com sucesso!"