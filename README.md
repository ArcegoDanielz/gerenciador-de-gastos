# 💸 Gerenciador de Gastos com IA

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

## 📝 Descrição

Este é um projeto Fullstack de um Gerenciador de Gastos Pessoais. A aplicação permite que o usuário registre suas entradas e saídas financeiras e, futuramente, utilizará uma Inteligência Artificial para analisar os gastos e fornecer sugestões de melhoria. O objetivo principal é criar um portfólio robusto que demonstre a integração entre backend, frontend e serviços de IA.

---

## ✨ Features (Funcionalidades)

- [x] **Backend:** Estrutura inicial do servidor com Node.js e Express.
- [x] **Backend:** Conexão com banco de dados MariaDB.
- [x] **Backend:** Criação de rota para registrar novas transações (`POST /transacoes`).
- [ ] **Backend:** Criação de rotas para listar, atualizar e deletar transações.
- [ ] **Backend:** Criação de rota para retornar o balanço (total de entradas e saídas).
- [ ] **Frontend:** Desenvolvimento da interface para o usuário interagir com a aplicação.
- [ ] **IA:** Integração com a API do Gemini para análise e sugestões de gastos.

---

## 🛠️ Tecnologias Utilizadas

As seguintes ferramentas e tecnologias foram usadas na construção do projeto:

#### **Backend**
- **[Node.js](https://nodejs.org/en/)**
- **[Express.js](https://expressjs.com/pt-br/)**
- **[MariaDB](https://mariadb.org/)**
- **[Nodemon](https://www.npmjs.com/package/nodemon)**
- **[Dotenv](https://www.npmjs.com/package/dotenv)**

#### **Planejado para o Frontend e IA**
- **[React.js](https://react.dev/)**
- **[Chart.js](https://www.chartjs.org/)** (para gráficos)
- **[Google Gemini API](https://ai.google.dev/)**

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
git clone [https://github.com/ArcegoDanielz/gerenciador-de-gastos.git](https://github.com/ArcegoDanielz/gerenciador-de-gastos.git)
cd gerenciador-de-gastos

2. Configure o Backend
Bash

# Navegue para a pasta do backend
cd backend

# Instale as dependências do projeto
npm install
3. Configure o Banco de Dados
Certifique-se de que seu servidor MariaDB está rodando.
Crie um banco de dados com o nome gerenciador_db.
Crie a tabela transacoes executando o script SQL que está na seção abaixo ou que foi usado durante o desenvolvimento.
4. Configure as Variáveis de Ambiente
Na pasta backend, crie um arquivo chamado .env.
Copie o conteúdo do exemplo abaixo e cole no seu arquivo .env, substituindo os valores com suas credenciais do MariaDB.
<!-- end list -->

Snippet de código

# Arquivo .env.example

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=gerenciador_db
5. Rode o Servidor
Bash

npm run dev
O servidor backend estará rodando na porta 3001.
🔌 Estrutura da API (Endpoints)
Método	Rota	Descrição	Corpo da Requisição (Body)	Resposta de Sucesso (201)
POST	/transacoes	Cria uma nova transação.	{ "descricao", "valor", "tipo", "data_transacao", "categoria?" }	{ "message", "id_da_nova_transacao" }

Exportar para as Planilhas
👨‍💻 Autor
Feito por [Daniel Arcego BAbicz]


### **Passo 3: Salvar e Enviar para o GitHub**

Agora que seu `README.md` está pronto e salvo, vamos enviá-lo para o seu repositório online.

1.  **Abra o terminal** na pasta raiz do projeto (`gerenciador-de-gastos`).
2.  **Adicione o novo arquivo** para ser "preparado":

    ```powershell
    git add README.md
    ```

3.  **Faça o "commit"** com uma mensagem descritiva:

    ```powershell
    git commit -m "docs: Adiciona README inicial do projeto"
    ```
    *(Usar `docs:` no início é uma convenção para indicar que a alteração é na documentação).*

4.  **Envie para o GitHub:**

    ```powershell
    git push
    ```

Agora, atualize a página do seu repositório no GitHub. Você verá uma página inicial b