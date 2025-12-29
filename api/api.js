// api/api.js - VERSÃO SIMPLIFICADA E FUNCIONAL
export const config = { runtime: 'edge' };

export default async function handler(request) {
  console.log('✅ API chamada - retornando jogo completo');
  
  // Código COMPLETO do seu jogo (todo o JavaScript original)
  const gameCode = `// ============================================
// 🌟 CAÇA-PALAVRAS MÁGICO - VERSÃO COMPLETA
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

// =======================================================
// FUNÇÕES DE TUTORIAL (GLOBAIS)
// =======================================================

window.showTutorial = function() {
    tutorialOverlay.classList.remove('hidden');
    console.log('📖 Tutorial aberto');
};

window.closeTutorial = function() {
    tutorialOverlay.classList.add('hidden');
    console.log('📖 Tutorial fechado');
};

window.skipTutorial = function() {
    tutorialOverlay.classList.add('hidden');
    firstPlay = false;
    console.log('⏭️ Tutorial pulado');
};

// =======================================================
// FUNÇÕES DE UTILIDADE
// =======================================================

window.createParticles = function() {
    const particles = document.getElementById('particles');
    particles.innerHTML = '';
    const emojis = ['⭐', '🌟', '✨', '💫', '🎨', '🎪', '🎭', '🎨'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (8 + Math.random() * 4) + 's';
        particles.appendChild(particle);
    }
    console.log('✨ Partículas criadas');
};

function updateStars() {
    const stars = starsContainer.querySelectorAll('.star');
    const wordsFound = foundWords.length;
    const totalWords = currentWords.length;
    const percentage = (wordsFound / totalWords) * 100;
    
    stars.forEach((star, index) => {
        if (percentage >= (index + 1) * 33.33) {
            star.classList.add('earned');
        }
    });
}

// =======================================================
// GERAÇÃO DO JOGO
// =======================================================

function generateGrid(levelConfig) {
    size = levelConfig.size;
    const themeData = WORD_SETS[currentTheme];
    const availableWords = themeData.words.filter(word => word.length <= size);
    const shuffled = [...availableWords].sort(() => 0.5 - Math.random());
    currentWords = shuffled.slice(0, levelConfig.words);
    
    foundWords = [];
    gameGrid = Array(size).fill().map(() => Array(size).fill(''));
    wordPositions = [];
    score = 0;
    combo = 0;
    hintsRemaining = 3;
    
    currentWords.forEach(word => {
        placeWord(word);
    });
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!gameGrid[r][c]) {
                gameGrid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }
}

function placeWord(word) {
    const directions = [
        { dr: 0, dc: 1, name: 'horizontal' },
        { dr: 1, dc: 0, name: 'vertical' },
        { dr: 1, dc: 1, name: 'diagonal' },
        { dr: -1, dc: 1, name: 'diagonal-up' }
    ];
    
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < 500) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        let maxRow = size - 1;
        let maxCol = size - 1;
        
        if (dir.dr > 0) maxRow = size - word.length;
        if (dir.dr < 0) maxRow = word.length - 1;
        if (dir.dc > 0) maxCol = size - word.length;
        
        if (maxRow < 0 || maxCol < 0) {
            attempts++;
            continue;
        }
        
        const startRow = Math.floor(Math.random() * (maxRow + 1));
        const startCol = Math.floor(Math.random() * (maxCol + 1));
        
        if (canPlaceWord(word, startRow, startCol, dir)) {
            const positions = [];
            for (let i = 0; i < word.length; i++) {
                const r = startRow + (dir.dr * i);
                const c = startCol + (dir.dc * i);
                gameGrid[r][c] = word[i];
                positions.push({ row: r, col: c });
            }
            wordPositions.push({ word, positions, direction: dir });
            placed = true;
        }
        attempts++;
    }
}

function canPlaceWord(word, row, col, dir) {
    for (let i = 0; i < word.length; i++) {
        const r = row + (dir.dr * i);
        const c = col + (dir.dc * i);
        
        if (r < 0 || r >= size || c < 0 || c >= size) return false;
        if (gameGrid[r][c] && gameGrid[r][c] !== word[i]) return false;
    }
    return true;
}

function renderGrid() {
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = \`repeat(\${size}, 1fr)\`;
    
    const maxGridSize = Math.min(window.innerWidth * 0.85, 500);
    const cellSize = maxGridSize / size;
    gridContainer.style.width = \`\${cellSize * size}px\`;
    gridContainer.style.height = \`\${cellSize * size}px\`;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.textContent = gameGrid[r][c];
            cell.style.width = cell.style.height = \`\${cellSize}px\`;
            cell.style.fontSize = \`\${cellSize * 0.4}px\`;
            gridContainer.appendChild(cell);
        }
    }
}

function renderWordList() {
    wordListElement.innerHTML = '';
    currentWords.forEach(word => {
        const li = document.createElement('li');
        li.textContent = \`\${foundWords.includes(word) ? '✓' : '○'} \${word}\`;
        li.dataset.word = word;
        if (foundWords.includes(word)) {
            li.classList.add('found');
        }
        wordListElement.appendChild(li);
    });
    
    const themeName = WORD_SETS[currentTheme].theme;
    document.querySelector('#sidebar h3').textContent = \`🔎 \${themeName}\`;
}

function updateProgress() {
    const percentage = (foundWords.length / currentWords.length) * 100;
    progressFill.style.width = percentage + '%';
    progressFill.textContent = Math.round(percentage) + '%';
}

// =======================================================
// TEMPORIZADOR E PONTUAÇÃO
// =======================================================

function startTimer() {
    secondsElapsed = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
        const seconds = String(secondsElapsed % 60).padStart(2, '0');
        timerElement.innerHTML = \`⏰ \${minutes}:\${seconds}\`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function calculateScore(wordLength) {
    const baseScore = wordLength * 10;
    const timeBonus = currentLevel.timeBonus * Math.max(0, 180 - secondsElapsed);
    const comboBonus = combo * 50;
    return baseScore + timeBonus + comboBonus;
}

function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

// =======================================================
// EVENTOS DE MOUSE E TOUCH
// =======================================================

function getCellFromEvent(event) {
    let clientX, clientY;
    
    if (event.type.startsWith('touch')) {
        const touch = event.touches[0] || event.changedTouches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    
    const element = document.elementFromPoint(clientX, clientY);
    if (!element || !element.classList.contains('grid-cell')) return null;
    
    return {
        element,
        row: parseInt(element.dataset.row),
        col: parseInt(element.dataset.col)
    };
}

function handleStart(event) {
    event.preventDefault();
    const cell = getCellFromEvent(event);
    if (!cell || cell.element.classList.contains('found')) return;
    
    isDragging = true;
    startCell = cell;
    selectedCells = [cell];
    
    document.querySelectorAll('.grid-cell').forEach(c => {
        c.classList.remove('selected', 'error');
    });
    cell.element.classList.add('selected');
}

function handleMove(event) {
    if (!isDragging || !startCell) return;
    event.preventDefault();
    
    const endCell = getCellFromEvent(event);
    if (!endCell) return;
    
    document.querySelectorAll('.grid-cell:not(.found)').forEach(c => {
        c.classList.remove('selected');
    });
    
    const cells = getCellsInLine(startCell, endCell);
    selectedCells = cells.map(el => ({
        element: el,
        row: parseInt(el.dataset.row),
        col: parseInt(el.dataset.col)
    }));
    
    cells.forEach(cell => {
        if (!cell.classList.contains('found')) {
            cell.classList.add('selected');
        }
    });
}

function handleEnd(event) {
    if (!isDragging || !startCell) return;
    isDragging = false;
    event.preventDefault();
    
    const endCell = getCellFromEvent(event);
    
    if (!endCell || selectedCells.length < 2) {
        document.querySelectorAll('.grid-cell.selected').forEach(c => {
            c.classList.remove('selected');
        });
        startCell = null;
        selectedCells = [];
        return;
    }
    
    let extractedWord = '';
    selectedCells.forEach(cell => {
        extractedWord += cell.element.textContent;
    });
    
    const reversedWord = extractedWord.split('').reverse().join('');
    
    let matchedWord = null;
    let isReversed = false;
    
    for (let word of currentWords) {
        if (foundWords.includes(word)) continue;
        
        if (word === extractedWord) {
            matchedWord = word;
            break;
        } else if (word === reversedWord) {
            matchedWord = word;
            isReversed = true;
            break;
        }
    }
    
    if (matchedWord) {
        foundWords.push(matchedWord);
        combo++;
        
        selectedCells.forEach(cell => {
            cell.element.classList.remove('selected');
            cell.element.classList.add('found');
        });
        
        const points = calculateScore(matchedWord.length);
        updateScore(points);
        updateProgress();
        updateStars();
        renderWordList();
        checkWin();
    } else {
        combo = 0;
        selectedCells.forEach(cell => {
            cell.element.classList.remove('selected');
            cell.element.classList.add('error');
        });
        
        setTimeout(() => {
            selectedCells.forEach(cell => {
                cell.element.classList.remove('error');
            });
        }, 500);
    }
    
    startCell = null;
    selectedCells = [];
}

function getCellsInLine(start, end) {
    const cells = [];
    
    const deltaRow = end.row - start.row;
    const deltaCol = end.col - start.col;
    
    const absRow = Math.abs(deltaRow);
    const absCol = Math.abs(deltaCol);
    
    if (absRow !== 0 && absCol !== 0 && absRow !== absCol) {
        return [start.element];
    }
    
    const steps = Math.max(absRow, absCol);
    const stepRow = steps === 0 ? 0 : deltaRow / steps;
    const stepCol = steps === 0 ? 0 : deltaCol / steps;
    
    for (let i = 0; i <= steps; i++) {
        const r = start.row + Math.round(stepRow * i);
        const c = start.col + Math.round(stepCol * i);
        const cell = document.querySelector(\`.grid-cell[data-row="\${r}"][data-col="\${c}"]\`);
        if (cell) {
            cells.push(cell);
        }
    }
    
    return cells;
}

// =======================================================
// CONTROLE DO JOGO
// =======================================================

function startGame(level) {
    currentLevel = LEVELS[level];
    generateGrid(currentLevel);
    renderGrid();
    renderWordList();
    updateProgress();
    startTimer();
    
    scoreElement.textContent = '0';
    hintButton.textContent = '💡 Usar Dica (3)';
    hintButton.disabled = false;
    starsContainer.querySelectorAll('.star').forEach(s => s.classList.remove('earned'));
    
    showScreen('game-screen');
}

function checkWin() {
    if (foundWords.length === currentWords.length) {
        stopTimer();
        
        setTimeout(() => {
            showScreen('end-screen');
            document.getElementById('final-time').textContent = formatTime(secondsElapsed);
            document.getElementById('final-score').textContent = score;
            
            const starsFinal = document.querySelectorAll('#stars-final .star');
            starsFinal.forEach((star, index) => {
                setTimeout(() => star.classList.add('earned'), index * 300);
            });
        }, 1000);
    }
}

function resetGame() {
    stopTimer();
    showScreen('start-screen');
}

window.showScreen = function(screenId) {
    [startScreen, gameScreen, endScreen].forEach(el => el.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
};

function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return \`\${minutes}:\${seconds}\`;
}

// =======================================================
// EVENT LISTENERS
// =======================================================

// Seleção de tema
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        currentTheme = parseInt(this.dataset.theme);
    });
});

// Seleção de nível
document.querySelectorAll('[data-level]').forEach(btn => {
    btn.addEventListener('click', function() {
        const level = this.dataset.level;
        startGame(level);
    });
});

// Eventos da grade
gridContainer.addEventListener('mousedown', handleStart);
document.addEventListener('mousemove', handleMove);
document.addEventListener('mouseup', handleEnd);

// Eventos touch
gridContainer.addEventListener('touchstart', handleStart, { passive: false });
document.addEventListener('touchmove', handleMove, { passive: false });
document.addEventListener('touchend', handleEnd, { passive: false });

// Botões
hintButton.addEventListener('click', () => {
    useHint();
});

document.getElementById('reset-button').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja reiniciar o jogo?')) {
        resetGame();
    }
});

document.getElementById('play-again-button').addEventListener('click', () => {
    resetGame();
});

// =======================================================
// INICIALIZAÇÃO
// =======================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Caça-Palavras inicializando...');
    
    // Inicializar partículas
    createParticles();
    
    // Mostrar tela inicial
    showScreen('start-screen');
    
    console.log('✅ Jogo Caça-Palavras carregado com sucesso!');
});

// Ajusta tamanho da grade ao redimensionar
window.addEventListener('resize', () => {
    if (gameGrid.length > 0) {
        renderGrid();
    }
});

console.log('🚀 Jogo Caça-Palavras carregado da API!');`;

  // Retorna o código do jogo
  return new Response(gameCode, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
