import { useState, useEffect } from 'react'
import ServerCards from './ServerCards'

export default function Hero3D({ onRegisterClick, onEssenceClick, onInfoClick }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [serverStatus, setServerStatus] = useState({ online: false, players: 0 })
  const [adminOnline, setAdminOnline] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024)
    const handleScroll = () => setScrollProgress(Math.min(1, window.scrollY / 600))

    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status')
        const data = await res.json()
        setServerStatus({ online: data.online, players: data.players || 0 })
      } catch {
        setServerStatus({ online: false, players: 0 })
      }

      try {
        const discordRes = await fetch('/api/discord')
        const discordData = await discordRes.json()
        setAdminOnline(discordData.adminOnline || false)
      } catch {
        setAdminOnline(false)
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    fetchStatus()
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section id="hero" className="hero-section" style={{
      height: '100vh', width: '100%',
      position: 'fixed', top: 0, left: 0,
      zIndex: 1, overflow: 'hidden',
    }}>
      {/* BACKGROUND — gradiente estatico (video + poster antigo REMOVIDOS 2026-07-15:
          era o mesmo frame congelado do vídeo, por isso "ainda parecia ter o video").
          Sem arte de fundo nova ainda — gradiente neutro nao compete com os personagens
          dos ServerCards. Trocar por imagem quando o usuario trouxer uma arte de fundo. */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 0%, #16161f 0%, #0a0a10 45%, #050508 100%)',
      }} />

      {/* PARTICULAS — bem sutis, so pra dar vida ao fundo sem chamar atencao
          (pedido do usuario 2026-07-15: "bem disfarçados"). CSS puro, leve. */}
      <div className="hero-particles" aria-hidden="true" />

      {/* CONTENT — empilhado: topo (titulo + status) e cards logo abaixo, tudo no
          fluxo normal (sem paddingBottom forcado) pra nao colidir com o resto da pagina
          no scroll — o fade/translate abaixo cuida de sumir o hero inteiro ao rolar. */}
      <div className="container" style={{
        height: '100%', position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        gap: isMobile ? '1.5rem' : '1.6rem',
        paddingTop: isMobile ? '70px' : '55px',
        opacity: 1 - scrollProgress,
        transform: `translateY(${scrollProgress * -40}px)`,
        transition: 'opacity 0.1s linear',
        pointerEvents: scrollProgress > 0.5 ? 'none' : 'auto',
      }}>

        {/* TOPO — logo centralizada (substitui o texto "IKARUS SERVERS" 2026-07-15),
            status fica ancorado a direita (desktop); empilhado no mobile */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'space-between',
          gap: '2rem',
        }}>
          {/* espaçador simetrico a coluna de status, pra logo ficar centralizada de verdade */}
          {!isMobile && <div style={{ width: '230px', flexShrink: 0 }} />}

          <img
            src="/logo-white.png"
            alt="IKARUS Servers"
            style={{
              width: isMobile ? '260px' : '420px', height: 'auto', maxWidth: '90%',
              marginTop: isMobile ? '-30px' : '-55px',
              filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.7)) drop-shadow(0 0 40px rgba(212,175,55,0.15))',
            }}
          />

          {/* STATUS CARDS — apenas desktop */}
          {!isMobile && (
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '1rem',
              width: '230px', flexShrink: 0,
            }}>
              {/* STATUS SERVIDOR */}
              <div className="glass-panel hero-status-card" style={{
                borderLeft: `3px solid ${serverStatus.online ? '#4ade80' : '#ef4444'}`,
                padding: '1.2rem',
              }}>
                <div className="status-header">
                  <span className="status-label">STATUS</span>
                  <div className="status-dot" style={{
                    background: serverStatus.online ? '#4ade80' : '#ef4444',
                    boxShadow: `0 0 12px ${serverStatus.online ? '#4ade80' : '#ef4444'}`,
                  }} />
                </div>
                <div className="status-value" style={{ fontSize: '1.3rem' }}>
                  {serverStatus.online ? 'ON-LINE' : 'OFFLINE'}
                </div>
              </div>

              {/* ADMIN IKARUS */}
              <div className="glass-panel hero-status-card" style={{
                borderLeft: `3px solid ${adminOnline ? '#4ade80' : '#ef4444'}`,
                padding: '1.2rem',
              }}>
                <div className="status-header">
                  <span className="status-label">ADMIN</span>
                  <div className="status-dot" style={{
                    background: adminOnline ? '#4ade80' : '#ef4444',
                    boxShadow: `0 0 12px ${adminOnline ? '#4ade80' : '#ef4444'}`,
                  }} />
                </div>
                <div className="status-value" style={{
                  fontSize: '1rem',
                  color: adminOnline ? '#4ade80' : '#ef4444',
                  letterSpacing: '2px',
                }}>
                  IKARUS
                </div>
                <p className="status-meta" style={{ marginTop: '0.3rem' }}>
                  {adminOnline ? 'Online no Discord' : 'Offline no Discord'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* CARDS DE SERVIDOR — 1 por servidor (Interlude/Essence/MU), hover = destaque,
            click = expande info com botoes de acao. Fica no fluxo normal do hero. */}
        <ServerCards isMobile={isMobile} onRegisterClick={onRegisterClick} onEssenceClick={onEssenceClick} onInfoClick={onInfoClick} />
      </div>

      <div className="scanline-overlay" style={{ opacity: 0.08 }} />
    </section>
  )
}
