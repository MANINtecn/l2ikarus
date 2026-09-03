import './Comunidade.css'

/**
 * Faixa de comunidade da home: WhatsApp -> gameplays -> Discord.
 *
 * A ordem e' proposital: o WhatsApp e' o canal onde o jogador brasileiro
 * ja' esta', as gameplays mostram o jogo antes de ele baixar 3 GB, e o
 * Discord fecha como a casa oficial.
 */

// Convite oficial, confirmado pelo dono em 2026-09-03.
const LINK_DISCORD = 'https://discord.gg/BGs8mkUrmE'

// Trocar pelos videos definitivos. `id` e' o codigo do YouTube
// (o que vem depois de "watch?v=" ou "youtu.be/").
const GAMEPLAYS = [
  { id: '', titulo: 'Interlude 30x — PvP em Giran', servidor: 'Interlude 30x' },
  { id: '', titulo: 'PVP 300x — primeiros minutos', servidor: 'PVP 300x' },
  { id: '', titulo: 'Mu Online — no celular', servidor: 'Mu Online' },
]

function Gameplay({ id, titulo, servidor }) {
  // Sem id ainda: mostra o lugar reservado em vez de um player quebrado.
  if (!id) {
    return (
      <div className="gp-item gp-vazio">
        <div className="gp-marca">
          <span className="gp-play" aria-hidden="true" />
          <span>vídeo em breve</span>
        </div>
        <div className="gp-legenda">
          <strong>{titulo}</strong>
          <span>{servidor}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="gp-item">
      <div className="gp-quadro">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={titulo}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="gp-legenda">
        <strong>{titulo}</strong>
        <span>{servidor}</span>
      </div>
    </div>
  )
}

export default function Comunidade() {
  // Sobe suave, mas respeita quem pediu menos movimento no sistema.
  const aoTopo = (e) => {
    e.preventDefault()
    const sem = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: sem ? 'auto' : 'smooth' })
  }

  return (
    <section className="com-bloco">
      <div className="com-shell">

        {/* ── WhatsApp ── */}
        <div className="com-zap" id="comunidade">
          <div className="com-zap-txt">
            <span className="com-eyebrow">Comunidade</span>
            <h2>Entre no grupo do WhatsApp</h2>
            <p>
              É onde a gente avisa manutenção, evento e novidade primeiro —
              e onde você tira dúvida direto com quem joga.
            </p>
          </div>
          <a
            className="com-zap-btn"
            href="https://chat.whatsapp.com/HLBCkTWF4sv5NrzAh2pLQk"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
              <path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35M12.04 21.5h-.01a9.5 9.5 0 0 1-4.83-1.32l-.35-.2-3.59.94.96-3.5-.23-.36a9.44 9.44 0 0 1-1.45-5.05c0-5.22 4.27-9.47 9.51-9.47 2.54 0 4.93.99 6.72 2.78a9.4 9.4 0 0 1 2.78 6.7c0 5.22-4.27 9.48-9.51 9.48m8.09-17.56A11.4 11.4 0 0 0 12.04 .6C5.75.6.63 5.7.63 11.97c0 2 .53 3.96 1.53 5.68L.54 23.4l5.9-1.54a11.5 11.5 0 0 0 5.6 1.42h.01c6.29 0 11.41-5.1 11.41-11.37 0-3.04-1.19-5.89-3.34-8.04" />
            </svg>
            Entrar no grupo
          </a>
        </div>

        {/* ── Discord ── */}
        <div className="com-dc" id="discord">
          <div className="com-zap-txt">
            <span className="com-eyebrow">Casa oficial</span>
            <h2>Entre no nosso Discord</h2>
            <p>
              Suporte, anúncios, canal de bug e a voz de quem joga. É onde as
              decisões do servidor passam antes de virar mudança.
            </p>
          </div>
          <a
            className="com-dc-btn"
            href={LINK_DISCORD}
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
              <path fill="currentColor" d="M20.32 4.57A19.8 19.8 0 0 0 15.43 3c-.24.42-.5.99-.69 1.44a18.3 18.3 0 0 0-5.48 0C9.07 3.99 8.8 3.42 8.57 3a19.7 19.7 0 0 0-4.9 1.57C.57 9.2-.27 13.72.15 18.17a19.9 19.9 0 0 0 6.06 3.08c.49-.67.93-1.38 1.3-2.13-.71-.27-1.4-.6-2.04-.99.17-.13.34-.26.5-.4a14.2 14.2 0 0 0 12.07 0c.16.14.33.28.5.4-.65.39-1.33.72-2.05.99.38.75.81 1.46 1.3 2.13a19.8 19.8 0 0 0 6.07-3.08c.5-5.16-.84-9.64-3.54-13.6M8.02 15.44c-1.18 0-2.15-1.09-2.15-2.42s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.33-.95 2.42-2.15 2.42m7.95 0c-1.18 0-2.15-1.09-2.15-2.42s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.33-.94 2.42-2.15 2.42" />
            </svg>
            Entrar no Discord
          </a>
        </div>


        {/* ── gameplays ── */}
        <div className="com-gameplays" id="gameplays">
          <div className="com-cabeca">
            <span className="com-eyebrow">Veja antes de baixar</span>
            <h2>Gameplays</h2>
          </div>
          <div className="gp-grade">
            {GAMEPLAYS.map((g) => (
              <Gameplay key={g.titulo} {...g} />
            ))}
          </div>
        </div>


      </div>
    </section>
  )
}
