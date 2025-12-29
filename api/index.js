const ALLOWED_ORIGIN = 'https://playjogosgratis.com';

const THEMES = {
    escola: {
        label: 'Escola',
        words: {
            facil: ['LAPIS', 'LIVRO', 'MESA', 'LOUSA', 'GIZ'],
            normal: ['CADERNO', 'MOCHILA', 'ESTOJO', 'BORRACHA', 'REGUA', 'TESOURA'],
            dificil: ['PROFESSOR', 'BIBLIOTECA', 'EDUCACAO', 'ALFABETO', 'CALENDARIO', 'MATEMATICA', 'GEOGRAFIA']
        }
    },
    animais: {
        label: 'Animais',
        words: {
            facil: ['GATO', 'CAO', 'PATO', 'URSO', 'SAPO'],
            normal: ['CAVALO', 'COELHO', 'TIGRE', 'MACACO', 'GIRAFA', 'ZEBRA'],
            dificil: ['ELEFANTE', 'RINOCERONTE', 'PAPAGAIO', 'TARTARUGA', 'BORBOLETA', 'CROCODILO', 'PINGUIM']
        }
    },
    frutas: {
        label: 'Frutas',
        words: {
            facil: ['UVA', 'PERA', 'MACA', 'KIWI', 'LIMA'],
            normal: ['BANANA', 'LARANJA', 'MORANGO', 'ABACAXI', 'MELANCIA', 'MANGA'],
            dificil: ['FRAMBOESA', 'TANGERINA', 'MARACUJA', 'JABUTICABA', 'CARAMBOLA', 'PITANGA', 'ACEROLA']
        }
    },
    veiculos: {
        label: 'Veículos',
        words: {
            facil: ['CARRO', 'MOTO', 'NAVIO', 'AVIAO', 'TREM'],
            normal: ['ONIBUS', 'CAMINHAO', 'BICICLETA', 'HELICOPTERO', 'BARCO', 'METRO'],
            dificil: ['AMBULANCIA', 'MOTOCICLETA', 'ESCAVADEIRA', 'SUBMARINO', 'TELEFERICO', 'FOGUETE', 'MONORAIL']
        }
    },
    cores: {
        label: 'Cores',
        words: {
            facil: ['AZUL', 'ROSA', 'ROXO', 'VERDE', 'CINZA'],
            normal: ['AMARELO', 'VERMELHO', 'LARANJA', 'MARROM', 'BRANCO', 'PRETO'],
            dificil: ['TURQUESA', 'VIOLETA', 'MAGENTA', 'DOURADO', 'PRATEADO', 'BEGE', 'CORAL']
        }
    }
};

const DIFFICULTY_CONFIG = {
    facil: { gridSize: 8, timeLimit: 300, basePoints: 10 },
    normal: { gridSize: 10, timeLimit: 240, basePoints: 20 },
    dificil: { gridSize: 12, timeLimit: 180, basePoints: 30 }
};

const DIRECTIONS = [
    [0, 1],   // horizontal direita
    [1, 0],   // vertical baixo
    [1, 1],   // diagonal direita-baixo
    [-1, 1],  // diagonal direita-cima
    [0, -1],  // horizontal esquerda
    [-1, 0],  // vertical cima
    [-1, -1], // diagonal esquerda-cima
    [1, -1]   // diagonal esquerda-baixo
];

const gameSessions = new Map();

function generateGrid(words, gridSize) {
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    const wordPositions = new Map();

    words.forEach(word => {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!placed && attempts < maxAttempts) {
            const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
            const startRow = Math.floor(Math.random() * gridSize);
            const startCol = Math.floor(Math.random() * gridSize);

            if (canPlaceWord(grid, word, startRow, startCol, direction, gridSize)) {
                placeWord(grid, word, startRow, startCol, direction);
                
                const positions = [];
                for (let i = 0; i < word.length; i++) {
                    positions.push({
                        row: startRow + direction[0] * i,
                        col: startCol + direction[1] * i
                    });
                }
                wordPositions.set(word, positions);
                placed = true;
            }
            attempts++;
        }
    });

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    return { grid, wordPositions };
}

function canPlaceWord(grid, word, row, col, direction, gridSize) {
    for (let i = 0; i < word.length; i++) {
        const newRow = row + direction[0] * i;
        const newCol = col + direction[1] * i;

        if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
            return false;
        }

        if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
            return false;
        }
    }
    return true;
}

function placeWord(grid, word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        const newRow = row + direction[0] * i;
        const newCol = col + direction[1] * i;
        grid[newRow][newCol] = word[i];
    }
}

