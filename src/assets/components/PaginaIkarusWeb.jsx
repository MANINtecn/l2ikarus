import { useEffect, useState } from 'react'
import './HeroRede.css'
import './PaginaSandbox.css'
import './PaginaIkarusWeb.css'
import { useLinksComunidade } from '../../config/linksComunidade'
import { IconeWhatsapp, IconeDiscord } from './IconesComunidade'
import IkoinEmblema from './IkoinEmblema'
import { URL_JOGO, URL_STATUS_JOGO, pilares, classes, andares, progressao, versus, galeria, plataformas } from '../../config/ikarusWeb'

/**
 * Home de l2ikarus.com: o L2 Ikarus Web (MMORPG de ação sem target, no navegador, PC e celular).
 * Conta, painel do jogador (Ikoin via PIX) e painel admin sao os mesmos do site antigo;
 * aqui so' a apresentacao. Textos e enderecos em src/config/ikarusWeb.js.
 * Formas sempre angulares (chanfro/losango): nada redondo.
 */

const ir = (id) => (e) => {
  e?.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// [x%, y%, duracao, atraso] das fagulhas em volta da logo IS Labs (as mesmas do site no ar)
const FAISCAS = [
  [14, 22, 3.2, 0], [22, 58, 4.1, 1.2], [28, 12, 3.6, 2.1], [33, 74, 4.4, .6], [38, 36, 3.1, 1.8],
  [62, 30, 3.8, .3], [67, 66, 4.2, 2.4], [72, 14, 3.4, 1.1], [78, 48, 4.6, .9], [86, 26, 3.3, 2.7],
  [9, 44, 4.8, 1.5], [91, 62, 3.9, .2], [45, 8, 4.3, 3], [56, 82, 3.5, 1.4], [18, 84, 4, 2.2],
]

// Icones dos pilares: so' linhas retas
const ICONES = {
  esquiva: <path d="M4 18 L10 6 L14 13 L20 4 M15 4 H20 V9" />,
  combo: <path d="M3 12 H8 L11 5 L14 19 L17 12 H21" />,
  grupo: <path d="M12 3 L18 9 L12 15 L6 9 Z M4 21 L8 15 M20 21 L16 15" />,
  pvp: <path d="M5 5 L19 19 M19 5 L5 19 M3 9 L9 3 M15 21 L21 15" />,
}
const ICONES_PLAT = {
  pc: <path d="M3 4 H21 V16 H3 Z M9 20 H15 M12 16 V20" />,
  celular: <path d="M7 2 H17 V22 H7 Z M10 19 H14" />,
  app: <path d="M12 3 V15 M7 10 L12 15 L17 10 M4 19 H20" />,
}
const ICONES_CLASSE = {
  guardiao: <path d="M12 2 L20 5 V12 L12 22 L4 12 V5 Z M12 7 V16" />,
  guerreiro: <path d="M12 2 L14 5 V15 H10 V5 Z M7 15 H17 M12 15 V22" />,
  mago: <path d="M12 2 L16 7 L12 12 L8 7 Z M12 12 V22 M9 18 H15" />,
  clerigo: <path d="M4 5 H11 L12 6 L13 5 H20 V19 H13 L12 20 L11 19 H4 Z M12 6 V20 M7 10 L9 8 L11 10 L9 12 Z" />,
}

function Icone({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="miter" aria-hidden="true">{d}</svg>
  )
}

function BotaoJogar({ grande = false }) {
  return (
    <a className={`ikw-jogar ${grande ? 'grande' : ''}`} href={URL_JOGO}>
      <span>Jogar agora</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 L19 12 L7 20 Z" /></svg>
    </a>
  )
}

// Quantos jogadores estao no servidor do jogo. Se falhar, simplesmente nao mostra.
function useStatusJogo() {
  const [st, setSt] = useState(null)
  useEffect(() => {
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 5000)
    fetch(URL_STATUS_JOGO, { signal: ctl.signal, cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        const n = (d.canais || []).reduce((a, c) => a + (c.jogadores || 0), 0)
        setSt({ on: true, n })
      })
      .catch(() => setSt(null))
      .finally(() => clearTimeout(t))
    return () => { clearTimeout(t); ctl.abort() }
  }, [])
  return st
}

