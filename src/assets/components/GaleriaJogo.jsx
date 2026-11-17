import { useCallback, useEffect, useRef, useState } from 'react'
import './GaleriaJogo.css'

/**
 * Vitrine de imagens reais do jogo na home: cards verticais (foco no centro) num carrossel.
 * PC: ~5 cards por vez, roda sozinho e para com o mouse em cima. Celular: ~2 cards, arrasta com o dedo.
 * Clique abre em tela cheia. As imagens vem do painel admin (/api/galeria, Vercel Blob).
 * Protecao: se a API falhar ou as imagens nao carregarem (ex.: cota do Blob estourada),
 * o card some; se nao sobrar nenhum, a secao inteira some. Sem lista no banco, usa a reserva local.
 */

export default function GaleriaJogo({ reserva = [] }) {
  const [imgs, setImgs] = useState(null)
  const [quebradas, setQuebradas] = useState(() => new Set())
  const [aberta, setAberta] = useState(-1)
  const trilho = useRef(null)
  const pausado = useRef(false)

  useEffect(() => {
    let vivo = true
    fetch('/api/galeria')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!vivo) return
        const lista = Array.isArray(d?.imagens) ? d.imagens : []
        setImgs(lista.length ? lista.map((i) => ({ id: i.id, card: i.url_card, full: i.url_full, legenda: i.legenda })) : reserva)
      })
      .catch(() => vivo && setImgs(reserva))
    return () => { vivo = false }
  }, [reserva])

  const visiveis = (imgs || []).filter((i) => !quebradas.has(i.card))
  const quebrou = (src) => setQuebradas((s) => new Set(s).add(src))

  // anda um card para o lado (volta ao comeco no fim)
  const passo = useCallback((dir) => {
    const t = trilho.current
    if (!t) return
    const card = t.querySelector('.gal-card')
    const w = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(t).columnGap || 0) : t.clientWidth / 2
    const fim = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4
    if (dir > 0 && fim) t.scrollTo({ left: 0, behavior: 'smooth' })
    else t.scrollBy({ left: dir * w, behavior: 'smooth' })
  }, [])

  // roda sozinho a cada 3,5 s (para com mouse/toque em cima, aba escondida ou tela cheia aberta)
  useEffect(() => {
    if (visiveis.length < 3) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      if (pausado.current || document.hidden || aberta >= 0) return
      passo(1)
    }, 3500)
    return () => clearInterval(id)
  }, [visiveis.length, aberta, passo])

  // teclado na tela cheia
  useEffect(() => {
    if (aberta < 0) return
    const tecla = (e) => {
      if (e.key === 'Escape') setAberta(-1)
      if (e.key === 'ArrowRight') setAberta((i) => (i + 1) % visiveis.length)
      if (e.key === 'ArrowLeft') setAberta((i) => (i - 1 + visiveis.length) % visiveis.length)
    }
    window.addEventListener('keydown', tecla)
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', tecla); document.body.style.overflow = antes }
  }, [aberta, visiveis.length])

  if (!imgs || !visiveis.length) return null
  const atual = visiveis[aberta]

  return (
    <section className="ikw-sec gal" id="ikw-galeria">
      <div className="ikw-cab">
        <small>Imagens reais · versão beta</small>
        <h2>Veja o jogo</h2>
        <p>Capturas do jogo rodando no navegador. Toque numa imagem para ver inteira.</p>
      </div>

      <div
        className="gal-palco"
        onMouseEnter={() => { pausado.current = true }}
        onMouseLeave={() => { pausado.current = false }}
        onTouchStart={() => { pausado.current = true }}
      >
        <button className="gal-seta esq" onClick={() => passo(-1)} aria-label="Anterior"><i /></button>
        <div className="gal-trilho" ref={trilho}>
          {visiveis.map((im, i) => (
            <button className="gal-card" key={im.id ?? im.card} onClick={() => setAberta(i)} aria-label={im.legenda || 'Ampliar imagem'}>
              <img src={im.card} alt={im.legenda || 'Imagem do jogo'} loading="lazy" decoding="async" onError={() => quebrou(im.card)} />
              {im.legenda && <span>{im.legenda}</span>}
            </button>
          ))}
        </div>
        <button className="gal-seta dir" onClick={() => passo(1)} aria-label="Próxima"><i /></button>
      </div>

      {atual && (
        <div className="gal-zoom" role="dialog" aria-label={atual.legenda || 'Imagem do jogo'} onClick={() => setAberta(-1)}>
          <button className="gal-fechar" aria-label="Fechar"><i /><i /></button>
          {visiveis.length > 1 && (
            <button className="gal-seta esq" aria-label="Anterior"
              onClick={(e) => { e.stopPropagation(); setAberta((aberta - 1 + visiveis.length) % visiveis.length) }}><i /></button>
          )}
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={atual.full} alt={atual.legenda || 'Imagem do jogo'} onError={() => { quebrou(atual.card); setAberta(-1) }} />
            <figcaption>{atual.legenda}<small>{aberta + 1} / {visiveis.length}</small></figcaption>
          </figure>
          {visiveis.length > 1 && (
            <button className="gal-seta dir" aria-label="Próxima"
              onClick={(e) => { e.stopPropagation(); setAberta((aberta + 1) % visiveis.length) }}><i /></button>
          )}
        </div>
      )}
    </section>
  )
}
