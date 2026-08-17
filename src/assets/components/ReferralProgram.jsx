import { useEffect, useState } from 'react'

/**
 * PROGRAMA DE INDICAÇÃO — painel do parceiro (17/08/2026).
 *
 * NOMENCLATURA: o dono pediu para NÃO usar "afiliado" na interface. Aqui é
 * "Programa de Indicação" e o participante é "parceiro".
 *
 * Três estados possíveis:
 *   1. não inscrito  -> convite + formulário de inscrição
 *   2. pendente      -> aviso de análise
 *   3. aprovado      -> painel completo (números, link, saque, histórico)
 */
export default function ReferralProgram() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState('')
  const [accept, setAccept] = useState(false)
  const [msg, setMsg] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showPayout, setShowPayout] = useState(false)
  const [payAmount, setPayAmount] = useState('')
  const [pixKey, setPixKey] = useState('')

  const load = async () => {
    try {
      const r = await fetch('/api/player/referral')
      if (r.ok) setData(await r.json())
    } catch { /* silencioso: a seção some se a API falhar */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const join = async () => {
    setMsg(null)
    const r = await fetch('/api/player/referral-join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, accept }),
    })
    const d = await r.json()
    if (d.success) { setMsg({ ok: true, text: 'Inscrição enviada! Aguarde a análise.' }); load() }
    else setMsg({ ok: false, text: d.error || 'Erro ao inscrever.' })
  }

  const requestPayout = async () => {
    setMsg(null)
    const r = await fetch('/api/player/referral-payout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: payAmount, pix_key: pixKey }),
    })
    const d = await r.json()
    if (d.success) {
      setMsg({ ok: true, text: `Saque de R$ ${Number(d.amount).toFixed(2)} solicitado!` })
      setShowPayout(false); setPayAmount(''); setPixKey(''); load()
    } else setMsg({ ok: false, text: d.error || 'Erro ao solicitar saque.' })
  }

  const copyLink = () => {
    navigator.clipboard.writeText(data.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading || !data) return null

  const brl = (v) => `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`
  const dt = (ts) => new Date(Number(ts)).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

  const card = {
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px', padding: '1.2rem', marginTop: '1.5rem',
  }
  const label = { fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '4px', margin: '0 0 1rem' }
  const btn = {
    background: 'rgba(197,160,89,0.12)', border: '1px solid rgba(197,160,89,0.35)',
    color: 'var(--gold)', padding: '0.5rem 1.1rem', borderRadius: '6px',
    fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer',
  }
  const input = {
    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', padding: '0.5rem 0.7rem', borderRadius: '6px', fontSize: '0.8rem', width: '100%',
  }

  // ---------------------------------------------------------- não inscrito
  if (!data.enrolled) {
    return (
      <div style={card}>
        <p style={label}>PROGRAMA DE INDICAÇÃO</p>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
          Indique o IKARUS e receba <b style={{ color: 'var(--gold)' }}>10% de comissão</b> sobre
          as compras de quem entrar pelo seu link.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
          Sem promessa de renda. A comissão depende de compras efetivamente pagas e passa por
          um período de validação de 30 dias antes de ficar disponível para saque.
        </p>

        <div style={{ marginBottom: '0.8rem' }}>
          <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 0.35rem' }}>
            ESCOLHA SEU LINK
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>l2ikarus.com/r/</span>
            <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="seunick"
              style={{ ...input, width: '160px' }} />
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
          <input type="checkbox" checked={accept} onChange={e => setAccept(e.target.checked)} style={{ marginTop: '3px' }} />
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', lineHeight: 1.5 }}>
            Li e aceito o <a href="/regulamento-indicacao" target="_blank" style={{ color: 'var(--gold)' }}>Regulamento do Programa</a>,
            os <a href="/terms" target="_blank" style={{ color: 'var(--gold)' }}>Termos de Uso</a> e
            a <a href="/privacy" target="_blank" style={{ color: 'var(--gold)' }}>Política de Privacidade</a>.
            Declaro ter 18 anos ou mais.
          </span>
        </label>

        <button onClick={join} disabled={!accept || !slug} style={{ ...btn, opacity: (!accept || !slug) ? 0.4 : 1 }}>
          QUERO PARTICIPAR
        </button>

        {msg && <p style={{ color: msg.ok ? '#4ade80' : '#f87171', fontSize: '0.75rem', marginTop: '0.8rem' }}>{msg.text}</p>}
      </div>
    )
  }

  // ------------------------------------------------------------- pendente
  if (data.status !== 'approved') {
    const txt = data.status === 'rejected'
      ? (data.reject_reason || 'Sua inscrição não foi aprovada.')
      : 'Sua inscrição está em análise. Você será avisado quando for aprovada.'
    return (
      <div style={card}>
        <p style={label}>PROGRAMA DE INDICAÇÃO</p>
        <p style={{ color: data.status === 'rejected' ? '#f87171' : 'var(--gold)', fontSize: '0.85rem', margin: 0 }}>
          {data.status === 'rejected' ? '✕ ' : '⏳ '}{txt}
        </p>
      </div>
    )
  }

  // ------------------------------------------------------------- aprovado
  const podeSecar = data.disponivel >= data.payout_min
  const restaHoje = Math.max(0, data.payout_max_day - data.sacado_hoje)

  return (
    <div style={card}>
      <p style={label}>PROGRAMA DE INDICAÇÃO</p>

      {/* números */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.8rem', marginBottom: '1.2rem' }}>
        {[
          ['JOGADORES INDICADOS', data.indicados, '#fff'],
          ['COMPRAS GERADAS', data.compras, '#fff'],
          ['VENDAS GERADAS', brl(data.vendas), '#fff'],
          ['SUA COMISSÃO', brl(data.comissao_total), 'var(--gold)'],
        ].map(([t, v, c], i) => (
          <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '0.8rem' }}>
            <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', margin: '0 0 0.3rem' }}>{t}</p>
            <p style={{ fontSize: '1.05rem', fontWeight: '800', color: c, margin: 0 }}>{v}</p>
          </div>
        ))}
      </div>

      {/* saldo: o que dá pra sacar vs o que ainda está maturando */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
        <div style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', padding: '0.8rem' }}>
          <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', margin: '0 0 0.3rem' }}>DISPONÍVEL PARA SAQUE</p>
          <p style={{ fontSize: '1.15rem', fontWeight: '800', color: '#4ade80', margin: 0 }}>{brl(data.disponivel)}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.8rem' }}>
          <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', margin: '0 0 0.3rem' }}>EM VALIDAÇÃO (30 DIAS)</p>
          <p style={{ fontSize: '1.15rem', fontWeight: '800', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{brl(data.em_validacao)}</p>
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', margin: '0 0 1rem', lineHeight: 1.5 }}>
        A comissão fica 30 dias em validação — é o prazo para eventuais estornos ou cancelamentos.
        Saque mínimo {brl(data.payout_min)} · limite de {brl(data.payout_max_day)} por dia
        {data.sacado_hoje > 0 && ` · resta hoje ${brl(restaHoje)}`}.
      </p>

      {!showPayout ? (
        <button onClick={() => setShowPayout(true)} disabled={!podeSecar}
          style={{ ...btn, opacity: podeSecar ? 1 : 0.4, marginBottom: '1.2rem' }}>
          SOLICITAR SAQUE
        </button>
      ) : (
        <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '1rem', marginBottom: '1.2rem' }}>
          <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <div>
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', margin: '0 0 0.3rem' }}>VALOR (R$)</p>
              <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)}
                placeholder={`mín ${data.payout_min} · máx ${Math.min(restaHoje, data.disponivel)}`} style={input} />
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', margin: '0 0 0.3rem' }}>CHAVE PIX</p>
              <input value={pixKey} onChange={e => setPixKey(e.target.value)} placeholder="CPF, e-mail, telefone ou aleatória" style={input} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={requestPayout} style={btn}>CONFIRMAR</button>
            <button onClick={() => setShowPayout(false)} style={{ ...btn, background: 'transparent', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.15)' }}>CANCELAR</button>
          </div>
        </div>
      )}

      {msg && <p style={{ color: msg.ok ? '#4ade80' : '#f87171', fontSize: '0.75rem', margin: '0 0 1rem' }}>{msg.text}</p>}

      {/* link */}
      <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '0.8rem', marginBottom: '1.2rem' }}>
        <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', margin: '0 0 0.5rem' }}>SEU LINK</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <code style={{ color: 'var(--gold)', fontSize: '0.82rem', flex: 1, minWidth: '180px' }}>{data.link}</code>
          <button onClick={copyLink} style={{ ...btn, padding: '0.35rem 0.8rem', fontSize: '0.65rem' }}>
            {copied ? '✓ COPIADO' : 'COPIAR'}
          </button>
        </div>
      </div>

      {/* histórico */}
      {data.historico?.length > 0 && (
        <>
          <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', margin: '0 0 0.6rem' }}>HISTÓRICO</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
              <thead>
                <tr style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'left' }}>
                  <th style={{ padding: '0.4rem 0.3rem', fontWeight: '500' }}>DATA</th>
                  <th style={{ padding: '0.4rem 0.3rem', fontWeight: '500' }}>JOGADOR</th>
                  <th style={{ padding: '0.4rem 0.3rem', fontWeight: '500' }}>COMPRA</th>
                  <th style={{ padding: '0.4rem 0.3rem', fontWeight: '500' }}>COMISSÃO</th>
                  <th style={{ padding: '0.4rem 0.3rem', fontWeight: '500' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {data.historico.map((h, i) => {
                  const st = h.status === 'paid' ? ['PAGO', '#4ade80']
                    : h.status === 'reversed' ? ['ESTORNADO', '#f87171']
                    : (h.status === 'available' || h.available_at <= Date.now()) ? ['DISPONÍVEL', '#4ade80']
                    : ['EM VALIDAÇÃO', 'rgba(255,255,255,0.35)']
                  return (
                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.65)' }}>
                      <td style={{ padding: '0.5rem 0.3rem' }}>{dt(h.created_at)}</td>
                      <td style={{ padding: '0.5rem 0.3rem' }}>{h.buyer_account}</td>
                      <td style={{ padding: '0.5rem 0.3rem' }}>{brl(h.order_amount)}</td>
                      <td style={{ padding: '0.5rem 0.3rem', color: 'var(--gold)' }}>{brl(h.commission_value)}</td>
                      <td style={{ padding: '0.5rem 0.3rem', color: st[1], fontSize: '0.62rem' }}>{st[0]}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
