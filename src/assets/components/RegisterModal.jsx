import { useState } from 'react'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function RegisterModal({ isOpen, onClose, regResult, regError }) {
  const [formData, setFormData] = useState({ login: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [manualMode, setManualMode] = useState(false)

  if (!isOpen) return null

  // Tela de sucesso com credenciais (após OAuth Google)
  if (regResult) {
    const isExisting = regResult.existing
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 12000,
        background: 'rgba(5,5,8,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(20px)', padding: '1rem',
      }}>
        <div className="glass-panel" style={{
          padding: '3rem', width: '100%', maxWidth: '440px', textAlign: 'center',
          border: '1px solid rgba(74,222,128,0.3)',
          animation: 'fadeUp 0.5s ease-out forwards',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {isExisting ? '👋' : '✅'}
          </div>

          {isExisting ? (
            <>
              <h2 className="cinzel" style={{ color: 'var(--gold)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                JÁ CADASTRADO
              </h2>
              <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem', marginBottom: '2rem' }}>
                Este e-mail já possui uma conta.<br />Seu login é:
              </p>
              <div style={{
                background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(197,160,89,0.3)',
                borderRadius: '8px', padding: '1.2rem', marginBottom: '2rem',
              }}>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '0.5rem' }}>SEU LOGIN</p>
                <p style={{ color: 'var(--gold)', fontSize: '1.3rem', fontWeight: '900', letterSpacing: '3px' }}>
                  {regResult.login}
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="cinzel" style={{ color: '#4ade80', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                CONTA CRIADA!
              </h2>
              <p style={{ color: 'var(--text-mute)', fontSize: '0.8rem', marginBottom: '2rem' }}>
                Bem-vindo, <strong style={{ color: '#fff' }}>{regResult.name}</strong>! Use estas credenciais para entrar no jogo.
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(197,160,89,0.3)',
                borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', textAlign: 'left',
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.55rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '0.3rem' }}>LOGIN DO JOGO</p>
                  <p style={{ color: 'var(--gold)', fontSize: '1.4rem', fontWeight: '900', letterSpacing: '4px', fontFamily: 'monospace' }}>
                    {regResult.login}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.55rem', color: 'var(--text-mute)', letterSpacing: '3px', marginBottom: '0.3rem' }}>SENHA DO JOGO</p>
                  <p style={{ color: '#4ade80', fontSize: '1.4rem', fontWeight: '900', letterSpacing: '4px', fontFamily: 'monospace' }}>
                    {regResult.password}
                  </p>
                </div>
              </div>

              <div style={{
                background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)',
                borderRadius: '6px', padding: '0.9rem', marginBottom: '1.5rem',
              }}>
                <p style={{ color: '#ff9999', fontSize: '0.68rem', letterSpacing: '1px' }}>
                  ⚠ ANOTE AGORA — esta senha não será exibida novamente.
                </p>
              </div>
            </>
          )}

          <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
            ENTENDIDO
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    if (formData.password !== formData.confirmPassword)
      return setMessage({ type: 'error', text: 'As senhas não coincidem.' })

    setLoading(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: formData.login, email: formData.email, password: formData.password }),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage({ type: 'success', text: 'CONTA CRIADA! SEJA BEM-VINDO AO REINO.' })
        setTimeout(() => {
          onClose()
          setFormData({ login: '', email: '', password: '', confirmPassword: '' })
          setMessage({ type: '', text: '' })
        }, 3000)
      } else {
        setMessage({ type: 'error', text: data.message || 'FALHA NA CONEXÃO.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'ERRO DE TERMINAL.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 12000,
      background: 'rgba(5,5,8,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(20px)', padding: '1rem',
    }} onClick={onClose}>
      <div className="glass-panel" style={{
        padding: '3rem', width: '100%', maxWidth: '450px', position: 'relative',
        animation: 'fadeUp 0.5s ease-out forwards',
      }} onClick={e => e.stopPropagation()}>

        <button onClick={onClose} style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          background: 'none', border: 'none', color: '#666', fontSize: '1.5rem', cursor: 'pointer',
        }}>&times;</button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="cinzel" style={{ color: 'var(--gold)', fontSize: '1.8rem', letterSpacing: '4px' }}>NOVO RECRUTA</h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-mute)', letterSpacing: '2px', marginTop: '0.5rem' }}>
            Inicie sua ascensão no Ikarus
          </p>
        </div>

        {/* BOTÃO GOOGLE — OPÇÃO RÁPIDA */}
        {!manualMode && (
          <>
            <a href="/api/register/google" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.9rem',
              background: '#fff', color: '#1a1a1a', borderRadius: '8px',
              padding: '1rem 1.5rem', textDecoration: 'none',
              fontWeight: '700', fontSize: '0.9rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              marginBottom: '1.5rem',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)' }}
            >
              <GoogleIcon />
              Criar conta com Google
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ color: 'var(--text-mute)', fontSize: '0.65rem', letterSpacing: '2px' }}>OU</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <button onClick={() => setManualMode(true)} style={{
              width: '100%', background: 'none', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)', padding: '0.85rem', borderRadius: '6px',
              fontSize: '0.75rem', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(197,160,89,0.4)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
            >
              CADASTRO MANUAL
            </button>
          </>
        )}

        {/* FORMULÁRIO MANUAL */}
        {manualMode && (
          <>
            <button onClick={() => setManualMode(false)} style={{
              background: 'none', border: 'none', color: 'var(--text-mute)',
              fontSize: '0.65rem', letterSpacing: '2px', cursor: 'pointer', marginBottom: '1.5rem', padding: 0,
            }}>← VOLTAR</button>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                { label: 'Login de Acesso', key: 'login', type: 'text' },
                { label: 'E-mail', key: 'email', type: 'email' },
              ].map(f => (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-mute)', textTransform: 'uppercase' }}>{f.label}</label>
                  <input type={f.type} required value={formData[f.key]}
                    onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '0.9rem', borderRadius: '4px', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '1rem' }}>
                {[
                  { label: 'Senha', key: 'password' },
                  { label: 'Confirmar', key: 'confirmPassword' },
                ].map(f => (
                  <div key={f.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-mute)', textTransform: 'uppercase' }}>{f.label}</label>
                    <input type="password" required value={formData[f.key]}
                      onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '0.9rem', borderRadius: '4px', outline: 'none', fontSize: '0.9rem', width: '100%' }}
                    />
                  </div>
                ))}
              </div>

              {message.text && (
                <div style={{
                  padding: '0.9rem', fontSize: '0.7rem', textAlign: 'center', letterSpacing: '1px',
                  background: message.type === 'error' ? 'rgba(255,68,68,0.1)' : 'rgba(74,222,128,0.1)',
                  color: message.type === 'error' ? '#ff4444' : '#4ade80',
                  border: `1px solid ${message.type === 'error' ? 'rgba(255,68,68,0.2)' : 'rgba(74,222,128,0.2)'}`,
                }}>
                  {message.text}
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem', padding: '1.1rem' }}
              >
                {loading ? 'AUTENTICANDO...' : 'CADASTRAR CONTA'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
