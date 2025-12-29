// api/api.js - Retorna apenas JSON puro
export const config = { runtime: 'edge' };

// Domínios permitidos
const ALLOWED_DOMAINS = [
  'playjogosgratis.com',
  'cacapalavras-api.vercel.app',
  'localhost:3000'
];

// Dados do jogo em JSON
const GAME_DATA = {
  game: "Caça-Palavras Mágico",
  version: "3.0.0",
  status: "active",
  timestamp: new Date().toISOString(),
  
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
    baseScore: 10
  }
};

export default async function handler(request) {
  const origin = request.headers.get('origin') || '';
  const isAllowed = ALLOWED_DOMAINS.some(domain => origin.includes(domain));
  
  // Configura CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': isAllowed ? origin : 'https://playjogosgratis.com',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };
  
  // Se for requisição OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }
  
  // Adiciona info de domínio
  const response = {
    ...GAME_DATA,
    domainInfo: {
      origin,
      allowed: isAllowed,
      requiredDomain: 'playjogosgratis.com'
    }
  };
  
  // Se não for domínio permitido, adiciona mensagem
  if (!isAllowed && origin && !origin.includes('localhost')) {
    response.accessBlocked = true;
    response.message = "❌ Este jogo só está disponível em: https://playjogosgratis.com";
  }
  
  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers
  });
}
