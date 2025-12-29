// api/api.js - VERSÃO CORRIGIDA E FUNCIONAL
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // 1. Verificação de domínio
  const origin = request.headers.get('origin') || request.headers.get('referer') || '';
  const allowedDomains = ['playjogosgratis.com'];
  const isAllowed = allowedDomains.some(domain => origin.includes(domain));
  
  // 2. Se não for permitido, retorna bloqueio
  if (!isAllowed && !origin.includes('localhost')) {
    const blockCode = `// ⚠️ ACESSO NEGADO ⚠️
    console.error("❌ Este jogo só está disponível em: https://playjogosgratis.com");
    
    document.addEventListener('DOMContentLoaded', function() {
      document.body.innerHTML = \`
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <h1 style="font-size: 2.5em; margin-bottom: 20px;">🎮 Acesso Restrito</h1>
            <p style="font-size: 1.2em;">
              Este jogo está disponível apenas em:<br>
              <strong style="font-size: 1.5em;">playjogosgratis.com</strong>
            </p>
            <button onclick="window.location.href='https://playjogosgratis.com/cacapalavras/'" 
              style="
                margin-top: 30px;
                padding: 15px 30px;
                background: white;
                border: none;
                border-radius: 25px;
                font-size: 1.1em;
                cursor: pointer;
                color: #764ba2;
                font-weight: bold;
              ">
              🔗 Ir para o Jogo Oficial
            </button>
          </div>
        </div>
      \`;
    });`;
    
    return new Response(blockCode, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
  
  // 3. SE FOR PERMITIDO, RETORNA O JOGO COMPLETO
  console.log(`✅ Permitido: ${origin}`);
  
  // 4. Código do jogo COMPLETO (cole seu código aqui)
  const gameCode = `// ============================================
// 🌟 CAÇA-PALAVRAS MÁGICO - VERSÃO PROTEGIDA
// ============================================

// Configurações
const LEVELS = {
    easy: { size: 6, words: 6, timeBonus: 5 },
    normal: { size: 8, words: 8, timeBonus: 3 },
    hard: { size: 10, words: 10, timeBonus: 2 }
};

const WORD_SETS = [
    { 
        theme: "ESCOLA 📚", 
        words: ["LIVRO", "LAPIS", "CADERNO", "ESCOLA", "AULA", "MESA","QUADRO", "ALUNO", "PROVA", "CANETA", "BORRACHA", "REGUA"] 
    },
    { 
        theme: "ANIMAIS 🦁", 
        words: ["GATO", "CACHORRO", "LEAO", "TIGRE", "URSO", "COELHO", "PATO", "ZEBRA", "ELEFANTE", "GIRAFA", "MACACO", "CORUJA"] 
    },
    { 
        theme: "FRUTAS 🍎", 
        words: ["MACA", "BANANA", "UVA", "LARANJA", "MANGA", "PERA", "MELAO", "ABACAXI", "MORANGO", "LIMÃO", "KIWI", "MELANCIA"] 
    },
    { 
        theme: "VEÍCULOS 🚗", 
        words: ["CARRO", "MOTO", "AVIAO", "NAVIO", "TREM", "ONIBUS", "BIKE", "BARCO", "CAMINHAO", "TAXI", "HELICOPTERO", "SUBWAY"] 
    },
    { 
        theme: "CORES 🎨", 
        words: ["AZUL", "VERDE", "AMARELO", "ROXO", "ROSA", "BRANCO", "PRETO", "LARANJA", "VERMELHO", "CINZA", "MARROM", "DOURADO"] 
    }
];

// Variáveis do jogo
let currentLevel = null;
let currentTheme = 0;
let currentWords = [];
let foundWords = [];
let gameGrid = [];
let wordPositions = [];
let isDragging = false;
let startCell = null;
let selectedCells = [];
let timerInterval = null;
let secondsElapsed = 0;
let size = 0;
let score = 0;
let combo = 0;
let hintsRemaining = 3;
let firstPlay = true;
let instructionTimeout = null;

// Elementos DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const gridContainer = document.getElementById('word-search-grid');
const wordListElement = document.getElementById('word-list');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const progressFill = document.getElementById('progress-fill');
const comboDisplay = document.getElementById('combo-display');
const comboCount = document.getElementById('combo-count');
const hintButton = document.getElementById('hint-button');
const starsContainer = document.getElementById('stars-container');
const tutorialOverlay = document.getElementById('tutorial-overlay');

// Função para mostrar tela
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// Função básica de tutorial
window.showTutorial = function() {
    document.getElementById('tutorial-overlay').classList.remove('hidden');
};

window.closeTutorial = function() {
    document.getElementById('tutorial-overlay').classList.add('hidden');
};

// Inicialização básica
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Caça-Palavras carregado com sucesso!');
    showScreen('start-screen');
    
    // Botões de tema
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            currentTheme = parseInt(this.dataset.theme);
        });
    });
    
    // Botões de nível - SIMPLIFICADO PARA TESTE
    document.querySelectorAll('[data-level]').forEach(btn => {
        btn.addEventListener('click', function() {
            const level = this.dataset.level;
            console.log('Iniciando nível:', level);
            showScreen('game-screen');
        });
    });
    
    // Botão de dica
    document.getElementById('hint-button').addEventListener('click', function() {
        console.log('Dica solicitada');
        alert('Funcionalidade de dica ativada!');
    });
    
    // Botão reset
    document.getElementById('reset-button').addEventListener('click', function() {
        if (confirm('Reiniciar jogo?')) {
            showScreen('start-screen');
        }
    });
    
    // Botão jogar novamente
    document.getElementById('play-again-button').addEventListener('click', function() {
        showScreen('start-screen');
    });
});

console.log('✅ Jogo Caça-Palavras carregado!');`;
  
  // 5. Retorna o código do jogo
  return new Response(gameCode, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
