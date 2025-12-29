// api/index.js - API para o jogo de caça-palavras
// Hospedado em: https://cacapalavras-api.vercel.app/api

const temas = {
    escola: {
        palavras: ["LIVRO", "CANETA", "CADERNO", "PROFESSOR", "SALA", "ALUNO", "QUADRO", "MOCHILA"],
        descricao: "Objetos da escola"
    },
    animais: {
        palavras: ["CACHORRO", "GATO", "ELEFANTE", "LEAO", "GIRAFA", "TIGRE", "ZEBRA", "MACACO"],
        descricao: "Animais diversos"
    },
    frutas: {
        palavras: ["BANANA", "MACA", "LARANJA", "UVA", "MORANGO", "ABACAXI", "PERA", "MELANCIA"],
        descricao: "Frutas deliciosas"
    },
    veiculos: {
        palavras: ["CARRO", "MOTO", "ONIBUS", "AVIAO", "NAVIO", "BICICLETA", "CAMINHAO", "TRATOR"],
        descricao: "Meios de transporte"
    },
    cores: {
        palavras: ["AZUL", "VERMELHO", "VERDE", "AMARELO", "ROSA", "ROXO", "LARANJA", "PRETO"],
        descricao: "Cores diversas"
    }
};

const dificuldades = {
    facil: {
        tamanho: 10,
        tempoLimite: 300,
        pontuacaoBase: 10
    },
    normal: {
        tamanho: 15,
        tempoLimite: 450,
        pontuacaoBase: 15
    },
    dificil: {
        tamanho: 20,
        tempoLimite: 600,
        pontuacaoBase: 20
    }
};

function gerarGrade(palavras, tamanho) {
    const grade = Array(tamanho).fill().map(() => Array(tamanho).fill(''));
    const direcoes = [
        [0, 1], [1, 0], [1, 1], [1, -1]
    ];
    
    const posicoesPalavras = [];
    
    palavras.forEach(palavra => {
        let colocada = false;
        let tentativas = 0;
        
        while (!colocada && tentativas < 100) {
            tentativas++;
            
            const dir = direcoes[Math.floor(Math.random() * direcoes.length)];
            const dirX = dir[0];
            const dirY = dir[1];
            
            const startX = dirX > 0 ? 
                Math.floor(Math.random() * (tamanho - palavra.length * dirX)) :
                Math.floor(Math.random() * tamanho);
                
            const startY = dirY > 0 ? 
                Math.floor(Math.random() * (tamanho - palavra.length * Math.abs(dirY))) :
                (dirY < 0 ? 
                    Math.floor(Math.random() * (tamanho - palavra.length * Math.abs(dirY))) + palavra.length - 1 :
                    Math.floor(Math.random() * tamanho));
            
            let podeColocar = true;
            const posicoes = [];
            
            for (let i = 0; i < palavra.length; i++) {
                const x = startX + i * dirX;
                const y = startY + i * dirY;
                
                if (x >= 0 && x < tamanho && y >= 0 && y < tamanho) {
                    if (grade[x][y] !== '' && grade[x][y] !== palavra[i]) {
                        podeColocar = false;
                        break;
                    }
                    posicoes.push({x, y, letra: palavra[i]});
                } else {
                    podeColocar = false;
                    break;
                }
            }
            
            if (podeColocar) {
                posicoes.forEach(pos => {
                    grade[pos.x][pos.y] = pos.letra;
                });
                
                posicoesPalavras.push({
                    palavra: palavra,
                    posicoes: posicoes.map(p => ({x: p.x, y: p.y}))
                });
                
                colocada = true;
            }
        }
    });
    
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < tamanho; i++) {
        for (let j = 0; j < tamanho; j++) {
            if (grade[i][j] === '') {
                grade[i][j] = letras[Math.floor(Math.random() * letras.length)];
            }
        }
    }
    
    return { grade, posicoesPalavras };
}

