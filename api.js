// api/api.js
export default async function handler(request, response) {
  // 1. Verificação de domínio
  const origin = request.headers.get('origin') || request.headers.get('referer') || '';
  const allowedDomains = ['playjogosgratis.com'];
  const isAllowed = allowedDomains.some(domain => origin.includes(domain));
  
  // 2. Se não for permitido, retorna bloqueio
  if (!isAllowed && !origin.includes('localhost')) {
    return response.status(200)
      .setHeader('Content-Type', 'application/javascript')
      .send(`
        console.error("❌ Acesso negado: use playjogosgratis.com");
        document.body.innerHTML = '<h1>Acesso Restrito</h1>';
      `);
  }
  
  // 3. SE FOR PERMITIDO, RETORNA O JOGO COMPLETO
  const gameCode = `
    // ========================
    // CAÇA-PALAVRAS MÁGICO
    // ========================
    
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
    
    console.log('🎮 Jogo Caça-Palavras carregado!');
    
    // Função para mostrar tela
    function showScreen(id) {
      document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
      document.getElementById(id).classList.remove('hidden');
    }
    
    // Inicialização
    document.addEventListener('DOMContentLoaded', function() {
      console.log('✅ DOM carregado');
      showScreen('start-screen');
      
      // Botões de tema
      document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('selected'));
          this.classList.add('selected');
          console.log('Tema selecionado:', this.dataset.theme);
        });
      });
      
      // Botões de nível
      document.querySelectorAll('[data-level]').forEach(btn => {
        btn.addEventListener('click', function() {
          const level = this.dataset.level;
          console.log('Iniciando jogo nível:', level);
          showScreen('game-screen');
        });
      });
    });
    
    // Exporta funções para o HTML acessar
    window.showTutorial = function() {
      document.getElementById('tutorial-overlay').classList.remove('hidden');
    };
    
    window.closeTutorial = function() {
      document.getElementById('tutorial-overlay').classList.add('hidden');
    };
  `;
  
  // 4. Retorna o código do jogo
  return response.status(200)
    .setHeader('Content-Type', 'application/javascript')
    .setHeader('Cache-Control', 'public, max-age=3600')
    .send(gameCode);
}
