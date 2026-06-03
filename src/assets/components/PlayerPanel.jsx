import { useState } from 'react'

const PACKS = [50, 100, 250, 500, 1000]

export default function PlayerPanel({ data, onLogout }) {
  const [buyOpen, setBuyOpen] = useState(false)
  const [amount, setAmount] = useState(100)
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState('')
  const [redeemCode, setRedeemCode] = useState('')
  const [redeemMsg, setRedeemMsg] = useState(null)

  const doRedeem = async () => {
    setRedeemMsg(null)
    if (!redeemCode.trim()) return
    const r = await fetch('/api/player/redeem', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: redeemCode.trim() }),
    }).then(x => x.json())
    if (r.success) {
      setRedeemMsg({ ok: true, text: r.message })
      setRedeemCode('')
      setTimeout(() => window.location.reload(), 1800)
    } else {
      setRedeemMsg({ ok: false, text: r.error })
    }
  }

  const buyIkoin = async () => {
    setBuying(true)
    setBuyError('')
    try {
      const r = await fetch('/api/payment/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      }).then(x => x.json())
      if (r.checkoutUrl) {
        window.location.href = r.checkoutUrl
      } else {
        setBuyError(r.error || 'Erro ao iniciar pagamento.')
      }
    } catch {
      setBuyError('Erro de conexão.')
    } finally {
      setBuying(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20000,
      background: 'rgba(2,2,6,0.98)', backdropFilter: 'blur(30px)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* HEADER */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.2rem 2rem',
        borderBottom: '1px solid rgba(197,160,89,0.2)',
        background: 'rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '3px', height: '28px', background: 'var(--gold)' }} />
          <span className="cinzel" style={{ color: 'var(--gold)', fontSize: '1rem', letterSpacing: '4px' }}>
            PAINEL DO JOGADOR
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <p style={{ color: '#fff', fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>{data.login}</p>
            {data.email && <p style={{ color: 'var(--text-mute)', fontSize: '0.65rem', margin: 0 }}>{data.email}</p>}
          </div>
          <button onClick={onLogout} style={{
            background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)',
            color: '#ff4444', padding: '0.5rem 1.2rem', borderRadius: '6px',
            fontSize: '0.65rem', letterSpacing: '2px', cursor: 'pointer',
          }}>SAIR</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
        {/* CARTEIRA IKOIN */}
        <div className="glass-panel" style={{
          padding: '1.5rem 2rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
          border: '1px solid rgba(197,160,89,0.3)',
          background: 'linear-gradient(135deg, rgba(197,160,89,0.08), rgba(197,160,89,0.02))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <img src="/ikoin.svg" alt="Ikoin" style={{ width: '60px', height: '60px', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.4))' }} />
            <div>
              <p style={{ fontSize: '0.58rem', color: 'var(--text-mute)', letterSpacing: '3px', margin: 0 }}>SEU SALDO</p>
              <p style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--gold)', margin: '2px 0 0', fontFamily: 'Cinzel, serif' }}>
                {(data.ikoin ?? 0).toLocaleString()} <span style={{ fontSize: '1rem' }}>IK</span>
              </p>
            </div>
          </div>
          <button onClick={() => setBuyOpen(true)} className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '0.75rem', letterSpacing: '2px' }}>
            + COMPRAR IKOIN
          </button>
        </div>

        {/* RESGATAR CÓDIGO */}
        <div className="glass-panel" style={{ padding: '1.2rem 1.5rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.58rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '0.8rem' }}>RESGATAR CÓDIGO</p>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <input
              value={redeemCode}
              onChange={e => setRedeemCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && doRedeem()}
              placeholder="DIGITE SEU CÓDIGO"
              style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', color: '#fff', fontSize: '0.85rem', borderRadius: '6px', outline: 'none', letterSpacing: '2px', fontFamily: 'monospace' }}
            />
            <button onClick={doRedeem} className="btn btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '0.72rem' }}>RESGATAR</button>
          </div>
          {redeemMsg && (
            <p style={{ marginTop: '0.8rem', fontSize: '0.75rem', color: redeemMsg.ok ? '#4ade80' : '#ef4444' }}>{redeemMsg.text}</p>
          )}
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid var(--gold)' }}>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '0.8rem' }}>PERSONAGENS</p>
            <p style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--gold)', margin: 0, fontFamily: 'Cinzel, serif' }}>
              {data.characters?.length ?? 0}
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid #4ade80' }}>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '0.8rem' }}>ONLINE AGORA</p>
            <p style={{ fontSize: '2.2rem', fontWeight: '900', color: '#4ade80', margin: 0, fontFamily: 'Cinzel, serif' }}>
              {data.characters?.filter(c => c.online).length ?? 0}
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid #c084fc' }}>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '0.8rem' }}>NÍVEL MÁXIMO</p>
            <p style={{ fontSize: '2.2rem', fontWeight: '900', color: '#c084fc', margin: 0, fontFamily: 'Cinzel, serif' }}>
              {data.characters?.length ? Math.max(...data.characters.map(c => c.level)) : 0}
            </p>
          </div>
        </div>

        {/* PERSONAGENS */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '1rem' }}>
            SEUS PERSONAGENS
          </p>
          {!data.characters?.length ? (
            <p style={{ color: 'var(--text-mute)', fontSize: '0.85rem' }}>Nenhum personagem criado ainda.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ color: 'var(--text-mute)', fontSize: '0.6rem', letterSpacing: '2px' }}>
                  {['PERSONAGEM', 'CLASSE', 'NÍVEL', 'STATUS'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.characters.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '0.7rem 0.5rem', color: 'var(--gold)', fontWeight: '700' }}>{c.name}</td>
                    <td style={{ padding: '0.7rem 0.5rem', color: 'rgba(255,255,255,0.7)' }}>{c.class}</td>
                    <td style={{ padding: '0.7rem 0.5rem', color: '#fff', fontWeight: '600' }}>{c.level}</td>
                    <td style={{ padding: '0.7rem 0.5rem' }}>
                      <span style={{
                        background: c.online ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
                        color: c.online ? '#4ade80' : 'var(--text-mute)',
                        border: `1px solid ${c.online ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        padding: '2px 10px', borderRadius: '20px', fontSize: '0.6rem', letterSpacing: '1px',
                      }}>
                        {c.online ? 'ONLINE' : 'OFFLINE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL COMPRAR IKOIN */}
      {buyOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 30000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', padding: '1rem' }} onClick={() => setBuyOpen(false)}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', border: '1px solid rgba(197,160,89,0.3)', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <img src="/ikoin.svg" alt="Ikoin" style={{ width: '70px', height: '70px', marginBottom: '1rem', filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.5))' }} />
            <h3 className="cinzel" style={{ color: 'var(--gold)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>COMPRAR IKOIN</h3>
            <p style={{ color: 'var(--text-mute)', fontSize: '0.75rem', marginBottom: '1.5rem' }}>1 Ikoin = R$ 1,00 · PIX, Boleto ou Cartão</p>

            {/* Pacotes rápidos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
              {PACKS.map(p => (
                <button key={p} onClick={() => setAmount(p)} style={{
                  background: amount === p ? 'rgba(197,160,89,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${amount === p ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                  color: amount === p ? 'var(--gold)' : 'rgba(255,255,255,0.6)',
                  padding: '0.6rem 0', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer',
                }}>{p}</button>
              ))}
            </div>

            {/* Valor custom */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <input type="number" min="5" value={amount} onChange={e => setAmount(parseInt(e.target.value) || 0)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.9rem', color: '#fff', fontSize: '1rem', borderRadius: '6px', outline: 'none', textAlign: 'center', fontWeight: '700' }}
              />
              <span style={{ color: 'var(--gold)', fontWeight: '900', fontSize: '1.1rem', minWidth: '90px' }}>= R$ {amount.toFixed(2)}</span>
            </div>

            {buyError && <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', padding: '0.7rem', marginBottom: '1rem', color: '#ef4444', fontSize: '0.75rem' }}>{buyError}</div>}

            <button onClick={buyIkoin} disabled={buying || amount < 5} className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginBottom: '0.75rem', opacity: amount < 5 ? 0.5 : 1 }}>
              {buying ? 'PROCESSANDO...' : `PAGAR R$ ${amount.toFixed(2)}`}
            </button>
            <button onClick={() => setBuyOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-mute)', fontSize: '0.7rem', cursor: 'pointer', letterSpacing: '2px' }}>CANCELAR</button>
          </div>
        </div>
      )}
    </div>
  )
}
