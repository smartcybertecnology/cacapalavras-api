/**
 * =====================================================================
 * SIMULAÇÃO DE LÓGICA DE BACKEND E DADOS DE INSTRUMENTOS
 * (Hosted em https://instrumentos-api.vercel.app/api/api.js)
 * =====================================================================
 *
 * NOTA IMPORTANTE:
 * Quando este arquivo é incluído via <script src="...">, ele é executado
 * no navegador do cliente, tornando os dados visíveis.
 *
 * Para proteger totalmente a lógica (como solicitado), a arquitetura correta
 * seria:
 * 1. O cliente (index.html) faz uma requisição HTTP (fetch) para a URL da API.
 * 2. O backend (este código em Node.js/Express) processa a requisição.
 * 3. O backend envia os dados ou executa a lógica.
 *
 * Abaixo, demonstramos *como* a lógica de controle CORS e manipulação de
 * requisições OPTIONS seria implementada em um servidor real (Node.js/Express
 * ou Vercel Serverless Function), conforme solicitado.
 */

// Este é um exemplo de função de handler (como um Serverless Function do Vercel)
// que controlaria o CORS e a requisição OPTIONS.
function handler(req, res) {
    const allowedOrigin = 'https://playjogosgratis.com';
    const origin = req.headers.origin;

    // 1. Controle CORS (res.setHeader)
    if (origin && origin === allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    } else {
        // Para requisições de domínios não permitidos, não define o cabeçalho ACAO,
        // ou retorna um erro de permissão.
        // res.status(403).send('Acesso Negado');
        // return;
    }

    // 2. Tratamento da Requisição OPTIONS (Pré-voo CORS)
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Max-Age', 86400); // Cache do pré-voo por 24h
        res.status(204).end(); // Retorna 204 (No Content) para OPTIONS
        return;
    }

    // Lógica principal do jogo (exemplo: retornar dados JSON)
    // res.status(200).json({ instruments: INSTRUMENTS_DATA });
}
// Fim da simulação do código de servidor
// =====================================================================


/**
 * DADOS EXPOSTOS PARA O CLIENTE (index.html)
 *
 * Estes dados seriam normalmente retornados como JSON via requisição fetch (GET),
 * mas para a simulação de inclusão de script, eles são expostos globalmente.
 *
 * URLs de áudio são de fontes abertas e gratuitas para demonstração.
 */

// Define URLs de base para simplificar a definição dos instrumentos
const BASE_DRUM_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-99/';
const BASE_KEYBOARD_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-99/keyboard-';

