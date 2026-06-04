import { useState } from 'react'

const PACKS = [50, 100, 250, 500, 1000]

const CLASS_COLORS = {
  Fighter: '#e8a87c', Knight: '#7cb8e8', Rogue: '#a8e87c',
  Mage: '#c87ce8', Wizard: '#e87cc8', Cleric: '#e8e07c',
  Archer: '#7ce8c8', default: '#c5a059'
}

function getClassColor(cls) {
  const key = Object.keys(CLASS_COLORS).find(k => cls?.includes(k))
  return CLASS_COLORS[key] || CLASS_COLORS.default
}

function formatTime(secs) {
  const h = Math.floor((secs || 0) / 3600)
  return h > 0 ? `${h}h` : '0h'
}

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
    setBuying(true); setBuyError('')
    try {
      const r = await fetch('/api/payment/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      }).then(x => x.json())
      if (r.checkoutUrl) window.location.href = r.checkoutUrl
      else setBuyError(r.error || 'Erro ao iniciar pagamento.')
    } catch { setBuyError('Erro de conexão.') }
    finally { setBuying(false) }
  }

  const maxLevel = data.characters?.length ? Math.max(...data.characters.map(c => c.level)) : 0
  const totalPvp = data.characters?.reduce((s, c) => s + (c.pvp || 0), 0) ?? 0
  const onlineChar = data.characters?.find(c => c.online)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20000,
      background: 'rgba(2,2,6,0.98)', backdropFilter: 'blur(30px)',
      display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif',
    }}>
      {/* HEADER */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem', borderBottom: '1px solid rgba(197,160,89,0.2)',
        background: 'rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '3px', height: '28px', background: 'var(--gold)', borderRadius: '2px' }} />
          <span className="cinzel" style={{ color: 'var(--gold)', fontSize: '1rem', letterSpacing: '4px' }}>PAINEL DO JOGADOR</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#fff', fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>{data.login}</p>
            {data.email && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', margin: 0 }}>{data.email}</p>}
          </div>
          <button onClick={onLogout} style={{
            background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)',
            color: '#ff4444', padding: '0.5rem 1.2rem', borderRadius: '6px',
            fontSize: '0.65rem', letterSpacing: '2px', cursor: 'pointer',
          }}>SAIR</button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* COLUNA ESQUERDA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* IKOIN CARD */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(197,160,89,0.15) 0%, rgba(197,160,89,0.03) 100%)',
            border: '1px solid rgba(197,160,89,0.4)', borderRadius: '16px', padding: '1.5rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px',
              background: 'rgba(197,160,89,0.08)', borderRadius: '50%',
              boxShadow: '0 0 60px rgba(197,160,89,0.15)',
            }} />
            <p style={{ fontSize: '0.55rem', color: 'rgba(197,160,89,0.7)', letterSpacing: '4px', margin: '0 0 0.8rem' }}>SEU SALDO IKOIN</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212,175,55,0.3), rgba(212,175,55,0.05))',
                border: '2px solid rgba(197,160,89,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(197,160,89,0.3)',
              }}>
                <img src="/ikoin.svg" alt="IK" style={{ width: '36px', height: '36px' }} />
              </div>
              <div>
                <p style={{ fontSize: '2.8rem', fontWeight: '900', color: 'var(--gold)', margin: 0, lineHeight: 1, fontFamily: 'Cinzel, serif' }}>
                  {(data.ikoin ?? 0).toLocaleString()}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(197,160,89,0.6)', margin: '2px 0 0', letterSpacing: '2px' }}>iKOIN</p>
              </div>
            </div>
            <button onClick={() => setBuyOpen(true)} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '0.72rem', letterSpacing: '2px' }}>
              + COMPRAR IKOIN
            </button>
          </div>

          {/* RESGATAR CÓDIGO */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.2rem' }}>
            <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '4px', margin: '0 0 0.8rem' }}>RESGATAR CÓDIGO</p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <input
                value={redeemCode}
                onChange={e => setRedeemCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && doRedeem()}
                placeholder="CÓDIGO PROMO / REFERRAL"
                style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.7rem 1rem', color: '#fff', fontSize: '0.8rem', borderRadius: '8px', outline: 'none', letterSpacing: '2px', fontFamily: 'monospace' }}
              />
              <button onClick={doRedeem} className="btn btn-primary" style={{ padding: '0.7rem 1.2rem', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>OK</button>
            </div>
            {redeemMsg && (
              <p style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: redeemMsg.ok ? '#4ade80' : '#ef4444', margin: '0.6rem 0 0' }}>{redeemMsg.text}</p>
            )}
            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', margin: '0.5rem 0 0' }}>Códigos também podem ser usados no jogo com .code SEUCODIGO</p>
          </div>

          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
            {[
              { label: 'PERSONAGENS', value: data.characters?.length ?? 0, color: 'var(--gold)' },
              { label: 'NÍVEL MÁX', value: maxLevel, color: '#c084fc' },
              { label: 'PVP TOTAL', value: totalPvp, color: '#f87171' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem 0.8rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', margin: '0 0 0.4rem' }}>{s.label}</p>
                <p style={{ fontSize: '1.8rem', fontWeight: '900', color: s.color, margin: 0, fontFamily: 'Cinzel, serif' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA — PERSONAGENS */}
        <div>
          <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '4px', margin: '0 0 1rem' }}>SEUS PERSONAGENS</p>
          {!data.characters?.length ? (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Nenhum personagem criado ainda.</p>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Entre no jogo e crie seu primeiro personagem.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {data.characters.map((c, i) => {
                const clrColor = getClassColor(c.class)
                const lvlPct = Math.min((c.level / 99) * 100, 100)
                return (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.02)', borderRadius: '14px', padding: '1.2rem',
                    border: `1px solid ${c.online ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.06)'}`,
                    position: 'relative', overflow: 'hidden',
                    boxShadow: c.online ? '0 0 20px rgba(74,222,128,0.08)' : 'none',
                    transition: 'all 0.2s',
                  }}>
                    {/* Cor de classe no topo */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${clrColor}, transparent)` }} />

                    {/* Header do card */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '1rem', margin: '0 0 2px', fontFamily: 'Cinzel, serif' }}>{c.name}</p>
                        <p style={{ color: clrColor, fontSize: '0.7rem', margin: 0, letterSpacing: '1px' }}>{c.class}</p>
                      </div>
                      <span style={{
                        background: c.online ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)',
                        color: c.online ? '#4ade80' : 'rgba(255,255,255,0.3)',
                        border: `1px solid ${c.online ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        padding: '3px 10px', borderRadius: '20px', fontSize: '0.55rem', letterSpacing: '1px',
                      }}>
                        {c.online ? '● ONLINE' : '○ OFFLINE'}
                      </span>
                    </div>

                    {/* Barra de nível */}
                    <div style={{ marginBottom: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '2px' }}>NÍVEL</span>
                        <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: '700' }}>{c.level} <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>/ 99</span></span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${lvlPct}%`, height: '100%', background: `linear-gradient(90deg, ${clrColor}, ${clrColor}88)`, borderRadius: '2px', transition: 'width 0.5s' }} />
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', margin: '0 0 2px' }}>PVP</p>
                        <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f87171', margin: 0 }}>{c.pvp ?? 0}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', margin: '0 0 2px' }}>TEMPO ONLINE</p>
                        <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{formatTime(c.onlinetime)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
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
