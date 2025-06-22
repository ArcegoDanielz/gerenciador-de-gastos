import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Importa nosso novo componente de formulário
import TransactionForm from './TransactionForm';
import './App.css';

function App() {
  const [transacoes, setTransacoes] = useState([]);

  // Transformamos a lógica de buscar transações em uma função reutilizável.
  const buscarTransacoes = async () => {
    try {
      const resposta = await axios.get('http://localhost:3001/transacoes');
      setTransacoes(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    }
  };

  // O useEffect agora chama nossa função quando o componente monta.
  useEffect(() => {
    buscarTransacoes();
  }, []);
 
  // Função para lidar com a exclusão de uma transação
  const handleDelete = async (id) => {
    // Usamos um 'confirm' para dar uma chance ao usuário de cancelar a ação.
    if (window.confirm('Tem certeza de que deseja excluir esta transação?')) {
      try {
        // Faz a requisição DELETE para o backend, passando o ID da transação na URL.
        await axios.delete(`http://localhost:3001/transacoes/${id}`);
        
        // Após deletar com sucesso, chamamos a função buscarTransacoes novamente
        // para atualizar a lista na tela com os dados mais recentes do banco.
        buscarTransacoes();
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
        alert('Ocorreu um erro ao tentar excluir a transação.');
      }
    }
  };

  // O resto do seu código continua aqui (o useEffect, o return...)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meu Gerenciador de Gastos</h1>
        
        {/* Usamos nosso novo componente de formulário aqui. 
            Passamos a função 'buscarTransacoes' como uma propriedade (prop) para que o 
            formulário possa "avisar" o App para atualizar a lista após adicionar uma nova. */}
        <TransactionForm onTransactionAdded={buscarTransacoes} />

        <hr />

        <h2>Lista de Transações</h2>
        <div className='lista-transacoes'>
          {/* Usamos .map() para percorrer o array 'transacoes' */}
          {transacoes.map(transacao => (
            <div key={transacao.id} className='transacao-item'>
              <span>{transacao.descricao} - R$ {transacao.valor} ({transacao.tipo})</span>
              
              {/* Botão de Excluir */}
              <button onClick={() => handleDelete(transacao.id)}>
                Excluir
              </button>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;