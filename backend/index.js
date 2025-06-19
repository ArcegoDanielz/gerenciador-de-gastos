// --- 1. Importações e Configuração Inicial ---

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa o framework Express
const express = require('express');

// Importa o driver do MySQL/MariaDB
const mysql = require('mysql2');

// Cria a aplicação Express
const app = express();

// Este é um "middleware". Uma ferramenta que ajuda o Express.
// Ele "ensina" o Express a ler e entender o formato JSON que virá no corpo das requisições.
app.use(express.json());

// Define a porta do servidor, pegando do .env ou usando 3001 como padrão
const PORT = process.env.PORT || 3001;


// --- 2. Conexão com o Banco de Dados ---

// Cria um "pool" de conexões. É mais eficiente que criar uma conexão nova a cada vez.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise(); // Adiciona o .promise() para usarmos uma sintaxe mais moderna (async/await)

// Função para testar a conexão ao iniciar o servidor
async function testarConexao() {
  try {
    // Tenta pegar uma conexão do pool
    const conexao = await pool.getConnection();
    console.log('Banco de dados conectado com sucesso!');
    // Libera a conexão de volta para o pool
    conexao.release();
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
}


// --- 3. Rotas da API ---

// Rota principal para testar se o servidor está no ar
app.get('/', (req, res) => {
  res.json({ message: 'API do Gerenciador de Gastos está funcionando!' });
});

// Adicione outras rotas aqui no futuro...
// Rota para CRIAR uma nova transação (Método POST)
app.post('/transacoes', async (req, res) => {
  // O 'async' na frente da função nos permite usar o 'await' dentro dela,
  // que espera o banco de dados responder antes de continuar.

  console.log('Recebemos dados para salvar:', req.body); // Ótimo para depurar!

  try {
    // 1. Pegamos os dados que o Postman nos enviou. Eles vêm dentro de 'req.body'.
    const { descricao, valor, tipo, data_transacao, categoria } = req.body;

    // 2. Uma validação simples para garantir que os campos essenciais foram enviados.
    if (!descricao || !valor || !tipo || !data_transacao) {
      // Se faltar algum, enviamos uma resposta de erro.
      return res.status(400).json({ error: 'Todos os campos (descrição, valor, tipo, data) são obrigatórios.' });
    }

    // 3. Montamos o comando SQL para inserir os dados na tabela.
    // Usamos '?' para evitar um tipo de ataque hacker chamado "SQL Injection".
    // O driver 'mysql2' vai substituir os '?' pelos valores do array, de forma segura.
    const sql = `
      INSERT INTO transacoes
      (descricao, valor, tipo, data_transacao, categoria)
      VALUES (?, ?, ?, ?, ?)
    `;

    // 4. Executamos o comando no banco de dados, passando os valores.
    const [resultado] = await pool.query(sql, [descricao, valor, tipo, data_transacao, categoria]);

    // 5. Se tudo deu certo, enviamos uma resposta de sucesso!
    // O status 201 significa "Created" (Criado), o que é perfeito para um POST.
    // Enviamos de volta o ID que o banco de dados acabou de criar para a nova transação.
    res.status(201).json({
      message: 'Transação salva com sucesso!',
      id_da_nova_transacao: resultado.insertId
    });

  } catch (error) {
    // Se qualquer coisa no bloco 'try' der errado, o código pula para cá.
    console.error('Erro ao salvar transação:', error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao tentar salvar a transação.' });
  }
});


// --- 4. Inicialização do Servidor ---

// Inicia o servidor e, depois, testa a conexão com o banco
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
  testarConexao();
});