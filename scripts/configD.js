// configM.js
// Array de caminhos de imagens disponíveis para o jogo
export const imagens = [
  'imagens/1.jpeg',
  'imagens/2.jpeg',
  'imagens/3.jpeg',
  'imagens/4.jpeg',
  'imagens/5.jpeg',
  'imagens/6.jpeg',
  'imagens/7.jpeg',
  'imagens/8.jpeg',
  'imagens/9.jpeg',
  'imagens/10.jpeg',
  'imagens/11.jpeg',
  'imagens/12.jpeg'
];

// Array de imagens duplicadas
export const imagensDuplicadas = [...imagens, ...imagens];

// Contêiner do jogo no HTML
export const containerDoJogo = document.getElementById('game-container');

// Marcador de pontuação no HTML
export const elementoPontuacao = document.getElementById('score');

// Contador de movimentos no HTML
export const elementoMovimentos = document.getElementById('moves');

// Função para embaralhar o array 
export const embaralharArray = array => array.sort(() => Math.random() - 0.5);