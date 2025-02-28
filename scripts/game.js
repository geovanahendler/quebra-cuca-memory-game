// Importações
import { imagensDuplicadas, containerDoJogo, elementoPontuacao, elementoMovimentos, embaralharArray } from './config.js';

// Importa a classe Carta
import { Carta } from './card.js';

// Array para armazenar as cartas selecionadas
let cartasSelecionadas = [];

// Armazenar o número de pares correspondentes
let paresCorrespondentes = 0;

// Armazenar o número de movimentos realizados
let movimentos = 0;

let tempoRestante = 50;
let intervalo;

// Criar uma nova carta com a imagem especificada
export const criarCarta = imagem => {
  // Nova instância da classe Carta
  const carta = new Carta(imagem, {
    // Passa as funções e elementos necessários para a carta
    virarCarta: virarCarta,
    elementoMovimentos: elementoMovimentos,
    elementoPontuacao: elementoPontuacao
  });
  // Retorna o elemento HTML da carta
  return carta.elemento;
};

export const virarCarta = (carta, imagem) => {
  if (tempoRestante === 50) {
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

// Função para verificar se as cartas selecionadas correspondem
export const verificarCorrespondencia = () => {
  // Desestrutura as cartas selecionadas em carta1 e carta2
  const [carta1, carta2] = cartasSelecionadas;

  // Verifica se as imagens das duas cartas são iguais
  if (carta1.imagem === carta2.imagem) {
    // Limpa o array de cartas selecionadas
    cartasSelecionadas = [];
    // Incrementa o número de pares correspondentes
    paresCorrespondentes++;
    // Atualiza o texto do elemento de pontuação
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
  tempoRestante = 50;

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

// Função para fechar o modal de parabéns
const fecharParabens = () => {
  const congratsModal = document.getElementById('congrats-modal');
  congratsModal.style.display = 'none';
};

// Função para mostrar o modal de game over
const mostrarGameOver = () => {
  clearInterval(intervalo);
  const gameOverModal = document.getElementById('game-over-modal');
  const gameOverMessage = document.getElementById('game-over-message');
  gameOverMessage.textContent = `Você perdeu! Tente novamente.`;
  gameOverModal.style.display = 'block';

  document.getElementById("botaoIniciar").innerHTML = '<i class="fas fa-play"></i>';
  document.getElementById("botaoIniciar").disabled = false;
};

// Função para fechar o modal de game over
const fecharGameOver = () => {
  const gameOverModal = document.getElementById('game-over-modal');
  gameOverModal.style.display = 'none';
};

const voltarParaIndex = () => {
  window.location.href = 'index.html'; // Redireciona para a página inicial
};

const formatarTempo = (segundos) => {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
};

export const IniciarTempo = () => {
  const botaoIniciar = document.getElementById("botaoIniciar");

  if (botaoIniciar.disabled || tempoRestante !== 50 || modalVisivel()) return;

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
  const botaoIniciar = document.getElementById("botaoIniciar");
  if (botaoIniciar.innerHTML.includes('fa-pause')) {
    return; // Sai da função se o botão estiver mostrando o ícone de pausa
  }

  clearInterval(intervalo);
  tempoRestante = 50;
  document.getElementById("valorTempo").textContent = formatarTempo(tempoRestante);

  botaoIniciar.innerHTML = '<i class="fas fa-play"></i>';
  botaoIniciar.disabled = false;

  inicializarJogo();
};

// Adicionando as funções ao objeto global para serem acessíveis no HTML
window.fecharParabens = fecharParabens;
window.fecharGameOver = fecharGameOver;
window.voltarParaIndex = voltarParaIndex;
window.IniciarTempo = IniciarTempo;
window.VoltarTempo = VoltarTempo;

// Inicializa o jogo ao carregar a página
inicializarJogo();
