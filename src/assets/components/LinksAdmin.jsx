import { useEffect, useState } from 'react'
import { LINKS_PADRAO } from '../../config/linksComunidade'

/**
 * Aba LINKS do painel admin: convites da comunidade (grupo do WhatsApp e Discord) e o
 * download do cliente do Sandbox. O que for salvo aqui e' o que os botoes do site abrem.
 * Grupo/Discord vazio = o botao some. Componente proprio: o AdminPanel ja' passa de 1000 linhas.
 */

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', padding: '0.75rem 0.9rem', borderRadius: '6px', fontSize: '0.85rem', outline: 'none',
}
const labelStyle = { fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '2px', display: 'block', marginBottom: '0.4rem' }
const tituloStyle = { fontSize: '0.62rem', color: 'var(--gold)', letterSpacing: '3px', margin: '0 0 1rem' }

const SECOES = [
  {
    titulo: 'COMUNIDADE',
    nota: 'Deixe vazio para esconder o botão. Só aceita convite do WhatsApp (chat.whatsapp.com ou wa.me) e do Discord (discord.gg ou discord.com/invite).',
    campos: [
      { id: 'grupo', titulo: 'GRUPO DO WHATSAPP', exemplo: 'https://chat.whatsapp.com/XXXX', link: true },
      { id: 'discord', titulo: 'DISCORD', exemplo: 'https://discord.gg/XXXX', link: true },
    ],
  },
  {
    titulo: 'DOWNLOAD DO CLIENTE (SANDBOX)',
    nota: 'Subiu um cliente novo no Drive? Cole aqui o link de compartilhamento. Qualquer formato de link do Drive serve: o site grava sempre no formato que funciona para arquivo grande.',
    campos: [
      { id: 'download', titulo: 'LINK DO GOOGLE DRIVE', exemplo: 'https://drive.google.com/file/d/.../view', link: true },
      { id: 'tamanho', titulo: 'TAMANHO (OPCIONAL, APARECE EMBAIXO DO BOTÃO)', exemplo: 'ex: 3,4 GB' },
    ],
  },
]
const TODOS = SECOES.flatMap((s) => s.campos.map((c) => c.id))

function situacao(id, gravados) {
  const v = gravados[id]
  if (typeof v !== 'string') return id === 'tamanho' ? 'Ainda não salvo: o site não mostra o tamanho.' : 'Ainda não salvo: o site usa o link padrão.'
  if (!v) return id === 'tamanho' ? 'No site agora: sem tamanho.' : 'No site agora: botão escondido.'
  return 'No site agora: ' + v
}

export default function LinksAdmin() {
  const [links, setLinks] = useState(Object.fromEntries(TODOS.map((k) => [k, ''])))
  const [gravados, setGravados] = useState({})
  const [carregando, setCarregando] = useState(true)
  const [msg, setMsg] = useState(null)

  const carregar = async () => {
    setCarregando(true)
    try {
      const r = await fetch('/api/admin/links').then((x) => x.json())
      const g = r.links || {}
      setGravados(g)
      // sem nada gravado ainda: mostra o que o site usa hoje (o padrao)
      setLinks(Object.fromEntries(TODOS.map((k) => [k, typeof g[k] === 'string' ? g[k] : (LINKS_PADRAO[k] || '')])))
    } catch {
      setMsg({ tipo: 'erro', txt: 'Não consegui ler os links atuais.' })
    }
    setCarregando(false)
  }

  useEffect(() => { carregar() }, [])

  const salvar = async () => {
    setMsg({ tipo: 'espera', txt: 'Salvando...' })
    try {
      const r = await fetch('/api/admin/links-save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(TODOS.map((k) => [k, links[k].trim()]))),
      }).then((x) => x.json())
      setMsg(r.success ? { tipo: 'ok', txt: r.message } : { tipo: 'erro', txt: r.error || 'Erro ao salvar' })
      if (r.success) carregar()
    } catch {
      setMsg({ tipo: 'erro', txt: 'Erro de conexão com o servidor.' })
    }
  }

  if (carregando) return <p style={{ color: 'var(--text-mute)' }}>Carregando...</p>

  return (
    <div style={{ maxWidth: '640px' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '1.2rem', lineHeight: 1.6 }}>
        Links que os botões do site abrem (home e página do Sandbox). O site atualiza em até 1 minuto depois de salvar.
      </p>
      <div className="glass-panel" style={{ padding: '1.8rem', border: '1px solid rgba(197,160,89,0.3)' }}>
        {SECOES.map((s, i) => (
          <div key={s.titulo} style={{ marginBottom: '1.4rem', paddingTop: i ? '1.4rem' : 0, borderTop: i ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <p style={tituloStyle}>{s.titulo}</p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', margin: '-0.4rem 0 1rem', lineHeight: 1.5 }}>{s.nota}</p>
            {s.campos.map((c) => (
              <div key={c.id} style={{ marginBottom: '1.1rem' }}>
                <label style={labelStyle}>{c.titulo}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    value={links[c.id]}
                    onChange={(e) => setLinks({ ...links, [c.id]: e.target.value })}
                    placeholder={c.exemplo}
                    style={inputStyle}
                  />
                  {c.link && links[c.id] && (
                    <a href={links[c.id]} target="_blank" rel="noreferrer" title="Testar o link" style={{
                      flex: '0 0 auto', display: 'flex', alignItems: 'center', padding: '0 0.9rem', borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem',
                      letterSpacing: '1px', textDecoration: 'none',
                    }}>TESTAR</a>
                  )}
                </div>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', margin: '0.4rem 0 0', wordBreak: 'break-all' }}>
                  {situacao(c.id, gravados)}
                </p>
              </div>
            ))}
          </div>
        ))}
        <button onClick={salvar} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>SALVAR LINKS</button>
        {msg && (
          <p style={{
            marginTop: '0.8rem', fontSize: '0.82rem', fontWeight: '600', textAlign: 'center',
            color: msg.tipo === 'ok' ? '#4ade80' : msg.tipo === 'espera' ? 'var(--gold)' : '#ef4444',
          }}>{msg.txt}</p>
        )}
      </div>
    </div>
  )
}
