// Monta o "PIX copia e cola" estatico (BR Code do Banco Central) sem valor fixo:
// quem paga escolhe o valor no app do banco.

const campo = (id, valor) => id + String(valor.length).padStart(2, '0') + valor

// tira acento e caracteres fora do padrao; o BR Code aceita so' ASCII basico
const limpar = (t, max) => (t || '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^A-Za-z0-9 .\-]/g, '').trim().toUpperCase().slice(0, max)

function crc16(txt) {
  let crc = 0xffff
  for (let i = 0; i < txt.length; i++) {
    crc ^= txt.charCodeAt(i) << 8
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function pixCopiaECola({ chave, nome, cidade }) {
  if (!chave || !nome || !cidade) return ''
  const conta = campo('00', 'br.gov.bcb.pix') + campo('01', chave.trim())
  const corpo =
    campo('00', '01') +
    campo('26', conta) +
    campo('52', '0000') +
    campo('53', '986') +
    campo('58', 'BR') +
    campo('59', limpar(nome, 25)) +
    campo('60', limpar(cidade, 15)) +
    campo('62', campo('05', '***')) +
    '6304'
  return corpo + crc16(corpo)
}