function validateWord(word, cells, wordPositions) {
    if (!wordPositions.has(word)) {
        return false;
    }

    const correctPositions = wordPositions.get(word);
    
    if (cells.length !== correctPositions.length) {
        return false;
    }

    for (let i = 0; i < cells.length; i++) {
        const match = correctPositions.some(pos => 
            pos.row === cells[i].row && pos.col === cells[i].col
        );
        if (!match) {
            return false;
        }
    }

    for (let i = 0; i < cells.length - 1; i++) {
        const rowDiff = Math.abs(cells[i + 1].row - cells[i].row);
        const colDiff = Math.abs(cells[i + 1].col - cells[i].col);
        
        if (rowDiff > 1 || colDiff > 1 || (rowDiff === 0 && colDiff === 0)) {
            return false;
        }
    }

    return true;
}

function calculatePoints(word, difficulty, hintsUsed) {
    const basePoints = DIFFICULTY_CONFIG[difficulty].basePoints;
    const lengthBonus = word.length * 5;
    const hintPenalty = hintsUsed * 10;
    
    return Math.max(0, basePoints + lengthBonus - hintPenalty);
}

function handleThemes(req, res) {
    const themes = Object.keys(THEMES).map(key => ({
        id: key,
        label: THEMES[key].label
    }));

    res.status(200).json({
        success: true,
        themes
    });
}

function handleGenerate(req, res) {
    const { theme, difficulty } = req.body;

    if (!theme || !difficulty) {
        return res.status(400).json({ 
            success: false, 
            error: 'Tema e dificuldade são obrigatórios' 
        });
    }

    if (!THEMES[theme]) {
        return res.status(400).json({ 
            success: false, 
            error: 'Tema inválido' 
        });
    }

    if (!DIFFICULTY_CONFIG[difficulty]) {
        return res.status(400).json({ 
            success: false, 
            error: 'Dificuldade inválida' 
        });
    }

    const words = THEMES[theme].words[difficulty];
    const config = DIFFICULTY_CONFIG[difficulty];
    const { grid, wordPositions } = generateGrid(words, config.gridSize);

    const gameId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    gameSessions.set(gameId, {
        theme,
        difficulty,
        wordPositions,
        words,
        createdAt: Date.now(),
        hintsUsed: 0
    });

    const oneHourAgo = Date.now() - 3600000;
    for (const [key, session] of gameSessions.entries()) {
        if (session.createdAt < oneHourAgo) {
            gameSessions.delete(key);
        }
    }

    res.status(200).json({
        success: true,
        gameId,
        grid,
        words,
        timeLimit: config.timeLimit,
        difficulty
    });
}

function handleValidate(req, res) {
    const { word, cells, gameId } = req.body;

    if (!word || !cells || !gameId) {
        return res.status(400).json({ 
            success: false, 
            error: 'Dados incompletos para validação' 
        });
    }

    if (!Array.isArray(cells) || cells.length === 0) {
        return res.status(400).json({ 
            success: false, 
            error: 'Células inválidas' 
        });
    }

    const session = gameSessions.get(gameId);
    
    if (!session) {
        return res.status(400).json({ 
            success: false, 
            error: 'Sessão de jogo inválida ou expirada' 
        });
    }

    const isValid = validateWord(word, cells, session.wordPositions);

    if (isValid) {
        const points = calculatePoints(word, session.difficulty, session.hintsUsed);
        
        return res.status(200).json({
            success: true,
            valid: true,
            points,
            word
        });
    } else {
        return res.status(200).json({
            success: true,
            valid: false,
            points: 0
        });
    }
}

function handleHint(req, res) {
    const { remainingWords, gameId } = req.body;

    if (!remainingWords || !gameId || remainingWords.length === 0) {
        return res.status(400).json({ 
            success: false, 
            error: 'Dados incompletos para dica' 
        });
    }

    const session = gameSessions.get(gameId);
    
    if (!session) {
        return res.status(400).json({ 
            success: false, 
            error: 'Sessão inválida' 
        });
    }

    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    
    session.hintsUsed++;

    const penalty = 15;

    res.status(200).json({
        success: true,
        word: randomWord,
        penalty,
        hintsUsed: session.hintsUsed
    });
}

export default async function handler(req, res) {
    const origin = req.headers.origin || req.headers.referer;
    
    if (origin && origin.includes(ALLOWED_ORIGIN)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Método não permitido' 
        });
    }

    if (!origin || !origin.includes(ALLOWED_ORIGIN)) {
        return res.status(403).json({ 
            success: false, 
            error: 'Acesso negado - origem não autorizada' 
        });
    }

    try {
        const action = req.query.action;

        switch (action) {
            case 'themes':
                return handleThemes(req, res);
            
            case 'generate':
                return handleGenerate(req, res);
            
            case 'validate':
                return handleValidate(req, res);
            
            case 'hint':
                return handleHint(req, res);
            
            default:
                return res.status(400).json({ 
                    success: false, 
                    error: 'Ação inválida' 
                });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
}
```

## 3. **Estrutura correta no Vercel:**
```
cacapalavras-api/
└── api/
    └── index.js
