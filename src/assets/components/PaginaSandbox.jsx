import { createContext, useContext, useEffect, useState } from 'react'
import './PaginaSandbox.css'
import { useLinksComunidade } from '../../config/linksComunidade'
import { IconeWhatsapp, IconeDiscord } from './IconesComunidade'
import Footer from './Footer'
import {
  jogos, mapa, raridades, STATUS, armaduras, runasLendarias, runasEpicas,
  atributosRuna, oficios, regrasInicio, economia, roadmap, prints,
} from '../../config/weaponMod'

/**
 * Pagina do Lineage II Sandbox (/sandbox), dentro da marca IS Labs.
 * Conteudo todo em src/config/weaponMod.js; aqui so' a apresentacao.
 * Ordem pensada para o celular: logo, o jogo, baixar, mapa do jogo, e o resto
 * fechado em blocos que a pessoa abre se quiser ler.
 */

// [x%, y%, duracao, atraso] das fagulhas do topo
const FAISCAS = [
  [14, 22, 3.2, 0], [22, 58, 4.1, 1.2], [28, 12, 3.6, 2.1], [33, 74, 4.4, .6], [38, 36, 3.1, 1.8],
  [62, 30, 3.8, .3], [67, 66, 4.2, 2.4], [72, 14, 3.4, 1.1], [78, 48, 4.6, .9], [86, 26, 3.3, 2.7],
  [9, 44, 4.8, 1.5], [91, 62, 3.9, .2], [45, 8, 4.3, 3], [56, 82, 3.5, 1.4], [18, 84, 4, 2.2],
]

