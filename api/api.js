// api/api.js - CÓDIGO COMPLETO DO JOGO COM VERIFICAÇÃO SERVIDOR
export default async function handler(request, response) {
    // OBTER O DOMÍNIO DE ORIGEM DA REQUISIÇÃO
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    
    // DOMÍNIOS PERMITIDOS
    const ALLOWED_DOMAINS = [
        'https://playjogosgratis.com',
        'http://playjogosgratis.com'
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
    
    // TODO: COLE AQUI TODO O SEU CÓDIGO DO JOGO
    // (remova este comentário e cole o código JavaScript completo do seu jogo)
    const gameCode = \`
        // ========================
        // CAÇA-PALAVRAS MÁGICO
        // ========================
        
        console.log('🎮 Jogo Caça-Palavras carregado da API!');
        
        // Seu código do jogo completo aqui...
        // Cole todo o JavaScript do seu index.html aqui
        
        // Exemplo de função básica:
        window.showTutorial = function() {
            document.getElementById('tutorial-overlay').classList.remove('hidden');
        };
        
        window.closeTutorial = function() {
            document.getElementById('tutorial-overlay').classList.add('hidden');
        };
    \`;
    
    // Retorna o código do jogo
    return response.status(200)
        .setHeader('Content-Type', 'application/javascript')
        .setHeader('Cache-Control', 'public, max-age=3600')
        .send(gameCode);
}
