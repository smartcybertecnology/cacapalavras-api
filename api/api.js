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
    
    // SE NÃO FOR O DOMÍNIO CORRETO, RETORNA CÓDIGO VAZIO
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
    
    // TODO: AQUI VOCÊ COLA TODO O CÓDIGO DO SEU JOGO
    // (o JavaScript que estava no index.html)
    
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
            { theme: "ESCOLA 📚", words: ["LIVRO", "LAPIS", "CADERNO", "ESCOLA", "AULA", "MESA"] },
            { theme: "ANIMAIS 🦁", words: ["GATO", "CACHORRO", "LEAO", "TIGRE", "URSO", "COELHO"] },
            { theme: "FRUTAS 🍎", words: ["MACA", "BANANA", "UVA", "LARANJA", "MANGA", "PERA"] },
            { theme: "VEÍCULOS 🚗", words: ["CARRO", "MOTO", "AVIAO", "NAVIO", "TREM", "ONIBUS"] },
            { theme: "CORES 🎨", words: ["AZUL", "VERDE", "AMARELO", "ROXO", "ROSA", "BRANCO"] }
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
        
        // Inicialização
        (function() {
            console.log('🎮 Caça-Palavras carregado com sucesso!');
            
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
            
            // ============ COLE AQUI TODAS AS FUNÇÕES DO SEU JOGO ============
            // 1. Funções de Tutorial
            function showTutorial() { /* seu código */ }
            function closeTutorial() { /* seu código */ }
            
            // 2. Funções de Utilidade
            function createParticles() { /* seu código */ }
            
            // 3. Geração do Jogo
            function generateGrid(levelConfig) { /* seu código */ }
            function placeWord(word) { /* seu código */ }
            function renderGrid() { /* seu código */ }
            
            // 4. Temporizador e Pontuação
            function startTimer() { /* seu código */ }
            function calculateScore(wordLength) { /* seu código */ }
            
            // 5. Eventos
            function handleStart(event) { /* seu código */ }
            function handleMove(event) { /* seu código */ }
            function handleEnd(event) { /* seu código */ }
            
            // 6. Controle do Jogo
            function startGame(level) { /* seu código */ }
            function checkWin() { /* seu código */ }
            function resetGame() { /* seu código */ }
            
            // ============ EVENT LISTENERS ============
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    currentTheme = parseInt(this.dataset.theme);
                    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });
            
            document.querySelectorAll('[data-level]').forEach(btn => {
                btn.addEventListener('click', function() {
                    startGame(this.dataset.level);
                });
            });
            
            // Mais event listeners...
            
            // Inicializar
            createParticles();
            document.getElementById('start-screen').classList.remove('hidden');
            
            console.log('✅ Jogo inicializado com sucesso!');
        })();
        
        // Ofuscação extra (opcional)
        window._g = window.onerror; window.onerror = null;
        setTimeout(() => { window.onerror = window._g; }, 5000);
    `;
    
    // Retorna o código do jogo
    return response.status(200)
        .setHeader('Content-Type', 'application/javascript')
        .setHeader('Cache-Control', 'public, max-age=3600')
        .send(gameCode);
}
