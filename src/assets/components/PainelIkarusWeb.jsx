import { useEffect, useRef, useState } from 'react'
import './PaginaIkarusWeb.css'
import './PainelIkarusWeb.css'
import IkoinEmblema from './IkoinEmblema'
import ReferralProgram from './ReferralProgram'
import { URL_STATUS_JOGO } from '../../config/ikarusWeb'
import { entrarNoJogo } from '../../config/jogar'

/**
 * Painel do jogador da home nova (l2ikarus.com). Mesmas APIs do PlayerPanel antigo
 * (/api/player/*, /api/payment/*): saldo e compra de Ikoin no PIX, resgate de codigo,
 * historico e indicacao. O PlayerPanel antigo continua nas paginas legadas (/jogos, /sandbox).
 * Personagens: os do L2 Ikarus Web entram quando a conta do site for unificada com a do jogo.
 */

const PACOTES = [50, 100, 250, 500, 1000]
const reais = (v) => Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const ABAS = [
  ['jogos', 'Jogos'],
  ['carteira', 'Carteira'],
  ['loja', 'Loja de skins'],
  ['personagens', 'Personagens'],
  ['indicacao', 'Indicação'],
]

const fmtData = (d) => {
  try { return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) } catch { return '' }
}

function ModalCompra({ onFechar }) {
  const [quantia, setQuantia] = useState(100)
  const [cpf, setCpf] = useState('')
  const [pix, setPix] = useState(null)
  const [pago, setPago] = useState(false)
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState('')
  const [copiado, setCopiado] = useState(false)
  const poll = useRef(null)

  useEffect(() => () => { if (poll.current) clearInterval(poll.current) }, [])

  const acompanhar = (orderId) => {
    if (poll.current) clearInterval(poll.current)
    poll.current = setInterval(async () => {
      try {
        const s = await fetch(`/api/payment/status?orderId=${orderId}`).then((x) => x.json())
        if (s.status === 'paid') {
          clearInterval(poll.current)
          setPago(true)
          setTimeout(() => window.location.reload(), 2500)
        }
      } catch {}
    }, 4000)
  }

  const gerarPix = async () => {
    const limpo = (cpf || '').replace(/\D/g, '')
    if (limpo.length !== 11) { setErro('Informe um CPF válido (11 dígitos) para o PIX.'); return }
    setGerando(true); setErro('')
    try {
      const r = await fetch('/api/payment/pix', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: quantia, cpf: limpo }),
      }).then((x) => x.json())
      if (r.qrCode) { setPix(r); acompanhar(r.orderId) }
      else setErro(r.error || 'Erro ao gerar PIX.')
    } catch { setErro('Erro de conexão.') }
    finally { setGerando(false) }
  }

  const copiar = () => {
    if (!pix?.qrCode) return
    navigator.clipboard?.writeText(pix.qrCode)
    setCopiado(true); setTimeout(() => setCopiado(false), 1500)
  }

  return (
    <div className="ikp-modal" onClick={onFechar}>
      <div className="ikp-modal-caixa" onClick={(e) => e.stopPropagation()}>
        {!pix && !pago && (<>
          <IkoinEmblema size={64} className="ikp-flutua" />
          <h3>Comprar Ikoin</h3>
          <p className="ikp-mudo">1 Ikoin = R$ 1,00 · pagamento por PIX</p>
          <div className="ikp-pacotes">
            {PACOTES.map((p) => (
              <button key={p} className={quantia === p ? 'sel' : ''} onClick={() => setQuantia(p)}>{p}</button>
            ))}
          </div>
          <div className="ikp-quantia">
            <input type="number" min="1" value={quantia} onChange={(e) => setQuantia(parseInt(e.target.value) || 0)} aria-label="Quantidade de Ikoin" />
            <span>= R$ {reais(quantia)}</span>
          </div>
          <input className="ikp-campo" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF do pagador (obrigatório no PIX)" maxLength={14} inputMode="numeric" />
          {erro && <div className="ikp-erro">{erro}</div>}
          <button className="ikw-btn alto ikp-cheio" onClick={gerarPix} disabled={gerando || quantia < 1}>
            {gerando ? 'Gerando...' : `Gerar PIX · R$ ${reais(quantia)}`}
          </button>
          <button className="ikp-link" onClick={onFechar}>Cancelar</button>
        </>)}

        {pix && !pago && (<>
          <h3>Pague com PIX</h3>
          <p className="ikp-mudo">{pix.amount} Ikoin · R$ {reais(pix.amount)}</p>
          {pix.qrBase64
            ? <img className="ikp-qr" src={`data:image/png;base64,${pix.qrBase64}`} alt="QR code do PIX" />
            : <p className="ikp-erro">QR indisponível, use o código abaixo.</p>}
          <p className="ikp-mudo">Escaneie no app do banco ou copie o código:</p>
          <div className="ikp-copia">
            <input readOnly value={pix.qrCode} onClick={(e) => e.target.select()} aria-label="Código PIX copia e cola" />
            <button className="ikw-btn" onClick={copiar}>{copiado ? 'Copiado' : 'Copiar'}</button>
          </div>
          <p className="ikp-aguarda"><i aria-hidden="true" />Aguardando pagamento. Os Ikoin caem sozinhos.</p>
          <button className="ikp-link" onClick={onFechar}>Fechar</button>
        </>)}

        {pago && (<>
          <IkoinEmblema size={72} />
          <h3 className="ikp-ok">Pagamento confirmado</h3>
          <p className="ikp-mudo">+{pix?.amount} Ikoin na sua conta. Atualizando...</p>
        </>)}
      </div>
    </div>
  )
}

