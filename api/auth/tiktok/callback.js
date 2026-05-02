import { getConnection } from '../../_db';
import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Código de autorização não fornecido.');
  }

  try {
    const pool = await getConnection();

    // 1. Garante que a tabela de tokens existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marketing_tokens (
        platform VARCHAR(50) PRIMARY KEY,
        token_data JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 2. Troca o código pelo Token real no TikTok
    const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', 
      new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `https://l2ikarus.com/api/auth/tiktok/callback`,
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const tokenData = response.data;

    // 3. Salva ou Atualiza no Banco
    await pool.query(
      'INSERT INTO marketing_tokens (platform, token_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE token_data = ?, updated_at = CURRENT_TIMESTAMP',
      ['tiktok', JSON.stringify(tokenData), JSON.stringify(tokenData)]
    );

    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
        <h1 style="color: #2563eb;">Sucesso! ✅</h1>
        <p>A conta do TikTok foi conectada ao Ikarus Media Hub.</p>
        <p>Você já pode fechar esta aba e voltar para o jogo.</p>
      </div>
    `);

  } catch (error) {
    console.error('Erro no Callback do TikTok:', error.response?.data || error.message);
    res.status(500).send('Erro ao processar a autenticação com o TikTok.');
  }
}
