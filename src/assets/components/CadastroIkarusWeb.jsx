import { useState } from 'react'
import './PaginaIkarusWeb.css'
import './PainelIkarusWeb.css'

/**
 * Cadastro da home nova (l2ikarus.com). Mesma API do RegisterModal antigo:
 * POST /api/register (com o ref de indicacao guardado), login automatico em seguida,
 * e o "Continuar com Google" por /api/register/google (volta com googleData).
 * O RegisterModal antigo continua nas paginas legadas.
 */

const IconeGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

export default function CadastroIkarusWeb({ isOpen, onClose, googleData, onEntrar }) {
  const [passo, setPasso] = useState(googleData ? 'form' : 'inicio')
  const [f, setF] = useState({ login: '', email: googleData?.email || '', senha: '', senha2: '' })
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [criada, setCriada] = useState(false)

  if (!isOpen) return null

  const mudar = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()
    setErro('')
    if (f.senha.length < 6) return setErro('A senha precisa ter pelo menos 6 caracteres.')
    if (f.senha !== f.senha2) return setErro('As senhas não são iguais.')
    setEnviando(true)
    // indicacao: o ref guardado pelo link /r/<slug> (se ainda valido) vai junto
    let referredBy = null
    try {
      const r = JSON.parse(localStorage.getItem('ref') || 'null')
      if (r && r.slug && r.exp > Date.now()) referredBy = r.slug
    } catch {}
    try {
      const res = await fetch('/api/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: f.login, email: f.email, password: f.senha, referredBy }),
      })
      const data = await res.json()
      if (res.ok) {
        try { localStorage.removeItem('ref') } catch {}
        await fetch('/api/player/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login: f.login, password: f.senha }),
        })
        setCriada(true)
      } else {
        setErro(data.message || 'Erro ao criar conta.')
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="ikw ikp-modal" onClick={onClose}>
      <div className="ikp-modal-caixa ikc" onClick={(e) => e.stopPropagation()}>
        <button className="ikc-fechar" onClick={onClose} aria-label="Fechar"><i /><i /></button>

        {criada ? (<>
          <div className="ikc-ok" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12 L10 17 L19 7" /></svg></div>
          <h3>Conta criada</h3>
          <p className="ikp-mudo">Bem-vindo ao L2 Ikarus, <b>{f.login}</b>. Você já está conectado: na central, é só clicar em <b>Jogar</b>.</p>
          <button className="ikw-btn alto ikp-cheio" onClick={() => { try { sessionStorage.setItem('ikw.painel', '1') } catch {} onClose(); window.location.reload() }}>Ir para a central e jogar</button>
        </>) : (<>
          <h3>Criar conta</h3>
          <p className="ikp-mudo">Grátis. Uma conta para jogar, guardar seus Ikoin e comprar skins.</p>

          {googleData && (
            <div className="ikc-google-ok"><IconeGoogle /><span>E-mail verificado: {googleData.email}</span></div>
          )}

          {passo === 'inicio' && !googleData && (<>
            <a className="ikc-google" href="/api/register/google"><IconeGoogle />Continuar com Google</a>
            <div className="ikc-ou"><span>ou</span></div>
            <button className="ikw-btn fantasma alto ikp-cheio" onClick={() => setPasso('form')}>Criar com login e senha</button>
          </>)}

          {(passo === 'form' || googleData) && (
            <form className="ikc-form" onSubmit={enviar}>
              <label>
                <span>Login</span>
                <input className="ikp-campo" type="text" required autoFocus autoComplete="username"
                  value={f.login} onChange={mudar('login')} placeholder="Escolha seu login" />
              </label>
              <label>
                <span>E-mail</span>
                <input className="ikp-campo" type="email" required autoComplete="email"
                  value={f.email} onChange={mudar('email')} placeholder="seu@email.com" readOnly={!!googleData} />
              </label>
              <div className="ikc-duas">
                <label>
                  <span>Senha</span>
                  <input className="ikp-campo" type="password" required autoComplete="new-password"
                    value={f.senha} onChange={mudar('senha')} placeholder="Mínimo 6" />
                </label>
                <label>
                  <span>Repita a senha</span>
                  <input className="ikp-campo" type="password" required autoComplete="new-password"
                    value={f.senha2} onChange={mudar('senha2')} placeholder="Igual à de cima" />
                </label>
              </div>
              {erro && <div className="ikp-erro">{erro}</div>}
              <button type="submit" className="ikw-btn alto ikp-cheio" disabled={enviando}>
                {enviando ? 'Criando...' : 'Criar conta'}
              </button>
              <p className="ikc-termos">
                Ao criar a conta você aceita os <a href="/terms" target="_blank" rel="noreferrer">Termos</a> e
                a <a href="/privacy" target="_blank" rel="noreferrer">Privacidade</a>.
              </p>
              {passo === 'form' && !googleData && (
                <button type="button" className="ikp-link" onClick={() => { setPasso('inicio'); setErro('') }}>Voltar</button>
              )}
            </form>
          )}

          <button className="ikp-link" onClick={() => { onClose(); onEntrar?.() }}>Já tenho conta · Entrar</button>
        </>)}
      </div>
    </div>
  )
}
