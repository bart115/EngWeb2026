import json

with open("cinema.json", "r", encoding="utf-8") as f:
    data = json.load(f)

filmes = data["filmes"]

for i, filme in enumerate(filmes, start=1):
    filme["id"] = i

atores = {}

for filme in filmes:
    for ator in filme.get("cast", []):
        if ator not in atores:
            atores[ator] = {
                "id": len(atores) + 1,
                "name": ator,
                "filmes": []
            }
        atores[ator]["filmes"].append({
            "id": filme["id"],
            "title": filme["title"],
            "year": filme["year"]
        })

generos = {}

for filme in filmes:
    for genero in filme.get("genres", []):
        if genero not in generos:
            generos[genero] = {
                "id": len(generos) + 1,
                "name": genero,
                "filmes": []
            }
        generos[genero]["filmes"].append({
            "id": filme["id"],
            "title": filme["title"],
            "year": filme["year"]
        })

resultado = {
    "filmes": filmes,
    "atores": list(atores.values()),
    "generos": list(generos.values())
}

with open("cinema.json", "w", encoding="utf-8") as f:
    json.dump(resultado, f, indent=2, ensure_ascii=False)