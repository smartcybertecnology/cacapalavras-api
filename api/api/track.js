// /api/track.js
export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Responder a preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const { gameId, gameName, duration, action, timestamp, userId } = data;
      
      console.log(`📊 Recebido checkpoint via Beacon: ${gameName} - ${duration}s`);
      
      // Aqui você pode salvar os dados em um banco de dados temporário
      // ou processá-los conforme necessário
      
      return res.status(200).json({ 
        success: true, 
        message: 'Checkpoint recebido',
        game: gameName,
        duration: duration 
      });
      
    } catch (error) {
      console.error('❌ Erro no endpoint /api/track:', error);
      return res.status(500).json({ error: 'Erro interno' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}