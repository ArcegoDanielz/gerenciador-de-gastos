# 💸 Gerenciador de Gastos com IA

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

## 📝 Descrição

Este é um projeto Fullstack de um Gerenciador de Gastos Pessoais. A aplicação permite que o usuário registre, visualize, delete e analise suas finanças através de um dashboard interativo. O objetivo principal é criar um portfólio robusto que demonstre a integração entre backend, frontend e, futuramente, serviços de Inteligência Artificial para fornecer sugestões de melhoria.

---

## 📸 Visualização

![alt text](image.png)

---

## ✨ Features (Funcionalidades)

- [x] **Backend:** API REST completa com Node.js e Express.
- [x] **Backend:** Conexão com banco de dados MariaDB.
- [x] **Backend:** Rotas CRUD completas para gerenciar transações (`Criar`, `Ler`, `Atualizar`, `Deletar`).
- [x] **Backend:** Rota para retornar o balanço financeiro (`/resumo`).
- [x] **Backend:** Rota para retornar gastos agrupados por categoria (`/gastos-por-categoria`).
- [x] **Frontend:** Interface reativa construída com React.
- [x] **Frontend:** Formulário para adicionar novas transações com atualização automática da lista.
- [x] **Frontend:** Funcionalidade para excluir transações com atualização automática.
- [x] **Frontend:** Dashboard com resumo financeiro (Entradas, Saídas, Balanço).
- [x] **Frontend:** Gráfico de pizza para visualização de despesas por categoria.
- [ ] **IA:** Integração com a API do Gemini para análise e sugestões de gastos.
- [ ] **Frontend:** Funcionalidade para editar uma transação existente.

---

## 🛠️ Tecnologias Utilizadas

As seguintes ferramentas e tecnologias foram usadas na construção do projeto:

#### **Backend**
- **[Node.js](https://nodejs.org/en/)**
- **[Express.js](https://expressjs.com/pt-br/)**
- **[MariaDB](https://mariadb.org/)**
- **[Axios](https://axios-http.com/)**
- **[CORS](https://www.npmjs.com/package/cors)**
- **[Nodemon](https://www.npmjs.com/package/nodemon)**
- **[Dotenv](https://www.npmjs.com/package/dotenv)**

#### **Frontend**
- **[React.js](https://react.dev/)**
- **[Chart.js](https://www.chartjs.org/)**
- **[React Chart.js 2](https://react-chartjs-2.js.org/)**

---

## ⚙️ Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o projeto em sua máquina.

#### **Pré-requisitos**
Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/)
- Um gerenciador de banco de dados como [HeidiSQL](https://www.heidisql.com/) ou [DBeaver](https://dbeaver.io/)

#### **1. Clone o Repositório**
```bash
git clone [https://github.com/ArcegoDanielz/gerenciador-de-gastos](https://github.com/ArcegoDanielz/gerenciador-de-gastos.git)
cd gerenciador-de-gastos
2. Configure o Backend
Abra um primeiro terminal.
<!-- end list -->

Bash

# Navegue para a pasta do backend
cd backend

# Instale as dependências
npm install

# Crie um arquivo .env na raiz do backend e configure suas variáveis de ambiente
# Use o .env.example como base
Configure seu banco de dados gerenciador_db e a tabela transacoes.
<!-- end list -->

Bash

# Rode o servidor do backend
npm run dev
O servidor backend estará rodando na porta 3001.

3. Configure o Frontend
Abra um segundo terminal, separado do primeiro.
<!-- end list -->

Bash

# A partir da pasta raiz do projeto, navegue para o frontend
cd frontend

# Instale as dependências
npm install

# Rode a aplicação React
npm start
A aplicação frontend abrirá automaticamente em seu navegador no endereço http://localhost:3000.

🔌 Estrutura da API (Endpoints)
Método	Rota	Descrição
POST	/transacoes	Cria uma nova transação.
GET	/transacoes	Lista todas as transações.
GET	/resumo	Retorna o resumo (entradas, saídas, balanço).
GET	/gastos-por-categoria	Retorna os gastos totais por categoria.
PUT	/transacoes/:id	Atualiza uma transação existente.
DELETE	/transacoes/:id	Deleta uma transação existente.

Exportar para as Planilhas
👨‍💻 Autor
Feito por [Daniel Arcego Babicz]