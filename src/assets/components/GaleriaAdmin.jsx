import { useEffect, useState } from 'react'

/**
 * Aba GALERIA do painel admin: imagens reais do jogo que rodam na vitrine da home.
 * O navegador do admin ja' diminui e converte cada imagem antes de enviar:
 *  - card: recorte do centro em retrato 3:4 (540x720), leve, e' o que a vitrine carrega;
 *  - grande: ate' 1600 px no lado maior, so' baixa quando a pessoa clica.
 * Os arquivos vao para o Vercel Blob (cache de 1 ano); a lista fica no banco (site_galeria).
 */

const caixa = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1.2rem' }
const titulo = { fontSize: '0.62rem', color: 'var(--gold)', letterSpacing: '3px', margin: '0 0 1rem' }
const input = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }
const botao = (cor = 'var(--gold)') => ({ background: 'rgba(255,255,255,0.04)', border: `1px solid ${cor}`, color: cor, padding: '0.4rem 0.7rem', borderRadius: '5px', fontSize: '0.62rem', letterSpacing: '1px', cursor: 'pointer', whiteSpace: 'nowrap' })

function carregarImagem(file) {
  return new Promise((ok, erro) => {
    const url = URL.createObjectURL(file)
    const im = new Image()
    im.onload = () => { URL.revokeObjectURL(url); ok(im) }
    im.onerror = () => { URL.revokeObjectURL(url); erro(new Error('Não consegui abrir essa imagem.')) }
    im.src = url
  })
}

// desenha no canvas e devolve data URL (webp; se o navegador nao fizer webp, jpeg)
function exportar(canvas, qualidade) {
  let d = canvas.toDataURL('image/webp', qualidade)
  if (!d.startsWith('data:image/webp')) d = canvas.toDataURL('image/jpeg', qualidade)
  return d
}

async function prepararImagem(file) {
  const im = await carregarImagem(file)
  const W = im.naturalWidth, H = im.naturalHeight
  // grande: lado maior ate' 1600
  const f = Math.min(1, 1600 / Math.max(W, H))
  const cg = document.createElement('canvas')
  cg.width = Math.round(W * f); cg.height = Math.round(H * f)
  cg.getContext('2d').drawImage(im, 0, 0, cg.width, cg.height)
  const full = exportar(cg, 0.82)
  // card: recorte do centro em 3:4
  const alvo = 3 / 4
  let sw = W, sh = H
  if (W / H > alvo) sw = H * alvo; else sh = W / alvo
  const sx = (W - sw) / 2, sy = (H - sh) / 2
  const cc = document.createElement('canvas')
  cc.width = 540; cc.height = 720
  cc.getContext('2d').drawImage(im, sx, sy, sw, sh, 0, 0, 540, 720)
  const card = exportar(cc, 0.72)
  return { card, full }
}

const kb = (dataUrl) => Math.round((dataUrl.length * 3) / 4 / 1024)

