import { useEffect } from 'react'
import './PaginaServidor.css'

/**
 * Página dedicada de um servidor (/interlude e /300x).
 *
 * O conteúdo do Interlude vem do antigo InterludeInfo — texto já escrito
 * e afiado (enchant por âncora, base+sub, farm rotativo). Aqui ele ganha
 * página própria, com URL para divulgar e download direto do cliente.
 */

// Link do Drive. NAO usar `uc?export=download`: acima de ~100 MB o Google
// devolve a pagina "nao foi possivel verificar virus" em vez do arquivo, e o
// navegador salvaria um HTML de 2 KB no lugar de 3 GB. O /view abre a pagina
// do Drive, onde o proprio Google trata o aviso e entrega o download.
const drive = (id) => `https://drive.google.com/file/d/${id}/view`

const SERVIDORES = {
  interlude: {
    slug: 'interlude',
    nome: 'Interlude 30x',
    arte: '/media/server-interlude.webp',
    linha: 'O clássico como ele era. Cada classe faz o que promete — nada de build quebrada.',
    aberto: true,
    cor: '#3d8fd6',
    corClara: '#bfe6ff',
    download: {
      id: '11Y5L08foNlAMQ6URdumJ3pxpzY5Q_UtS',
      arquivo: 'Interlud.rar',
      tamanho: '3,15 GB',
    },
    rates: [['XP', '30x'], ['SP', '30x'], ['Drop', '10x'], ['Spoil', '15x'], ['Adena', '5x']],
    blocos: [
      {
        titulo: 'Enchant com âncora',
        tag: 'não quebra',
        largo: false,
        corpo: (
          <>
            <p>
              <b>Safe +3</b> · âncoras <em>+4 / +6 / +9</em> · máximo <b>+10</b> por enquanto.
            </p>
            <p>
              O <b>Blessed nunca quebra</b> seu item. Se falhar, ele cai para a âncora
              conquistada mais próxima — e nunca abaixo do +3.
            </p>
            <p>
              Sua arma <b>+8</b> falhou? Volta para <em>+6</em>. Chegou no <em>+9</em>?
              Uma falha te devolve para o +9, não para o zero.
            </p>
            <p>
              O scroll normal é mais barato, mas arriscado: falha destrói o item.
              O cap sobe para +20/+18 mais à frente, com novas âncoras.
            </p>
          </>
        ),
      },
      {
        titulo: 'Base + 1 sub acumulativa',
        tag: 'exclusivo',
        largo: false,
        corpo: (
          <>
            <p>
              Mantenha sua classe base e <b>some as skills de 1 sub</b> à sua escolha —
              cura, ressurreição e mana não entram.
            </p>
            <p>
              É <em>grátis</em>, no NPC de Serviços. Monte e teste a combinação antes de escolher.
            </p>
          </>
        ),
      },
      {
        titulo: 'Nobless e 3ª profissão',
        tag: 'sem enrolação',
        largo: false,
        corpo: (
          <>
            <p>
              A <em>3ª profissão é grátis</em> no NPC — ninguém perde o fim de semana em
              quest para começar a jogar de verdade.
            </p>
            <p>
              A <b>Nobless</b> continua clássica, via quest retail: Caradine, o caçador de
              Barakiel e a jornada completa.
            </p>
          </>
        ),
      },
      {
        titulo: 'Kamaloka oficial',
        tag: 'retail',
        largo: false,
        corpo: (
          <>
            <p>
              As <b>instâncias Kamaloka do retail</b>, do jeito que foram feitas —
              não é versão adaptada nem simplificada.
            </p>
            <p>
              Entrada por nível, recompensa proporcional ao desafio.
            </p>
          </>
        ),
      },
      {
        titulo: 'Autofarm offline',
        tag: 'sem deixar o PC ligado',
        largo: false,
        corpo: (
          <>
            <p>
              Configure a rotina do seu personagem e <b>desligue o computador</b> —
              ele continua farmando no servidor.
            </p>
            <p>
              Quem trabalha o dia todo não fica para trás de quem passa a tarde no jogo.
            </p>
          </>
        ),
      },
      {
        titulo: 'Bosses solo',
        tag: 'em breve',
        largo: false,
        corpo: (
          <p>
            Bosses <b>solo-áveis</b> a caminho: desafio e recompensa para quem joga sozinho,
            sem depender de CP fechada. Sem data ainda.
          </p>
        ),
      },
    ],
  },

  '300x': {
    slug: '300x',
    nome: 'Interlude PVP 300x',
    arte: '/media/server-300x.webp',
    linha: 'Quanto mais você farma, mais forte fica no PvP. Progressão sem fim.',
    aberto: true,
    cor: '#e0561f',
    corClara: '#ffc182',
    download: {
      id: '1q3R0bmzyqaQU9Ruk1Z5NvMqacJvLDdf6',
      arquivo: 'Ikarus300x.rar',
      tamanho: '3,27 GB',
    },
    rates: [['XP', '300x'], ['SP', '300x'], ['Adena', '300x'], ['Drop', '300x'], ['Spoil', '300x']],
    blocos: [
      {
        titulo: 'Começo pronto para lutar',
        tag: 'sem grind inicial',
        largo: false,
        corpo: (
          <>
            <p>
              Ao criar o personagem você escolhe <b>classe, armadura, arma e para onde ir</b> —
              e já entra equipado.
            </p>
            <p>
              Ninguém passa a primeira semana farmando pedra para poder jogar. Você chega
              para o PvP, que é o ponto do servidor.
            </p>
          </>
        ),
      },
      {
        titulo: 'Sub livre',
        tag: 'sem quest',
        largo: false,
        corpo: (
          <p>
            Subclasse <em>liberada direto</em>, sem a quest do Mimir. Troque de classe e
            experimente builds sem perder dias em pré-requisito.
          </p>
        ),
      },
      {
        titulo: 'Enchant sem limite',
        tag: 'Blessed comum, Crystal raríssimo',
        largo: true,
        corpo: (
          <>
            <p>
              Não existe teto de enchant aqui. <b>Não vendemos scroll</b> — os dois são
              farmados no jogo, e quem junta, sobe. Até +4 é seguro nos dois.
            </p>
            <p>
              <b>Crystal — 100%.</b> <b>Nunca falha.</b> É raríssimo de encontrar, mas quando
              você tem um na mão, o item sobe garantido — sem risco nenhum.
            </p>
            <p>
              <b>Blessed — 50%.</b> Falhou, o item <b>desce um nível</b> — e não quebra. É
              o caminho farmável do dia a dia: mais fácil de conseguir, com um risco pequeno
              a cada tentativa.
            </p>
            <p>
              Os dois <em>nunca destroem o item</em>. O limite é quanto você farma, não um
              número que a gente escolheu.
            </p>
          </>
        ),
      },
      {
        titulo: 'Progressão sem fim',
        tag: 'em desenvolvimento',
        largo: false,
        corpo: (
          <>
            <p>
              O <b>Ultra Status</b> faz o enchant escalar atributos em arma, set, joias e
              acessórios — quanto mais você joga, mais forte fica, sem teto.
            </p>
            <p>
              É o coração do conceito do servidor e está <em>em desenvolvimento</em>.
              Ainda sem data.
            </p>
          </>
        ),
      },
      {
        titulo: 'Kamaloka oficial',
        tag: 'ticket farmado',
        largo: false,
        corpo: (
          <>
            <p>
              As <b>instâncias Kamaloka do retail</b>, com o ticket de entrada
              <em> conquistado jogando</em> — não comprado.
            </p>
            <p>
              Farme o acesso, entre e leve a recompensa. Nenhuma etapa passa pela loja.
            </p>
          </>
        ),
      },
      {
        titulo: 'Áreas de farm',
        tag: 'mapa vivo',
        largo: false,
        corpo: (
          <p>
            Zonas de farm espalhadas pelo mundo, com <b>GK global</b> te levando a
            qualquer uma delas. Sem caminhada de vinte minutos para começar a jogar.
          </p>
        ),
      },
      {
        titulo: 'Supere seus limites',
        tag: 'sem teto',
        largo: false,
        corpo: (
          <p>
            <b>Quanto mais você se esforça, mais você supera seus limites.</b> Aqui o
            tempo investido vira poder de verdade — e não existe ponto onde ele para
            de valer.
          </p>
        ),
      },
      {
        titulo: 'Sem venda de vantagem',
        tag: 'sem P2W',
        largo: true,
        corpo: (
          <p>
            Nenhum item à venda. O que você tem no personagem foi conquistado jogando —
            aqui não existe atalho de carteira, e é isso que mantém o PvP honesto.
          </p>
        ),
      },
    ],
  },
  mu: {
    slug: 'mu',
    nome: 'Mu Online',
    arte: '/media/server-mu.webp',
    linha: 'Comece no PC, continue no celular. Mesmo personagem, mesmo mundo.',
    aberto: false,
    cor: '#c9522b',
    corClara: '#ffb98a',
    download: null,
    rates: [['Season', 'clássica'], ['PC', 'Windows'], ['Mobile', 'Android'], ['Progresso', 'único']],
    blocos: [
      {
        titulo: 'Joga onde você estiver',
        tag: 'cross-plataforma',
        largo: false,
        corpo: (
          <>
            <p>
              O <b>mesmo personagem</b> no computador e no celular. Você para de jogar no
              PC e continua no ônibus, do ponto exato onde estava.
            </p>
            <p>
              Não são duas contas nem dois mundos — é <em>um progresso só</em>.
            </p>
          </>
        ),
      },
      {
        titulo: 'Mesma conta da rede',
        tag: '1 cadastro',
        largo: false,
        corpo: (
          <p>
            A conta que você usa nos servidores de Lineage <b>vale aqui também</b>.
            Nenhum cadastro novo, nenhum saldo separado.
          </p>
        ),
      },
      {
        titulo: 'Season clássica',
        tag: 'sem invenção',
        largo: false,
        corpo: (
          <p>
            O Mu que você lembra, sem sistemas enxertados que descaracterizam o jogo.
          </p>
        ),
      },
      {
        titulo: 'Beta fechado',
        tag: 'em preparação',
        largo: true,
        corpo: (
          <p>
            O servidor está em testes. Entre no <b>WhatsApp ou no Discord</b> da rede
            para saber quando abrir — é por lá que a data sai primeiro.
          </p>
        ),
      },
    ],
  },
}

