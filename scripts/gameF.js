// Importações
import { imagensDuplicadas, containerDoJogo, elementoPontuacao, elementoMovimentos, embaralharArray } from './configF.js';
import { Carta } from './cardF.js';

let cartasSelecionadas = [];
let paresCorrespondentes = 0;
let movimentos = 0;
let tempoRestante = 35;
let intervalo;

export const criarCarta = imagem => {
  const carta = new Carta(imagem, {
    virarCarta: virarCarta,
    elementoMovimentos: elementoMovimentos,
    elementoPontuacao: elementoPontuacao
  });
  return carta.elemento;
};

const formatarTempo = (segundos) => {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
};

export const virarCarta = (carta, imagem) => {
  if (tempoRestante === 35) {
    return; // Sai da função se o tempo for igual a 35
  }

  if (!carta.elemento.classList.contains('flipped') && cartasSelecionadas.length < 2) {
    carta.elemento.classList.add('flipped');
    cartasSelecionadas.push({ carta: carta, imagem: imagem });

    if (cartasSelecionadas.length === 2) {
      movimentos++;
      elementoMovimentos.textContent = `Movimentos: ${movimentos}`;
      setTimeout(verificarCorrespondencia, 500);
    }
  }
};


export const verificarCorrespondencia = () => {
  const [carta1, carta2] = cartasSelecionadas;

  if (carta1.imagem === carta2.imagem) {
    cartasSelecionadas = [];
    paresCorrespondentes++;
    elementoPontuacao.textContent = `Pontos: ${paresCorrespondentes}`;

    if (paresCorrespondentes === imagensDuplicadas.length / 2) {
      mostrarParabens();
    }
  } else {
    setTimeout(() => {
      carta1.carta.elemento.classList.remove('flipped');
      carta2.carta.elemento.classList.remove('flipped');
      cartasSelecionadas = [];
    }, 500);
  }
};

export const inicializarJogo = () => {
  cartasSelecionadas = [];
  paresCorrespondentes = 0;
  movimentos = 0;
  tempoRestante = 35;

  elementoPontuacao.textContent = 'Pontos: 0';
  elementoMovimentos.textContent = 'Movimentos: 0';

  containerDoJogo.innerHTML = ''; // Limpar o contêiner antes de adicionar novas cartas
  const imagensEmbaralhadas = embaralharArray(imagensDuplicadas);

  imagensEmbaralhadas.forEach(imagem => {
    const carta = criarCarta(imagem);
    containerDoJogo.appendChild(carta);
  });

  document.getElementById("valorTempo").textContent = formatarTempo(tempoRestante);
};

const mostrarParabens = () => {
  clearInterval(intervalo);
  const congratsModal = document.getElementById('congrats-modal');
  const congratsMessage = document.getElementById('congrats-message');
  congratsMessage.textContent = `Você encontrou todos os pares em ${movimentos} movimentos.`;
  congratsModal.style.display = 'block';

  document.getElementById("botaoIniciar").innerHTML = '<i class="fas fa-play"></i>';
  document.getElementById("botaoIniciar").disabled = false;
};

const fecharParabens = () => {
  const congratsModal = document.getElementById('congrats-modal');
  congratsModal.style.display = 'none';
};

const mostrarGameOver = () => {
  clearInterval(intervalo);
  const gameOverModal = document.getElementById('game-over-modal');
  const gameOverMessage = document.getElementById('game-over-message');
  gameOverMessage.textContent = `Você perdeu! Tente novamente.`;
  gameOverModal.style.display = 'block';

  document.getElementById("botaoIniciar").innerHTML = '<i class="fas fa-play"></i>';
  document.getElementById("botaoIniciar").disabled = false;
};

const fecharGameOver = () => {
  const gameOverModal = document.getElementById('game-over-modal');
  gameOverModal.style.display = 'none';
};

const voltarParaIndex = () => {
  window.location.href = 'index.html';
};

export const IniciarTempo = () => {
  const botaoIniciar = document.getElementById("botaoIniciar");

  if (botaoIniciar.disabled || tempoRestante !== 35|| modalVisivel()) return;

  botaoIniciar.innerHTML = '<i class="fas fa-pause"></i>';
  botaoIniciar.disabled = true;

  clearInterval(intervalo);
  document.getElementById("valorTempo").textContent = formatarTempo(tempoRestante);

  intervalo = setInterval(() => {
    tempoRestante--;
    document.getElementById("valorTempo").textContent = formatarTempo(tempoRestante);

    if (tempoRestante <= 0) {
      clearInterval(intervalo);
      mostrarGameOver();
    }
  }, 1000);
};

// Função auxiliar para verificar se algum modal está visível
const modalVisivel = () => {
  const congratsModal = document.getElementById('congrats-modal');
  const gameOverModal = document.getElementById('game-over-modal');
  
  return congratsModal.style.display === 'block' || gameOverModal.style.display === 'block';
};

export const VoltarTempo = () => {
  // Verifica se o botão de iniciar está mostrando o ícone de pausa
  const botaoIniciar = document.getElementById("botaoIniciar");
  if (botaoIniciar.innerHTML.includes('fa-pause')) {
    return; // Sai da função se o botão estiver mostrando o ícone de pausa
  }

  clearInterval(intervalo);
  tempoRestante = 35;
  document.getElementById("valorTempo").textContent = formatarTempo(tempoRestante);

  botaoIniciar.innerHTML = '<i class="fas fa-play"></i>';
  botaoIniciar.disabled = false;

  inicializarJogo();
};

window.fecharParabens = fecharParabens;
window.fecharGameOver = fecharGameOver;
window.voltarParaIndex = voltarParaIndex;
window.IniciarTempo = IniciarTempo;
window.VoltarTempo = VoltarTempo;

// Inicializa o jogo ao carregar a página
inicializarJogo();
