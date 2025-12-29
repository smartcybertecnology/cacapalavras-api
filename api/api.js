// api.js - API para o jogo de caça-palavras
// Hospedado em: https://cacapalavras-api.vercel.app/api/api.js

// Dados das palavras por tema
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

// Configurações de dificuldade
const dificuldades = {
    facil: {
        tamanho: 10,
        tempoLimite: 300, // 5 minutos
        pontuacaoBase: 10
    },
    normal: {
        tamanho: 15,
        tempoLimite: 450, // 7.5 minutos
        pontuacaoBase: 15
    },
    dificil: {
        tamanho: 20,
        tempoLimite: 600, // 10 minutos
        pontuacaoBase: 20
    }
};

// Função para gerar grade de letras
function gerarGrade(palavras, tamanho) {
    // Inicializar grade vazia
    const grade = Array(tamanho).fill().map(() => Array(tamanho).fill(''));
    const direcoes = [
        [0, 1],   // horizontal →
        [1, 0],   // vertical ↓
        [1, 1],   // diagonal ↘
        [1, -1]   // diagonal ↙
    ];
    
    const posicoesPalavras = [];
    
    // Colocar palavras na grade
    palavras.forEach(palavra => {
        let colocada = false;
        let tentativas = 0;
        
        while (!colocada && tentativas < 100) {
            tentativas++;
            
            // Escolher direção aleatória
            const dir = direcoes[Math.floor(Math.random() * direcoes.length)];
            const dirX = dir[0];
            const dirY = dir[1];
            
            // Calcular posição inicial possível
            const startX = dirX > 0 ? 
                Math.floor(Math.random() * (tamanho - palavra.length * dirX)) :
                Math.floor(Math.random() * tamanho);
                
            const startY = dirY > 0 ? 
                Math.floor(Math.random() * (tamanho - palavra.length * Math.abs(dirY))) :
                (dirY < 0 ? 
                    Math.floor(Math.random() * (tamanho - palavra.length * Math.abs(dirY))) + palavra.length - 1 :
                    Math.floor(Math.random() * tamanho));
            
            // Verificar se a posição está livre
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
            
            // Colocar palavra se possível
            if (podeColocar) {
                posicoes.forEach(pos => {
                    grade[pos.x][pos.y] = pos.letra;
                });
                
                posicoesPalavras.push({
                    palavra: palavra,
                    posicoes: posicoes.map(p => ({x: p.x, y: p.y})),
                    direcao: dir
                });
                
                colocada = true;
            }
        }
    });
    
    // Preencher espaços vazios com letras aleatórias
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

// Função para validar seleção do jogador
function validarSelecao(grade, posicoesSelecionadas, posicoesPalavras) {
    // Converter posições selecionadas para array de coordenadas
    const coordenadas = posicoesSelecionadas.map(p => ({x: p[0], y: p[1]}));
    
    // Verificar se forma uma linha reta
    const dx = coordenadas[1]?.x - coordenadas[0]?.x;
    const dy = coordenadas[1]?.y - coordenadas[0]?.y;
    
    if (!dx && !dy) return null;
    
    // Verificar se todas estão alinhadas
    for (let i = 2; i < coordenadas.length; i++) {
        const dxi = coordenadas[i].x - coordenadas[i-1].x;
        const dyi = coordenadas[i].y - coordenadas[i-1].y;
        
        if (dxi !== dx || dyi !== dy) {
            return null;
        }
    }
    
    // Normalizar direção para frente ou trás
    const dir = dx === 0 ? [0, dy > 0 ? 1 : -1] : 
                dy === 0 ? [dx > 0 ? 1 : -1, 0] :
                [dx > 0 ? 1 : -1, dy > 0 ? 1 : -1];
    
    // Formar palavra
    let palavra = '';
    coordenadas.forEach(pos => {
        palavra += grade[pos.x][pos.y];
    });
    
    // Verificar se a palavra existe na lista
    for (const dados of posicoesPalavras) {
        if (dados.palavra === palavra || dados.palavra === palavra.split('').reverse().join('')) {
            // Verificar se as posições correspondem
            const posicoesPalavra = dados.posicoes;
            const encontrou = posicoesPalavra.every((pos, idx) => 
                pos.x === coordenadas[idx].x && pos.y === coordenadas[idx].y
            ) || posicoesPalavra.every((pos, idx) => 
                pos.x === coordenadas[coordenadas.length - 1 - idx].x && 
                pos.y === coordenadas[coordenadas.length - 1 - idx].y
            );
            
            if (encontrou) {
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

// Handler principal da API
module.exports = async (req, res) => {
    // Configuração de CORS - Permitir apenas o domínio específico
    const allowedOrigin = 'https://playjogosgratis.com';
    
    // Verificar origem da requisição
    const origin = req.headers.origin;
    if (origin && origin === allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        // Bloquear outras origens
        return res.status(403).json({ 
            error: 'Acesso não autorizado. Este recurso está disponível apenas para https://playjogosgratis.com' 
        });
    }
    
    // Configurar outros headers CORS
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 horas
    
    // Lidar com requisição OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Endpoints da API
    if (req.method === 'GET') {
        // Endpoint para obter lista de temas
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
        
        // Endpoint para iniciar novo jogo
        if (req.query.acao === 'novo-jogo') {
            const { tema, dificuldade } = req.query;
            
            if (!tema || !temas[tema]) {
                return res.status(400).json({ error: 'Tema inválido' });
            }
            
            if (!dificuldade || !dificuldades[dificuldade]) {
                return res.status(400).json({ error: 'Dificuldade inválida' });
            }
            
            const palavras = temas[tema].palavras;
            const tamanho = dificuldades[dificuldade].tamanho;
            const tempoLimite = dificuldades[dificuldade].tempoLimite;
            const pontuacaoBase = dificuldades[dificuldade].pontuacaoBase;
            
            const { grade, posicoesPalavras } = gerarGrade(palavras, tamanho);
            
            // Gerar ID único para o jogo
            const jogoId = Date.now().toString(36) + Math.random().toString(36).substr(2);
            
            return res.status(200).json({
                jogoId,
                tema,
                dificuldade,
                grade,
                palavras: palavras.sort(() => Math.random() - 0.5),
                palavrasEncontradas: [],
                tempoLimite,
                tempoInicio: Date.now(),
                pontuacao: 0,
                pontuacaoBase,
                dicasDisponiveis: 3,
                tamanhoGrade: tamanho
            });
        }
        
        // Endpoint para obter dica
        if (req.query.acao === 'dica') {
            const { jogoId, palavra } = req.query;
            
            // Em produção, validaria o jogoId no banco de dados
            // Aqui retornamos uma dica simples
            
            if (!palavra) {
                return res.status(400).json({ error: 'Palavra não especificada' });
            }
            
            // Retornar a primeira letra e última letra como dica
            return res.status(200).json({
                dica: `A palavra "${palavra}" começa com "${palavra[0]}" e termina com "${palavra[palavra.length-1]}"`,
                custoDica: 5 // pontos perdidos por usar dica
            });
        }
        
        return res.status(404).json({ error: 'Endpoint não encontrado' });
    }
    
    if (req.method === 'POST') {
        let body;
        try {
            body = JSON.parse(req.body || '{}');
        } catch (e) {
            body = {};
        }
        
        // Endpoint para validar palavra encontrada
        if (body.acao === 'validar-palavra') {
            const { jogoId, posicoesSelecionadas, grade, posicoesPalavras } = body;
            
            if (!posicoesSelecionadas || !grade) {
                return res.status(400).json({ error: 'Dados insuficientes' });
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
                mensagem: 'Palavra não encontrada ou seleção inválida'
            });
        }
        
        // Endpoint para finalizar jogo
        if (body.acao === 'finalizar-jogo') {
            const { jogoId, pontuacao, palavrasEncontradas, tempoDecorrido } = body;
            
            // Em produção, salvaria no banco de dados
            return res.status(200).json({
                sucesso: true,
                mensagem: 'Jogo finalizado com sucesso!',
                pontuacaoFinal: pontuacao,
                palavrasEncontradas: palavrasEncontradas.length,
                tempoDecorrido
            });
        }
        
        return res.status(404).json({ error: 'Endpoint não encontrado' });
    }
    
    return res.status(405).json({ error: 'Método não permitido' });
};
