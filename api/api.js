// api/api.js - API para o Caça-Palavras Mágico
export const config = { runtime: 'edge' };

// Domínios autorizados
const ALLOWED_ORIGINS = [
  'https://playjogosgratis.com',
  'https://www.playjogosgratis.com',
  'https://cacapalavras-api.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000'
];

// Dados completos do jogo
const GAME_DATA = {
  status: "active",
  game: "Caça-Palavras Mágico",
  version: "2.1.0",
  timestamp: new Date().toISOString(),
  author: "PlayJogosGratis.com",
  
  config: {
    maxHints: 3,
    baseScore: 100,
    comboMultiplier: 50,
    validation: "origin_required"
  },
  
  levels: {
    easy: {
      size: 6,
      words: 6,
      timeBonus: 5,
      description: "Fácil para iniciantes"
    },
    normal: {
      size: 8,
      words: 8,
      timeBonus: 3,
      description: "Desafio normal"
    },
    hard: {
      size: 10,
      words: 10,
      timeBonus: 2,
      description: "Difícil para experts"
    }
  },
  
  themes: [
    {
      id: 0,
      name: "ESCOLA 📚",
      icon: "📚",
      color: "#4CAF50",
      words: ["LIVRO", "LAPIS", "CADERNO", "ESCOLA", "AULA", "MESA", "QUADRO", "ALUNO", "PROVA", "CANETA", "BORRACHA", "REGUA"]
    },
    {
      id: 1,
      name: "ANIMAIS 🦁",
      icon: "🦁",
      color: "#FF9800",
      words: ["GATO", "CACHORRO", "LEAO", "TIGRE", "URSO", "COELHO", "PATO", "ZEBRA", "ELEFANTE", "GIRAFA", "MACACO", "CORUJA"]
    },
    {
      id: 2,
      name: "FRUTAS 🍎",
      icon: "🍎",
      color: "#F44336",
      words: ["MACA", "BANANA", "UVA", "LARANJA", "MANGA", "PERA", "MELAO", "ABACAXI", "MORANGO", "LIMÃO", "KIWI", "MELANCIA"]
    },
    {
      id: 3,
      name: "VEÍCULOS 🚗",
      icon: "🚗",
      color: "#2196F3",
      words: ["CARRO", "MOTO", "AVIAO", "NAVIO", "TREM", "ONIBUS", "BIKE", "BARCO", "CAMINHAO", "TAXI", "HELICOPTERO", "SUBWAY"]
    },
    {
      id: 4,
      name: "CORES 🎨",
      icon: "🎨",
      color: "#9C27B0",
      words: ["AZUL", "VERDE", "AMARELO", "ROXO", "ROSA", "BRANCO", "PRETO", "LARANJA", "VERMELHO", "CINZA", "MARROM", "DOURADO"]
    }
  ],
  
  instructions: {
    pt: [
      "1. Escolha um tema e nível de dificuldade",
      "2. Encontre as palavras na grade",
      "3. Clique e arraste para selecionar palavras",
      "4. Ganhe pontos e tente combos!"
    ],
    en: [
      "1. Choose a theme and difficulty level",
      "2. Find words in the grid",
      "3. Click and drag to select words",
      "4. Earn points and try combos!"
    ]
  }
};

// Função para verificar origem
function isOriginAllowed(origin) {
  if (!origin) return false;
  
  // Permite requisições do mesmo domínio (para testes)
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return true;
  }
  
  return ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || 
    origin.startsWith(allowed.replace('https://', 'http://')) ||
    (allowed.includes('*') && new RegExp(allowed.replace('*', '.*')).test(origin))
  );
}

// Função principal do handler
export default async function handler(request) {
  const url = new URL(request.url);
  const origin = request.headers.get('origin') || request.headers.get('referer') || '';
  const method = request.method;
  
  console.log(`🌐 [${new Date().toISOString()}] ${method} ${url.pathname} - Origin: ${origin}`);
  
  // Headers CORS dinâmicos
  const corsHeaders = {
    'Access-Control-Allow-Origin': isOriginAllowed(origin) ? origin : 'https://playjogosgratis.com',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin'
  };
  
  // Handle preflight OPTIONS request
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Content-Length': '0'
      }
    });
  }
  
  // Verifica se é uma requisição GET
  if (method !== 'GET') {
    return new Response(JSON.stringify({
      error: true,
      message: 'Método não permitido. Use GET.'
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...corsHeaders
      }
    });
  }
  
  try {
    // Dados da resposta
    const responseData = {
      ...GAME_DATA,
      requestInfo: {
        origin: origin,
        allowed: isOriginAllowed(origin),
        timestamp: new Date().toISOString(),
        path: url.pathname,
        query: Object.fromEntries(url.searchParams)
      }
    };
    
    // Adiciona mensagem de bloqueio se necessário
    if (!isOriginAllowed(origin) && !origin.includes('localhost')) {
      responseData.accessBlocked = true;
      responseData.message = "Este jogo só está disponível em playjogosgratis.com";
      responseData.redirect = "https://playjogosgratis.com";
      
      // Log de acesso não autorizado
      console.warn(`🚫 Acesso bloqueado de: ${origin}`);
    } else {
      console.log(`✅ Acesso permitido de: ${origin}`);
    }
    
    // Retorna os dados JSON
    return new Response(JSON.stringify(responseData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('❌ Erro na API:', error);
    
    return new Response(JSON.stringify({
      error: true,
      message: 'Erro interno do servidor',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...corsHeaders
      }
    });
  }
}
