// _links.js — links que o admin edita no painel (aba LINKS) e o site le em /api/links:
// convites da comunidade (grupo do WhatsApp e Discord) e o download do cliente do Sandbox.
// Ficam na tabela site_settings do banco do Essence (o compartilhado da rede, igual Ikoin e contas).
// Arquivo com "_" na frente: a Vercel nao transforma em funcao (nao gasta o limite do plano).

export const LINK_CHAVES = {
  grupo: 'link_grupo',
  discord: 'link_discord',
  download: 'link_download_sandbox',
  tamanho: 'download_sandbox_tamanho',
}

export const SQL_TABELA = `CREATE TABLE IF NOT EXISTS site_settings (
  k VARCHAR(64) NOT NULL PRIMARY KEY,
  v TEXT NOT NULL,
  updated_at BIGINT NOT NULL DEFAULT 0,
  updated_by VARCHAR(120) NULL
)`

// So' aceita convite de verdade: um link errado colado no painel nao vira botao quebrado
// (nem link para fora) no site. Vazio = esconder o botao.
const FORMATOS = {
  grupo: /^https:\/\/(chat\.whatsapp\.com\/[A-Za-z0-9]{10,40}|wa\.me\/[A-Za-z0-9?=&%._-]{3,200})$/,
  discord: /^https:\/\/(discord\.gg\/[A-Za-z0-9-]{2,40}|(www\.)?discord\.com\/invite\/[A-Za-z0-9-]{2,40})$/,
}
const NOMES = { grupo: 'grupo', discord: 'Discord' }
const EXEMPLOS = {
  grupo: 'https://chat.whatsapp.com/XXXX',
  discord: 'https://discord.gg/XXXX',
}

export function validarLink(tipo, valor) {
  const url = String(valor ?? '').trim()
  if (tipo === 'download') return validarDownload(url)
  if (tipo === 'tamanho') return validarTamanho(url)
  if (!url) return { ok: true, url: '' }
  if (!FORMATOS[tipo]?.test(url)) {
    return { ok: false, error: `Link do ${NOMES[tipo]} inválido. Formato esperado: ${EXEMPLOS[tipo]}` }
  }
  return { ok: true, url }
}

// Download: so' Google Drive, e sempre gravado no formato /file/d/ID/view. NAO usar
// uc?export=download: acima de ~100 MB o Google devolve a pagina "nao foi possivel verificar
// virus" e o navegador salva um HTML de 2 KB no lugar do cliente. O /view abre a pagina do
// Drive, que trata o aviso e entrega o arquivo. Obrigatorio (sem ele o botao Baixar quebra).
function validarDownload(url) {
  if (!url) return { ok: false, error: 'O link do download não pode ficar vazio.' }
  let id = null
  try {
    const u = new URL(url)
    if (u.protocol === 'https:' && /^(drive|docs)\.google\.com$/.test(u.hostname)) {
      const m = u.pathname.match(/\/file\/d\/([A-Za-z0-9_-]{10,})/)
      id = m ? m[1] : u.searchParams.get('id')
    }
  } catch {}
  if (!id || !/^[A-Za-z0-9_-]{10,}$/.test(id)) {
    return { ok: false, error: 'Link do download inválido. Cole o link de compartilhamento do Google Drive (https://drive.google.com/file/d/.../view).' }
  }
  return { ok: true, url: `https://drive.google.com/file/d/${id}/view` }
}

// Tamanho mostrado embaixo do botao (opcional). Texto curto tipo "3,4 GB".
function validarTamanho(txt) {
  if (!txt) return { ok: true, url: '' }
  if (!/^[0-9]{1,4}([.,][0-9]{1,2})?\s?(MB|GB)$/i.test(txt)) {
    return { ok: false, error: 'Tamanho inválido. Use algo como 3,4 GB ou 900 MB.' }
  }
  return { ok: true, url: txt.toUpperCase().replace(/\s?(MB|GB)$/, ' $1') }
}

// Devolve { grupo, discord, download, tamanho } so' com as chaves gravadas (a que nao existe
// fica de fora e o site usa o padrao). null = tabela ainda nao existe ou banco fora.
export async function lerLinks(db) {
  try {
    const chaves = Object.values(LINK_CHAVES)
    const [rows] = await db.query(
      `SELECT k, v FROM site_settings WHERE k IN (${chaves.map(() => '?').join(', ')})`,
      chaves
    )
    const out = {}
    for (const r of rows || []) {
      const tipo = Object.keys(LINK_CHAVES).find((t) => LINK_CHAVES[t] === r.k)
      if (tipo) out[tipo] = r.v
    }
    return out
  } catch {
    return null
  }
}
