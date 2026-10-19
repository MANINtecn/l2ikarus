import { useEffect, useState } from 'react'

// Links que o admin edita no painel (aba LINKS), lidos em /api/links: convites da comunidade
// e o download do cliente do Sandbox. Estes sao a reserva: valem enquanto o admin nao gravou
// nada ou se a API falhar. Grupo/Discord gravado vazio = o botao some.
export const LINKS_PADRAO = {
  grupo: 'https://chat.whatsapp.com/HLBCkTWF4sv5NrzAh2pLQk',
  discord: 'https://discord.gg/BGs8mkUrmE',
  // mesmo link da pagina /300x; trocar pelo painel quando o cliente do mod for publicado
  download: 'https://drive.google.com/file/d/1q3R0bmzyqaQU9Ruk1Z5NvMqacJvLDdf6/view',
  tamanho: '',
}

let cache = null
let pedido = null

function buscar() {
  if (!pedido) {
    pedido = fetch('/api/links')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const gravados = d?.links && typeof d.links === 'object' ? d.links : {}
        cache = { ...LINKS_PADRAO }
        for (const k of Object.keys(LINKS_PADRAO)) {
          if (typeof gravados[k] === 'string') cache[k] = gravados[k]
        }
        // download nunca fica vazio (o painel nem deixa gravar); garante o padrao
        if (!cache.download) cache.download = LINKS_PADRAO.download
        return cache
      })
      .catch(() => (cache = { ...LINKS_PADRAO }))
  }
  return pedido
}

export function useLinksComunidade() {
  const [links, setLinks] = useState(cache || LINKS_PADRAO)
  useEffect(() => {
    let vivo = true
    buscar().then((l) => { if (vivo) setLinks(l) })
    return () => { vivo = false }
  }, [])
  return links
}
