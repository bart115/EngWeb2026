import json, os, shutil

def open_json(filename):
    with open(filename, encoding='utf-8') as f:
        data = json.load(f)
    return data

def mk_dir(relative_path):
    if not os.path.exists(relative_path):
        os.mkdir(relative_path)
    else:
        shutil.rmtree(relative_path)
        os.mkdir(relative_path)

def new_file(filename, content):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
        
# ---------------Script Principal----------------- #

html = f'''
<html>
    <head>
        <title>Consulta</title>
        <meta charset="utf-8"/>
    </head>
    
    <body>
        <h3>Dados de possivel consulta</h3>
        <hr/>
        <ul>
            <li><a href="reparações.html">Reparações</a></li>
            <li><a href="intervenções.html">Intervenções</a></li>
            <li><a href="marcasmodelos.html">Marcas e Modelos</a></li>
        </ul>    
    </body>

</html>
'''
mk_dir('output')
new_file('output/index.html', html)

# --------------- Script Reparações ----------------- #

data = open_json('dataset_reparacoes.json')

reparacoes = data['reparacoes']
reparacoes_ordenadas = sorted(reparacoes, key=lambda x: x['data'], reverse=True)

lista_links = ""
for reparacao in reparacoes_ordenadas:
    data = reparacao['data']
    nome = reparacao['nome']
    nif = reparacao['nif']
    marca = reparacao['viatura']['marca']
    modelo = reparacao['viatura']['modelo']
    matricula = reparacao['viatura']['matricula']
    nr_intervencoes = reparacao['nr_intervencoes'] 
    lista_links += f'''
    <li><a href="reparação_{matricula}.html">{data} - {nome} - nif:{nif} - {marca} - {modelo} - {nr_intervencoes} intervenções</a></li>
    '''

html = f'''
<html>
    <head>
        <title>Reparações</title> 
        <meta charset="utf-8"/>
    </head>
    <body>
        <div style="display: flex; justify-content: space-between; align-items: center;">
             <h3>Reparações:</h3>
             <a href="index.html">Voltar ao indice</a>
        </div>
        <ul>
            {lista_links}
        </ul>
    </body>
</html>
'''
new_file('output/reparações.html', html)

# --------------- Script Intervenções ----------------- #

intervencoes = []
for reparacao in reparacoes:
    for intervencao in reparacao['intervencoes']:
        if intervencao not in intervencoes:
            intervencoes.append(intervencao)
            
intervencoes_ordenadas = sorted(intervencoes, key=lambda x: x['codigo'])
lista_links2 = ""
for intervencao in intervencoes_ordenadas:
    codigo = intervencao['codigo']
    nome = intervencao['nome']
    lista_links2 += f'''
    <li><a href="intervenção_{codigo}.html">{codigo} - {nome}</a></li>
    '''
html = f'''
<html>
    <head>
        <title>Intervenções</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <div style="display: flex; justify-content: space-between; align-items: center;">
             <h3>Intervenções:</h3>
             <a href="index.html">Voltar ao indice</a>
        </div>
        <ul>
            {lista_links2}
        </ul>
    </body>
</html>
'''
new_file('output/intervenções.html', html)

# --------------- Script Marcas e Modelos ----------------- #
marcas = []
modelos = {}
contador = {}
for reparacao in reparacoes:
    marca = reparacao['viatura']['marca']
    if marca not in marcas:
        marcas.append(marca)
        contador[marca] = 1
    else:
        contador[marca] += 1
    modelo = reparacao['viatura']['modelo']
    if marca not in modelos:
        modelos[marca] = []
    if modelo not in modelos[marca]:
        modelos[marca] += [modelo]
        contador[modelo] = 1
    else:
        contador[modelo] += 1
marcas_ordenadas = sorted(marcas)
modelos_ordenados = sorted(modelos)
lista_links3 = ""
for marca in marcas_ordenadas:
    lista_links3 += f'''
    <li>{marca} - {contador[marca]} reparações</li>
    '''
