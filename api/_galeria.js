// _galeria.js — vitrine de imagens reais do jogo (home do l2ikarus.com).
// Os arquivos ficam no Vercel Blob (CDN da Vercel); a lista (endereco, legenda, ordem) fica
// na tabela site_galeria do banco do Essence. Cada imagem tem duas versoes ja' comprimidas
// no navegador do admin: o card (retrato, leve) e a grande (abre no clique).
// Arquivo com "_" na frente: a Vercel nao transforma em funcao (nao gasta o limite do plano).

import { put, del } from '@vercel/blob'

// endereco do Blob nunca muda (sufixo aleatorio): da' para guardar no cache por 1 ano
export const CACHE_1_ANO = 60 * 60 * 24 * 365

export const SQL_TABELA_GALERIA = `CREATE TABLE IF NOT EXISTS site_galeria (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  url_card VARCHAR(500) NOT NULL,
  url_full VARCHAR(500) NOT NULL,
  legenda VARCHAR(140) NOT NULL DEFAULT '',
  ordem INT NOT NULL DEFAULT 0,
  visivel TINYINT NOT NULL DEFAULT 1,
  criado_em BIGINT NOT NULL DEFAULT 0,
  criado_por VARCHAR(120) NULL
)`

const MAX_BYTES = 1.5 * 1024 * 1024 // por versao, depois de comprimida no navegador

// "data:image/webp;base64,...." -> Buffer (so' imagem leve e nos formatos que o site usa)
function lerDataUrl(dataUrl) {
  const m = /^data:(image\/(webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''))
  if (!m) return null
  const buf = Buffer.from(m[3], 'base64')
  if (!buf.length || buf.length > MAX_BYTES) return null
  return { buf, tipo: m[1], ext: m[2] === 'jpeg' ? 'jpg' : m[2] }
}

export function limparLegenda(t) {
  return String(t ?? '').replace(/\s+/g, ' ').trim().slice(0, 140)
}

export async function lerGaleria(db, { todas = false } = {}) {
  try {
    const [linhas] = await db.query(
      `SELECT id, url_card, url_full, legenda, ordem, visivel FROM site_galeria
       ${todas ? '' : 'WHERE visivel = 1'} ORDER BY ordem ASC, id DESC`
    )
    return linhas || []
  } catch {
    return null // tabela ainda nao existe
  }
}

export async function subirImagem(db, { card, full, legenda }, quem) {
  const c = lerDataUrl(card)
  const f = lerDataUrl(full)
  if (!c || !f) return { ok: false, error: 'Imagem inválida ou grande demais.' }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: 'Armazenamento de imagens (Vercel Blob) não está ligado ao projeto.' }
  }
  const opcoes = (tipo) => ({ access: 'public', contentType: tipo, addRandomSuffix: true, cacheControlMaxAge: CACHE_1_ANO })
  const bCard = await put(`galeria/card.${c.ext}`, c.buf, opcoes(c.tipo))
  const bFull = await put(`galeria/full.${f.ext}`, f.buf, opcoes(f.tipo))
  await db.query(SQL_TABELA_GALERIA)
  // a nova entra no comeco da vitrine
  const [[{ menor }]] = await db.query('SELECT COALESCE(MIN(ordem), 0) AS menor FROM site_galeria')
  await db.query(
    'INSERT INTO site_galeria (url_card, url_full, legenda, ordem, visivel, criado_em, criado_por) VALUES (?, ?, ?, ?, 1, ?, ?)',
    [bCard.url, bFull.url, limparLegenda(legenda), Number(menor) - 1, Date.now(), quem]
  )
  return { ok: true }
}

export async function apagarImagem(db, id) {
  const [[linha]] = await db.query('SELECT url_card, url_full FROM site_galeria WHERE id = ?', [id])
  if (!linha) return { ok: false, error: 'Imagem não encontrada.' }
  try { await del([linha.url_card, linha.url_full]) } catch { /* arquivo ja' sumiu: segue e tira da lista */ }
  await db.query('DELETE FROM site_galeria WHERE id = ?', [id])
  return { ok: true }
}
