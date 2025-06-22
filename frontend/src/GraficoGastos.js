import React from 'react';
// Importa as ferramentas necessárias da biblioteca de gráficos
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Registra os componentes do gráfico que vamos usar
ChartJS.register(ArcElement, Tooltip, Legend);

function GraficoGastos({ dados }) {
  // Se não houver dados, não renderiza nada ou mostra uma mensagem
  if (!dados || dados.length === 0) {
    return <p>Não há dados de gastos por categoria para exibir.</p>;
  }

  // A biblioteca de gráficos espera os dados em um formato específico.
  // Precisamos transformar nosso array de dados (ex: [{categoria: 'Lazer', total: 100}])
  // em um objeto com 'labels' (os nomes) e 'datasets' (os valores).
  const data = {
    labels: dados.map(d => d.categoria), // ex: ['Lazer', 'Alimentação']
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: dados.map(d => d.total), // ex: [100, 350]
        backgroundColor: [ // Cores para cada fatia da pizza
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Renderiza o componente 'Pie' (pizza) da biblioteca, passando os dados formatados
  return (
    <div className="grafico-container">
      <h3>Gastos por Categoria</h3>
      <Pie data={data} />
    </div>
  );
}

export default GraficoGastos;