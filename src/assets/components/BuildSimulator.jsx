import { useState, useEffect, useMemo, useRef } from 'react'

// IKARUS 2026 — Simulador de build do Interlude (Base + 1 sub acumulativa).
// Le /builds-interlude.json (gerado no GS pelo //dumpbuilds, mesma logica do
// BuildClassManager). Sem login. A BASE mostra TODAS as skills; a SUB soma as skills
// dela MENOS as bloqueadas (heal/res/mana) — exatamente o que o jogador recebe ao
// comprar a sub. Renderiza como MODAL centralizado (fundo solido, rola por dentro,
// escurece o resto pra nada do site atravessar), responsivo na horizontal.

// type -> categoria amigavel + cor (o servidor so manda o tipo, nao a descricao;
// descricao completa e client-side, fica pra uma v2 se quiser enriquecer).
const ATTACK = new Set(['PDAM', 'MDAM', 'BLOW', 'CHARGEDAM', 'DRAIN', 'MDOT', 'DOT', 'CPDAMPERCENT', 'FATAL', 'DEATHLINK', 'MANADAM', 'PARALYZE'])
const CONTROL = new Set(['DEBUFF', 'STUN', 'ROOT', 'SLEEP', 'FEAR', 'MUTE', 'CANCEL', 'CANCEL_DEBUFF', 'CONFUSION', 'WEAKNESS', 'POISON', 'BLEED', 'AGGDEBUFF', 'AGGDAMAGE', 'AGGREDUCE', 'AGGREDUCE_CHAR', 'AGGREMOVE', 'WARRIOR_BANE', 'MAGE_BANE', 'NEGATE', 'ERASE', 'BETRAY', 'SLOW', 'SPOIL', 'SWEEP'])
const SUMMON = new Set(['SUMMON', 'SUMMON_FRIEND', 'SUMMON_PARTY'])
const BUFFY = new Set(['BUFF', 'CONT', 'HOT', 'MPHOT', 'FUSION', 'SIGNET', 'SIGNET_CASTTIME', 'REFLECT', 'RECALL'])

function category(sk) {
  if (sk.passive) return { key: 'passiva', label: 'Passiva', color: '#94a3b8' }
  const t = sk.type
  if (ATTACK.has(t)) return { key: 'ataque', label: 'Ataque', color: '#f87171' }
  if (CONTROL.has(t)) return { key: 'controle', label: 'Controle', color: '#c084fc' }
  if (SUMMON.has(t)) return { key: 'invocar', label: 'Invocar', color: '#60a5fa' }
  if (BUFFY.has(t)) return { key: 'buff', label: 'Buff', color: '#4ade80' }
  return { key: 'util', label: 'Utilidade', color: '#cbb26a' }
}

const CAT_ORDER = ['ataque', 'buff', 'controle', 'invocar', 'passiva', 'util']

