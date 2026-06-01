import { getConnection } from './_db.js'

// L2JBrasil chama este endpoint após o jogador votar
// Docs: https://top.l2jbrasil.com/api-docs
export default async function handler(req, res) {
  const apiKey = process.env.L2JBRASIL_API_KEY

  // Verifica a chave da requisição
  const receivedKey = req.query.key || req.body?.key
  if (!apiKey || receivedKey !== apiKey) {
    return res.status(403).json({ error: 'Chave inválida' })
  }

  // L2JBrasil envia o username ou IP do votante
  const username = req.query.username || req.query.user || req.body?.username
  const ip = req.query.ip || req.headers['x-forwarded-for']?.split(',')[0]

  console.log(`Voto recebido — usuário: ${username}, IP: ${ip}`)

  // TODO: dar recompensa in-game ao jogador
  // Exemplo: adicionar L-Coins ou item via query no banco
  // try {
  //   const db = await getConnection()
  //   await db.query('UPDATE characters SET ... WHERE account_name = ?', [username])
  // } catch (err) { console.error(err) }

  // L2JBrasil espera status 200 para confirmar recebimento
  res.status(200).json({ success: true, message: 'Voto registrado' })
}
