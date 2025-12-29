// api/api.js - RETORNA DADOS JSON COM VERIFICAÇÃO DE DOMÍNIO
export const config = { runtime: 'edge' };

// Domínios autorizados para acesso direto
const ALLOWED_DOMAINS = [
  'playjogosgratis.com',
  'cacapalavras-api.vercel.app',
  'localhost:3000',
  'localhost:5173'
];

// Dados completos do jogo em JSON
const GAME_DATA = {
  status: "success",
  game: "caça-palavras-magico",
  version: "2.0.0",
  requiresAPI: true,
  data: {
    levels: {
      easy: { size: 6, words: 6, timeBonus: 5 },
      normal: { size: 8, words: 8, timeBonus: 3 },
      hard: { size: 10, words: 10, timeBonus: 2 }
    },
    themes: [
      { 
        id: 0,
        name: "ESCOLA 📚", 
        words: ["LIVRO", "LAPIS", "CADERNO", "ESCOLA", "AULA", "MESA", "QUADRO", "ALUNO", "PROVA", "CANETA", "BORRACHA", "REGUA"] 
      },
      { 
        id: 1,
        name: "ANIMAIS 🦁", 
        words: ["GATO", "CACHORRO", "LEAO", "TIGRE", "URSO", "COELHO", "PATO", "ZEBRA", "ELEFANTE", "GIRAFA", "MACACO", "CORUJA"] 
      },
      { 
        id: 2,
        name: "FRUTAS 🍎", 
        words: ["MACA", "BANANA", "UVA", "LARANJA", "MANGA", "PERA", "MELAO", "ABACAXI", "MORANGO", "LIMÃO", "KIWI", "MELANCIA"] 
      },
      { 
        id: 3,
        name: "VEÍCULOS 🚗", 
        words: ["CARRO", "MOTO", "AVIAO", "NAVIO", "TREM", "ONIBUS", "BIKE", "BARCO", "CAMINHAO", "TAXI", "HELICOPTERO", "SUBWAY"] 
      },
      { 
        id: 4,
        name: "CORES 🎨", 
        words: ["AZUL", "VERDE", "AMARELO", "ROXO", "ROSA", "BRANCO", "PRETO", "LARANJA", "VERMELHO", "CINZA", "MARROM", "DOURADO"] 
      }
    ],
    settings: {
      maxHints: 3,
      comboMultiplier: 50,
      baseScorePerLetter: 10,
      validationKey: "wp_2024_secure"
    }
  },
  functions: {
    generateGrid: "Função para gerar grade do jogo",
    validateWord: "Função para validar palavra selecionada",
    calculateScore: "Função para calcular pontuação"
  }
};

// Função de verificação de domínio com mais robustez
function getDomainFromRequest(request) {
  try {
    // Tenta pegar do Origin header (para requisições CORS)
    const origin = request.headers.get('origin');
    if (origin) {
      const url = new URL(origin);
      return url.hostname;
    }
    
    // Tenta pegar do Referer header
    const referer = request.headers.get('referer');
    if (referer) {
      const url = new URL(referer);
      return url.hostname;
    }
    
    // Tenta pegar do Host header (para requisições diretas)
    const host = request.headers.get('host');
    if (host) {
      return host.split(':')[0];
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao extrair domínio:', error);
    return null;
  }
}

// Verifica se o domínio é permitido
function isDomainAllowed(domain) {
  if (!domain) return false;
  
  // Permite localhost em desenvolvimento
  if (process.env.NODE_ENV === 'development' && domain.includes('localhost')) {
    return true;
  }
  
  // Verifica domínios exatos ou subdomínios
  return ALLOWED_DOMAINS.some(allowed => {
    return domain === allowed || 
           domain.endsWith('.' + allowed) ||
           (allowed.startsWith('*.') && domain.endsWith(allowed.slice(2)));
  });
}

// Função principal
export default async function handler(request) {
  console.log('📡 API do Caça-Palavras chamada');
  
  // Método HTTP
  const method = request.method;
  
  if (method === 'OPTIONS') {
    // Responde a preflight CORS
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  if (method !== 'GET') {
    return new Response(JSON.stringify({ 
      error: true, 
      message: 'Método não permitido. Use GET.' 
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Verifica domínio
  const domain = getDomainFromRequest(request);
  const isAllowed = isDomainAllowed(domain);
  
  console.log(`🌐 Domínio de origem: ${domain || 'desconhecido'}`);
  console.log(`🔒 Acesso permitido: ${isAllowed}`);
  
  // Adiciona informações de domínio aos dados
  const responseData = {
    ...GAME_DATA,
    domainInfo: {
      requestedFrom: domain,
      isAllowed: isAllowed,
      timestamp: new Date().toISOString(),
      apiVersion: "1.0"
    }
  };
  
  // Se o domínio não for permitido, adiciona mensagem de bloqueio
  if (!isAllowed) {
    responseData.accessBlocked = true;
    responseData.message = "Este jogo só está disponível em playjogosgratis.com";
    responseData.redirectUrl = "https://playjogosgratis.com";
  }
  
  // Cabeçalhos CORS
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'public, max-age=3600',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Game-API': 'caça-palavras/2.0'
  };
  
  // Retorna dados JSON
  return new Response(JSON.stringify(responseData, null, 2), {
    status: 200,
    headers: headers
  });
}
