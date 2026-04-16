import { getConnection } from './_db';

export default async function handler(req, res) {
  try {
    const pool = await getConnection();
    
    // Consulta para contar jogadores online (ajuste os nomes das tabelas se necessário)
    // No Mobius Essence geralmente é a tabela 'characters' com a coluna 'online'
    const [playersRow] = await pool.query('SELECT COUNT(*) as count FROM characters WHERE online > 0');
    
    // Consulta para contar total de contas criadas
    const [accountsRow] = await pool.query('SELECT COUNT(*) as count FROM accounts');
    
    res.status(200).json({ 
      online: true, 
      players: playersRow[0].count,
      accounts: accountsRow[0].count,
      status_login: "ONLINE",
      status_game: "ONLINE"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      online: false, 
      players: 0,
      accounts: 0,
      error: "Erro ao conectar ao banco de dados. Verifique a ponte Ngrok/VPS." 
    });
  }
}
