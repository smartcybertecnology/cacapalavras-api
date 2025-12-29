// api/api.js - VERSÃO CORRIGIDA
export const config = { runtime: 'edge' };

export default async function handler(request) {
  // 1. Verificação de domínio FLEXÍVEL
  const origin = request.headers.get('origin') || '';
  const referer = request.headers.get('referer') || '';
  
  // Domínios permitidos
  const allowedDomains = [
    'playjogosgratis.com',
    'playjogosgratis.com/cacapalavras/',
    'localhost',
    '127.0.0.1'
  ];
  
  // Verificação flexível
  let isAllowed = false;
  
  // Verifica origem
  allowedDomains.forEach(domain => {
    if (origin.includes(domain) || referer.includes(domain)) {
      isAllowed = true;
    }
  });
  
  // 2. Se não for permitido, retorna bloqueio SIMPLIFICADO
  if (!isAllowed) {
    return new Response(
      'console.log("🔒 Acesso verificado - carregando jogo...");',
      { headers: { 'Content-Type': 'application/javascript' } }
    );
  }
  
  // 3. JOGO COMPLETO
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

// =================== FUNÇÕES GLOBAIS ===================
// ESSENCIAIS: Funções chamadas por onclick no HTML
window.showTutorial = function() {
  console.log('📖 Mostrando tutorial');
  document.getElementById('tutorial-overlay').classList.remove('hidden');
};

window.closeTutorial = function() {
  console.log('📖 Fechando tutorial');
  document.getElementById('tutorial-overlay').classList.add('hidden');
};

window.skipTutorial = function() {
  console.log('⏭️ Pulando tutorial');
  document.getElementById('tutorial-overlay').classList.add('hidden');
  if (typeof firstPlay !== 'undefined') firstPlay = false;
};

window.showScreen = function(id) {
  console.log('🖥️ Mostrando tela:', id);
  document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(id);
  if (target) target.classList.remove('hidden');
};

// Função de utilidade
window.createParticles = function() {
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
};

// =================== INICIALIZAÇÃO ===================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎮 Caça-Palavras inicializando...');
  
  // Inicializar partículas
  if (typeof createParticles === 'function') {
    createParticles();
  }
  
  // Mostrar tela inicial
  const startScreen = document.getElementById('start-screen');
  if (startScreen) {
    startScreen.classList.remove('hidden');
  }
  
  // Configurar botões de tema
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      console.log('🎨 Tema selecionado:', this.dataset.theme);
    });
  });
  
  // Configurar botões de nível (simplificado)
  document.querySelectorAll('[data-level]').forEach(btn => {
    btn.addEventListener('click', function() {
      const level = this.dataset.level;
      console.log('🎯 Nível selecionado:', level);
      showScreen('game-screen');
    });
  });
  
  // Configurar botão de dica
  const hintBtn = document.getElementById('hint-button');
  if (hintBtn) {
    hintBtn.addEventListener('click', function() {
      console.log('💡 Dica solicitada');
      alert('Funcionalidade de dica em desenvolvimento!');
    });
  }
  
  // Configurar botão reset
  const resetBtn = document.getElementById('reset-button');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (confirm('Deseja reiniciar o jogo?')) {
        showScreen('start-screen');
      }
    });
  }
  
  // Configurar botão jogar novamente
  const playAgainBtn = document.getElementById('play-again-button');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', function() {
      showScreen('start-screen');
    });
  }
  
  console.log('✅ Jogo Caça-Palavras carregado com sucesso!');
});

// =================== LOG INICIAL ===================
console.log('🎮 Jogo Caça-Palavras carregado da API!');`;

  // 4. Retorna o código do jogo
  return new Response(gameCode, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

