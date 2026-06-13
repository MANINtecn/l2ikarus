// _db.js — encaminha as queries pra VPS (status-server :8080 /query) em vez de conectar
// direto no MySQL. A 3306 fica FECHADA (segurança). Todas as APIs que usam getConnection()
// continuam funcionando sem mudança: o objeto retornado tem .query(sql, params) -> [result, fields].

const BASE = process.env.VPS_API_URL || (process.env.VPS_STATUS_URL || '').replace(/\/status$/, '')
const KEY = process.env.VPS_STATUS_TOKEN

async function vpsQuery(sql, params = []) {
  if (!BASE || !KEY) {
    throw new Error('VPS_API_URL/VPS_STATUS_TOKEN não configurados no Vercel')
  }
  const r = await fetch(BASE + '/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': KEY },
    body: JSON.stringify({ sql, params }),
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
export async function getConnection() {
  return { query: vpsQuery }
}

export const dbConfig = { proxied: true }
