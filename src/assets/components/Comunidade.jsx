import './Comunidade.css'
import { useLinksComunidade } from '../../config/linksComunidade'
import { IconeWhatsapp, IconeDiscord } from './IconesComunidade'

/**
 * Faixa de comunidade da home: WhatsApp -> gameplays -> Discord.
 *
 * A ordem e' proposital: o WhatsApp e' o canal onde o jogador brasileiro
 * ja' esta', as gameplays mostram o jogo antes de ele baixar 3 GB, e o
 * Discord fecha como a casa oficial.
 */

// Links do grupo e do Discord: vem do painel admin (aba LINKS); reserva em config/linksComunidade.js.

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
  const links = useLinksComunidade()
  // Sobe suave, mas respeita quem pediu menos movimento no sistema.
  const aoTopo = (e) => {
    e.preventDefault()
    const sem = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: sem ? 'auto' : 'smooth' })
  }

  return (
    <section className="com-bloco">
      <div className="com-shell">

        {/* ── WhatsApp ── (some se o admin apagar o link) */}
        {links.grupo && (
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
            href={links.grupo}
            target="_blank"
            rel="noreferrer"
          >
            <IconeWhatsapp />
            Entrar no grupo
          </a>
        </div>
        )}

        {/* ── Discord ── */}
        {links.discord && (
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
            href={links.discord}
            target="_blank"
            rel="noreferrer"
          >
            <IconeDiscord />
            Entrar no Discord
          </a>
        </div>
        )}


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
