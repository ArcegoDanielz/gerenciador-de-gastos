import React from 'react';

// Este componente recebe o objeto 'resumo' como uma propriedade (prop).
function ResumoFinanceiro({ resumo }) {
  // Se o resumo ainda não foi carregado, não mostramos nada.
  if (!resumo) {
    return <div>Carregando resumo...</div>;
  }

  // Função para formatar os números como moeda brasileira (BRL)
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <div className="resumo-container">
      <h2>Resumo Financeiro</h2>
      <div className="resumo-card" id="entradas">
        <h3>Entradas</h3>
        <p>{formatarMoeda(resumo.totalEntradas)}</p>
      </div>
      <div className="resumo-card" id="saidas">
        <h3>Saídas</h3>
        <p>{formatarMoeda(resumo.totalSaidas)}</p>
      </div>
      <div className="resumo-card" id="balanco">
        <h3>Balanço</h3>
        <p>{formatarMoeda(resumo.balanco)}</p>
      </div>
    </div>
  );
}

export default ResumoFinanceiro;