// Cartao de um jogo na central: arte, status e o botao Jogar (entra com a conta do site, sem outro login)
function CartaoJogo() {
  const [indo, setIndo] = useState(false)
  const [erro, setErro] = useState('')
  const [online, setOnline] = useState(null)
  useEffect(() => {
    const ctl = new AbortController()
    fetch(URL_STATUS_JOGO, { signal: ctl.signal, cache: 'no-store' }).then((r) => r.json())
      .then((d) => setOnline((d.canais || []).reduce((a, c) => a + (c.jogadores || 0), 0)))
      .catch(() => setOnline(null))
    return () => ctl.abort()
  }, [])
  const jogar = async () => {
    setIndo(true); setErro('')
    const r = await entrarNoJogo()
    if (r === 'login') { setErro('Sua sessão expirou. Saia e entre de novo.'); setIndo(false) }
    else if (r) { setErro(r); setIndo(false) }
  }
  return (
    <article className="ikp-jogo">
      <img src="/media/web/capa_logo.webp" alt="L2 Ikarus" />
      <div className="ikp-jogo-info">
        <small>MMORPG de ação · sem target</small>
        <h2>L2 Ikarus</h2>
        <p className="ikp-mudo">O primeiro L2 sem target. No navegador, no PC e no celular.</p>
        {online !== null && <p className="ikp-jogo-on"><i aria-hidden="true" />Servidor online{online > 0 ? ` · ${online} ${online === 1 ? 'jogador' : 'jogadores'}` : ''}</p>}
        <button className="ikw-jogar grande" onClick={jogar} disabled={indo}>
          <span>{indo ? 'Abrindo...' : 'Jogar'}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 L19 12 L7 20 Z" /></svg>
        </button>
        {erro && <p className="ikp-erro-txt">{erro}</p>}
      </div>
    </article>
  )
}

