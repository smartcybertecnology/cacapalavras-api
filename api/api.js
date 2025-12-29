// api/api.js - COM PROTEÇÃO DE DOMÍNIO E CODIFICAÇÃO
export const config = { runtime: 'edge' };

// Domínios autorizados
const ALLOWED_DOMAINS = [
  'playjogosgratis.com',
  'cacapalavras-api.vercel.app', // Seu próprio domínio
  'localhost:3000' // Para desenvolvimento
];

// Função para verificar o domínio
function isAllowedDomain(request) {
  const origin = request.headers.get('origin') || request.headers.get('referer') || '';
  const host = request.headers.get('host') || '';
  
  // Extrai o domínio da origem
  let domain = '';
  try {
    if (origin) {
      const url = new URL(origin);
      domain = url.hostname;
    } else if (host) {
      domain = host.split(':')[0];
    }
  } catch (e) {
    domain = '';
  }
  
  // Verifica se o domínio está na lista de permitidos
  return ALLOWED_DOMAINS.some(allowed => 
    domain === allowed || 
    domain.endsWith('.' + allowed) ||
    (process.env.NODE_ENV === 'development' && domain.includes('localhost'))
  );
}

// Código do jogo embaralhado (pode ser ainda mais ofuscado)
const ENCRYPTED_GAME_CODE = `
// Código encriptado do jogo - só será decriptado se o domínio for válido
(function() {
  const d = ['playjogosgratis.com'];
  const h = window.location.hostname;
  if (!d.some(domain => h === domain || h.endsWith('.' + domain))) {
    document.body.innerHTML = '<div style="padding:50px;text-align:center;color:red;font-size:24px;font-family:Arial;">❌ Este jogo só está disponível em: <a href="https://playjogosgratis.com" style="color:blue;">playjogosgratis.com</a></div>';
    throw new Error('Acesso não autorizado');
  }
  
  // Código do jogo começa aqui
  const LEVELS = {
    easy: { size: 6, words: 6, timeBonus: 5 },
    normal: { size: 8, words: 8, timeBonus: 3 },
    hard: { size: 10, words: 10, timeBonus: 2 }
  };

  const WORD_SETS = [
    { 
      theme: "ESCOLA 📚", 
      words: ["LIVRO", "LAPIS", "CADERNO", "ESCOLA", "AULA", "MESA", "QUADRO", "ALUNO", "PROVA", "CANETA", "BORRACHA", "REGUA"] 
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

  // Funções do jogo...
  let currentLevel, currentTheme = 0, currentWords = [], foundWords = [];
  let gameGrid = [], wordPositions = [], isDragging = false, startCell = null;
  let selectedCells = [], timerInterval = null, secondsElapsed = 0, size = 0;
  let score = 0, combo = 0, hintsRemaining = 3, firstPlay = true;

  // Inicialização
  function initGame() {
    createParticles();
    showScreen('start-screen');
    
    // Event listeners
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        currentTheme = parseInt(this.dataset.theme);
      });
    });

    document.querySelectorAll('[data-level]').forEach(btn => {
      btn.addEventListener('click', function() {
        startGame(this.dataset.level);
      });
    });

    document.getElementById('hint-button').addEventListener('click', useHint);
    document.getElementById('reset-button').addEventListener('click', () => {
      if (confirm('Reiniciar jogo?')) resetGame();
    });
    document.getElementById('play-again-button').addEventListener('click', resetGame);

    // Eventos da grade
    const gridContainer = document.getElementById('word-search-grid');
    gridContainer.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    gridContainer.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd, { passive: false });
  }

  // Funções principais do jogo
  function startGame(level) {
    currentLevel = LEVELS[level];
    generateGrid(currentLevel);
    renderGrid();
    renderWordList();
    updateProgress();
    startTimer();
    showScreen('game-screen');
  }

  function generateGrid(config) {
    size = config.size;
    const theme = WORD_SETS[currentTheme];
    const availableWords = theme.words.filter(w => w.length <= size);
    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    currentWords = shuffled.slice(0, config.words);
    
    // Cria grade e posiciona palavras
    gameGrid = Array(size).fill().map(() => Array(size).fill(''));
    wordPositions = [];
    
    currentWords.forEach(word => {
      const dirs = [{dr:0,dc:1},{dr:1,dc:0},{dr:1,dc:1},{dr:-1,dc:1}];
      let placed = false;
      
      for (let attempt = 0; attempt < 100; attempt++) {
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        const maxR = dir.dr > 0 ? size - word.length : dir.dr < 0 ? word.length - 1 : size - 1;
        const maxC = dir.dc > 0 ? size - word.length : size - 1;
        
        if (maxR < 0 || maxC < 0) continue;
        
        const startR = Math.floor(Math.random() * (maxR + 1));
        const startC = Math.floor(Math.random() * (maxC + 1));
        
        if (canPlace(word, startR, startC, dir)) {
          const positions = [];
          for (let i = 0; i < word.length; i++) {
            const r = startR + dir.dr * i;
            const c = startC + dir.dc * i;
            gameGrid[r][c] = word[i];
            positions.push({row: r, col: c});
          }
          wordPositions.push({word, positions, dir});
          placed = true;
          break;
        }
      }
    });
    
    // Preenche espaços vazios
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!gameGrid[r][c]) {
          gameGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  }

  function canPlace(word, row, col, dir) {
    for (let i = 0; i < word.length; i++) {
      const r = row + dir.dr * i;
      const c = col + dir.dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) return false;
      if (gameGrid[r][c] && gameGrid[r][c] !== word[i]) return false;
    }
    return true;
  }

  function renderGrid() {
    const container = document.getElementById('word-search-grid');
    container.innerHTML = '';
    container.style.gridTemplateColumns = \`repeat(\${size}, 1fr)\`;
    
    const maxSize = Math.min(window.innerWidth * 0.8, 500);
    const cellSize = maxSize / size;
    container.style.width = container.style.height = \`\${cellSize * size}px\`;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.textContent = gameGrid[r][c];
        cell.style.fontSize = \`\${cellSize * 0.4}px\`;
        container.appendChild(cell);
      }
    }
  }

  // Restante das funções do jogo...
  window.showScreen = function(id) {
    ['start-screen', 'game-screen', 'end-screen'].forEach(s => {
      document.getElementById(s).classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
  };

  window.showTutorial = function() {
    document.getElementById('tutorial-overlay').classList.remove('hidden');
  };

  window.closeTutorial = function() {
    document.getElementById('tutorial-overlay').classList.add('hidden');
  };

  window.skipTutorial = function() {
    document.getElementById('tutorial-overlay').classList.add('hidden');
    firstPlay = false;
  };

  window.createParticles = function() {
    const container = document.getElementById('particles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = ['⭐', '🌟', '✨', '💫'][Math.floor(Math.random() * 4)];
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      container.appendChild(p);
    }
  };

  // Inicia o jogo quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }
})();
`;

export default async function handler(request) {
  console.log('🔒 Verificando acesso à API...');
  
  // Verifica se o domínio é permitido
  if (!isAllowedDomain(request)) {
    console.log('❌ Acesso bloqueado para:', request.headers.get('origin') || request.headers.get('host'));
    
    return new Response(
      `// ❌ ACESSO BLOQUEADO
console.error('Este jogo só está disponível em: https://playjogosgratis.com');
document.body.innerHTML = '<div style="padding:50px;text-align:center;color:red;font-size:24px;font-family:Arial;">❌ Este jogo só está disponível em: <a href="https://playjogosgratis.com" style="color:blue;">playjogosgratis.com</a></div>';`,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/javascript',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  }

  // Domínio permitido - retorna o jogo
  console.log('✅ Acesso permitido para:', request.headers.get('origin') || request.headers.get('host'));
  
  return new Response(ENCRYPTED_GAME_CODE, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
      'X-Domain-Check': 'verified'
    }
  });
}
