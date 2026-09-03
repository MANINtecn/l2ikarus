import { useEffect, useRef } from 'react'
import './HeroRede.css'

/**
 * Home da rede IS SERVERS — direcao "Portais" (aprovada 2026-09-03).
 *
 * Substitui o Hero3D antigo, que era de um servidor so'. Aqui os quatro
 * mundos aparecem em arco, com o vao central deixando a logo do video
 * respirar. As posicoes dos cards estao TRAVADAS no CSS (o dono ajustou
 * uma a uma) — ver HeroRede.css.
 */
export default function HeroRede({ onRegisterClick, onLoginClick, onAbrirServidor }) {
  const navRef = useRef(null)

  // A nav nasce transparente e escurece quando a pagina sai do topo.
  // IntersectionObserver em vez de listener de scroll: o navegador avisa
  // so' na troca de estado, em vez de a cada pixel rolado.
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const sentinela = document.createElement('div')
    sentinela.style.cssText =
      'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none'
    document.body.prepend(sentinela)

    const obs = new IntersectionObserver(
      ([e]) => nav.classList.toggle('rolou', !e.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(sentinela)

    return () => {
      obs.disconnect()
      sentinela.remove()
    }
  }, [])

  const servidores = [
    {
      id: 'inter',
      rota: '/interlude',
      nome: 'Interlude 30x',
      plataforma: 'PC',
      texto: 'Cada classe faz o que promete. Nada de build quebrada — aqui sua classe funciona.',
      taxas: [['XP', '30x'], ['SP', '30x'], ['Drop', '10x'], ['Spoil', '15x']],
      acao: 'Jogar agora',
      aberto: true,
    },
    {
      id: 'pvp',
      rota: '/300x',
      nome: 'Interlude PVP 300x',
      plataforma: 'PC',
      texto: 'Quanto mais você farma, mais forte fica no PvP. Progressão sem fim.',
      taxas: [['XP', '300x'], ['SP', '300x'], ['Adena', '300x'], ['Sub', 'livre']],
      acao: 'Jogar agora',
      aberto: true,
    },
    {
      id: 'mu',
      rota: '/mu',
      nome: 'Mu Online',
      plataforma: 'PC e celular',
      texto: 'Comece no PC, continue no celular. Mesmo personagem, mesmo mundo.',
      taxas: [['PC +', 'Android'], ['Progresso', 'único'], ['Season', 'clássica']],
      acao: 'Beta fechado',
      aberto: false,
    },
    {
      id: 'ess',
      rota: null,
      nome: 'Essence',
      plataforma: 'PC',
      texto: 'Em preparação. Sua conta já vale aqui quando ele abrir.',
      taxas: [],
      acao: 'Beta fechado',
      aberto: false,
    },
  ]

  return (
    <>
      <div className="rede-bg" />
      <video
        className="rede-vid"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        poster="/media/hero-rede.webp"
        src="/media/hero-rede.mp4"
      />
      <div className="rede-veu" />

      <nav className="rede-nav" ref={navRef}>
        <div className="rede-shell">
          <span className="rede-brand">IS SERVERS</span>
          <div className="rede-links">
            <a href="#servidores">Servidores</a>
            <a href="#conta">Conta</a>
            <a href="#ranking">Ranking</a>
            <a href="https://discord.gg/ikarus" target="_blank" rel="noreferrer">Discord</a>
          </div>
          <div className="rede-acoes">
            <button type="button" className="rede-login" onClick={onLoginClick}>
              Login
            </button>
            <button type="button" className="rede-entrar" onClick={onRegisterClick}>
              Criar conta
            </button>
          </div>
        </div>
      </nav>

      <header className="rede-hero" />

      <div className="rede-shell" id="servidores">
        <div className="rede-portais">
          {servidores.map((s) => (
            <a
              key={s.id}
              href={s.rota || '#servidores'}
              className={`rede-card rede-${s.id}`}
              onClick={(e) => {
                e.preventDefault()
                if (s.rota) onAbrirServidor(s.rota)
              }}
            >
              <span className="rede-veu-card" />
              <span className="rede-plataforma">{s.plataforma}</span>
              <div className="rede-corpo">
                <span className="rede-moldura" />
                <h2 className="rede-nome">{s.nome}</h2>
                <p className="rede-texto">{s.texto}</p>
                {s.taxas.length > 0 && (
                  <div className="rede-taxas">
                    {s.taxas.map(([rotulo, valor]) => (
                      <span className="rede-taxa" key={rotulo}>
                        {rotulo} <b>{valor}</b>
                      </span>
                    ))}
                  </div>
                )}
                <span className={`rede-btn ${s.aberto ? 'rede-btn-on' : 'rede-btn-off'}`}>
                  {s.acao}
                </span>
              </div>
            </a>
          ))}

          <div className="rede-selo-central">
            <span className="rede-selo">
              <span className="rede-selo-arte" aria-hidden="true" />
              <span className="rede-selo-txt">
                <b>SEM P2W</b>
                <i>nenhum item à venda</i>
              </span>
            </span>
          </div>
        </div>

        <div className="rede-faixa">
          <div className="rede-uma-conta">
            <span className="rede-uc">
              <b>1 conta</b>, vários mundos
            </span>
            <span className="rede-ponto" />
            <span className="rede-uc">sem venda de vantagens</span>
          </div>
        </div>
      </div>
    </>
  )
}