function validarSelecao(grade, posicoesSelecionadas, posicoesPalavras) {
    const coordenadas = posicoesSelecionadas.map(p => ({x: p[0], y: p[1]}));
    
    // Verificar alinhamento
    if (coordenadas.length < 2) return null;
    
    const dx = coordenadas[1].x - coordenadas[0].x;
    const dy = coordenadas[1].y - coordenadas[0].y;
    
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) return null;
    
    // Verificar consistência
    for (let i = 2; i < coordenadas.length; i++) {
        const dxi = coordenadas[i].x - coordenadas[i-1].x;
        const dyi = coordenadas[i].y - coordenadas[i-1].y;
        
        if (dxi !== dx || dyi !== dy) return null;
    }
    
    // Formar palavra
    let palavra = '';
    coordenadas.forEach(pos => {
        palavra += grade[pos.x][pos.y];
    });
    
    // Verificar se palavra existe (em qualquer direção)
    const palavraReversa = palavra.split('').reverse().join('');
    
    for (const dados of posicoesPalavras) {
        if (dados.palavra === palavra || dados.palavra === palavraReversa) {
            // Verificar correspondência de posições
            const posicoesPalavra = dados.posicoes;
            const encontrouNormal = posicoesPalavra.every((pos, idx) => 
                pos.x === coordenadas[idx].x && pos.y === coordenadas[idx].y
            );
            const encontrouReverso = posicoesPalavra.every((pos, idx) => 
                pos.x === coordenadas[coordenadas.length - 1 - idx].x && 
                pos.y === coordenadas[coordenadas.length - 1 - idx].y
            );
            
            if (encontrouNormal || encontrouReverso) {
                return {
                    palavra: dados.palavra,
                    encontrada: true,
                    pontuacao: dados.palavra.length * 10
                };
            }
        }
    }
    
    return null;
}

module.exports = async (req, res) => {
    // Configuração de CORS
    const allowedOrigin = 'https://playjogosgratis.com';
    const origin = req.headers.origin;
    
    // Permitir apenas o domínio específico
    if (origin && origin === allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Max-Age', '86400');
    } else {
        return res.status(403).json({ 
            error: 'Acesso não autorizado. Este recurso está disponível apenas para https://playjogosgratis.com' 
        });
    }
    
    // Lidar com OPTIONS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        if (req.method === 'GET') {
            if (req.query.acao === 'temas') {
                const listaTemas = Object.keys(temas).map(tema => ({
                    id: tema,
                    nome: tema.charAt(0).toUpperCase() + tema.slice(1),
                    descricao: temas[tema].descricao,
                    quantidade: temas[tema].palavras.length
                }));
                
                return res.status(200).json({
                    temas: listaTemas,
                    dificuldades: Object.keys(dificuldades).map(d => ({
                        id: d,
                        nome: d.charAt(0).toUpperCase() + d.slice(1),
                        ...dificuldades[d]
                    }))
                });
            }
            
            if (req.query.acao === 'novo-jogo') {
                const { tema, dificuldade } = req.query;
                
                if (!tema || !temas[tema]) {
                    return res.status(400).json({ error: 'Tema inválido' });
                }
                
                if (!dificuldade || !dificuldades[dificuldade]) {
                    return res.status(400).json({ error: 'Dificuldade inválida' });
                }
                
                const palavras = [...temas[tema].palavras];
                const tamanho = dificuldades[dificuldade].tamanho;
                const tempoLimite = dificuldades[dificuldade].tempoLimite;
                
                const { grade, posicoesPalavras } = gerarGrade(palavras, tamanho);
                
                const jogoId = Date.now().toString(36) + Math.random().toString(36).substr(2);
                
                return res.status(200).json({
                    jogoId,
                    tema,
                    dificuldade,
                    grade,
                    palavras: palavras,
                    posicoesPalavras, // Incluir as posições para validação
                    tempoLimite,
                    tempoInicio: Date.now(),
                    pontuacaoBase: dificuldades[dificuldade].pontuacaoBase,
                    dicasDisponiveis: 3,
                    tamanhoGrade: tamanho
                });
            }
            
            if (req.query.acao === 'dica') {
                const { palavra } = req.query;
                
                if (!palavra) {
                    return res.status(400).json({ error: 'Palavra não especificada' });
                }
                
                return res.status(200).json({
                    dica: `Dica: "${palavra}" começa com "${palavra[0]}" e tem ${palavra.length} letras.`,
                    custoDica: 5
                });
            }
            
            return res.status(404).json({ error: 'Endpoint não encontrado' });
        }
        
        if (req.method === 'POST') {
            let body;
            try {
                body = JSON.parse(req.body || '{}');
            } catch (e) {
                body = req.body || {};
            }
            
            if (body.acao === 'validar-palavra') {
                const { posicoesSelecionadas, grade, posicoesPalavras } = body;
                
                if (!posicoesSelecionadas || !grade || !posicoesPalavras) {
                    return res.status(400).json({ error: 'Dados insuficientes para validação' });
                }
                
                const resultado = validarSelecao(grade, posicoesSelecionadas, posicoesPalavras);
                
                if (resultado) {
                    return res.status(200).json({
                        valido: true,
                        palavra: resultado.palavra,
                        pontuacao: resultado.pontuacao
                    });
                }
                
                return res.status(200).json({
                    valido: false,
                    mensagem: 'Seleção inválida'
                });
            }
            
            if (body.acao === 'finalizar-jogo') {
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Jogo finalizado'
                });
            }
            
            return res.status(404).json({ error: 'Endpoint não encontrado' });
        }
        
        return res.status(405).json({ error: 'Método não permitido' });
        
    } catch (error) {
        console.error('Erro na API:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
