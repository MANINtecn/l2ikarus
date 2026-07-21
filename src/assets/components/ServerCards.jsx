import { useState, useEffect } from 'react'
import interludeImg from '../server-interlude.webp'
import essenceImg from '../server-essence.webp'
import muImg from '../server-mu.webp'

// IKARUS 2026-07-15: cards de servidor no hero. Cada card = 1 jogo da rede IKARUS
// (1 site, 1 conta, 1 saldo Ikoin compartilhado entre todos — ver memoria
// project_ikarus_multi_servidor.md). 3 artes hoje (Interlude/Essence/MU), cada uma
// JA TRAZ o logo/titulo do jogo estampado na propria imagem — por isso NAO
// renderizamos label de nome por cima no card fechado, so a vinheta de contraste.
//
// LAYOUT v4 (2026-07-15, pedido do usuario): SEM MOLDURA/CARD no estado fechado — a
// imagem (PNG/WEBP com fundo transparente) fica solta direto sobre o fundo do hero,
// so o contorno real do personagem aparece (nada de retangulo/borda visivel). No
// hover/click ela cresce e um painel retangular desliza pra aparecer ao LADO dela
// (a direita), com nome/status/descricao/rates/botoes. Um X fecha e volta ao estado
// solto. Hover = preview (fecha ao tirar o mouse); click = fixa aberto.
//
// STATUS: so o Essence tem endpoint de status real hoje (/api/status, single-server
// — ver project_site_infra.md). Interlude ainda NAO tem endpoint proprio na VPS ate
// a estreia rodar o deploy. Ate la (17/07 19h), o card mostra CONTAGEM REGRESSIVA ao
// vivo; ao bater a hora vira "live" de verdade via ?server=interlude (ver server.js).
const LAUNCH_DATE = new Date('2026-07-17T19:00:00-03:00') // America/Sao_Paulo

const SERVERS = [
  {
    id: 'interlude',
    name: 'Interlude',
    color: '#4ade80',
    img: interludeImg,
    desc: 'A era dourada do PvP. Classes balanceadas, siege de castelo, o L2 que você lembra.',
    rates: { XP: 'x30', SP: 'x30', DROP: 'x10', SPOIL: 'x15', ADENA: 'x5' },
    highlight: 'Base + 1 Sub acumulativa',
    statusMode: 'countdown',
    downloadHref: '#download',
    actionLabel: 'BAIXAR INTERLUDE',
  },
  {
    id: 'essence',
    name: 'Essence',
    color: '#60a5fa',
    img: essenceImg,
    desc: 'Sistema de classe única, autofarm nativo, o L2 repensado pra quem quer progredir rápido.',
    rates: { XP: 'x3', SP: 'x3', ADENA: 'x2' },
    statusMode: 'live', // consulta /api/status
    downloadHref: '#download',
    actionLabel: 'BAIXAR ESSENCE',
  },
  {
    id: 'mu',
    name: 'MU Online',
    color: '#f472b6',
    img: muImg,
    desc: 'Reservado para a expansão da rede Ikarus.',
    rates: null,
    statusMode: 'fixed',
    statusText: 'EM BREVE',
    statusColor: '#94a3b8',
    downloadHref: null,
    actionLabel: null,
  },
]