export default function PainelIkarusWeb({ data, onLogout, onFechar }) {
  const [aba, setAba] = useState('jogos')
  const [comprando, setComprando] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [resgate, setResgate] = useState(null)
  const [historico, setHistorico] = useState(null)

  useEffect(() => {
    fetch('/api/player/wallet').then((r) => (r.ok ? r.json() : null))
      .then((d) => setHistorico(d?.transactions || []))
      .catch(() => setHistorico([]))
  }, [])

  // trava a rolagem da pagina de tras enquanto o painel esta aberto
  useEffect(() => {
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = antes }
  }, [])

  const resgatar = async () => {
    setResgate(null)
    if (!codigo.trim()) return
    try {
      const r = await fetch('/api/player/redeem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codigo.trim() }),
      }).then((x) => x.json())
      if (r.success) {
        setResgate({ ok: true, texto: r.message })
        setCodigo('')
        setTimeout(() => window.location.reload(), 1800)
      } else setResgate({ ok: false, texto: r.error })
    } catch { setResgate({ ok: false, texto: 'Erro de conexão.' }) }
  }

  return (
    <div className="ikw ikp" role="dialog" aria-label="Painel do jogador">
      <header className="ikp-topo">
        <button className="ikw-marca ikp-marca" onClick={onFechar} aria-label="Voltar ao site">
          <i aria-hidden="true" /><span>L2 <b>IKARUS</b></span>
        </button>
        <div className="ikp-conta">
          <div className="ikp-quem">
            <b>{data.login}</b>
            {data.email && <small>{data.email}</small>}
          </div>
          <button className="ikw-btn fantasma" onClick={onFechar}>Voltar ao site</button>
          <button className="ikw-btn ikp-sair" onClick={onLogout}>Sair</button>
        </div>
      </header>

      <div className="ikp-corpo">
        <div className="ikp-cab">
          <small>Painel do jogador</small>
          <h1>Olá, {data.login}</h1>
        </div>

        <nav className="ikp-abas" role="tablist">
          {ABAS.map(([id, nome]) => (
            <button key={id} role="tab" aria-selected={aba === id} className={aba === id ? 'sel' : ''} onClick={() => setAba(id)}>{nome}</button>
          ))}
        </nav>

        {aba === 'carteira' && (
          <div className="ikp-grade">
            <section className="ikp-saldo">
              <IkoinEmblema size={84} className="ikp-flutua" />
              <div>
                <small>Seu saldo</small>
                <b>{(data.ikoin ?? 0).toLocaleString('pt-BR')}</b>
                <span>Ikoin</span>
              </div>
              <button className="ikw-btn alto ikp-cheio" onClick={() => setComprando(true)}>Comprar Ikoin</button>
            </section>

            <section className="ikp-bloco">
              <h2>Resgatar código</h2>
              <div className="ikp-copia">
                <input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && resgatar()}
                  placeholder="CÓDIGO PROMOCIONAL"
                  aria-label="Código promocional"
                />
                <button className="ikw-btn" onClick={resgatar}>Resgatar</button>
              </div>
              {resgate && <p className={resgate.ok ? 'ikp-ok' : 'ikp-erro-txt'}>{resgate.texto}</p>}
            </section>

            <section className="ikp-bloco ikp-hist">
              <h2>Histórico</h2>
              {historico === null && <p className="ikp-mudo">Carregando...</p>}
              {historico?.length === 0 && <p className="ikp-mudo">Nenhuma movimentação ainda.</p>}
              {historico?.length > 0 && (
                <ul>
                  {historico.map((t, i) => (
                    <li key={i}>
                      <span>{t.description || t.type}</span>
                      <small>{fmtData(t.created_at)}</small>
                      <b className={t.amount >= 0 ? 'mais' : 'menos'}>{t.amount >= 0 ? '+' : ''}{t.amount}</b>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {aba === 'loja' && (
          <section className="ikp-bloco">
            <h2>Loja de skins</h2>
            <p className="ikp-mudo">As skins mudam só a aparência do personagem e são compradas com Ikoin. O catálogo está chegando.</p>
            <div className="ikp-skins">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ '--i': i }}><span>Em breve</span></div>
              ))}
            </div>
          </section>
        )}

        {aba === 'jogos' && (
          <div className="ikp-jogos">
            <CartaoJogo />
            <section className="ikp-bloco ikp-embreve">
              <h2>Mais jogos da IS Labs</h2>
              <p className="ikp-mudo">Novos jogos web vão aparecer aqui, todos com esta mesma conta.</p>
            </section>
          </div>
        )}

        {aba === 'personagens' && (
          <section className="ikp-bloco ikp-vazio">
            <h2>Seus personagens</h2>
            <p className="ikp-mudo">Em breve os seus personagens do L2 Ikarus aparecem aqui, com nível e classe. Por enquanto, veja e escolha dentro do jogo.</p>
            <button className="ikw-btn alto" onClick={() => setAba('jogos')}>Ir para Jogos</button>
          </section>
        )}

        {aba === 'indicacao' && (
          <section className="ikp-bloco ikp-indic">
            <ReferralProgram />
          </section>
        )}
      </div>

      {comprando && <ModalCompra onFechar={() => setComprando(false)} />}
    </div>
  )
}