export default function BuildSimulator({ onClose }) {
  const [classes, setClasses] = useState(null)
  const [error, setError] = useState(false)
  const [baseId, setBaseId] = useState(null)
  const [subId, setSubId] = useState(null)
  const panelRef = useRef(null)

  // Trava o scroll do body enquanto o modal esta aberto + fecha no ESC.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  useEffect(() => {
    fetch('/builds-interlude.json')
      .then(r => r.json())
      .then(d => {
        const list = (d.classes || []).slice().sort((a, b) => a.name.localeCompare(b.name))
        setClasses(list)
        if (list.length) {
          setBaseId(list.find(c => !c.mage)?.id ?? list[0].id)
          setSubId(list.find(c => c.mage)?.id ?? list[Math.min(1, list.length - 1)].id)
        }
      })
      .catch(() => setError(true))
  }, [])

  const base = useMemo(() => classes?.find(c => c.id === baseId) || null, [classes, baseId])
  const sub = useMemo(() => classes?.find(c => c.id === subId) || null, [classes, subId])

  const { merged, blockedCount } = useMemo(() => {
    const m = new Map()
    if (base) for (const s of base.skills) m.set(s.id, { ...s, src: 'base' })
    let blocked = 0
    if (sub) for (const s of sub.skills) {
      if (s.blocked) { blocked++; continue }
      const ex = m.get(s.id)
      if (ex) m.set(s.id, { ...(s.lvl > ex.lvl ? s : ex), src: 'both' })
      else m.set(s.id, { ...s, src: 'sub' })
    }
    return { merged: [...m.values()], blockedCount: blocked }
  }, [base, sub])

  const grouped = useMemo(() => {
    const g = {}
    for (const s of merged) {
      const c = category(s)
      ;(g[c.key] ||= { label: c.label, color: c.color, items: [] }).items.push(s)
    }
    for (const k in g) g[k].items.sort((a, b) => a.name.localeCompare(b.name))
    return g
  }, [merged])

  const gold = 'var(--gold, #cbb26a)'
  const green = '#4ade80'

  const select = (value, onChange, label) => (
    <div style={{ flex: '1 1 180px', minWidth: 0 }}>
      <div style={{ fontSize: '0.6rem', letterSpacing: '1px', color: 'var(--text-mute, #9aa)', marginBottom: 4 }}>{label}</div>
      <select
        value={value ?? ''}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%', padding: '0.55rem 0.6rem', borderRadius: 6, cursor: 'pointer',
          background: 'rgba(0,0,0,0.4)', color: '#fff',
          border: '1px solid rgba(203,178,106,0.4)', fontSize: '0.8rem',
        }}
      >
        {classes?.map(c => (
          <option key={c.id} value={c.id} style={{ background: '#14140f' }}>
            {c.name}{c.mage ? ' (mago)' : ''}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: 'clamp(0.5rem, 3vw, 2.2rem)',
        overflowY: 'auto',
        animation: 'fadeInPanel 0.25s ease',
      }}
    >
      <div
        ref={panelRef}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 980, margin: 'auto', boxSizing: 'border-box',
          maxHeight: '92vh', display: 'flex', flexDirection: 'column',
          background: '#111009',              // fundo SOLIDO — nada do site atravessa
          border: `1px solid ${green}`,
          borderRadius: 14,
          padding: 'clamp(0.9rem, 2.5vw, 1.6rem)',
          position: 'relative', textAlign: 'left',
          boxShadow: '0 30px 80px rgba(0,0,0,0.65)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: 'absolute', top: '0.7rem', right: '0.7rem', width: 26, height: 26,
            borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', cursor: 'pointer', lineHeight: 1, flexShrink: 0,
          }}
        >×</button>

        <div className="cinzel" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.2rem)', color: '#fff', marginBottom: 2, paddingRight: 28 }}>
          Simulador de build — Interlude
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-mute, #9aa)', marginBottom: '1rem' }}>
          Monte sua classe base + 1 sub acumulativa e veja as habilidades. Cura, ressurreição e mana não entram na sub.
        </div>

        {error && <div style={{ color: '#f87171', fontSize: '0.8rem' }}>Não consegui carregar os dados das classes.</div>}
        {!classes && !error && <div style={{ color: 'var(--text-mute, #9aa)', fontSize: '0.8rem' }}>Carregando classes…</div>}

        {classes && (
          <>
            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', flexShrink: 0 }}>
              {select(baseId, setBaseId, 'CLASSE BASE')}
              <div style={{ paddingBottom: 8, color: gold, fontWeight: 700 }}>+</div>
              {select(subId, setSubId, 'SUB (ACUMULATIVA)')}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: '0.8rem', flexShrink: 0 }}>
              <span className="cinzel" style={{ color: '#fff', fontSize: '0.9rem' }}>
                <span style={{ color: green }}>{base?.name}</span>
                <span style={{ color: gold }}> + </span>
                <span style={{ color: green }}>{sub?.name}</span>
              </span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-mute, #9aa)' }}>
                {merged.length} habilidades{blockedCount > 0 ? ` · ${blockedCount} bloqueadas da sub (cura/res/mana)` : ''}
              </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', margin: '0 -0.2rem', padding: '0 0.2rem', minHeight: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {CAT_ORDER.filter(k => grouped[k]).map(k => {
                  const g = grouped[k]
                  return (
                    <div key={k} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '0.6rem 0.7rem' }}>
                      <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1px', color: g.color, marginBottom: 6 }}>
                        {g.label.toUpperCase()} · {g.items.length}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {g.items.map(s => (
                          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem' }}>
                            <img
                              src={`/skill-icons/${s.id}.png`}
                              alt=""
                              width={18}
                              height={18}
                              loading="lazy"
                              onError={e => { e.currentTarget.style.visibility = 'hidden' }}
                              style={{ width: 18, height: 18, borderRadius: 3, flexShrink: 0, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.12)' }}
                            />
                            <span style={{ color: '#e7e2d3' }}>{s.name}</span>
                            {s.lvl > 1 && <span style={{ color: 'var(--text-mute, #9aa)', fontSize: '0.6rem' }}>Lv{s.lvl}</span>}
                            {s.src === 'sub' && <span style={{ color: green, fontSize: '0.55rem', border: `1px solid ${green}55`, borderRadius: 3, padding: '0 4px' }}>sub</span>}
                            {s.src === 'both' && <span style={{ color: gold, fontSize: '0.55rem', border: `1px solid ${gold}55`, borderRadius: 3, padding: '0 4px' }}>ambas</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
