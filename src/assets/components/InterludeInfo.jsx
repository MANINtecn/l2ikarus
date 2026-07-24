import { useState } from 'react'
import BuildSimulator from './BuildSimulator'

// IKARUS 2026 — Central de INFO do Interlude (revela ao clicar "INFO" no card).
// Tudo sobre o servidor num lugar so. Enchant apresentado pelas ANCORAS (nao por %).
// Responsivo: grid auto-fit, fontes com clamp.

const GREEN = '#4ade80'
const GOLD = 'var(--gold, #cbb26a)'

const RATES = [
  ['XP', 'x30'], ['SP', 'x30'], ['DROP', 'x10'], ['SPOIL', 'x15'], ['ADENA', 'x5'],
]

const AREAS_ATIVAS = ['ToI 9 / 10 / 11', 'Antharas Lair', 'Ketra Orc', 'Mystic Taberna']
const AREAS_ROTACAO = ['Monastery', 'Imperial Tomb', 'Forge of the Gods', 'Abandoned Mines', 'Cave of Trials', 'The Enchanted Valley', 'Ruins of Agony', 'Execution Grounds', 'Alligator Island']

function Chip({ children, color }) {
  return (
    <span style={{ fontSize: '0.66rem', color: '#e7e2d3', border: `1px solid ${color}55`, background: `${color}12`, borderRadius: 5, padding: '2px 8px' }}>
      {children}
    </span>
  )
}

function Card({ title, tag, span, children }) {
  return (
    <div style={{
      ...(span ? { gridColumn: '1 / -1' } : {}),
      border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12,
      background: 'rgba(255,255,255,0.02)', padding: 'clamp(0.9rem, 2.2vw, 1.3rem)',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span className="cinzel" style={{ color: '#fff', fontSize: 'clamp(0.85rem, 2.4vw, 1rem)' }}>{title}</span>
        {tag && <span style={{ fontSize: '0.55rem', letterSpacing: '1px', color: GOLD, border: `1px solid ${GOLD}55`, borderRadius: 4, padding: '1px 6px' }}>{tag}</span>}
      </div>
      <div style={{ color: 'var(--text-mute, #9aa)', fontSize: '0.8rem', lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  )
}

export default function InterludeInfo({ onClose }) {
  const [simOpen, setSimOpen] = useState(false)

  return (
    <div id="interlude-info" style={{ scrollMarginTop: '80px', maxWidth: 1160, margin: '0 auto', padding: 'clamp(1rem, 3vw, 2rem) clamp(0.8rem, 3vw, 1.5rem)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        <div>
          <div className="cinzel" style={{ color: GREEN, fontSize: 'clamp(1.1rem, 4vw, 1.6rem)', letterSpacing: '2px' }}>
            INTERLUDE — TUDO SOBRE O SERVIDOR
          </div>
          <div style={{ color: 'var(--text-mute, #9aa)', fontSize: '0.8rem', marginTop: 4, maxWidth: 640, lineHeight: 1.6 }}>
            A central de informações que nenhum outro servidor te dá: enchant que protege seu progresso,
            farm que nunca fica parado, e a build que você monta antes de gastar.
          </div>
        </div>
        <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.4rem 0.9rem', fontSize: '0.6rem', letterSpacing: '1px', flexShrink: 0 }}>
          FECHAR ×
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '0.8rem' }}>

        <Card title="Rates" tag="x30 XP/SP">
          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
            {RATES.map(([k, v]) => (
              <div key={k}>
                <span style={{ color: 'var(--text-mute, #9aa)' }}>{k} </span>
                <span style={{ color: GREEN, fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 6 }}>Curva pensada pra progredir rápido sem trivializar o end-game.</div>
        </Card>

        <Card title="Enchant com âncora" tag="seguro">
          <div style={{ marginBottom: 6 }}>
            Cap atual: <b style={{ color: '#fff' }}>safe +3</b> · máximo <b style={{ color: '#fff' }}>+10 arma</b> / <b style={{ color: '#fff' }}>+8 armadura</b>.
          </div>
          O <b style={{ color: '#fff' }}>Blessed nunca quebra</b> seu item. Se falhar, ele cai pro
          <b style={{ color: GOLD }}> ponto de âncora</b> já conquistado (a cada 3 níveis: <b style={{ color: '#fff' }}>+6 / +9</b>…).
          <div style={{ marginTop: 6 }}>
            Ex.: sua arma <b style={{ color: '#fff' }}>+8</b> falhou → volta pra <b style={{ color: GOLD }}>+6</b>, sem zerar e sem destruir.
          </div>
          <div style={{ marginTop: 6 }}>
            O <b style={{ color: '#fff' }}>scroll normal</b> é mais barato, mas arriscado: falha destrói o item.
          </div>
          <div style={{ marginTop: 6, fontSize: '0.7rem', opacity: 0.85 }}>
            A escada de âncoras já está pronta pra quando o cap subir (+20 arma / +18 armadura).
          </div>
        </Card>

        <Card title="Base + 1 sub acumulativa" tag="exclusivo">
          Mantenha sua classe base e <b style={{ color: '#fff' }}>some as skills de 1 sub</b> à sua escolha (cura, ressurreição e mana não entram).
          Monte e teste a combinação <b style={{ color: '#fff' }}>antes de comprar</b> no simulador.
          <button
            onClick={() => setSimOpen(true)}
            className="btn btn-primary"
            style={{ marginTop: 10, padding: '0.5rem 1rem', fontSize: '0.62rem', letterSpacing: '1px' }}
          >
            MONTAR MINHA BUILD →
          </button>
        </Card>

        <Card title="Nobless & 3ª profissão" tag="retail">
          Conquistadas do <b style={{ color: '#fff' }}>jeito clássico</b>, via quest retail — Caradine, o caçador de Barakiel e a jornada completa.
          Sem atalho automático: o título tem valor porque foi merecido.
        </Card>

        <Card title="Farm com rotação" tag="sempre ativo" span>
          Um núcleo de áreas <b style={{ color: '#fff' }}>sempre ativo</b> + um <b style={{ color: '#fff' }}>rodízio constante</b> de zonas —
          sempre há um ponto "quente" valendo mais, nada monopolizado num canto só. O mapa fica vivo o servidor inteiro.
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '1px', color: GREEN, marginBottom: 6 }}>ÁREAS ATIVAS</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {AREAS_ATIVAS.map(a => <Chip key={a} color={GREEN}>{a}</Chip>)}
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '1px', color: GOLD, marginBottom: 6 }}>EM ROTAÇÃO · troca a cada 7 dias</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {AREAS_ROTACAO.map(a => <Chip key={a} color={GOLD}>{a}</Chip>)}
              <Chip color={GOLD}>entre outras</Chip>
            </div>
          </div>
        </Card>

        <Card title="Bosses solo" tag="em breve">
          Bosses <b style={{ color: '#fff' }}>solo-áveis</b> a caminho: desafio e recompensa pra quem joga sozinho, sem depender de CP fechada. Em breve — sem data ainda.
        </Card>

      </div>

      {simOpen && <BuildSimulator onClose={() => setSimOpen(false)} />}
    </div>
  )
}
