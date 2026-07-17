// BCrypt em JS puro (sem dependencia externa) — compativel com o formato $2a$ que o
// aCis (Interlude) usa em BCrypt.checkPw. Usado no cadastro pra gerar a senha do banco
// do Interlude a partir do texto puro (o Essence continua com sha1-base64).
// Porta do algoritmo classico OpenBSD bcrypt. Custo padrao 10 (igual ao aCis).
import crypto from 'crypto'

const BCRYPT_SALT_LEN = 16
const BF_N = 16

const P_orig = [
  0x243f6a88, 0x85a308d3, 0x13198a2e, 0x03707344, 0xa4093822, 0x299f31d0,
  0x082efa98, 0xec4e6c89, 0x452821e6, 0x38d01377, 0xbe5466cf, 0x34e90c6c,
  0xc0ac29b7, 0xc97c50dd, 0x3f84d5b5, 0xb5470917, 0x9216d5d9, 0x8979fb1b,
]

// As S-boxes e o resto de P sao grandes; geramos deterministicamente a partir dos
// digitos hex de PI, exatamente como o bcrypt de referencia. Para manter o arquivo
// enxuto e 100% correto, usamos a tabela canonica embutida em base64.
import { S_BOXES } from './_bcrypt_tables.js'

const base64Code = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('')
const index64 = (() => { const a = new Array(128).fill(-1); base64Code.forEach((c, i) => a[c.charCodeAt(0)] = i); return a })()

function encodeBase64(d, len) {
  let off = 0, rs = ''
  while (off < len) {
    let c1 = d[off++] & 0xff
    rs += base64Code[(c1 >> 2) & 0x3f]
    c1 = (c1 & 0x03) << 4
    if (off >= len) { rs += base64Code[c1 & 0x3f]; break }
    let c2 = d[off++] & 0xff
    c1 |= (c2 >> 4) & 0x0f
    rs += base64Code[c1 & 0x3f]
    c1 = (c2 & 0x0f) << 2
    if (off >= len) { rs += base64Code[c1 & 0x3f]; break }
    c2 = d[off++] & 0xff
    c1 |= (c2 >> 6) & 0x03
    rs += base64Code[c1 & 0x3f]
    rs += base64Code[c2 & 0x3f]
  }
  return rs
}

function streamToWord(data, offp) {
  let word = 0, off = offp.off
  for (let i = 0; i < 4; i++) { word = (word << 8) | (data[off] & 0xff); off = (off + 1) % data.length }
  offp.off = off
  return word >>> 0
}

function encipher(lr, off, P, S) {
  let l = lr[off], r = lr[off + 1]
  l ^= P[0]
  for (let i = 0; i <= BF_N - 2;) {
    let n = S[(l >>> 24) & 0xff]
    n = (n + S[0x100 | ((l >>> 16) & 0xff)]) >>> 0
    n = (n ^ S[0x200 | ((l >>> 8) & 0xff)]) >>> 0
    n = (n + S[0x300 | (l & 0xff)]) >>> 0
    r = (r ^ n ^ P[++i]) >>> 0
    n = S[(r >>> 24) & 0xff]
    n = (n + S[0x100 | ((r >>> 16) & 0xff)]) >>> 0
    n = (n ^ S[0x200 | ((r >>> 8) & 0xff)]) >>> 0
    n = (n + S[0x300 | (r & 0xff)]) >>> 0
    l = (l ^ n ^ P[++i]) >>> 0
  }
  lr[off] = (r ^ P[BF_N + 1]) >>> 0
  lr[off + 1] = l
}

function initState() {
  return { P: [...P_orig], S: [...S_BOXES] }
}

function key(keyBytes, st) {
  const offp = { off: 0 }
  const lr = [0, 0]
  for (let i = 0; i < st.P.length; i++) st.P[i] = (st.P[i] ^ streamToWord(keyBytes, offp)) >>> 0
  for (let i = 0; i < st.P.length; i += 2) { encipher(lr, 0, st.P, st.S); st.P[i] = lr[0]; st.P[i + 1] = lr[1] }
  for (let i = 0; i < st.S.length; i += 2) { encipher(lr, 0, st.P, st.S); st.S[i] = lr[0]; st.S[i + 1] = lr[1] }
}

function ekskey(dataBytes, keyBytes, st) {
  const koffp = { off: 0 }, doffp = { off: 0 }
  const lr = [0, 0]
  for (let i = 0; i < st.P.length; i++) st.P[i] = (st.P[i] ^ streamToWord(keyBytes, koffp)) >>> 0
  for (let i = 0; i < st.P.length; i += 2) {
    lr[0] = (lr[0] ^ streamToWord(dataBytes, doffp)) >>> 0
    lr[1] = (lr[1] ^ streamToWord(dataBytes, doffp)) >>> 0
    encipher(lr, 0, st.P, st.S); st.P[i] = lr[0]; st.P[i + 1] = lr[1]
  }
  for (let i = 0; i < st.S.length; i += 2) {
    lr[0] = (lr[0] ^ streamToWord(dataBytes, doffp)) >>> 0
    lr[1] = (lr[1] ^ streamToWord(dataBytes, doffp)) >>> 0
    encipher(lr, 0, st.P, st.S); st.S[i] = lr[0]; st.S[i + 1] = lr[1]
  }
}

function cryptRaw(password, salt, logRounds) {
  const st = initState()
  const rounds = 1 << logRounds
  ekskey(salt, password, st)
  for (let i = 0; i < rounds; i++) { key(password, st); key(salt, st) }
  // "OrpheanBeholderScryDoubt"
  const cdata = [0x4f727068, 0x65616e42, 0x65686f6c, 0x64657253, 0x63727944, 0x6f756274]
  const clen = 6
  for (let i = 0; i < 64; i++) for (let j = 0; j < clen >> 1; j++) encipher(cdata, j << 1, st.P, st.S)
  const ret = Buffer.alloc(clen * 4)
  for (let i = 0, j = 0; i < clen; i++) {
    ret[j++] = (cdata[i] >>> 24) & 0xff
    ret[j++] = (cdata[i] >>> 16) & 0xff
    ret[j++] = (cdata[i] >>> 8) & 0xff
    ret[j++] = cdata[i] & 0xff
  }
  return ret
}

export function hashpw(passwordPlain, logRounds = 10) {
  const saltBytes = crypto.randomBytes(BCRYPT_SALT_LEN)
  // senha em UTF-8 + terminador nulo (padrao bcrypt)
  const pw = Buffer.concat([Buffer.from(passwordPlain, 'utf8'), Buffer.from([0])])
  const hashed = cryptRaw(pw, saltBytes, logRounds)
  const rounds = logRounds < 10 ? '0' + logRounds : '' + logRounds
  return `$2a$${rounds}$${encodeBase64(saltBytes, BCRYPT_SALT_LEN)}${encodeBase64(hashed, 23)}`
}