function formatCountdown(ms) {
  if (ms <= 0) return null
  const totalSec = Math.floor(ms / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const pad = n => String(n).padStart(2, '0')
  if (days > 0) return `ESTREIA EM ${days}D ${pad(hours)}H ${pad(minutes)}M`
  return `ESTREIA EM ${pad(hours)}H ${pad(minutes)}M ${pad(seconds)}S`
}

export default function ServerCards({ isMobile, onRegisterClick }) {
  const [hovered, setHovered] = useState(null)
  const [pinned, setPinned] = useState(null)
  const [essenceStatus, setEssenceStatus] = useState({ online: false, players: 0 })
  const [interludeStatus, setInterludeStatus] = useState({ online: false, players: 0 })
  const [now, setNow] = useState(() => Date.now())

  const isInterludeLive = () => LAUNCH_DATE.getTime() - now <= 0
  const activeId = pinned || hovered
  const isPinned = pinned !== null

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status')
        const data = await res.json()
        setEssenceStatus({ online: data.online, players: data.players || 0 })
      } catch {
        setEssenceStatus({ online: false, players: 0 })
      }

      // So consulta o status real do Interlude DEPOIS da estreia — antes disso o GS
      // pode nem estar de pe ainda, sem sentido gastar request. Mesma API do Essence,
      // so muda o parametro ?server=interlude (ver server.js getStats).
      if (isInterludeLive()) {
        try {
          const res = await fetch('/api/status?server=interlude')
          const data = await res.json()
          setInterludeStatus({ online: data.online, players: data.players || 0 })
        } catch {
          setInterludeStatus({ online: false, players: 0 })
        }
      }
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [now])

  // Relogio do countdown: 1x/s so enquanto faltar menos de 1 dia (mostra segundos),
  // senao 1x/min basta (menos re-render).
  useEffect(() => {
    const msLeft = LAUNCH_DATE.getTime() - Date.now()
    const tick = msLeft > 0 && msLeft < 86400000 ? 1000 : 60000
    const id = setInterval(() => setNow(Date.now()), tick)
    return () => clearInterval(id)
  }, [now])

  const getStatusDisplay = (server) => {
    if (server.statusMode === 'countdown') {
      // Depois da estreia, o Interlude vira "live" de verdade (status real do banco
      // via API) em vez de ficar preso no texto fixo "SERVIDOR NO AR".
      if (isInterludeLive()) {
        return interludeStatus.online
          ? { text: `ON-LINE · ${interludeStatus.players} JOGADORES`, color: '#4ade80' }
          : { text: 'OFFLINE', color: '#ef4444' }
      }
      const msLeft = LAUNCH_DATE.getTime() - now
      const label = formatCountdown(msLeft)
      return { text: label, color: server.color }
    }
    if (server.statusMode === 'fixed') {
      return { text: server.statusText, color: server.statusColor }
    }
    // live: Essence
    return essenceStatus.online
      ? { text: `ON-LINE · ${essenceStatus.players} JOGADORES`, color: '#4ade80' }
      : { text: 'OFFLINE', color: '#ef4444' }
  }

  // Imagem solta (sem moldura): altura fixa como referencia, largura livre (auto,
  // respeita a proporcao real do PNG). GOTCHA 2026-07-16: o crescimento no hover TEM
  // que ser via transform:scale (nao height) e o painel TEM que ser position:absolute —
  // qualquer mudanca de layout no hover empurra a propria imagem pra fora de baixo do
  // mouse, o mouseleave dispara sozinho e o hover "pisca" (parece quebrado). Pelo mesmo
  // motivo o hover fica no WRAPPER (imagem+painel): mover o mouse pro botao do painel
  // nao pode fechar o painel.
  const imgH = isMobile ? 200 : 380
  const panelW = isMobile ? 220 : 300

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      gap: isMobile ? '0.5rem' : '0.5rem',
      flexWrap: 'wrap',
      minHeight: imgH,
      // sobe as imagens pra dar respiro entre elas e a borda de baixo do hero
      marginTop: isMobile ? '-12px' : '-34px',
      paddingBottom: isMobile ? '10px' : '26px',
    }}>
      {/* SLOGAN — absoluto (fora do fluxo, nao empurra nada) entre a logo e as imagens */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '-16px' : '-24px',
        left: 0, right: 0,
        textAlign: 'center',
        zIndex: 5,
        pointerEvents: 'none',
      }}>
        <span className="cinzel" style={{
          fontSize: isMobile ? '0.6rem' : '0.78rem',
          fontWeight: 700,
          letterSpacing: isMobile ? '3px' : '5px',
          color: 'var(--gold)',
          textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        }}>
          UMA CONTA · VÁRIOS SERVIDORES
        </span>
      </div>

      {SERVERS.map((server, idx) => {
        const isActive = activeId === server.id
        const status = getStatusDisplay(server)
        // ultimo da fileira abre o painel pra ESQUERDA pra nao estourar a tela
        const panelLeft = idx === SERVERS.length - 1

        return (
          <div
            key={server.id}
            onMouseEnter={() => !isMobile && setHovered(server.id)}
            onMouseLeave={() => !isMobile && setHovered(null)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              zIndex: isActive ? 25 : 10,
            }}
          >
            {/* IMAGEM SOLTA — sem moldura, sem borda, sem fundo. So o contorno real do
                PNG/WEBP transparente. Cresce no hover/click; brilho (drop-shadow) reforça
                o destaque sem precisar de caixa ao redor. */}
            <img
              src={server.img}
              alt={server.name}
              onClick={() => setPinned(pinned === server.id ? null : server.id)}
              style={{
                height: imgH,
                width: 'auto',
                cursor: 'pointer',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transformOrigin: 'bottom center',
                filter: isActive
                  ? `drop-shadow(0 20px 40px rgba(0,0,0,0.7)) drop-shadow(0 0 35px ${server.color}55)`
                  : 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
                transition: 'transform 0.45s cubic-bezier(0.2, 1, 0.3, 1), filter 0.3s ease',
              }}
            />

            {/* PAINEL DE INFO — absoluto AO LADO da imagem (fora do fluxo: nao empurra
                nada, nao gera flicker). Hover mostra; click fixa (X pra fechar). */}
            {isActive && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  ...(panelLeft
                    ? { right: '100%', marginRight: isMobile ? '0.5rem' : '0.8rem' }
                    : { left: '100%', marginLeft: isMobile ? '0.5rem' : '0.8rem' }),
                  bottom: isMobile ? '1rem' : '2rem',
                  width: panelW,
                  padding: isMobile ? '0.8rem' : '1.3rem',
                  borderColor: server.color,
                  animation: 'fadeInPanel 0.35s ease',
                }}
              >
                <div className="cinzel" style={{ fontSize: isMobile ? '0.85rem' : '1.05rem', color: '#fff', marginBottom: '0.4rem' }}>
                  {server.name}
                </div>
                <div style={{
                  fontSize: isMobile ? '0.55rem' : '0.62rem', letterSpacing: '0.5px',
                  color: status.color, marginBottom: '0.6rem',
                }}>
                  {status.text}
                </div>

                {!isMobile && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-mute)', lineHeight: 1.5, marginBottom: '0.7rem' }}>
                    {server.desc}
                  </p>
                )}

                {server.highlight && (
                  <div style={{
                    display: 'inline-block', marginBottom: '0.6rem', padding: '0.25rem 0.6rem',
                    borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.5px',
                    color: server.color, border: `1px solid ${server.color}66`, background: `${server.color}18`,
                  }}>
                    ⚔ {server.highlight}
                  </div>
                )}

                {server.rates && (
                  <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                    {Object.entries(server.rates).map(([k, v]) => (
                      <div key={k} style={{ fontSize: '0.62rem' }}>
                        <span style={{ color: 'var(--text-mute)' }}>{k} </span>
                        <span style={{ color: server.color, fontWeight: 700 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* "Criar conta" vale mesmo antes da estreia (conta e da rede, serve pra
                    qualquer jogo). "Baixar" aparece sempre que o servidor tiver actionLabel
                    (Interlude liberado antes da estreia 2026-07-16 — cliente subindo jaja). */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRegisterClick && onRegisterClick() }}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.6rem', letterSpacing: '1px' }}
                  >
                    CRIAR CONTA
                  </button>
                  {server.actionLabel && (
                    <a
                      href={server.downloadHref}
                      onClick={(e) => e.stopPropagation()}
                      className="btn btn-ghost"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.6rem', letterSpacing: '1px' }}
                    >
                      {server.actionLabel}
                    </a>
                  )}
                </div>

                {/* X pra fechar — so aparece quando FIXADO por click (hover fecha sozinho
                    ao tirar o mouse, nao precisa de X) */}
                {pinned === server.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setPinned(null) }}
                    aria-label="Fechar"
                    style={{
                      position: 'absolute', top: '0.6rem', right: '0.6rem',
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.25)',
                      color: '#fff', fontSize: '0.85rem', lineHeight: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
