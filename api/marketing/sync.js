import { getConnection } from '../_db';

export default async function handler(req, res) {
  const { secret } = req.query;

  // Segurança básica para evitar que curiosos baixem seus tokens
  if (secret !== process.env.HUB_SYNC_SECRET) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  try {
    const pool = await getConnection();
    const [rows] = await pool.query('SELECT platform, token_data FROM marketing_tokens');

    const tokens = {};
    rows.forEach(row => {
      tokens[row.platform] = typeof row.token_data === 'string' ? JSON.parse(row.token_data) : row.token_data;
    });

    res.status(200).json(tokens);
  } catch (error) {
    console.error('Erro na sincronia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