export const INSTRUMENTS_DATA = [
    {
        id: 'drumkit',
        name: 'Bateria Musical',
        icon: '🥁',
        color: 'bg-red-500',
        parts: [
            { id: 'crash', name: 'Prato', soundUrl: BASE_DRUM_URL + 'crash.mp3' },
            { id: 'hihat', name: 'Hi-Hat', soundUrl: BASE_DRUM_URL + 'hihat.mp3' },
            { id: 'snare', name: 'Caixa', soundUrl: BASE_DRUM_URL + 'snare.mp3' },
            { id: 'kick', name: 'Bumbo', soundUrl: BASE_DRUM_URL + 'kick.mp3' },
            { id: 'tom1', name: 'Tom 1', soundUrl: BASE_DRUM_URL + 'tom1.mp3' },
            { id: 'tom2', name: 'Tom 2', soundUrl: BASE_DRUM_URL + 'tom2.mp3' },
        ]
    },
    {
        id: 'keyboard',
        name: 'Teclado Mágico',
        icon: '🎹',
        color: 'bg-blue-500',
        parts: [
            // Usando notas do C4 ao C5 como exemplo
            { id: 'c4', name: 'C4', soundUrl: BASE_KEYBOARD_URL + 'c4.mp3' },
            { id: 'd4', name: 'D4', soundUrl: BASE_KEYBOARD_URL + 'd4.mp3' },
            { id: 'e4', name: 'E4', soundUrl: BASE_KEYBOARD_URL + 'e4.mp3' },
            { id: 'f4', name: 'F4', soundUrl: BASE_KEYBOARD_URL + 'f4.mp3' },
            { id: 'g4', name: 'G4', soundUrl: BASE_KEYBOARD_URL + 'g4.mp3' },
            { id: 'a4', name: 'A4', soundUrl: BASE_KEYBOARD_URL + 'a4.mp3' },
            { id: 'b4', name: 'B4', soundUrl: BASE_KEYBOARD_URL + 'b4.mp3' },
            { id: 'c5', name: 'C5', soundUrl: BASE_KEYBOARD_URL + 'c5.mp3' },
        ]
    },
    {
        id: 'ukulele',
        name: 'Ukulele Havaiano',
        icon: '🎸',
        color: 'bg-orange-500',
        parts: [
            { id: 'string_g', name: 'Cordel G', soundUrl: BASE_DRUM_URL + 'ukulele-g.mp3' },
            { id: 'string_c', name: 'Cordel C', soundUrl: BASE_DRUM_URL + 'ukulele-c.mp3' },
            { id: 'string_e', name: 'Cordel E', soundUrl: BASE_DRUM_URL + 'ukulele-e.mp3' },
            { id: 'string_a', name: 'Cordel A', soundUrl: BASE_DRUM_URL + 'ukulele-a.mp3' },
        ]
    },
    {
        id: 'saxophone',
        name: 'Saxofone Suave',
        icon: '🎷',
        color: 'bg-teal-500',
        parts: [
            { id: 'main', name: 'Saxofone', soundUrl: BASE_DRUM_URL + 'saxophone.mp3' }
        ]
    },
    {
        id: 'tambourine',
        name: 'Pandeiro Animado',
        icon: '🪘',
        color: 'bg-lime-500',
        parts: [
            { id: 'hit', name: 'Tocar', soundUrl: BASE_DRUM_URL + 'tambourine-hit.mp3' },
            { id: 'shake', name: 'Agitar', soundUrl: BASE_DRUM_URL + 'tambourine-shake.mp3' }
        ]
    },
    {
        id: 'accordion',
        name: 'Sanfona Alegre',
        icon: '🪗',
        color: 'bg-green-500',
        // Simplificando com um som único de Sanfona para o propósito da demo
        parts: [
            { id: 'main', name: 'Sanfona', soundUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-99/accordion.mp3' }
        ]
    },
    {
        id: 'flute',
        name: 'Flauta Doce',
        icon: '🎶',
        color: 'bg-yellow-500',
        // Simplificando com um som único de Flauta
        parts: [
            { id: 'main', name: 'Flauta', soundUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-99/flute.mp3' }
        ]
    },
];

// O cliente (index.html) terá acesso a esta variável.
window.INSTRUMENTS_DATA = INSTRUMENTS_DATA;
window.SOUND_CACHE = {}; // Cache para armazenar objetos Audio

/**
 * Função principal de lógica de reprodução de som.
 * Isto simula que a lógica de como o som é tocado (incluindo tratamento de cache)
 * está fora do cliente.
 *
 * @param {string} soundUrl URL do arquivo de áudio.
 */
window.playInstrumentSound = function(soundUrl) {
    if (!soundUrl) {
        console.error("URL de som inválida fornecida.");
        return;
    }

    let audio;
    if (window.SOUND_CACHE[soundUrl]) {
        // Reutiliza o objeto Audio do cache
        audio = window.SOUND_CACHE[soundUrl];
        audio.currentTime = 0; // Reinicia o som
    } else {
        // Cria e armazena novo objeto Audio no cache
        audio = new Audio(soundUrl);
        // Adiciona tratamento de erro no carregamento, se necessário
        audio.onerror = () => {
             console.error(`Erro ao carregar o som: ${soundUrl}. Verifique se a URL está correta.`);
        };
        window.SOUND_CACHE[soundUrl] = audio;
    }

    // Tenta reproduzir. O try/catch é crucial, pois alguns navegadores
    // bloqueiam a reprodução automática sem interação inicial do usuário.
    try {
        audio.play().catch(e => {
            console.warn("Reprodução de áudio falhou (provavelmente devido a restrições do navegador).", e);
            // Mensagem amigável ao usuário (opcional)
            const messageBox = document.getElementById('message-box');
            if (messageBox) {
                messageBox.textContent = 'Clique em qualquer lugar da tela para ativar o áudio!';
                messageBox.classList.remove('opacity-0', 'pointer-events-none');
                setTimeout(() => {
                    messageBox.classList.add('opacity-0', 'pointer-events-none');
                }, 3000);
            }
        });
    } catch (e) {
        console.error("Erro fatal ao tentar tocar o áudio:", e);
    }
};

// Funções de utilidade que simulam lógica de "API"
window.getInstrumentById = function(id) {
    return INSTRUMENTS_DATA.find(inst => inst.id === id);
};

console.log("Módulo de Instrumentos API carregado. Dados e lógica prontos.");