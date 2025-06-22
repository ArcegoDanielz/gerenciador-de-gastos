// --- 1. Importações e Configuração Inicial ---

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa o framework Express
const express = require('express');
const cors = require('cors');

// Importa o driver do MySQL/MariaDB
const mysql = require('mysql2');

// Cria a aplicação Express
const app = express();

// Este é um "middleware". Uma ferramenta que ajuda o Express.
// Ele "ensina" o Express a ler e entender o formato JSON que virá no corpo das requisições.
app.use(express.json());
app.use(cors());

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
// Rota para LER TODAS as transações (Método GET)
app.get('/transacoes', async (req, res) => {
  // 'app.get' é usado para buscar/ler dados. É diferente do 'app.post' que é para criar.

  try {
    // 1. Montamos o comando SQL para selecionar os dados.
    // 'SELECT * FROM transacoes' significa: "Selecione TODAS as colunas (*) da tabela 'transacoes'".
    // 'ORDER BY data_transacao DESC' é um extra para ordenar o resultado, mostrando as
    // transações mais recentes primeiro. 'DESC' = Decrescente.
    const sql = 'SELECT * FROM transacoes ORDER BY data_transacao DESC';

    // 2. Executamos o comando no banco de dados. Como não estamos enviando dados variáveis (como no INSERT),
    // não precisamos do segundo argumento com os valores.
    const [transacoes] = await pool.query(sql);

    // 3. Se tudo deu certo, enviamos a lista de transações de volta como resposta.
    // O status 200 significa "OK", o padrão para uma requisição GET bem-sucedida.
    // A resposta será um array de objetos JSON, onde cada objeto é uma transação.
    res.status(200).json(transacoes);

  } catch (error) {
    // Se der algum erro ao tentar buscar no banco...
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao tentar buscar as transações.' });
  }
});
// Rota para LER um RESUMO FINANCEIRO (Método GET)
app.get('/resumo', async (req, res) => {
  try {
    // 1. Esta é uma consulta SQL mais avançada:
    // - SELECT tipo, SUM(valor) as total: Selecione a coluna 'tipo' e a SOMA da coluna 'valor'
    //   (e chame o resultado dessa soma de 'total').
    // - FROM transacoes: Da tabela 'transacoes'.
    // - GROUP BY tipo: Agrupe as linhas pelo 'tipo'. Isso faz com que o SUM(valor)
    //   calcule a soma para 'ENTRADA' e 'SAIDA' separadamente.
    const sql = 'SELECT tipo, SUM(valor) as total FROM transacoes GROUP BY tipo';

    const [grupos] = await pool.query(sql);

    // 2. O resultado de 'grupos' será um array, algo como:
    // [
    //   { tipo: 'ENTRADA', total: 5000.00 },
    //   { tipo: 'SAIDA', total: 7.50 }
    let totalEntradas = 0;
    let totalSaidas = 0;

    // 3. Vamos percorrer o array 'grupos' para pegar os totais.
    for (const grupo of grupos) {
      if (grupo.tipo === 'ENTRADA') {
        // O parseFloat é importante para garantir que o valor seja tratado como um número.
        totalEntradas = parseFloat(grupo.total);
      } else if (grupo.tipo === 'SAIDA') {
        totalSaidas = parseFloat(grupo.total);
      }
    }

    // 4. Calculamos o balanço final.
    const balanco = totalEntradas - totalSaidas;

    // 5. Montamos o objeto de resposta final.
    const resumo = {
      totalEntradas: totalEntradas,
      totalSaidas: totalSaidas,
      balanco: balanco
    };

    // 6. Enviamos o resumo como resposta JSON.
    res.status(200).json(resumo);

  } catch (error) {
    console.error('Erro ao buscar o resumo financeiro:', error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao tentar buscar o resumo.' });
  }
});
// Rota para DELETAR uma transação específica (Método DELETE)
app.delete('/transacoes/:id', async (req, res) => {
  // 'app.delete' é usado para remover um recurso.

  try {
    // 1. Pegamos o 'id' que vem na própria URL.
    // O Express coloca os parâmetros da URL (como o :id) dentro de 'req.params'.
    const { id } = req.params;

    // 2. Montamos o comando SQL para deletar.
    // 'DELETE FROM transacoes WHERE id = ?' significa: "Delete da tabela 'transacoes'
    // a linha ONDE a coluna 'id' for igual ao valor que vamos passar".
    const sql = 'DELETE FROM transacoes WHERE id = ?';

    // 3. Executamos o comando no banco de dados, passando o id que recebemos.
    const [resultado] = await pool.query(sql, [id]);

    // 4. O 'resultado' nos diz quantas linhas foram afetadas.
    // Se 'affectedRows' for 0, significa que não encontramos nenhuma transação com aquele id.
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Transação não encontrada com o ID fornecido.' });
    }

    // 5. Se 'affectedRows' for maior que 0 (geralmente 1), a deleção foi um sucesso.
    res.status(200).json({ message: 'Transação deletada com sucesso!' });
    // Algumas APIs respondem com status 204 (No Content), que significa sucesso mas sem
    // corpo de resposta. Ambas as abordagens (200 com mensagem ou 204) são válidas.

  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao tentar deletar a transação.' });
  }
});
// Rota para ATUALIZAR uma transação existente (Método PUT)
app.put('/transacoes/:id', async (req, res) => {
  // 'app.put' é usado para atualizar um recurso completamente.
  // Outra opção seria o 'app.patch', que é semanticamente usado para atualizações parciais.
  // Para nosso caso, PUT funciona perfeitamente.

  try {
    // 1. Pegamos o ID da URL e os novos dados do corpo da requisição.
    const { id } = req.params;
    const novosDados = req.body;

    // 2. Precisamos montar a consulta SQL dinamicamente, atualizando apenas os campos
    // que foram enviados na requisição.
    // 'Object.keys(novosDados)' cria um array com os nomes das chaves (ex: ['descricao', 'valor']).
    // '.map(chave => `${chave} = ?`)' transforma cada chave em "chave = ?".
    // '.join(', ') junta tudo com vírgulas.
    const camposParaAtualizar = Object.keys(novosDados)
      .map(chave => `${chave} = ?`)
      .join(', ');

    // Se o usuário não enviou nenhum dado para atualizar, não há o que fazer.
    if (camposParaAtualizar.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar foi fornecido.' });
    }

    // 'Object.values(novosDados)' pega apenas os valores correspondentes.
    const valores = [...Object.values(novosDados), id];

    // 3. Montamos o comando SQL final.
    const sql = `UPDATE transacoes SET ${camposParaAtualizar} WHERE id = ?`;

    // 4. Executamos a query no banco. Os valores no array 'valores' preencherão
    // os '?' na ordem correta.
    const [resultado] = await pool.query(sql, valores);

    // 5. Verificamos se alguma linha foi realmente afetada.
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Transação não encontrada com o ID fornecido.' });
    }

    res.status(200).json({ message: 'Transação atualizada com sucesso!' });

  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao tentar atualizar a transação.' });
  }
}); 
// --- 4. Inicialização do Servidor ---

// Inicia o servidor e, depois, testa a conexão com o banco
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
  testarConexao();
});