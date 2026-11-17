import { URL_JOGO } from './ikarusWeb'

// Entra no jogo com a conta do site: pede um passe (vale 2 min, uso unico) e abre o jogo com ele.
// Devolve 'login' se nao ha sessao no site, uma mensagem de erro, ou nada (ja' redirecionou).
export async function entrarNoJogo() {
  try {
    const r = await fetch('/api/player/ticket', { method: 'POST', credentials: 'same-origin' })
    if (r.status === 401) return 'login'
    const d = await r.json().catch(() => ({}))
    if (!r.ok || !d.ticket) return d.error || 'Não consegui abrir o jogo agora. Tente de novo.'
    window.location.href = `${URL_JOGO}#t=${d.ticket}`
    return null
  } catch {
    return 'Sem conexão com o site. Tente de novo.'
  }
}