lista_links4 = ""
for marca in modelos_ordenados:
    for modelo in modelos[marca]:
        lista_links4 += f'''
        <li>{marca} {modelo} - {contador[modelo]} reparações</li>
        '''

html = f'''
<html>
    <head>
        <title>Marcas e Modelos</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <div style="display: flex; justify-content: space-between; align-items: center;">
             <h3>Marcas</h3>
             <a href="index.html">Voltar ao indice</a>
        </div>
        <ul>
            {lista_links3}
        </ul>
        <h3>Modelos</h3>
        <ul>
            {lista_links4}
        </ul>
        
    </body>
</html>
'''
new_file('output/marcasmodelos.html', html)

# --------------- Script de 1 Reparação ----------------- #
for reparacao in reparacoes:
    data = reparacao['data']
    nome = reparacao['nome']
    nif = reparacao['nif']
    matricula = reparacao['viatura']['matricula']
    marca = reparacao['viatura']['marca']
    modelo = reparacao['viatura']['modelo']
    nr_intervencoes = reparacao['nr_intervencoes'] 
    lista_intervencoes = ""
    for intervencao in reparacao['intervencoes']:
        codigo = intervencao['codigo']
        nome_intervencao = intervencao['nome']
        lista_intervencoes += f'''
        <li><a href="intervenção_{codigo}.html">{codigo} - {nome_intervencao}</a></li>
        '''
    html = f'''
    <html>
        <head>
            <title>Reparação {matricula}</title>
            <meta charset="utf-8"/>
        </head>
        <body>
        <div style="display: flex; justify-content: space-between; align-items: center;">
             <h3>Reparação {matricula}</h3>
             <a href="index.html">Voltar ao indice</a>
        </div>
            <table border="1">
                <tr>
                    <th>Data</th>
                    <td>{data}</td>
                </tr>
                <tr>
                    <th>Nome</th>
                    <td>{nome}</td>
                </tr>
                <tr>
                    <th>NIF</th>
                    <td>{nif}</td>
                </tr>
                <tr>
                    <th>Marca</th>
                    <td>{marca}</td>
                </tr>
                <tr>
                    <th>Modelo</th>
                    <td>{modelo}</td>
                </tr>
                <tr>
                    <th>Número de Intervenções</th>
                    <td>{nr_intervencoes}</td>
                </tr>
            </table>
            <h4>Intervenções</h4>
            <ul>
                {lista_intervencoes}
            </ul>
        </body>
    </html>
    '''
    new_file(f'output/reparação_{matricula}.html', html)
    
    
# --------------- Script de 1 Intervenção ----------------- #
for intervencao in intervencoes:
    codigo = intervencao['codigo']
    nome = intervencao['nome']
    descricao = intervencao['descricao']
    lista_reparacoes = ""
    for reparacao in reparacoes:
        for interv in reparacao['intervencoes']:
            if interv['codigo'] == codigo:
                nome_reparacao = reparacao['nome']
                matricula = reparacao['viatura']['matricula']
                marca = reparacao['viatura']['marca']
                lista_reparacoes += f'''
                <li><a href="reparação_{matricula}.html">{reparacao['data']} - {nome_reparacao} - {marca}</a></li>
                '''
                
    html = f'''
    <html>
        <head>
            <title>Intervenção {codigo}</title>
            <meta charset="utf-8"/>
        </head>
        <body>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Intervenção {codigo}</h3>
                <a href="index.html">Voltar ao indice</a>
            </div>
            <table border="1">
                <tr>
                    <th>Código</th>
                    <td>{codigo}</td>
                </tr>
                <tr>
                    <th>Nome</th>
                    <td>{nome}</td>
                </tr>
                <tr>
                    <th>Descrição</th>
                    <td>{descricao}</td>
                </tr>
            </table>
            <h4>Reparações em que foi utilizada:</h4>
            <ul>
               {lista_reparacoes}
            </ul>
        </body>
    </html>
    '''
    new_file(f'output/intervenção_{codigo}.html', html)
