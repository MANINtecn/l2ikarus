import { useEffect, useState } from 'react'

/**
 * ADMIN — PROGRAMA DE INDICAÇÃO (17/08/2026).
 *
 * Três blocos, na ordem em que o dono precisa agir:
 *   1. FILA DE APROVAÇÃO — quem se inscreveu e espera análise
 *   2. SAQUES PENDENTES  — quem pediu dinheiro (com a chave PIX)
 *   3. PARCEIROS ATIVOS  — visão geral de quem já está aprovado
 *
 * Componente separado do AdminPanel de propósito: aquele arquivo já passa de 900
 * linhas, e isso aqui é um domínio próprio.
 */
export default function ReferralAdmin() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState(null)
  const [rejecting, setRejecting] = useState(null)   // slug em rejeição
  const [reason, setReason] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin?action=referral-admin')
      if (r.ok) setData(await r.json())
      else setMsg({ ok: false, text: 'Erro ao carregar.' })
    } catch (e) {
      setMsg({ ok: false, text: e.message })
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const post = async (action, body) => {
    setMsg(null)
    const r = await fetch(`/api/admin?action=${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const d = await r.json()
    if (d.success) { setMsg({ ok: true, text: 'Feito.' }); load() }
    else setMsg({ ok: false, text: d.error || 'Erro.' })
  }

  const review = (slug, approve) => post('referral-review', { slug, approve, reason })
  const payoutReview = (id, paid, note) => post('referral-payout-review', { id, paid, note })

  const brl = (v) => `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`
  const dt = (ts) => ts ? new Date(Number(ts)).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'

  const box = {
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px', padding: '1.1rem', marginBottom: '1.2rem',
  }
  const title = { fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '3px', margin: '0 0 0.9rem' }
  const th = { padding: '0.45rem 0.4rem', fontWeight: '500', textAlign: 'left', color: 'rgba(255,255,255,0.3)' }
  const td = { padding: '0.55rem 0.4rem', color: 'rgba(255,255,255,0.7)' }
  const btn = (c = 'var(--gold)') => ({
    background: 'transparent', border: `1px solid ${c}`, color: c,
    padding: '0.28rem 0.7rem', borderRadius: '5px', fontSize: '0.62rem',
    fontWeight: '700', cursor: 'pointer', marginRight: '0.35rem',
  })

  if (loading) return <p style={{ color: 'rgba(255,255,255,0.4)' }}>Carregando…</p>
  if (!data) return <p style={{ color: '#f87171' }}>Não foi possível carregar.</p>

  return (
    <div>
      {msg && (
        <p style={{ color: msg.ok ? '#4ade80' : '#f87171', fontSize: '0.78rem', marginBottom: '1rem' }}>
          {msg.text}
        </p>
      )}

      {/* ---------------- 1. FILA DE APROVAÇÃO ---------------- */}
      <div style={box}>
        <p style={title}>
          INSCRIÇÕES AGUARDANDO APROVAÇÃO
          {data.pendentes?.length > 0 && (
            <span style={{ color: 'var(--gold)', marginLeft: '0.5rem' }}>({data.pendentes.length})</span>
          )}
        </p>

        {!data.pendentes?.length ? (
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', margin: 0 }}>
            Nenhuma inscrição pendente.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead><tr>
              <th style={th}>LINK</th><th style={th}>CONTA</th>
              <th style={th}>SOLICITOU EM</th><th style={th}>AÇÃO</th>
            </tr></thead>
            <tbody>
              {data.pendentes.map(p => (
                <tr key={p.slug} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ ...td, color: 'var(--gold)' }}>/r/{p.slug}</td>
                  <td style={td}>{p.account_name}</td>
                  <td style={td}>{dt(p.applied_at)}</td>
                  <td style={td}>
                    {rejecting === p.slug ? (
                      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input value={reason} onChange={e => setReason(e.target.value)}
                          placeholder="motivo (opcional)"
                          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.68rem', width: '150px' }} />
                        <button onClick={() => { review(p.slug, false); setRejecting(null); setReason('') }} style={btn('#f87171')}>CONFIRMAR</button>
                        <button onClick={() => { setRejecting(null); setReason('') }} style={btn('rgba(255,255,255,0.3)')}>VOLTAR</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => review(p.slug, true)} style={btn('#4ade80')}>APROVAR</button>
                        <button onClick={() => setRejecting(p.slug)} style={btn('#f87171')}>REJEITAR</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ---------------- 2. SAQUES ---------------- */}
      <div style={box}>
        <p style={title}>
          SAQUES SOLICITADOS
          {data.saques?.length > 0 && (
            <span style={{ color: 'var(--gold)', marginLeft: '0.5rem' }}>({data.saques.length})</span>
          )}
        </p>

        {!data.saques?.length ? (
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', margin: 0 }}>
            Nenhum saque pendente.
          </p>
        ) : (
          <>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', margin: '0 0 0.8rem', lineHeight: 1.5 }}>
              Pague o PIX manualmente e marque como pago. Ao <b>rejeitar</b>, o valor volta
              pro saldo disponível do parceiro (não some).
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead><tr>
                <th style={th}>PARCEIRO</th><th style={th}>VALOR</th>
                <th style={th}>CHAVE PIX</th><th style={th}>PEDIDO EM</th><th style={th}>AÇÃO</th>
              </tr></thead>
              <tbody>
                {data.saques.map(s => (
                  <tr key={s.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ ...td, color: 'var(--gold)' }}>/r/{s.streamer_slug}</td>
                    <td style={{ ...td, color: '#4ade80', fontWeight: '700' }}>{brl(s.amount)}</td>
                    <td style={{ ...td, fontFamily: 'monospace', fontSize: '0.7rem' }}>{s.pix_key}</td>
                    <td style={td}>{dt(s.requested_at)}</td>
                    <td style={td}>
                      <button onClick={() => payoutReview(s.id, true)} style={btn('#4ade80')}>PAGO</button>
                      <button onClick={() => payoutReview(s.id, false)} style={btn('#f87171')}>REJEITAR</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* ---------------- 3. PARCEIROS ATIVOS ---------------- */}
      <div style={box}>
        <p style={title}>PARCEIROS ATIVOS</p>

        {!data.parceiros?.length ? (
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', margin: 0 }}>
            Nenhum parceiro aprovado ainda.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead><tr>
              <th style={th}>LINK</th><th style={th}>CONTA</th><th style={th}>%</th>
              <th style={th}>INDICADOS</th><th style={th}>DISPONÍVEL</th>
              <th style={th}>EM VALIDAÇÃO</th><th style={th}>JÁ PAGO</th>
            </tr></thead>
            <tbody>
              {data.parceiros.map(p => (
                <tr key={p.slug} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ ...td, color: 'var(--gold)' }}>/r/{p.slug}</td>
                  <td style={td}>{p.account_name || '-'}</td>
                  <td style={td}>{p.commission_pct}%</td>
                  <td style={td}>{p.indicados}</td>
                  <td style={{ ...td, color: '#4ade80' }}>{brl(p.disponivel)}</td>
                  <td style={{ ...td, color: 'rgba(255,255,255,0.4)' }}>{brl(p.em_validacao)}</td>
                  <td style={td}>{brl(p.pago)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button onClick={load} style={{ ...btn(), padding: '0.4rem 1rem', fontSize: '0.68rem' }}>
        ATUALIZAR
      </button>
    </div>
  )
}
