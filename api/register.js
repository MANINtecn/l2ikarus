import { getConnection } from './_db';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { login, password, email } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: "Login e senha são obrigatórios" });
  }

  try {
    const pool = await getConnection();

    // No Mobius, a senha costuma ser Base64 do hash SHA-1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('base64');

    // Verifica se a conta já existe
    const [existing] = await pool.query('SELECT login FROM accounts WHERE login = ?', [login]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Este login já está em uso" });
    }

    // Insere a nova conta
    await pool.query(
      'INSERT INTO accounts (login, password, email, access_level) VALUES (?, ?, ?, 0)',
      [login, hashedPassword, email || '']
    );

    res.status(200).json({ success: true, message: "Conta criada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar conta. Tente novamente mais tarde." });
  }
}
