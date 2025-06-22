// --- 1. Importações e Configuração Inicial ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

// --- 2. Conexão com o Banco de Dados ---
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// Função para testar a conexão
async function testarConexao() {
  try {
    const conexao = await pool.getConnection();
    console.log('Banco de dados conectado com sucesso!');
    conexao.release();
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
}

// --- 3. Rotas da API ---

// Rota principal
app.get('/', (req, res) => {
  res.json({ message: 'API do Gerenciador de Gastos está funcionando!' });
});

// Rota para CRIAR uma nova transação (Método POST)
app.post('/transacoes', async (req, res) => {
  try {
    const { descricao, valor, tipo, data_transacao, categoria } = req.body;
    if (!descricao || !valor || !tipo || !data_transacao) {
      return res.status(400).json({ error: 'Todos os campos (descrição, valor, tipo, data) são obrigatórios.' });
    }
    const sql = `
      INSERT INTO transacoes
      (descricao, valor, tipo, data_transacao, categoria)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [resultado] = await pool.query(sql, [descricao, valor, tipo, data_transacao, categoria]);
    res.status(201).json({
      message: 'Transação salva com sucesso!',
      id_da_nova_transacao: resultado.insertId
    });
  } catch (error) {
    console.error('Erro ao salvar transação:', error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao tentar salvar a transação.' });
  }
});

// Rota para LER TODAS as transações (Método GET)
app.get('/transacoes', async (req, res) => {
  try {
    const sql = 'SELECT * FROM transacoes ORDER BY data_transacao DESC';
    const [transacoes] = await pool.query(sql);
    res.status(200).json(transacoes);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao tentar buscar as transações.' });
  }
});

// Rota para LER um RESUMO FINANCEIRO (Método GET)
app.get('/resumo', async (req, res) => {
  try {
    const sql = 'SELECT tipo, SUM(valor) as total FROM transacoes GROUP BY tipo';
    const [grupos] = await pool.query(sql);
    let totalEntradas = 0;
    let totalSaidas = 0;
    for (const grupo of grupos) {
      if (grupo.tipo === 'ENTRADA') {
        totalEntradas = parseFloat(grupo.total);
      } else if (grupo.tipo === 'SAIDA') {
        totalSaidas = parseFloat(grupo.total);
      }
    }
    const balanco = totalEntradas - totalSaidas;
    const resumo = { totalEntradas, totalSaidas, balanco };
    res.status(200).json(resumo);
  } catch (error) {
    console.error('Erro ao buscar o resumo financeiro:', error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao tentar buscar o resumo.' });
  }
});

// Rota para DELETAR uma transação específica (Método DELETE)
app.delete('/transacoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM transacoes WHERE id = ?';
    const [resultado] = await pool.query(sql, [id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Transação não encontrada com o ID fornecido.' });
    }
    res.status(200).json({ message: 'Transação deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao tentar deletar a transação.' });
  }
});

// Rota para ATUALIZAR uma transação existente (Método PUT)
app.put('/transacoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const novosDados = req.body;
    const camposParaAtualizar = Object.keys(novosDados).map(chave => `${chave} = ?`).join(', ');
    if (camposParaAtualizar.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar foi fornecido.' });
    }
    const valores = [...Object.values(novosDados), id];
    const sql = `UPDATE transacoes SET ${camposParaAtualizar} WHERE id = ?`;
    const [resultado] = await pool.query(sql, valores);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Transação não encontrada com o ID fornecido.' });
    }
    res.status(200).json({ message: 'Transação atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao tentar atualizar a transação.' });
  }
});

// Rota para LER os gastos agrupados por categoria
app.get('/gastos-por-categoria', async (req, res) => {
  try {
    const sql = `
      SELECT categoria, SUM(valor) as total
      FROM transacoes
      WHERE tipo = 'SAIDA' AND categoria IS NOT NULL AND categoria != ''
      GROUP BY categoria
      ORDER BY total DESC
    `;
    const [resultado] = await pool.query(sql);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao buscar gastos por categoria:', error);
    res.status(500).json({ error: 'Erro ao buscar gastos por categoria.' });
  }
});


// --- 4. Inicialização do Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
  testarConexao();
});