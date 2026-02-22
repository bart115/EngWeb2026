import json
import os
import shutil
from pathlib import Path

# -- Funções auxiliares --

def carregar_dados(caminho):
    with open(caminho, encoding='utf-8') as ficheiro:
        return json.load(ficheiro)

def preparar_pasta(pasta):
    dest = Path(pasta)
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir()

def guardar_pagina(caminho, conteudo):
    with open(caminho, 'w', encoding='utf-8') as fich:
        fich.write(conteudo)

def montar_pagina(titulo, corpo):
    return f'''<html>
<head>
    <title>{titulo}</title>
    <meta charset="utf-8"/>
</head>
<body>
{corpo}
</body>
</html>'''

def barra_navegacao(texto_titulo):
    return f'''<div style="display: flex; justify-content: space-between; align-items: center;">
     <h3>{texto_titulo}</h3>
     <a href="index.html">Voltar ao indice</a>
</div>'''

# -- Carregar dataset --

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(SCRIPT_DIR)

dados = carregar_dados('dataset_reparacoes.json')
lista_reparacoes = dados['reparacoes']
preparar_pasta('output')

# -- Página principal (index) --

corpo_index = '''<h3>Dados de possivel consulta</h3>
<hr/>
<ul>
    <li><a href="reparações.html">Reparações</a></li>
    <li><a href="intervenções.html">Intervenções</a></li>
    <li><a href="marcasmodelos.html">Marcas e Modelos</a></li>
</ul>'''
guardar_pagina('output/index.html', montar_pagina('Consulta', corpo_index))

# -- Página de todas as reparações --

por_data = sorted(lista_reparacoes, key=lambda r: r['data'], reverse=True)
items_rep = []
for rep in por_data:
    v = rep['viatura']
    texto = f"{rep['data']} - {rep['nome']} - nif:{rep['nif']} - {v['marca']} - {v['modelo']} - {rep['nr_intervencoes']} intervenções"
    items_rep.append(f'<li><a href="reparação_{v["matricula"]}.html">{texto}</a></li>')

corpo_rep = barra_navegacao('Reparações:') + '\n<ul>\n' + '\n'.join(items_rep) + '\n</ul>'
guardar_pagina('output/reparações.html', montar_pagina('Reparações', corpo_rep))

# -- Recolher intervenções únicas --

mapa_intervencoes = {}
for rep in lista_reparacoes:
    for interv in rep['intervencoes']:
        cod = interv['codigo']
        if cod not in mapa_intervencoes:
            mapa_intervencoes[cod] = interv

codigos_ordenados = sorted(mapa_intervencoes.keys())

# -- Página de todas as intervenções --

items_int = []
for cod in codigos_ordenados:
    nm = mapa_intervencoes[cod]['nome']
    items_int.append(f'<li><a href="intervenção_{cod}.html">{cod} - {nm}</a></li>')

corpo_int = barra_navegacao('Intervenções:') + '\n<ul>\n' + '\n'.join(items_int) + '\n</ul>'
guardar_pagina('output/intervenções.html', montar_pagina('Intervenções', corpo_int))

# -- Página de marcas e modelos --

contagem_marcas = {}
contagem_modelos = {}
modelos_por_marca = {}

for rep in lista_reparacoes:
    m = rep['viatura']['marca']
    mod = rep['viatura']['modelo']
    contagem_marcas[m] = contagem_marcas.get(m, 0) + 1
    if m not in modelos_por_marca:
        modelos_por_marca[m] = []
    if mod in modelos_por_marca[m]:
        contagem_modelos[mod] = contagem_modelos.get(mod, 0) + 1
    else:
        modelos_por_marca[m].append(mod)
        contagem_modelos[mod] = contagem_modelos.get(mod, 0) + 1

items_marcas = []
for m in sorted(contagem_marcas.keys()):
    items_marcas.append(f'<li>{m} - {contagem_marcas[m]} reparações</li>')

items_modelos = []
for m in sorted(modelos_por_marca.keys()):
    for mod in modelos_por_marca[m]:
        items_modelos.append(f'<li>{m} {mod} - {contagem_modelos[mod]} reparações</li>')

corpo_mm = barra_navegacao('Marcas') + '\n<ul>\n' + '\n'.join(items_marcas) + '\n</ul>'
corpo_mm += '\n<h3>Modelos</h3>\n<ul>\n' + '\n'.join(items_modelos) + '\n</ul>'
guardar_pagina('output/marcasmodelos.html', montar_pagina('Marcas e Modelos', corpo_mm))

# -- Páginas individuais de cada reparação --

for rep in lista_reparacoes:
    v = rep['viatura']
    mat = v['matricula']
    linhas_int = []
    for interv in rep['intervencoes']:
        linhas_int.append(f'<li><a href="intervenção_{interv["codigo"]}.html">{interv["codigo"]} - {interv["nome"]}</a></li>')

    tabela = f'''<table border="1">
    <tr><th>Data</th><td>{rep["data"]}</td></tr>
    <tr><th>Nome</th><td>{rep["nome"]}</td></tr>
    <tr><th>NIF</th><td>{rep["nif"]}</td></tr>
    <tr><th>Marca</th><td>{v["marca"]}</td></tr>
    <tr><th>Modelo</th><td>{v["modelo"]}</td></tr>
    <tr><th>Número de Intervenções</th><td>{rep["nr_intervencoes"]}</td></tr>
</table>
<h4>Intervenções</h4>
<ul>
''' + '\n'.join(linhas_int) + '\n</ul>'

    corpo_r = barra_navegacao(f'Reparação {mat}') + '\n' + tabela
    guardar_pagina(f'output/reparação_{mat}.html', montar_pagina(f'Reparação {mat}', corpo_r))

# -- Páginas individuais de cada intervenção --

for cod in codigos_ordenados:
    info = mapa_intervencoes[cod]
    linhas_rep = []
    for rep in lista_reparacoes:
        for iv in rep['intervencoes']:
            if iv['codigo'] == cod:
                v = rep['viatura']
                linhas_rep.append(f'<li><a href="reparação_{v["matricula"]}.html">{rep["data"]} - {rep["nome"]} - {v["marca"]}</a></li>')

    tabela = f'''<table border="1">
    <tr><th>Código</th><td>{cod}</td></tr>
    <tr><th>Nome</th><td>{info["nome"]}</td></tr>
    <tr><th>Descrição</th><td>{info["descricao"]}</td></tr>
</table>
<h4>Reparações em que foi utilizada:</h4>
<ul>
''' + '\n'.join(linhas_rep) + '\n</ul>'

    corpo_i = barra_navegacao(f'Intervenção {cod}') + '\n' + tabela
    guardar_pagina(f'output/intervenção_{cod}.html', montar_pagina(f'Intervenção {cod}', corpo_i))
