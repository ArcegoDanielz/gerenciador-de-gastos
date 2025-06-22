import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Importa os nossos dois componentes filhos
import TransactionForm from './TransactionForm';
import ResumoFinanceiro from './ResumoFinanceiro'; // <-- Importa o novo componente
import './App.css';

function App() {
  const [transacoes, setTransacoes] = useState([]);
  const [resumo, setResumo] = useState(null); // <-- NOVO ESTADO: para guardar o resumo, começa como nulo.

  // Função para buscar a lista de transações
  const buscarTransacoes = async () => {
    try {
      const resposta = await axios.get('http://localhost:3001/transacoes');
      setTransacoes(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  };

  // <-- NOVA FUNÇÃO: para buscar os dados do resumo financeiro
  const buscarResumo = async () => {
    try {
      const resposta = await axios.get('http://localhost:3001/resumo');
      setResumo(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar resumo:", error);
    }
  };

  // O useEffect agora buscará tanto as transações quanto o resumo quando a página carregar.
  useEffect(() => {
    buscarTransacoes();
    buscarResumo();
  }, []);

  // Função para lidar com a adição de uma nova transação
  const handleTransactionAdded = () => {
    buscarTransacoes(); // Atualiza a lista
    buscarResumo();     // <-- IMPORTANTE: Atualiza o resumo também!
  };
  
  // Função para lidar com a exclusão de uma transação
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza de que deseja excluir esta transação?')) {
      try {
        await axios.delete(`http://localhost:3001/transacoes/${id}`);
        buscarTransacoes(); // Atualiza a lista
        buscarResumo();     // <-- IMPORTANTE: Atualiza o resumo também!
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
        alert('Ocorreu um erro ao tentar excluir a transação.');
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meu Gerenciador de Gastos</h1>

        {/* Renderiza o componente de Resumo, passando os dados do resumo como prop */}
        <ResumoFinanceiro resumo={resumo} />

        {/* Passamos a nova função handleTransactionAdded para o formulário */}
        <TransactionForm onTransactionAdded={handleTransactionAdded} />
        
        <hr />

        <h2>Lista de Transações</h2>
        <div className='lista-transacoes'>
          {transacoes.map(transacao => (
            <div key={transacao.id} className='transacao-item'>
              <span>{transacao.descricao} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transacao.valor)} ({transacao.tipo})</span>
              <button onClick={() => handleDelete(transacao.id)}>Excluir</button>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;