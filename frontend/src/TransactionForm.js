import React, { useState } from 'react';
import axios from 'axios';

// Componente do Formulário de Transação
// Ele recebe uma propriedade (prop) chamada 'onTransactionAdded' que será uma função
// para atualizar a lista de transações no componente principal (App.js).
function TransactionForm({ onTransactionAdded }) {
  // Usamos um único estado para guardar todos os dados do formulário.
  // Ele começa com os campos vazios.
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'SAIDA', // Valor padrão
    data_transacao: '',
    categoria: ''
  });

  // Esta função é chamada toda vez que o usuário digita em algum campo.
  const handleChange = (e) => {
    // 'e.target' é o elemento que disparou o evento (o input).
    // 'name' é o nome do input (ex: "descricao") e 'value' é o que foi digitado.
    const { name, value } = e.target;
    // Atualizamos o estado do formulário com o novo valor.
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Esta função é chamada quando o formulário é enviado.
  const handleSubmit = async (e) => {
    // Previne o comportamento padrão do formulário, que é recarregar a página.
    e.preventDefault();

    // Validação simples para garantir que os campos não estão vazios.
    if (!formData.descricao || !formData.valor || !formData.data_transacao) {
      alert('Por favor, preencha os campos obrigatórios: Descrição, Valor e Data.');
      return;
    }

    try {
      // Faz a requisição POST para o backend, enviando os dados do formulário.
      await axios.post('http://localhost:3001/transacoes', formData);
      
      // Se a requisição foi um sucesso, limpamos o formulário.
      setFormData({
        descricao: '',
        valor: '',
        tipo: 'SAIDA',
        data_transacao: '',
        categoria: ''
      });

      // Chamamos a função que foi passada como propriedade para avisar o App.js
      // que uma nova transação foi adicionada e a lista precisa ser atualizada.
      onTransactionAdded();

    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      alert('Ocorreu um erro ao tentar adicionar a transação.');
    }
  };

  // O JSX que define a aparência do formulário.
  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h3>Adicionar Nova Transação</h3>
      <input
        type="text"
        name="descricao"
        value={formData.descricao}
        onChange={handleChange}
        placeholder="Descrição"
        required
      />
      <input
        type="number"
        name="valor"
        value={formData.valor}
        onChange={handleChange}
        placeholder="Valor (ex: 50.75)"
        required
      />
      <input
        type="date"
        name="data_transacao"
        value={formData.data_transacao}
        onChange={handleChange}
        required
      />
      <select name="tipo" value={formData.tipo} onChange={handleChange}>
        <option value="SAIDA">Saída</option>
        <option value="ENTRADA">Entrada</option>
      </select>
      <input
        type="text"
        name="categoria"
        value={formData.categoria}
        onChange={handleChange}
        placeholder="Categoria (opcional)"
      />
      <button type="submit">Adicionar</button>
    </form>
  );
}

export default TransactionForm;