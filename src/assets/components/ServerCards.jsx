import { useState } from 'react'
import interludeImg from '../server-interlude.webp'
import essenceImg from '../server-essence.webp'
import muImg from '../server-mu.webp'

// IKARUS 2026-07-15: cards de servidor no hero. 3 artes (Interlude/Essence/MU),
// cada uma JA TRAZ o logo/titulo do jogo estampado na propria imagem (composicao
// fundo-transparente feita pelo usuario) — por isso NAO renderizamos label de nome
// por cima, so a vinheta pra dar contraste. Hover/click = mesmo efeito: escala +
// eleva + abre painel de info com descricao/rates. Cabal fica de fora por enquanto
// (nao criar card pra ele ainda). Troque `img: null` por
// `import interludeImg from '../server-interlude.png'` quando cada arte chegar.
const SERVERS = [
  {
    id: 'interlude',
    name: 'Interlude',
    color: '#4ade80',
    img: interludeImg,
    desc: 'A era dourada do PvP. Classes balanceadas, siege de castelo, o L2 que você lembra.',
    rates: { XP: 'x15', SP: 'x15', ADENA: 'x5' },
    status: 'EM BREVE',
  },
  {
    id: 'essence',
    name: 'Essence',
    color: '#60a5fa',
    img: essenceImg,
    desc: 'Sistema de classe única, autofarm nativo, o L2 repensado pra quem quer progredir rápido.',
    rates: { XP: 'x3', SP: 'x3', ADENA: 'x2' },
    status: 'EM BREVE',
  },
  {
    id: 'mu',
    name: 'MU Online',
    color: '#f472b6',
    img: muImg,
    desc: 'Reservado para a expansão da rede Ikarus.',
    rates: null,
    status: 'EM PLANEJAMENTO',
  },
]

export default function ServerCards({ isMobile }) {
  const [active, setActive] = useState(null)

  const activeServer = SERVERS.find(s => s.id === active)

  return (
    <div style={{
      position: 'absolute',
      bottom: isMobile ? '1rem' : '2.5rem',
      left: 0, right: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      gap: isMobile ? '0.6rem' : '1.5rem',
      zIndex: 15,
      pointerEvents: 'none',
    }}>
      {SERVERS.map(server => {
        const isActive = active === server.id
        return (
          <div
            key={server.id}
            onMouseEnter={() => !isMobile && setActive(server.id)}
            onMouseLeave={() => !isMobile && setActive(null)}
            onClick={() => setActive(isActive ? null : server.id)}
            style={{
              pointerEvents: 'auto',
              cursor: 'pointer',
              position: 'relative',
              width: isMobile ? '90px' : '180px',
              height: isMobile ? '135px' : '270px',
              borderRadius: '4px',
              overflow: 'hidden',
              border: `1px solid ${isActive ? server.color : 'rgba(255,255,255,0.15)'}`,
              background: server.img
                ? `url(${server.img}) center/cover no-repeat`
                : `linear-gradient(160deg, ${server.color}22 0%, #08080a 75%)`,
              transform: isActive ? 'scale(1.15) translateY(-10px)' : 'scale(1)',
              transformOrigin: 'bottom center',
              transition: 'transform 0.4s cubic-bezier(0.2, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
              boxShadow: isActive
                ? `0 20px 50px rgba(0,0,0,0.6), 0 0 40px ${server.color}55`
                : '0 8px 24px rgba(0,0,0,0.4)',
              zIndex: isActive ? 20 : 10,
            }}
          >
            {/* Placeholder enquanto a arte especifica nao chega (a arte final ja traz o titulo embutido) */}
            {!server.img && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Cinzel, serif', fontWeight: 900, textAlign: 'center',
                fontSize: isMobile ? '0.75rem' : '1.1rem',
                color: `${server.color}aa`,
                padding: '0.5rem',
              }}>
                {server.name}
              </div>
            )}
          </div>
        )
      })}

      {/* Painel de info do servidor ativo */}
      {activeServer && !isMobile && (
        <div className="glass-panel" style={{
          position: 'absolute',
          bottom: '100%',
          marginBottom: '1rem',
          padding: '1.5rem',
          width: '280px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          borderColor: activeServer.color,
        }}>
          <div className="cinzel" style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>
            {activeServer.name}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-mute)', lineHeight: 1.5, marginBottom: activeServer.rates ? '1rem' : 0 }}>
            {activeServer.desc}
          </p>
          {activeServer.rates && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              {Object.entries(activeServer.rates).map(([k, v]) => (
                <div key={k} style={{ fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--text-mute)' }}>{k} </span>
                  <span style={{ color: activeServer.color, fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{
            marginTop: '0.8rem', fontSize: '0.65rem', letterSpacing: '1px',
            color: activeServer.color,
          }}>
            {activeServer.status}
          </div>
        </div>
      )}
    </div>
  )
}
