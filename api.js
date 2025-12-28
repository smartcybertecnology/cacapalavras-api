// api/api.js - CÓDIGO COMPLETO DO JOGO COM VERIFICAÇÃO SERVIDOR
export default async function handler(request, response) {
    // OBTER O DOMÍNIO DE ORIGEM DA REQUISIÇÃO
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    
    // DOMÍNIOS PERMITIDOS
    const ALLOWED_DOMAINS = [
        'https://playjogosgratis.com',
        'http://playjogosgratis.com',
        // Adicione outros subdomínios se necessário
    ];
    
    // VERIFICA SE A ORIGEM É PERMITIDA
    const isOriginAllowed = ALLOWED_DOMAINS.some(domain => 
        origin.includes(domain.replace(/https?:\/\//, ''))
    );
    
    // SE NÃO FOR O DOMÍNIO CORRETO, RETORNA CÓDIGO DE BLOQUEIO
    if (!isOriginAllowed) {
        console.log(`❌ Bloqueado: ${origin}`);
        
        // Retorna um arquivo JS que BLOQUEIA o jogo no cliente
        return response.status(200)
            .setHeader('Content-Type', 'application/javascript')
            .send(`
                // ⚠️ ACESSO NEGADO ⚠️
                console.error("❌ Este jogo só está disponível em: https://playjogosgratis.com");
                
                // Substitui toda a página por mensagem de erro
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
                                <p style="margin-top: 30px; opacity: 0.8;">
                                    Se você está acessando do domínio correto,<br>
                                    verifique se há algum bloqueador de scripts.
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
                    
                    // Bloqueia qualquer tentativa de inspecionar
                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                            e.preventDefault();
                            return false;
                        }
                    });
                    
                    document.addEventListener('contextmenu', function(e) {
                        e.preventDefault();
                        return false;
                    });
                });
            `);
    }
    
    // ============================================
    // 🔥 SE FOR O DOMÍNIO CORRETO, ENVIA O JOGO COMPLETO
    // ============================================
    
    console.log(`✅ Permitido: ${origin}`);
    
    // Código completo do jogo Caça-Palavras
    const gameCode = `
// ============================================
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
let startScreen, gameScreen, endScreen, gridContainer, wordListElement, timerElement;
let scoreElement, progressFill, comboDisplay, comboCount, hintButton, starsContainer, tutorialOverlay;

// Funções de Tutorial
function showTutorial() {
    tutorialOverlay.classList.remove('hidden');
    playSound('click');
}

function closeTutorial() {
    tutorialOverlay.classList.add('hidden');
    playSound('click');
    
    if (!gameScreen.classList.contains('hidden')) {
        showFloatingInstruction();
    }
}

function skipTutorial() {
    tutorialOverlay.classList.add('hidden');
    firstPlay = false;
    playSound('click');
}

function showFloatingInstruction() {
    const existingInstruction = document.getElementById('floating-instruction');
    if (existingInstruction) existingInstruction.remove();

    const instruction = document.createElement('div');
    instruction.id = 'floating-instruction';
    instruction.innerHTML = '👆 Arraste da primeira até a última letra! ➡️';
    document.body.appendChild(instruction);

    instructionTimeout = setTimeout(() => {
        instruction.remove();
        showHandPointer();
    }, 3000);
}

function showHandPointer() {
    if (!wordPositions.length || foundWords.length > 0) return;
    const firstWord = wordPositions[0];
    const firstPos = firstWord.positions[0];
    const cell = document.querySelector(\`.grid-cell[data-row="\${firstPos.row}"][data-col="\${firstPos.col}"]\`);
    if (!cell) return;
    const cellRect = cell.getBoundingClientRect();
    const hand = document.createElement('div');
    hand.className = 'hand-pointer';
    hand.innerHTML = '👆';
    hand.style.position = 'fixed';
    hand.style.left = (cellRect.left - 30) + 'px';
    hand.style.top = (cellRect.top - 30) + 'px';
    document.body.appendChild(hand);
    setTimeout(() => hand.remove(), 5000);
}

// Funções de Utilidade
function playSound(type) {
    if (navigator.vibrate) {
        if (type === 'correct') navigator.vibrate(200);
        else if (type === 'error') navigator.vibrate([50, 50, 50]);
        else navigator.vibrate(50);
    }
}

function createParticles() {
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
}

function createConfetti() {
    const colors = ['#FFD700', '#FF69B4', '#87CEEB', '#7CFC00', '#FFA500', '#9370DB'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = '0s';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

function showCombo() {
    comboCount.textContent = combo;
    comboDisplay.style.display = 'block';
    setTimeout(() => {
        comboDisplay.style.display = 'none';
    }, 2000);
}

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

// Geração do Jogo
function generateGrid(levelConfig) {
    size = levelConfig.size;
    const themeData = WORD_SETS[currentTheme];
    const availableWords = themeData.words.filter(word => word.length <= size);
    const shuffled = [...availableWords].sort(() => 0.5 - Math.random());
    currentWords = shuffled.slice(0, levelConfig.words);
    
    if (currentWords.length < levelConfig.words) {
        console.warn('Não há palavras suficientes. Adicionando extras.');
        while (currentWords.length < levelConfig.words) {
            const extraWord = availableWords[Math.floor(Math.random() * availableWords.length)];
            if (!currentWords.includes(extraWord)) currentWords.push(extraWord);
        }
    }
    
    foundWords = [];
    gameGrid = Array(size).fill().map(() => Array(size).fill(''));
    wordPositions = [];
    score = 0;
    combo = 0;
    hintsRemaining = 3;
    
    currentWords.forEach(word => { placeWord(word); });
    
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
        if (maxRow < 0 || maxCol < 0) { attempts++; continue; }
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
    
    if (!placed) {
        console.warn('Forçando colocação horizontal: ' + word);
        for (let r = 0; r < size; r++) {
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
                if (gameGrid[r][i] && gameGrid[r][i] !== word[i]) { canPlace = false; break; }
            }
            if (canPlace && size - word.length >= 0) {
                const positions = [];
                for (let i = 0; i < word.length; i++) {
                    gameGrid[r][i] = word[i];
                    positions.push({ row: r, col: i });
                }
                wordPositions.push({ word, positions, direction: directions[0] });
                placed = true;
                break;
            }
        }
    }
    
    if (!placed) {
        console.error('Não foi possível colocar: ' + word);
        const index = currentWords.indexOf(word);
        if (index > -1) currentWords.splice(index, 1);
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
        if (foundWords.includes(word)) li.classList.add('found');
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

// Temporizador e Pontuação
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

function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return \`\${minutes}:\${seconds}\`;
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
    const scoreAnim = document.createElement('div');
    scoreAnim.textContent = '+' + points;
    scoreAnim.style.position = 'fixed';
    scoreAnim.style.top = '50%';
    scoreAnim.style.left = '50%';
    scoreAnim.style.transform = 'translate(-50%, -50%)';
    scoreAnim.style.fontSize = '3em';
    scoreAnim.style.fontFamily = 'Fredoka One';
    scoreAnim.style.color = '#FFD700';
    scoreAnim.style.textShadow = '3px 3px 0 rgba(0,0,0,0.3)';
    scoreAnim.style.zIndex = '9999';
    scoreAnim.style.pointerEvents = 'none';
    scoreAnim.style.animation = 'tada 0.8s ease-out';
    document.body.appendChild(scoreAnim);
    setTimeout(() => scoreAnim.remove(), 800);
}

// Sistema de Dicas
function useHint() {
    if (hintsRemaining <= 0) return;
    const remainingWords = currentWords.filter(w => !foundWords.includes(w));
    if (remainingWords.length === 0) return;
    const targetWord = remainingWords[0];
    const wordData = wordPositions.find(wp => wp.word === targetWord);
    if (wordData) {
        hintsRemaining--;
        hintButton.textContent = \`💡 Usar Dica (\${hintsRemaining})\`;
        if (hintsRemaining === 0) hintButton.disabled = true;
        wordData.positions.slice(0, 2).forEach((pos, index) => {
            const cell = document.querySelector(
                \`.grid-cell[data-row="\${pos.row}"][data-col="\${pos.col}"]\`
            );
            setTimeout(() => {
                cell.classList.add('hint');
                setTimeout(() => cell.classList.remove('hint'), 2000);
            }, index * 300);
        });
        playSound('click');
        const hintMsg = document.createElement('div');
        hintMsg.style.position = 'fixed';
        hintMsg.style.top = '30%';
        hintMsg.style.left = '50%';
        hintMsg.style.transform = 'translate(-50%, -50%)';
        hintMsg.style.background = 'linear-gradient(135deg, #9370DB, #FF69B4)';
        hintMsg.style.color = 'white';
        hintMsg.style.padding = '20px 30px';
        hintMsg.style.borderRadius = '20px';
        hintMsg.style.fontSize = '1.5em';
        hintMsg.style.fontFamily = 'Fredoka One';
        hintMsg.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)';
        hintMsg.style.zIndex = '9999';
        hintMsg.style.animation = 'bounceIn 0.5s ease';
        hintMsg.textContent = \`💡 Procure: \${targetWord}\`;
        document.body.appendChild(hintMsg);
        setTimeout(() => hintMsg.remove(), 2500);
    }
}

// Eventos de Mouse e Touch
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
    playSound('click');
    isDragging = true;
    startCell = cell;
    selectedCells = [cell];
    document.querySelectorAll('.grid-cell').forEach(c => {
        c.classList.remove('selected', 'error');
    });
    cell.element.classList.add('selected');
    clearTimeout(instructionTimeout);
    const instruction = document.getElementById('floating-instruction');
    if (instruction) instruction.remove();
    const hands = document.querySelectorAll('.hand-pointer');
    hands.forEach(h => h.remove());
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
        if (word === extractedWord) { matchedWord = word; break; }
        else if (word === reversedWord) { matchedWord = word; isReversed = true; break; }
    }
    if (matchedWord) {
        playSound('correct');
        foundWords.push(matchedWord);
        combo++;
        if (combo > 1) showCombo();
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
        playSound('error');
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
        if (cell) cells.push(cell);
    }
    return cells;
}

// Controle do Jogo
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
    if (firstPlay) {
        setTimeout(() => { showTutorial(); }, 500);
    } else {
        setTimeout(() => { showFloatingInstruction(); }, 500);
    }
}

function checkWin() {
    if (foundWords.length === currentWords.length) {
        stopTimer();
        createConfetti();
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
    clearTimeout(instructionTimeout);
    const instruction = document.getElementById('floating-instruction');
    if (instruction) instruction.remove();
    const hands = document.querySelectorAll('.hand-pointer');
    hands.forEach(h => h.remove());
    showScreen('start-screen');
}

function showScreen(screenId) {
    [startScreen, gameScreen, endScreen].forEach(el => el.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// Inicialização do jogo
(function initGame() {
    console.log('🎮 Caça-Palavras carregado com sucesso!');
    
    // Referenciar elementos DOM
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
    
    // Event Listeners
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            currentTheme = parseInt(this.dataset.theme);
            playSound('click');
        });
    });

    document.querySelectorAll('[data-level]').forEach(btn => {
        btn.addEventListener('click', function() {
            const level = this.dataset.level;
            playSound('click');
            startGame(level);
        });
    });

    // Eventos da grade (Mouse)
    gridContainer.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    // Eventos da grade (Touch)
    gridContainer.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd, { passive: false });

    // Previne zoom no double tap em mobile
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) event.preventDefault();
        lastTouchEnd = now;
    }, false);

    // Botões
    hintButton.addEventListener('click', () => {
        playSound('click');
        useHint();
    });

    document.getElementById('reset-button').addEventListener('click', () => {
        playSound('click');
        if (confirm('Tem certeza que deseja reiniciar o jogo?')) resetGame();
    });

    document.getElementById('play-again-button').addEventListener('click', () => {
        playSound('click');
        resetGame();
    });

    // Previne menu de contexto na grade
    gridContainer.addEventListener('contextmenu', e => e.preventDefault());
    
    // Inicializar
    createParticles();
    showScreen('start-screen');
    
    // Ajusta tamanho da grade ao redimensionar
    window.addEventListener('resize', () => {
        if (gameGrid.length > 0) renderGrid();
    });
    
    console.log('✅ Jogo inicializado com sucesso!');
})();
    `;
    
    // Retorna o código do jogo
    return response.status(200)
        .setHeader('Content-Type', 'application/javascript')
        .setHeader('Cache-Control', 'public, max-age=3600')
        .send(gameCode);
}
