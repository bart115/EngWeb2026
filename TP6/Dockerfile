# 1. Escolher a imagem de base do Node.js
FROM node:18 

# 2. Criar uma pasta para o projeto dentro do contentor
WORKDIR /usr/src/app

# 3. Copiar os ficheiros de configuração (package.json) e instalar dependências
COPY package*.json ./
RUN npm install

# 4. Copiar o resto de todo o teu código
COPY . .

# 5. Expor a porta que a tua app usa (16000)
EXPOSE 16000

# 6. Definir o comando para arrancar o projeto
CMD ["node", "app.js"]