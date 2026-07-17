import { useState, useRef, useEffect } from 'react'

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
  const [method, setMethod] = useState('pix')
  const [cpf, setCpf] = useState('')
  const [pix, setPix] = useState(null)
  const [paid, setPaid] = useState(false)
  const [copied, setCopied] = useState(false)
  const pollRef = useRef(null)

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

  const startPolling = (orderId) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const s = await fetch(`/api/payment/status?orderId=${orderId}`).then(x => x.json())
        if (s.status === 'paid') {
          clearInterval(pollRef.current)
          setPaid(true)
          setTimeout(() => window.location.reload(), 2500)
        }
      } catch {}
    }, 4000)
  }

  const genPix = async () => {
    const cleanCpf = (cpf || '').replace(/\D/g, '')
    if (cleanCpf.length !== 11) { setBuyError('Informe um CPF válido (11 dígitos) para o PIX.'); return }
    setBuying(true); setBuyError(''); setPaid(false)
    try {
      const r = await fetch('/api/payment/pix', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, cpf: cleanCpf }),
      }).then(x => x.json())
      if (r.qrCode) { setPix(r); startPolling(r.orderId) }
      else setBuyError(r.error || 'Erro ao gerar PIX.')
    } catch { setBuyError('Erro de conexão.') }
    finally { setBuying(false) }
  }

  const copyPix = () => {
    if (pix?.qrCode) { navigator.clipboard?.writeText(pix.qrCode); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  }

  const closeBuy = () => {
    setBuyOpen(false); setPix(null); setPaid(false); setBuyError('')
    if (pollRef.current) clearInterval(pollRef.current)
  }

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
                <p style={{ fontSize: '0.75rem', color: 'rgba(197,160,89,0.6)', margin: '2px 0 0', letterSpacing: '2px' }}>Ikoin</p>
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
            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', margin: '0.5rem 0 0' }}>Códigos também podem ser resgatados no jogo, no Community Board (Alt+B → Referral).</p>
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

          {/* SERVIÇOS */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.2rem' }}>
            <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '4px', margin: '0 0 1rem' }}>SERVIÇOS</p>
            {[
              { name: 'Troca de Classe', price: '150 Ikoin', soon: false },
              { name: 'Doar Ikoin a um amigo', price: 'Em breve', soon: true },
              { name: 'Vender Personagem', price: 'Em breve', soon: true },
            ].map(srv => (
              <div key={srv.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: srv.soon ? 'rgba(255,255,255,0.4)' : '#fff', fontSize: '0.82rem' }}>{srv.name}</span>
                {srv.soon ? (
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', letterSpacing: '1px', fontStyle: 'italic' }}>EM BREVE</span>
                ) : (
                  <button style={{ background: 'rgba(197,160,89,0.12)', border: '1px solid rgba(197,160,89,0.35)', color: 'var(--gold)', padding: '0.35rem 0.9rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>{srv.price}</button>
                )}
              </div>
            ))}
          </div>

          {/* INDICAÇÕES (jogador) removido 2026-07-17: a indicacao e via streamer/afiliado
              (link /r/slug), gerenciada no painel admin. Sem programa de indicacao por jogador. */}
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 30000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', padding: '1rem' }} onClick={closeBuy}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', border: '1px solid rgba(197,160,89,0.3)', textAlign: 'center' }} onClick={e => e.stopPropagation()}>

            {!pix && !paid && (<>
              <img src="/ikoin.svg" alt="Ikoin" style={{ width: '64px', height: '64px', marginBottom: '0.8rem', filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.5))' }} />
              <h3 className="cinzel" style={{ color: 'var(--gold)', fontSize: '1.4rem', marginBottom: '0.3rem' }}>COMPRAR IKOIN</h3>
              <p style={{ color: 'var(--text-mute)', fontSize: '0.75rem', marginBottom: '1.25rem' }}>1 Ikoin = R$ 1,00</p>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {/* Cartao EM BREVE: PagBank aguardando allowlist. O checkout ja funciona
                    (api/payment.js), so falta o PagBank liberar cartao na conta. Quando
                    liberar, trocar cardEnabled pra true. */}
                {[['pix', 'PIX', true], ['card', 'Cartão', false]].map(([k, label, enabled]) => (
                  <button key={k} onClick={() => enabled && setMethod(k)} disabled={!enabled} style={{
                    flex: 1, padding: '0.7rem 0', borderRadius: '6px', cursor: enabled ? 'pointer' : 'not-allowed', fontWeight: '700', fontSize: '0.78rem', letterSpacing: '1px',
                    background: method === k ? 'rgba(197,160,89,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${method === k ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                    color: enabled ? (method === k ? 'var(--gold)' : 'rgba(255,255,255,0.6)') : 'rgba(255,255,255,0.3)',
                    position: 'relative',
                  }}>
                    {label}
                    {!enabled && <span style={{ display: 'block', fontSize: '0.5rem', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>EM BREVE</span>}
                  </button>
                ))}
              </div>

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
                <input type="number" min="1" value={amount} onChange={e => setAmount(parseInt(e.target.value) || 0)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.9rem', color: '#fff', fontSize: '1rem', borderRadius: '6px', outline: 'none', textAlign: 'center', fontWeight: '700' }}
                />
                <span style={{ color: 'var(--gold)', fontWeight: '900', fontSize: '1.1rem', minWidth: '90px' }}>= R$ {amount.toFixed(2)}</span>
              </div>
              {method === 'pix' && (
                <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="CPF do pagador (obrigatório p/ PIX)" maxLength={14}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', color: '#fff', fontSize: '0.85rem', borderRadius: '6px', outline: 'none', textAlign: 'center', marginBottom: '1.5rem' }}
                />
              )}
              {buyError && <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', padding: '0.7rem', marginBottom: '1rem', color: '#ef4444', fontSize: '0.75rem' }}>{buyError}</div>}
              <button onClick={method === 'pix' ? genPix : buyIkoin} disabled={buying || amount < 1} className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginBottom: '0.75rem', opacity: amount < 1 ? 0.5 : 1 }}>
                {buying ? 'PROCESSANDO...' : method === 'pix' ? `GERAR QR PIX · R$ ${amount.toFixed(2)}` : `PAGAR NO CARTÃO · R$ ${amount.toFixed(2)}`}
              </button>
              <button onClick={closeBuy} style={{ background: 'none', border: 'none', color: 'var(--text-mute)', fontSize: '0.7rem', cursor: 'pointer', letterSpacing: '2px' }}>CANCELAR</button>
            </>)}

            {pix && !paid && (<>
              <h3 className="cinzel" style={{ color: 'var(--gold)', fontSize: '1.3rem', marginBottom: '0.2rem' }}>PAGUE COM PIX</h3>
              <p style={{ color: 'var(--text-mute)', fontSize: '0.72rem', marginBottom: '1rem' }}>{pix.amount} Ikoin · R$ {Number(pix.amount).toFixed(2)}</p>
              {pix.qrBase64
                ? <img src={`data:image/png;base64,${pix.qrBase64}`} alt="QR PIX" style={{ width: '220px', height: '220px', background: '#fff', padding: '8px', borderRadius: '10px', margin: '0 auto 1rem', display: 'block' }} />
                : <p style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '1rem' }}>QR indisponível, use o código abaixo.</p>}
              <p style={{ color: 'var(--text-mute)', fontSize: '0.68rem', marginBottom: '0.5rem', letterSpacing: '1px' }}>Escaneie no app do banco ou copie o código:</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input readOnly value={pix.qrCode} onClick={e => e.target.select()}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.62rem', borderRadius: '6px', outline: 'none' }} />
                <button onClick={copyPix} className="btn btn-primary" style={{ padding: '0 1rem', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{copied ? 'COPIADO' : 'COPIAR'}</button>
              </div>
              <p style={{ color: 'var(--gold)', fontSize: '0.74rem', marginBottom: '1rem' }}>⏳ Aguardando pagamento... os Ikoins caem sozinhos.</p>
              <button onClick={closeBuy} style={{ background: 'none', border: 'none', color: 'var(--text-mute)', fontSize: '0.7rem', cursor: 'pointer', letterSpacing: '2px' }}>FECHAR</button>
            </>)}

            {paid && (<>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
              <h3 className="cinzel" style={{ color: '#7BD88F', fontSize: '1.4rem', marginBottom: '0.5rem' }}>PAGAMENTO CONFIRMADO</h3>
              <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem' }}>+{pix?.amount} Ikoin adicionados! Atualizando...</p>
            </>)}

          </div>
        </div>
      )}
    </div>
  )
}