export default function PaginaIkarusWeb({ jogador, admin, onEntrar, onCriarConta, onAbrirConta, onAbrirAdmin }) {
  const links = useLinksComunidade()
  const status = useStatusJogo()

  const [rolou, setRolou] = useState(false)
  useEffect(() => {
    const f = () => setRolou(window.scrollY > 30)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  useEffect(() => { document.title = 'L2 Ikarus — o primeiro L2 sem target · IS Labs' }, [])

  return (
    <div className="ikw">
      {/* TOPO DA IS LABS: a mesma barra e a mesma logo do site no ar (estilos de PaginaSandbox.css) */}
      <div className="sbx ikw-islabs">
        <nav className={`sbx-nav ikw-barra ${rolou ? 'cheia' : ''}`} aria-label="Jogos IS Labs">
          <div className="rede-shell">
            {/* "Jogos" vai virar a vitrine dos jogos web da IS Labs; por enquanto nao leva a lugar nenhum */}
            <span className="sbx-todos ikw-em-breve" title="Mais jogos da IS Labs em breve">
              <i aria-hidden="true"><b /><b /><b /><b /></i>
              <span>Jogos</span>
            </span>
            <div className="sbx-jogos">
              <a className="sbx-jogo on" href="#ikw-combate" onClick={ir('ikw-combate')}>
                <em aria-label="online" />
                <span><b>L2 Ikarus<u className="sbx-tag-beta">Beta</u></b><small>MMORPG de ação web</small></span>
              </a>
            </div>
            <div className="sbx-acoes">
              {links.grupo && (
                <a className="sbx-social zap" href={links.grupo} target="_blank" rel="noreferrer" title="Entrar no grupo do WhatsApp">
                  <IconeWhatsapp size={17} /><span>Grupo</span>
                </a>
              )}
              {links.discord && (
                <a className="sbx-social dc" href={links.discord} target="_blank" rel="noreferrer" title="Entrar no Discord">
                  <IconeDiscord size={18} /><span>Discord</span>
                </a>
              )}
              {admin && <button className="sbx-conta admin" onClick={onAbrirAdmin} title="Painel administrativo">Admin</button>}
              {jogador
                ? <button className="sbx-conta" onClick={onAbrirConta} title="Painel do jogador">{jogador.login || 'Minha conta'}</button>
                : <button className="sbx-conta" onClick={onEntrar}>Entrar</button>}
              <span className="sbx-brilho nav">
                <a className="sbx-baixar nav" href={URL_JOGO}>
                  <svg className="ikw-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 L19 12 L7 20 Z" /></svg>
                  Jogar agora
                </a>
              </span>
            </div>
          </div>
        </nav>

      </div>

      {/* COLLAB: IS Labs no alto a esquerda, L2 Ikarus em destaque do centro para a direita.
          As duas artes sobem por tras da barra, que fica transparente enquanto a pagina esta no topo. */}
      <section className="ikw-collab" id="ikw-jogo">
        <div className="ikw-collab-fundo" aria-hidden="true" />
        <div className="ikw-collab-islabs" id="topo">
          <div className="sbx-faiscas" aria-hidden="true">
            {FAISCAS.map(([x, y, d, a], i) => (
              <i key={i} style={{ left: `${x}%`, top: `${y}%`, '--d': `${d}s`, '--a': `${a}s` }} />
            ))}
          </div>
          <img src="/media/sandbox/islabs_fortaleza.webp" alt="IS Labs" width="1100" height="1100" />
        </div>
        <div className="ikw-collab-jogo">
          <img className="ikw-collab-arte" src="/media/web/capa_logo.webp" alt="L2 Ikarus" width="1400" height="620" fetchpriority="high" />
          <div className="ikw-collab-txt">
            <p className="ikw-apresenta"><i aria-hidden="true" />IS Labs <span>×</span> L2 Ikarus</p>
            <h1 className="ikw-chamada">O primeiro L2 <em>sem target</em></h1>
            <p className="ikw-hero-sub">
              Combate de ação de verdade: você <b>mira</b>, <b>esquiva</b> e <b>encadeia combos</b>.
              Sem clicar e esperar. No navegador, no PC e no celular.
            </p>
            <div className="ikw-hero-acoes">
              <BotaoJogar grande />
              {!jogador && <button className="ikw-btn fantasma alto" onClick={onCriarConta}>Criar conta grátis</button>}
            </div>
            <div className="ikw-chips">
              <span>Direto no navegador</span>
              <span>PC e celular</span>
              <span>Sem download</span>
              <span>Grátis para jogar</span>
            </div>
            {status?.on && (
              <p className="ikw-status"><i aria-hidden="true" />Servidor online{status.n > 0 && ` · ${status.n} ${status.n === 1 ? 'jogador' : 'jogadores'} agora`}</p>
            )}
          </div>
        </div>
      </section>

      {/* SEM TARGET: o diferencial, em contraste com o L2 classico */}
      <section className="ikw-sec" id="ikw-combate">
        <div className="ikw-cab">
          <small>Sem target</small>
          <h2>Você não clica no alvo. <em>Você mira.</em></h2>
          <p>O mundo do Lineage 2 que você conhece, com combate de jogo de ação. Quem decide a luta é a sua mão, não o auto-ataque.</p>
        </div>
        <div className="ikw-versus">
          <div className="ikw-versus-cab" aria-hidden="true">
            <span />
            <b className="classico">L2 clássico</b>
            <b className="ikarus">L2 Ikarus</b>
          </div>
          {versus.map(([tema, antes, agora]) => (
            <div className="ikw-versus-linha" key={tema}>
              <span className="tema">{tema}</span>
              <p className="classico"><small>L2 clássico</small>{antes}</p>
              <p className="ikarus"><small>L2 Ikarus</small>{agora}</p>
            </div>
          ))}
        </div>
        <div className="ikw-pilares">
          {pilares.map((p) => (
            <article className="ikw-pilar" key={p.id}>
              <Icone d={ICONES[p.id]} />
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* VEJA O JOGO: imagens reais da versao beta */}
      <section className="ikw-sec ikw-galeria-sec" id="ikw-galeria">
        <div className="ikw-cab">
          <small>Imagens reais · versão beta</small>
          <h2>Veja o jogo</h2>
          <p>Capturas do jogo rodando no navegador. Vídeos de gameplay no PC e no celular chegando.</p>
        </div>
        <div className="ikw-galeria">
          {galeria.map((g) => (
            <figure key={g.src}>
              <img src={g.src} alt={g.legenda} loading="lazy" width="1200" height="700" />
              <figcaption>{g.legenda}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* PC E CELULAR */}
      <section className="ikw-sec" id="ikw-plataformas">
        <div className="ikw-cab">
          <small>Jogue onde quiser</small>
          <h2>PC e celular, <em>o mesmo jogo</em></h2>
          <p>Por ser no navegador, não tem cliente para baixar. Abriu, jogou.</p>
        </div>
        <div className="ikw-plataformas">
          {plataformas.map((x) => (
            <article key={x.id} className="ikw-plat">
              <div className="ikw-plat-ico"><Icone d={ICONES_PLAT[x.id]} /></div>
              <h3>{x.nome}</h3>
              <ul>{x.itens.map((i) => <li key={i}>{i}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      {/* CLASSES */}
      <section className="ikw-sec" id="ikw-classes">
        <div className="ikw-cab">
          <small>4 classes</small>
          <h2>Escolha como lutar</h2>
          <p>A classe define a arma e o jeito de jogar. Raça e aparência ficam por sua conta.</p>
        </div>
        <div className="ikw-classes">
          {classes.map((c, i) => (
            <article className="ikw-classe" key={c.id} style={{ '--i': i }}>
              <div className="ikw-classe-ico"><Icone d={ICONES_CLASSE[c.id]} /></div>
              <small>{c.papel}</small>
              <h3>{c.nome}</h3>
              <span className="ikw-classe-arma">{c.arma}</span>
              <p>{c.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* TORRE DO BAIUM */}
      <section className="ikw-torre" id="ikw-torre">
        <picture className="ikw-torre-fundo" aria-hidden="true">
          <source media="(max-width: 700px)" srcSet="/media/web/templo_m.webp" />
          <img src="/media/web/templo.webp" alt="" loading="lazy" />
        </picture>
        <div className="ikw-sec ikw-torre-in">
          <div className="ikw-cab">
            <small>Conteúdo principal</small>
            <h2>Torre do Baium</h2>
            <p>Três andares. Cada um mais duro que o anterior. No topo, o chefe que todo jogador de L2 conhece.</p>
          </div>
          <ol className="ikw-andares">
            {andares.map((a) => (
              <li key={a.n}>
                <span className="ikw-andar-n">{a.n}</span>
                <div><h3>{a.nome}</h3><p>{a.texto}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PROGRESSAO */}
      <section className="ikw-sec" id="ikw-progressao">
        <div className="ikw-cab">
          <small>Progressão</small>
          <h2>Upar tem peso</h2>
          <p>Cada nível conta. As skills liberam conforme você sobe, e você monta os atributos do seu jeito.</p>
        </div>
        <div className="ikw-numeros">
          {progressao.map((x) => (
            <div key={x.rotulo}><b>{x.valor}</b><span>{x.rotulo}</span></div>
          ))}
        </div>
      </section>

      {/* LOJA */}
      <section className="ikw-sec" id="ikw-loja">
        <div className="ikw-loja">
          <div className="ikw-loja-txt">
            <small>Loja</small>
            <h2>Skins com Ikoin</h2>
            <p>
              Mude o visual do seu personagem com skins compradas com <b>Ikoin</b>, a moeda do L2 Ikarus.
              Skins são só aparência: quem decide a luta é você.
            </p>
            <ul>
              <li>Compre Ikoin no PIX, direto no painel da sua conta</li>
              <li>O crédito cai na hora, depois que o pagamento é confirmado</li>
              <li>Catálogo de skins chegando</li>
            </ul>
            <div className="ikw-loja-acoes">
              {jogador
                ? <button className="ikw-btn alto" onClick={onAbrirConta}>Comprar Ikoin</button>
                : <>
                    <button className="ikw-btn alto" onClick={onCriarConta}>Criar conta</button>
                    <button className="ikw-btn fantasma alto" onClick={onEntrar}>Já tenho conta</button>
                  </>}
            </div>
          </div>
          <div className="ikw-loja-vitrine" aria-hidden="true">
            <div className="ikw-moeda">
              <IkoinEmblema />
              <span>Ikoin</span>
            </div>
            <div className="ikw-slots">
              {Array.from({ length: 6 }).map((_, i) => <i key={i} style={{ '--i': i }}><span>em breve</span></i>)}
            </div>
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="ikw-final">
        <h2>Pronto para a torre?</h2>
        <p>Abre no navegador do PC ou do celular. No celular, dá para instalar como app.</p>
        <BotaoJogar grande />
      </section>

      {/* celular: jogar sempre a um toque */}
      <div className="ikw-barra-jogar">
        <span><b>L2 Ikarus</b><small>O L2 sem target, no navegador</small></span>
        <BotaoJogar />
      </div>

      {/* RODAPE */}
      <footer className="ikw-rodape">
        <div className="ikw-rodape-linha">
          <a className="ikw-marca" href="/"><i aria-hidden="true" /><span>L2 <b>IKARUS</b></span></a>
          <div className="ikw-social">
            {links.grupo && <a href={links.grupo} target="_blank" rel="noreferrer" aria-label="Grupo no WhatsApp"><IconeWhatsapp /></a>}
            {links.discord && <a href={links.discord} target="_blank" rel="noreferrer" aria-label="Discord"><IconeDiscord /></a>}
          </div>
        </div>
        <div className="ikw-rodape-linha baixo">
          <nav>
            <a href="/terms">Termos</a>
            <a href="/privacy">Privacidade</a>
            <span className="ikw-classico">L2 Clássico (PC) · em breve</span>
          </nav>
          <button className="ikw-tecx" onClick={() => { window.location.href = '/api/auth/google' }}>
            © {new Date().getFullYear()} TECX SOFTHOUSE · IS Labs
          </button>
        </div>
      </footer>
    </div>
  )
}