export default function GaleriaAdmin() {
  const [imagens, setImagens] = useState([])
  const [blob, setBlob] = useState(true)
  const [carregando, setCarregando] = useState(true)
  const [fila, setFila] = useState([]) // { nome, card, full, legenda, estado }
  const [msg, setMsg] = useState(null)

  const carregar = async () => {
    setCarregando(true)
    try {
      const d = await fetch('/api/admin/galeria').then((r) => r.json())
      setImagens(d.imagens || [])
      setBlob(d.blob !== false)
    } catch { setMsg({ ok: false, t: 'Não consegui carregar a galeria.' }) }
    setCarregando(false)
  }
  useEffect(() => { carregar() }, [])

  const post = (acao, corpo) => fetch(`/api/admin/${acao}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo),
  }).then(async (r) => ({ ok: r.ok, ...(await r.json().catch(() => ({}))) }))

  const escolher = async (e) => {
    const arquivos = [...(e.target.files || [])].filter((f) => f.type.startsWith('image/'))
    e.target.value = ''
    setMsg(null)
    for (const f of arquivos) {
      try {
        const p = await prepararImagem(f)
        setFila((q) => [...q, { nome: f.name, ...p, legenda: '', estado: 'pronta' }])
      } catch (err) { setMsg({ ok: false, t: `${f.name}: ${err.message}` }) }
    }
  }

  const enviarTudo = async () => {
    setMsg(null)
    for (let i = 0; i < fila.length; i++) {
      const it = fila[i]
      if (it.estado === 'enviada') continue
      setFila((q) => q.map((x, j) => (j === i ? { ...x, estado: 'enviando' } : x)))
      const r = await post('galeria-upload', { card: it.card, full: it.full, legenda: it.legenda })
      setFila((q) => q.map((x, j) => (j === i ? { ...x, estado: r.ok ? 'enviada' : 'erro', erro: r.error } : x)))
    }
    setFila((q) => q.filter((x) => x.estado !== 'enviada'))
    carregar()
  }

  const editar = async (id, campos) => {
    const r = await post('galeria-editar', { id, ...campos })
    if (!r.ok) setMsg({ ok: false, t: r.error || 'Erro ao salvar.' })
    else setImagens((l) => l.map((x) => (x.id === id ? { ...x, ...(campos.visivel !== undefined ? { visivel: campos.visivel ? 1 : 0 } : {}), ...(campos.legenda !== undefined ? { legenda: campos.legenda } : {}) } : x)))
  }

  const mover = async (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= imagens.length) return
    const nova = [...imagens]
    ;[nova[i], nova[j]] = [nova[j], nova[i]]
    setImagens(nova)
    const r = await post('galeria-ordem', { ids: nova.map((x) => x.id) })
    if (!r.ok) { setMsg({ ok: false, t: r.error || 'Erro ao reordenar.' }); carregar() }
  }

  const apagar = async (id) => {
    if (!confirm('Apagar esta imagem da vitrine? Não dá para desfazer.')) return
    const r = await post('galeria-apagar', { id })
    if (!r.ok) setMsg({ ok: false, t: r.error || 'Erro ao apagar.' })
    else setImagens((l) => l.filter((x) => x.id !== id))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '980px' }}>
      <div>
        <p style={{ ...titulo, marginBottom: '0.4rem' }}>GALERIA DA HOME</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-mute)', margin: 0, lineHeight: 1.6 }}>
          Imagens reais do jogo que rodam na vitrine do site. O card mostra o <b style={{ color: '#fff' }}>centro</b> da imagem em pé (retrato);
          ao clicar, abre inteira. A imagem é diminuída aqui mesmo antes de enviar, então pode mandar print grande.
        </p>
      </div>

      {!blob && (
        <div style={{ ...caixa, borderColor: 'rgba(255,180,58,0.5)', color: '#ffb43a', fontSize: '0.78rem' }}>
          O armazenamento de imagens (Vercel Blob) ainda não está ligado ao projeto. Na Vercel: projeto do site → Storage → Create → Blob → ligar ao projeto, e depois um novo deploy.
        </div>
      )}
      {msg && <div style={{ ...caixa, color: msg.ok ? '#4ade80' : '#f87171', fontSize: '0.78rem' }}>{msg.t}</div>}

      {/* ENVIAR */}
      <div style={caixa}>
        <p style={titulo}>ADICIONAR IMAGENS</p>
        <label style={{ display: 'block', border: '1px dashed rgba(197,160,89,0.45)', borderRadius: '8px', padding: '1.4rem', textAlign: 'center', cursor: 'pointer', color: 'var(--text-mute)', fontSize: '0.78rem' }}>
          Clique para escolher (pode escolher várias): PNG, JPG ou WEBP
          <input type="file" accept="image/*" multiple onChange={escolher} style={{ display: 'none' }} />
        </label>
        {fila.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginTop: '1rem' }}>
            {fila.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <img src={it.card} alt="" style={{ width: 54, height: 72, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input style={input} placeholder="Legenda (opcional): ex. Baium soltando raios" maxLength={140}
                    value={it.legenda} onChange={(e) => setFila((q) => q.map((x, j) => (j === i ? { ...x, legenda: e.target.value } : x)))} />
                  <small style={{ color: it.estado === 'erro' ? '#f87171' : 'var(--text-mute)', fontSize: '0.62rem' }}>
                    {it.nome} · card {kb(it.card)} KB · grande {kb(it.full)} KB
                    {it.estado === 'enviando' && ' · enviando...'}{it.estado === 'erro' && ` · ${it.erro || 'erro'}`}
                  </small>
                </div>
                <button style={botao('#f87171')} onClick={() => setFila((q) => q.filter((_, j) => j !== i))}>TIRAR</button>
              </div>
            ))}
            <button onClick={enviarTudo} className="btn btn-primary" style={{ padding: '0.8rem', fontSize: '0.7rem', letterSpacing: '2px' }}>
              PUBLICAR {fila.length} {fila.length === 1 ? 'IMAGEM' : 'IMAGENS'}
            </button>
          </div>
        )}
      </div>

      {/* LISTA */}
      <div style={caixa}>
        <p style={titulo}>NA VITRINE ({imagens.length})</p>
        {carregando && <p style={{ color: 'var(--text-mute)', fontSize: '0.78rem' }}>Carregando...</p>}
        {!carregando && !imagens.length && <p style={{ color: 'var(--text-mute)', fontSize: '0.78rem' }}>Nenhuma imagem ainda. Enquanto estiver vazia, o site mostra a imagem reserva.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {imagens.map((im, i) => { const vis = Number(im.visivel ?? 1) === 1; return (
            <div key={im.id} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', opacity: vis ? 1 : 0.45 }}>
              <span style={{ width: 22, textAlign: 'right', color: 'var(--text-mute)', fontSize: '0.7rem' }}>{i + 1}</span>
              <a href={im.url_full} target="_blank" rel="noreferrer"><img src={im.url_card} alt="" style={{ width: 54, height: 72, objectFit: 'cover', borderRadius: 4, display: 'block' }} /></a>
              <input style={{ ...input, flex: 1 }} defaultValue={im.legenda} maxLength={140} placeholder="Sem legenda"
                onBlur={(e) => { if (e.target.value !== im.legenda) editar(im.id, { legenda: e.target.value }) }} />
              <button style={botao()} onClick={() => mover(i, -1)} disabled={i === 0} title="Mais para a frente">▲</button>
              <button style={botao()} onClick={() => mover(i, 1)} disabled={i === imagens.length - 1} title="Mais para trás">▼</button>
              <button style={botao(vis ? '#94a3b8' : '#4ade80')} onClick={() => editar(im.id, { visivel: !vis })}>{vis ? 'ESCONDER' : 'MOSTRAR'}</button>
              <button style={botao('#f87171')} onClick={() => apagar(im.id)}>APAGAR</button>
            </div>
          ) })}
        </div>
      </div>
    </div>
  )
}
