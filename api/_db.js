// _db.js — encaminha as queries pra VPS (status-server :8080 /query) em vez de conectar
// direto no MySQL. A 3306 fica FECHADA (segurança). Todas as APIs que usam getConnection()
// continuam funcionando sem mudança: o objeto retornado tem .query(sql, params) -> [result, fields].

const BASE = process.env.VPS_API_URL || (process.env.VPS_STATUS_URL || '').replace(/\/status$/, '')
const KEY = process.env.VPS_STATUS_TOKEN

async function vpsQuery(sql, params = [], db) {
  if (!BASE || !KEY) {
    throw new Error('VPS_API_URL/VPS_STATUS_TOKEN não configurados no Vercel')
  }
  const r = await fetch(BASE + '/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': KEY },
    // db='interlude' roteia pro banco l2jacis na VPS; omitido = banco do Essence.
    body: JSON.stringify({ sql, params, db }),
  })
  let data
  try { data = await r.json() } catch { data = {} }
  if (!r.ok) {
    throw new Error(data.error || `VPS query falhou (HTTP ${r.status})`)
  }
  // mesmo formato do mysql2: [rows_ou_result, fields] (fields nao usado pelas APIs)
  return [data.result, []]
}

// Mantém a mesma assinatura que as APIs já usam: const db = await getConnection(); await db.query(...)
// getConnection('interlude') devolve um handle preso ao banco do Interlude (l2jacis).
export async function getConnection(db) {
  return { query: (sql, params) => vpsQuery(sql, params, db) }
}

export const dbConfig = { proxied: true }