const ir = (id) => (e) => {
  e?.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Print do cliente; clique abre ampliado (o lightbox mora na pagina)
const ZoomCtx = createContext(() => {})
function Print({ id, className = '' }) {
  const abrirZoom = useContext(ZoomCtx)
  const p = prints[id]
  if (!p) return null
  return (
    <figure className={`sbx-print ${className}`}>
      <button onClick={() => abrirZoom(p)} aria-label={`Ampliar: ${p.legenda}`}>
        <img src={p.src} alt={p.legenda} loading="lazy" />
        <span className="sbx-print-tag">no jogo</span>
      </button>
      <figcaption>{p.legenda}</figcaption>
    </figure>
  )
}

function Selo({ status }) {
  const s = STATUS[status]
  return <span className="sbx-selo" style={{ '--c': s.cor }}>{s.rotulo}</span>
}

// o link vem do painel admin (aba LINKS); reserva em config/linksComunidade.js
function BotaoBaixar({ className = '' }) {
  const { download } = useLinksComunidade()
  return (
    // o span segura o brilho: o corte chanfrado (clip-path) do botao apagaria a sombra
    <span className={`sbx-brilho ${className}`}>
      <a className={`sbx-baixar ${className}`} href={download} target="_blank" rel="noreferrer">
        <span className="sbx-seta" aria-hidden="true" />
        Baixar o jogo
      </a>
    </span>
  )
}

// Mapa do jogo: linha principal com ramos. Tocar numa etapa mostra o resumo dela.
function Mapa({ abrirDetalhe }) {
  const [sel, setSel] = useState(mapa[0].id)
  const n = mapa.find((m) => m.id === sel)
  const idx = mapa.indexOf(n)
  // o mesmo resumo aparece embaixo da trilha (PC) ou logo abaixo da etapa tocada (celular)
  const resumo = (onde) => (
    <div className={`sbx-mapa-det ${onde}`} key={`${onde}-${n.id}`}>
      <small>Etapa {idx + 1} de {mapa.length}</small>
      <h3>{n.nome}</h3>
      <ul>{n.det.map((d) => <li key={d}>{d}</li>)}</ul>
      <div className="sbx-mapa-acoes">
        <button onClick={() => abrirDetalhe(n.alvo)}>Ver detalhes</button>
        {idx < mapa.length - 1
          ? <button className="prox" onClick={() => setSel(mapa[idx + 1].id)}>Próxima etapa &rarr;</button>
          : <button className="prox" onClick={() => setSel(mapa[0].id)}>Recomeçar o ciclo &#8635;</button>}
      </div>
    </div>
  )
  return (
    <div className="sbx-mapa">
      <ol className="sbx-trilha">
        {mapa.map((m, i) => (
          <li key={m.id} className={`${m.id === sel ? 'on' : ''}${m.volta ? ' volta' : ''}`}>
            {m.acima && (
              <div className="sbx-ramo cima">
                <b>{m.acima.nome}</b><span>{m.acima.txt}</span>
              </div>
            )}
            <button className="sbx-no" onClick={() => setSel(m.id)} aria-pressed={m.id === sel}>
              <i>{i + 1}</i>
              <span><b>{m.nome}</b><small>{m.curto}</small></span>
            </button>
            {m.abaixo && (
              <div className="sbx-ramo baixo">
                <b>{m.abaixo.nome}</b><span>{m.abaixo.txt}</span>
              </div>
            )}
            {m.id === sel && resumo('cel')}
          </li>
        ))}
      </ol>
      {resumo('pc')}
    </div>
  )
}

function Armaduras() {
  const nomes = Object.keys(armaduras)
  const [q, setQ] = useState(nomes[0])
  const [col, setCol] = useState(3)
  const a = armaduras[q]
  return (
    <div className="sbx-arm">
      <div className="sbx-tabs">
        {nomes.map((n) => (
          <button key={n} className={n === q ? 'on' : ''} onClick={() => setQ(n)}>
            {n}<span>{armaduras[n].tema}</span>
          </button>
        ))}
      </div>
      <div className="sbx-tabela-wrap">
        <table className="sbx-tabela">
          <thead>
            <tr>
              <th>Peça</th>
              {raridades.map((r, i) => (
                <th key={r.id} style={{ '--c': r.cor }} className={i <= col ? 'ativa' : ''}
                  onMouseEnter={() => setCol(i)} onClick={() => setCol(i)}>
                  {r.nome}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {a.linhas.map(([peca, ...vals]) => (
              <tr key={peca}>
                <td>{peca}</td>
                {vals.map((v, i) => (
                  <td key={i} className={i <= col ? 'ativa' : ''} style={{ '--c': raridades[i].cor }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="sbx-nota">
        Os adicionais acumulam: peça <b style={{ color: raridades[col].cor }}>{raridades[col].nome}</b> tem{' '}
        {raridades[col].adicionais} {raridades[col].adicionais === 1 ? 'adicional' : 'adicionais'}. A calça não recebe adicional.
      </p>
    </div>
  )
}

// Bloco que abre e fecha; o estado fica na pagina para o mapa conseguir abrir um bloco
function Detalhe({ id, titulo, resumo, aberto, alternar, children }) {
  return (
    <div id={id} className={`sbx-det${aberto ? ' aberto' : ''}`}>
      <button className="sbx-det-cab" onClick={() => alternar(id)} aria-expanded={aberto}>
        <span><b>{titulo}</b><small>{resumo}</small></span>
        <i aria-hidden="true" />
      </button>
      {aberto && <div className="sbx-det-corpo">{children}</div>}
    </div>
  )
}

export default function PaginaSandbox({ onVoltar, jogador, admin, onEntrar, onCriarConta, onAbrirConta, onAbrirAdmin }) {
  const links = useLinksComunidade()
  const [zoom, setZoom] = useState(null)
  const [abertos, setAbertos] = useState(() => new Set())

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    document.title = 'Lineage II Sandbox — IS Labs'
    return () => { document.title = 'IS Servers' }
  }, [])

  useEffect(() => {
    if (!zoom) return
    const esc = (e) => { if (e.key === 'Escape') setZoom(null) }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [zoom])

  const alternar = (id) => setAbertos((s) => {
    const n = new Set(s)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  })
  // o mapa abre o bloco certo e rola ate ele
  const abrirDetalhe = (id) => {
    if (id.startsWith('d-')) setAbertos((s) => new Set(s).add(id))
    setTimeout(() => ir(id)(), 30)
  }
  const det = (id) => ({ id, aberto: abertos.has(id), alternar })

  return (
    <ZoomCtx.Provider value={setZoom}>
    <div className="sbx">
      {zoom && (
        <div className="sbx-zoom" onClick={() => setZoom(null)} role="dialog" aria-label={zoom.legenda}>
          <img src={zoom.src} alt={zoom.legenda} />
          <p>{zoom.legenda}</p>
        </div>
      )}

      {/* barra: jogos da IS Labs (so os que estao no ar) + baixar */}
      <nav className="sbx-nav" aria-label="Jogos IS Labs">
        <div className="rede-shell">
          <a className="sbx-todos" href="/" onClick={onVoltar} title="Central de jogos IS Labs">
            <i aria-hidden="true"><b /><b /><b /><b /></i>
            <span>Jogos</span>
          </a>
          <div className="sbx-jogos">
            {jogos.map((j) => (
              <a key={j.id} className={`sbx-jogo${j.rota === '/sandbox' ? ' on' : ''}`} href={j.rota}
                onClick={j.rota === '/sandbox' ? ir('topo') : undefined}>
                {j.online && <em aria-label="online" />}
                <span><b>{j.nome}{j.beta && <u className="sbx-tag-beta">Beta</u>}</b><small>{j.sub}</small></span>
              </a>
            ))}
          </div>
          {/* comunidade (links vem do painel admin) + conta */}
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
            {admin && (
              <button className="sbx-conta admin" onClick={onAbrirAdmin} title="Painel administrativo">Admin</button>
            )}
            {jogador
              ? <button className="sbx-conta" onClick={onAbrirConta} title="Painel do jogador">{jogador.login || 'Minha conta'}</button>
              : <button className="sbx-conta" onClick={onEntrar}>Entrar</button>}
            <BotaoBaixar className="nav" />
          </div>
        </div>
      </nav>

      <div id="topo" className="sbx-marca">
        {/* fagulhas azuis piscando em volta da logo (posicoes fixas, sem sorteio) */}
        <div className="sbx-faiscas" aria-hidden="true">
          {FAISCAS.map(([x, y, d, a], i) => (
            <i key={i} style={{ left: `${x}%`, top: `${y}%`, '--d': `${d}s`, '--a': `${a}s` }} />
          ))}
        </div>
        {/* teste: ilustracao da fortaleza. Para voltar a logo simples: src islabs_logo.webp e tirar a classe "cena" */}
        <img className="sbx-logo cena" src="/media/sandbox/islabs_fortaleza.webp" alt="IS Labs" />
      </div>

      <div className="rede-shell">
        {/* o jogo */}
        {/* aviso de beta: o primeiro texto que a pessoa le */}
        <div className="sbx-beta" role="note">
          <span className="sbx-beta-selo"><em />Beta teste aberto</span>
          <p>
            O servidor está em <b>fase de testes</b>. Os sistemas ainda podem mudar e novidades entram toda semana.
            Jogue, teste e ajude a moldar o jogo.
          </p>
        </div>

        <section className="sbx-jogo-hero">
          <div className="sbx-jogo-hero-txt">
            <div className="sbx-jogo-status marca"><em />IS Labs apresenta</div>
            <h1><small>Lineage II · Interlude Sandbox</small>Sua arma é a sua classe.</h1>
            <p>Raça é só aparência. A arma que você equipa decide o que você faz.</p>
            <div className="sbx-hero-cta">
              <BotaoBaixar />
              <a className="sbx-btn ghost" href="#mapa" onClick={ir('mapa')}>Como funciona</a>
            </div>
            <div className="sbx-dl-meta">Cliente completo · Windows{links.tamanho ? ` · ${links.tamanho}` : ''}</div>
          </div>
          {/* numeros espalhados pelo lado direito, cada um com o porque dele */}
          <div className="sbx-fatos">
            <div className="sbx-fato f1">
              <b>31</b><span>classes</span>
              <p>As classes do Interlude, liberadas pela arma. Trocou a arma, trocou de classe.</p>
            </div>
            <div className="sbx-fato f2">
              <b>12</b><span>tipos de arma</span>
              <p>Cada tipo traz as suas doutrinas, sorteadas no drop.</p>
            </div>
            <div className="sbx-fato f3">
              <b>4</b><span>raridades</span>
              <div className="sbx-fato-cores">
                {raridades.map((r) => <i key={r.id} style={{ '--c': r.cor }} title={r.nome} />)}
              </div>
              <p>Mudam skills, slots e adicionais.</p>
            </div>
            <div className="sbx-fato f4">
              <b>20</b><span>slots de runa</span>
              <p>Set Lendário completo: 5 slots no elmo, peito, luvas e botas.</p>
            </div>
            <div className="sbx-fato build">
              <small>Liberdade total</small>
              <h3>Monte sua build</h3>
              <p>
                Você escolhe a runa de <b>cada slot</b> do seu set. São <b>29 atributos</b>: mais dano no PvP,
                crítico, HP, resistência, drop... Duas pessoas com a mesma arma jogam diferente.
              </p>
              <div className="sbx-fato-slots" aria-hidden="true">
                {['Dano PvP', 'Crítico', 'Max HP', 'Resist. Stun', 'Drop'].map((a, i) => (
                  <span key={a} style={{ '--c': raridades[i % 4].cor }}><i />{a}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* mapa do jogo */}
        <section id="mapa" className="sbx-sec">
          <div className="sbx-sec-cab">
            <h2>Mapa do jogo</h2>
            <p>Seis etapas. Toque em cada uma.</p>
          </div>
          <Mapa abrirDetalhe={abrirDetalhe} />
        </section>

        {/* raridades */}
        <section id="raridades" className="sbx-sec">
          <div className="sbx-sec-cab">
            <h2>Raridades</h2>
            <p>Cada item sai com uma raridade. Ela muda uma coisa diferente em cada item:</p>
          </div>
          <div className="sbx-rar-legenda">
            <div><b>Arma</b><span>skills da classe + slots de runa</span></div>
            <div><b>Armadura</b><span>slots de runa + adicionais</span></div>
            <div><b>Cristal de minério</b><span>pedras brutas que ele solta</span></div>
          </div>
          <div className="sbx-rars">
            {raridades.map((r) => (
              <div className="sbx-rar" key={r.id} style={{ '--c': r.cor }}>
                <img src={`/media/sandbox/arte_${r.id}.webp`} alt={`Cristal ${r.nome}`} loading="lazy" />
                <div className="sbx-rar-txt">
                  <h3>{r.nome}</h3>
                  <div className="sbx-rar-chance">{r.chance}%<small>de chance</small></div>
                  <dl>
                    <div><dt>Arma</dt><dd><b>{r.skills}%</b> das skills · <b>{r.sockets}</b> {r.sockets === 1 ? 'slot' : 'slots'}</dd></div>
                    <div><dt>Armadura</dt><dd><b>{r.sockets}</b> {r.sockets === 1 ? 'slot' : 'slots'} · <b>{r.adicionais}</b> {r.adicionais === 1 ? 'adicional' : 'adicionais'}</dd></div>
                    <div><dt>Cristal</dt><dd><b>{r.pedras}</b> {r.pedras === 1 ? 'pedra bruta' : 'pedras brutas'}</dd></div>
                  </dl>
                </div>
              </div>
            ))}
          </div>
          <p className="sbx-nota">
            Nos slots você encaixa a runa que quiser: o jogador monta a própria build.
          </p>
        </section>

        {/* o resto: fechado, abre quem quiser ler */}
        <section className="sbx-sec">
          <div className="sbx-sec-cab">
            <h2>Para quem quer saber tudo</h2>
          </div>
          <div className="sbx-dets">
            <Detalhe {...det('d-armaduras')} titulo="Armaduras" resumo="Heavy, Light e Robe: cada raridade soma um adicional">
              <Armaduras />
              <div className="sbx-prova">
                <Print id="armadura" className="alto" />
                <div><h3>Tudo no tooltip</h3><p>Raridade, slots, runas encaixadas e adicionais em verde.</p></div>
              </div>
            </Detalhe>

            <Detalhe {...det('d-runas')} titulo="Runas e slots" resumo="Até 20 slots. As 4 lendárias mudam a luta">
              <div className="sbx-sockets">
                {raridades.map((r) => (
                  <div key={r.id} style={{ '--c': r.cor }}>
                    <span>{r.nome}</span>
                    <div>{Array.from({ length: r.sockets }).map((_, i) => <i key={i} />)}</div>
                  </div>
                ))}
              </div>
              <h3 className="sbx-h3">Lendárias de arma <small>1% no refino</small></h3>
              <div className="sbx-runas lend">
                {runasLendarias.map((x) => <div key={x.nome}><b>{x.nome}</b><p>{x.efeito}</p></div>)}
              </div>
              <h3 className="sbx-h3">Épicas de destaque</h3>
              <div className="sbx-runas epic">
                {runasEpicas.map((x) => <div key={x.nome}><b>{x.nome}</b><p>{x.efeito}</p></div>)}
              </div>
              <h3 className="sbx-h3">Atributos de runa de armadura</h3>
              <div className="sbx-attrs">
                {atributosRuna.map((g) => (
                  <div key={g.grupo}>
                    <small>{g.grupo}</small>
                    <div>{g.itens.map((i) => <span key={i}>{i}</span>)}</div>
                  </div>
                ))}
              </div>
              <div className="sbx-prints"><Print id="runa" /></div>
            </Detalhe>

            <Detalhe {...det('d-oficios')} titulo="Coleta de materiais brutos" resumo="Mineração e pesca: da pedra bruta até a runa">
              <div className="sbx-oficios">
                {oficios.map((o) => (
                  <div className="sbx-oficio" key={o.id}>
                    <div className="sbx-oficio-cab"><h3>{o.nome}</h3><Selo status={o.status} /></div>
                    <p>{o.resumo}</p>
                    {o.tabela && (
                      <div className="sbx-refino">
                        {o.tabela.map(([rot, ...v]) => (
                          <div key={rot}>
                            <small>{rot}</small>
                            <div className="sbx-pilha">
                              {v.map((p, i) => (
                                <i key={i} style={{ width: `${p}%`, background: raridades[i].cor }} title={`${raridades[i].nome} ${p}%`}>
                                  {p >= 5 ? `${p}%` : ''}
                                </i>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <ul>{o.pontos.map((p) => <li key={p}>{p}</li>)}</ul>
                  </div>
                ))}
              </div>
              <div className="sbx-prints"><Print id="refino" /></div>
            </Detalhe>

            <Detalhe {...det('d-economia')} titulo="Economia" resumo="Tudo se negocia. Cada item tem seu preço">
              <div className="sbx-cards4">
                {economia.map(([t, d]) => <div key={t}><b>{t}</b><p>{d}</p></div>)}
              </div>
            </Detalhe>

            <Detalhe {...det('d-comecar')} titulo="Começando" resumo="Start em 3 passos e profissão automática">
              <div className="sbx-cards4">
                {regrasInicio.map(([t, d], i) => <div key={t}><small>{i + 1}</small><b>{t}</b><p>{d}</p></div>)}
              </div>
              <div className="sbx-prints"><Print id="start1" /><Print id="start3" /></div>
            </Detalhe>

            <Detalhe {...det('d-original')} titulo="Nada do Interlude foi tirado" resumo="SA, Augment, level 1-80 e grades continuam iguais">
              <div className="sbx-camadas-grade">
                <div><small>Original</small><b>Special Ability</b><span>Soul Crystal funciona como sempre.</span></div>
                <div className="nova"><small>Do mod</small><b>Doutrina</b><span>A classe e o kit de skills que a arma dá.</span></div>
                <div><small>Original</small><b>Augment</b><span>Life Stone no ferreiro, com o brilho na mão.</span></div>
              </div>
            </Detalhe>

            <Detalhe {...det('d-roadmap')} titulo="Em construção" resumo="O que está no ar, em teste e o que vem">
              <div className="sbx-road">
                {['ar', 'teste', 'plano'].map((st) => (
                  <div key={st}>
                    <Selo status={st} />
                    <ul>{roadmap.filter((x) => x.status === st).map((x) => <li key={x.nome}>{x.nome}</li>)}</ul>
                  </div>
                ))}
              </div>
            </Detalhe>
          </div>
        </section>

        {/* download final */}
        <section id="baixar" className="sbx-final">
          <h2>Entre no beta</h2>
          <p>O jogo está em testes e cada jogador conta. Cliente completo para Windows: descompacte e abra, não precisa do jogo original.</p>
          <BotaoBaixar />
          <div className="sbx-dl-meta">Cliente completo · Windows{links.tamanho ? ` · ${links.tamanho}` : ''} · via Google Drive</div>
          {!jogador && (
            <p className="sbx-final-conta">
              Ainda não tem conta? <button onClick={onCriarConta}>Crie a sua grátis</button>
            </p>
          )}
          {(links.grupo || links.discord) && (
            <div className="sbx-final-com">
              <span>Reporte bugs e acompanhe as novidades do beta:</span>
              <div>
                {links.grupo && (
                  <a className="sbx-social zap grande" href={links.grupo} target="_blank" rel="noreferrer">
                    <IconeWhatsapp size={18} /><span>Entrar no grupo</span>
                  </a>
                )}
                {links.discord && (
                  <a className="sbx-social dc grande" href={links.discord} target="_blank" rel="noreferrer">
                    <IconeDiscord size={19} /><span>Entrar no Discord</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </section>

      </div>

      {/* o mesmo rodape da home: direitos, termos e o acesso de super admin (TECX SOFTHOUSE) */}
      <Footer onAdminClick={() => { window.location.href = '/api/auth/google' }} />

      {/* celular: o download fica sempre a um toque */}
      <div className="sbx-barra-baixar">
        <span><b>Lineage II Sandbox</b><small>Baixe no PC · {links.tamanho || 'Windows'}</small></span>
        <BotaoBaixar />
      </div>
    </div>
    </ZoomCtx.Provider>
  )
}
