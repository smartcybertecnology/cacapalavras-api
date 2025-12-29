// api/api.js - CÓDIGO COMPLETO DO JOGO COM VERIFICAÇÃO SERVIDOR
export default async function handler(request, response) {
    // OBTER O DOMÍNIO DE ORIGEM DA REQUISIÇÃO
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    
    // DOMÍNIOS PERMITIDOS (apenas seu domínio oficial)
    const ALLOWED_DOMAINS = [
        'https://playjogosgratis.com',
        'http://playjogosgratis.com',
        // Para desenvolvimento local, você pode adicionar:
        // 'http://localhost:3000',
        // 'http://localhost:5173',
    ];
    
    // VERIFICA SE A ORIGEM É PERMITIDA
    const isOriginAllowed = ALLOWED_DOMAINS.some(domain => 
        origin.includes(domain.replace(/https?:\/\//, ''))
    );
    
    // SE NÃO FOR O DOMÍNIO CORRETO, RETORNA CÓDIGO DE BLOQUEIO
    if (!isOriginAllowed) {
        console.log(`❌ Acesso bloqueado para: ${origin}`);
        
        return response.status(200)
            .setHeader('Content-Type', 'application/javascript')
            .send(`
                // ⚠️ ACESSO NEGADO - JOGO BLOQUEADO ⚠️
                console.error("❌ Este jogo só está disponível em: https://playjogosgratis.com");
                
                // Substitui toda a página por mensagem de erro
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', blockPage);
                } else {
                    blockPage();
                }
                
                function blockPage() {
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
                            z-index: 99999;
                        ">
                            <div>
                                <h1 style="font-size: 2.5em; margin-bottom: 20px;">🎮 Acesso Restrito</h1>
                                <p style="font-size: 1.2em;">
                                    Este jogo está disponível apenas em:<br>
                                    <strong style="font-size: 1.5em;">playjogosgratis.com</strong>
                                </p>
                                <p style="margin-top: 30px; opacity: 0.8;">
                                    Acesse o jogo oficial através do link abaixo:
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
                                        transition: transform 0.2s;
                                    "
                                    onmouseover="this.style.transform='scale(1.05)'"
                                    onmouseout="this.style.transform='scale(1)'"
                                >
                                    🔗 Ir para o Jogo Oficial
                                </button>
                            </div>
                        </div>
                    \`;
                    
                    // Bloqueia atalhos de desenvolvedor (apenas dificulta, não impede totalmente)
                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.shiftKey && e.key === 'J') || (e.ctrlKey && e.key === 'U')) {
                            e.preventDefault();
                            alert('Acesso ao desenvolvedor bloqueado neste jogo protegido.');
                            return false;
                        }
                    });
                    
                    document.addEventListener('contextmenu', function(e) {
                        e.preventDefault();
                        alert('Menu de contexto bloqueado.');
                        return false;
                    });
                    
                    // Tenta bloquear a aba de rede (dificulta inspeção)
                    Object.defineProperty(document, 'hidden', { value: true });
                    Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
                }
            `);
    }
    
    // ============================================
    // 🔥 SE FOR O DOMÍNIO CORRETO, ENVIA O JOGO COMPLETO
    // ============================================
    
    console.log(`✅ Acesso permitido para: ${origin}`);
    
    // CÓDIGO COMPLETO DO JOGO CAÇA-PALAVRAS
    const gameCode = `
// ============================================
// 🌟 CAÇA-PALAVRAS MÁGICO - VERSÃO PROTEGIDA
// ============================================
// Carregado dinamicamente da API - ${new Date().toISOString()}

// Configurações do jogo
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

// Elementos DOM (serão inicializados quando o DOM estiver pronto)
let startScreen, gameScreen, endScreen, gridContainer, wordListElement;
let timerElement, scoreElement, progressFill, comboDisplay, comboCount;
let hintButton, starsContainer, tutorialOverlay;

// =======================================================
// FUNÇÕES DE TUTORIAL
// =======================================================

function showTutorial() {
    if (tutorialOverlay) tutorialOverlay.classList.remove('hidden');
}

function closeTutorial() {
    if (tutorialOverlay) tutorialOverlay.classList.add('hidden');
}

function skipTutorial() {
    closeTutorial();
    firstPlay = false;
}

// =======================================================
// FUNÇÕES DE UTILIDADE
// =======================================================

function createParticles() {
    const particles = document.getElementById('particles');
    if (!particles) return;
    
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
}

function updateStars() {
    if (!starsContainer) return;
    
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
    if (!gridContainer) return;
    
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
    if (!wordListElement) return;
    
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
    const sidebarTitle = document.querySelector('#sidebar h3');
    if (sidebarTitle) sidebarTitle.textContent = \`🔎 \${themeName}\`;
}

function updateProgress() {
    if (!progressFill) return;
    
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
        if (timerElement) {
            const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
            const seconds = String(secondsElapsed % 60).padStart(2, '0');
            timerElement.innerHTML = \`⏰ \${minutes}:\${seconds}\`;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function calculateScore(wordLength) {
    const baseScore = wordLength * 10;
    const timeBonus = currentLevel ? currentLevel.timeBonus * Math.max(0, 180 - secondsElapsed) : 0;
    const comboBonus = combo * 50;
    return baseScore + timeBonus + comboBonus;
}

function updateScore(points) {
    score += points;
    if (scoreElement) scoreElement.textContent = score;
}

// =======================================================
// SISTEMA DE DICAS
// =======================================================

function useHint() {
    if (hintsRemaining <= 0 || !hintButton) return;
    
    const remainingWords = currentWords.filter(w => !foundWords.includes(w));
    if (remainingWords.length === 0) return;
    
    const targetWord = remainingWords[0];
    const wordData = wordPositions.find(wp => wp.word === targetWord);
    
    if (wordData) {
        hintsRemaining--;
        if (hintButton) {
            hintButton.textContent = \`💡 Usar Dica (\${hintsRemaining})\`;
            if (hintsRemaining === 0) hintButton.disabled = true;
        }
        
        // Destaca as duas primeiras letras
        wordData.positions.slice(0, 2).forEach((pos, index) => {
            const cell = document.querySelector(
                \`.grid-cell[data-row="\${pos.row}"][data-col="\${pos.col}"]\`
            );
            
            if (cell) {
                setTimeout(() => {
                    cell.classList.add('hint');
                    setTimeout(() => cell.classList.remove('hint'), 2000);
                }, index * 300);
            }
        });
    }
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
        // ACERTO!
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
        // ERRO!
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
    
    if (scoreElement) scoreElement.textContent = '0';
    if (hintButton) {
        hintButton.textContent = '💡 Usar Dica (3)';
        hintButton.disabled = false;
    }
    
    if (starsContainer) {
        starsContainer.querySelectorAll('.star').forEach(s => s.classList.remove('earned'));
    }
    
    showScreen('game-screen');
}

function checkWin() {
    if (foundWords.length === currentWords.length) {
        stopTimer();
        
        // Cria confetes (simulação simples)
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.background = ['#FFD700', '#FF69B4', '#87CEEB', '#7CFC00', '#FFA500', '#9370DB'][Math.floor(Math.random() * 6)];
                confetti.style.borderRadius = '50%';
                confetti.style.zIndex = '999';
                confetti.style.animation = 'confettiFall 3s linear';
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
        
        setTimeout(() => {
            showScreen('end-screen');
            const finalTime = document.getElementById('final-time');
            const finalScore = document.getElementById('final-score');
            
            if (finalTime) finalTime.textContent = formatTime(secondsElapsed);
            if (finalScore) finalScore.textContent = score;
            
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

function showScreen(screenId) {
    const screens = ['start-screen', 'game-screen', 'end-screen'];
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) targetScreen.classList.remove('hidden');
}

function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return \`\${minutes}:\${seconds}\`;
}

// =======================================================
// INICIALIZAÇÃO DO JOGO
// =======================================================

function initGame() {
    console.log('🎮 Inicializando Caça-Palavras Mágico...');
    
    // Inicializar referências aos elementos DOM
    startScreen = document.getElementById('start-screen');
    gameScreen = document.getElementById('game-screen');
    endScreen = document.getElementById('end-screen');
    gridContainer = document.getElementById('word-search-grid');
    wordListElement = document.getElementById('word-list');
    timerElement = document.getElementById('timer');
    scoreElement = document.getElementById('score');
    progressFill = document.getElementById('progress-fill');
    comboDisplay = document.getElementById('combo-display');
    comboCount = document.getElementById('combo-count');
    hintButton = document.getElementById('hint-button');
    starsContainer = document.getElementById('stars-container');
    tutorialOverlay = document.getElementById('tutorial-overlay');
    
    // Configurar event listeners
    if (gridContainer) {
        gridContainer.addEventListener('mousedown', handleStart);
        gridContainer.addEventListener('touchstart', handleStart, { passive: false });
    }
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd, { passive: false });
    
    // Botões de tema
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            currentTheme = parseInt(this.dataset.theme);
        });
    });
    
    // Botões de nível
    document.querySelectorAll('[data-level]').forEach(btn => {
        btn.addEventListener('click', function() {
            startGame(this.dataset.level);
        });
    });
    
    // Botão de dica
    if (hintButton) {
        hintButton.addEventListener('click', useHint);
    }
    
    // Botão de reset
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja reiniciar o jogo?')) {
                resetGame();
            }
        });
    }
    
    // Botão de jogar novamente
    const playAgainButton = document.getElementById('play-again-button');
    if (playAgainButton) {
        playAgainButton.addEventListener('click', resetGame);
    }
    
    // Criar partículas
    createParticles();
    
    // Mostrar tela inicial
    showScreen('start-screen');
    
    // Verificar se é a primeira vez para mostrar tutorial
    if (firstPlay) {
        setTimeout(() => {
            showTutorial();
        }, 1000);
    }
    
    console.log('✅ Jogo inicializado com sucesso!');
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

// Ajustar tamanho da grade ao redimensionar janela
window.addEventListener('resize', () => {
    if (gameGrid.length > 0) {
        renderGrid();
    }
});

// Exportar funções globais para acesso pelo HTML
window.showTutorial = showTutorial;
window.closeTutorial = closeTutorial;
window.showScreen = showScreen;
`;
    
    // Retorna o código do jogo
    return response.status(200)
        .setHeader('Content-Type', 'application/javascript')
        .setHeader('Cache-Control', 'public, max-age=3600')
        .send(gameCode);
}