export default function PaginaServidor({ slug, onVoltar }) {
  const s = SERVIDORES[slug]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    if (s) document.title = `${s.nome} — IS Servers`
    return () => { document.title = 'IS Servers' }
  }, [slug, s])

  if (!s) return null

  const estilo = {
    '--cor': s.cor,
    '--cor-clara': s.corClara,
    '--cor-brilho': `${s.cor}26`,
    '--cor-brilho-forte': `${s.cor}66`,
    '--cor-borda': `${s.cor}44`,
    '--cor-fundo-a': `${s.cor}1a`,
    '--cor-fundo-b': 'rgba(9,8,12,.72)',
  }

  return (
    <div className="srv-pag" style={estilo}>
      <div className="srv-topo">
        <div className="rede-shell srv-voltar">
          <a href="/" onClick={onVoltar}>
            <span aria-hidden="true" />
            Todos os servidores
          </a>
        </div>

        <img className="srv-arte" src={s.arte} alt={s.nome} />
        <h1 className="srv-nome">{s.nome}</h1>
        <p className="srv-linha">{s.linha}</p>
        <div className={`srv-estado${s.aberto ? '' : ' fechado'}`}>
          {s.aberto ? 'Servidor no ar' : 'Beta fechado'}
        </div>
      </div>

      <div className="rede-shell">
        {/* download direto do cliente completo */}
        {s.download && (
        <div className="srv-download" id="download">
          <div className="srv-dl-txt">
            <h2>Baixar o cliente completo</h2>
            <p>
              Cliente inteiro, pronto para jogar. Descompacte e abra — não precisa de
              instalador nem do jogo original. O download abre no Google Drive.
            </p>
            <div className="srv-dl-meta">
              <span><b>{s.download.arquivo}</b></span>
              <span><b>{s.download.tamanho}</b></span>
              <span>via Google Drive</span>
            </div>
          </div>
          <a
            className="srv-dl-btn"
            href={drive(s.download.id)}
            target="_blank"
            rel="noreferrer"
          >
            <span className="srv-dl-seta" aria-hidden="true" />
            Baixar agora
          </a>
        </div>
        )}

        {/* rates em faixa: os numeros sao o dado mais comparado, entao
            ocupam a largura toda em vez de um card com sobra */}
        <div className="srv-faixa-rates">
          {s.rates.map(([nome, valor]) => (
            <div className="srv-rate" key={nome}>
              <b>{valor}</b>
              <span>{nome}</span>
            </div>
          ))}
        </div>

        <div className="srv-secao">
          <div className="srv-secao-titulo">O servidor</div>
          <div className="srv-grade">
            {s.blocos.map((b) => (
              <div className={`srv-bloco${b.largo ? ' largo' : ''}`} key={b.titulo}>
                <div className="srv-bloco-cabeca">
                  <h3>{b.titulo}</h3>
                  {b.tag && <span className="srv-tag">{b.tag}</span>}
                </div>
                {b.corpo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
