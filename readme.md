# API de Cards em Node.js

Este projeto fornece uma API RESTful em Node.js para gerenciamento de jogadores, cartas e decks, utilizando MySQL (via `mysql2/promise`) como banco de dados. A aplicação é inicializada com Express e utiliza variáveis de ambiente para configuração.

---

## ⚙️ Tecnologias Utilizadas

* Node.js
* Express
* mysql2 (Promise)
* dotenv
* MySQL / MariaDB

---

## 🚀 Instalação

1. Clone este repositório:

   ```bash
   git clone <URL-do-repositório>
   ```
2. Acesse a pasta do projeto:

   ```bash
   cd <nome-da-pasta>
   ```
3. Instale as dependências:

   ```bash
   npm install
   ```
4. Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente conforme o exemplo abaixo.

---

## 📦 Variáveis de Ambiente

```env
PORT=3000
CONNECTION_STRING=mysql://root:senha@localhost:3306/cards-db
```

* `PORT`: porta em que a aplicação irá escutar.
* `CONNECTION_STRING`: string de conexão para o banco MySQL.

---

## 🔧 Configuração do Banco de Dados

1. Garanta que o MySQL/MariaDB esteja rodando.
2. Crie o banco de dados:

   ```sql
   CREATE DATABASE `cards-db`;
   ```
3. Execute as migrations ou crie manualmente as tabelas (`player`, `card`, `player_has_card`, `deck`, `deck_card`) conforme seu modelo de dados.

---

## 🗂 Estrutura de Arquivos

```
├── db.js           # Camada de acesso ao banco (funções CRUD)
├── index.js        # Definição de rotas e inicialização do servidor
├── .env            # Variáveis de ambiente
└── package.json    # Dependências e scripts npm
```

---

## 📝 Endpoints da API

### Jogadores

* **POST** `/player`

  * Descrição: Cadastra um novo jogador.
  * Body (JSON): `{ "nick": "string", "password": "string" }`
  * Resposta: `200 OK`

* **GET** `/player`

  * Descrição: Autentica um jogador (login).
  * Body (JSON): `{ "nick": "string", "password": "string" }`
  * Resposta: Objeto do jogador ou mensagem de erro.

### Cartas

* **GET** `/card`

  * Descrição: Retorna todas as cartas disponíveis.
  * Resposta: `{ "result": [ ... ] }`

* **PATCH** `/card`

  * Descrição: Atualiza quantidade de cartas do jogador.
  * Body (JSON): `{ "idUser": number, "idCard": number, "cardCount": number }`
  * Resposta: `200 OK` (atualizado) ou `201 Created` (novo registro).

* **PATCH** `/cardlevel`

  * Descrição: Incrementa nível de uma carta do jogador.
  * Body (JSON): `{ "idUser": number, "idCard": number }`
  * Resposta: `200 OK`

* **GET** `/selectplayercard`

  * Descrição: Lista cartas do jogador, exceto as que estão em um deck.
  * Body (JSON): `{ "playerId": number, "idDeck": number }`
  * Resposta: `{ "result": [ ... ] }`

* **GET** `/noAvalibleCards`

  * Descrição: Retorna cartas não adquiridas pelo jogador.
  * Body (JSON): `{ "idUser": number }`
  * Resposta: Array de cartas.

### Decks

* **POST** `/deck`

  * Descrição: Cria ou retorna um deck para o jogador.
  * Body (JSON): `{ "idDeck": number, "mediumCost": number, "playerId": number }`
  * Resposta: Objeto do deck.

* **POST** `/deckCard`

  * Descrição: Adiciona carta a um deck.
  * Body (JSON): `{ "deck_idDeck": number, "Player_has_Card_Player_idUser": number, "Player_has_Card_Card_idCard": number, "position": number }`
  * Resposta: `201 Created`

* **GET** `/deck`

  * Descrição: Retorna todos os decks do jogador e suas cartas.
  * Body (JSON): `{ "playerId": number }`
  * Resposta: `{ "decks": [ { /* deck + cardList */ } ] }`

* **PATCH** `/deck`

  * Descrição: Insere carta em deck (mesma lógica de `/deckCard`).
  * Body (JSON): mesmo de `/deckCard`
  * Resposta: `200 OK`

### Root

* **GET** `/`

  * Descrição: Rota de teste para verificar saúde da API.
  * Resposta: `{ "message": "It's alive!" }`

---

## Como Executar

```bash
# Iniciar o servidor
npm start
# ou
node index.js
```

A API estará disponível em `http://localhost:<PORT>`.

---
