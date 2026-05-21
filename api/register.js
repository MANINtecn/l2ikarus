import { getConnection } from './_db';
import crypto from 'crypto';

// Apenas letras, números e underscore — sem caracteres especiais
const LOGIN_RE = /^[a-zA-Z0-9_]{4,16}$/;
// Mínimo 6 chars, sem espaços
const PASS_RE  = /^[^\s]{6,64}$/;
// Validação básica de e-mail (opcional no cadastro)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limit simples: 5 tentativas/IP/min
const rateMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const WINDOW = 60_000;
  const MAX = 5;
  const entry = rateMap.get(ip) ?? { count: 0, start: now };
  if (now - entry.start > WINDOW) {
    rateMap.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count++;
  rateMap.set(ip, entry);
  return entry.count > MAX;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] ?? req.socket?.remoteAddress ?? 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ message: 'Muitas tentativas. Aguarde 1 minuto.' });
  }

  const { login, password, email } = req.body ?? {};

  if (!login || !password) {
    return res.status(400).json({ message: 'Login e senha são obrigatórios' });
  }
  if (!LOGIN_RE.test(login)) {
    return res.status(400).json({ message: 'Login: 4-16 caracteres, apenas letras, números e _' });
  }
  if (!PASS_RE.test(password)) {
    return res.status(400).json({ message: 'Senha: mínimo 6 caracteres, sem espaços' });
  }
  if (email && !EMAIL_RE.test(email)) {
    return res.status(400).json({ message: 'E-mail inválido' });
  }

  try {
    const pool = await getConnection();

    // SHA-1 em Base64 — formato esperado pelo L2JMobius
    const hashedPassword = crypto.createHash('sha1').update(password).digest('base64');

    const [existing] = await pool.query(
      'SELECT login FROM accounts WHERE login = ?',
      [login]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Este login já está em uso' });
    }

    await pool.query(
      'INSERT INTO accounts (login, password, email, access_level) VALUES (?, ?, ?, 0)',
      [login, hashedPassword, email ?? '']
    );

    return res.status(200).json({ success: true, message: 'Conta criada com sucesso!' });
  } catch {
    return res.status(500).json({ message: 'Erro ao criar conta. Tente novamente mais tarde.' });
  }
}