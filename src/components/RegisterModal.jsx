import { useState } from 'react'

export default function RegisterModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (formData.password !== formData.confirmPassword) {
      return setMessage({ type: 'error', text: 'As senhas não coincidem.' })
    }

    setLoading(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: formData.login,
          email: formData.email,
          password: formData.password
        })
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
    } catch (err) {
      setMessage({ type: 'error', text: 'ERRO DE TERMINAL.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 12000,
      background: 'rgba(5, 5, 8, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(20px)',
      padding: '1rem'
    }} onClick={onClose}>
      
      <div className="glass-panel" style={{
        padding: '3rem',
        width: '100%', maxWidth: '450px',
        position: 'relative',
        animation: 'fadeUp 0.5s ease-out forwards'
      }} onClick={e => e.stopPropagation()}>
        
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            background: 'none', border: 'none', color: '#666', 
            fontSize: '1.5rem', cursor: 'pointer', transition: '0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--gold)'}
          onMouseLeave={(e) => e.target.style.color = '#666'}
        >
          &times;
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="cinzel" style={{ color: 'var(--gold)', fontSize: '1.8rem', letterSpacing: '4px' }}>NOVO RECRUTA</h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-mute)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '0.5rem' }}>Inicie sua ascensão no Ikarus Elite</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-mute)', textTransform: 'uppercase' }}>Login de Acesso</label>
             <input 
               type="text" required value={formData.login}
               onChange={e => setFormData({...formData, login: e.target.value})}
               autoFocus
               style={{ 
                 background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                 color: '#fff', padding: '1rem', borderRadius: '4px', outline: 'none', fontSize: '0.9rem'
               }}
             />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-mute)', textTransform: 'uppercase' }}>Endereço de E-mail</label>
             <input 
               type="email" required value={formData.email}
               onChange={e => setFormData({...formData, email: e.target.value})}
               style={{ 
                 background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                 color: '#fff', padding: '1rem', borderRadius: '4px', outline: 'none', fontSize: '0.9rem'
               }}
             />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <label style={{ fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-mute)', textTransform: 'uppercase' }}>Senha</label>
               <input 
                 type="password" required value={formData.password}
                 onChange={e => setFormData({...formData, password: e.target.value})}
                 style={{ 
                   background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                   color: '#fff', padding: '1rem', borderRadius: '4px', outline: 'none', fontSize: '0.9rem', width: '100%'
                 }}
               />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <label style={{ fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-mute)', textTransform: 'uppercase' }}>Confirmar</label>
               <input 
                 type="password" required value={formData.confirmPassword}
                 onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                 style={{ 
                   background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                   color: '#fff', padding: '1rem', borderRadius: '4px', outline: 'none', fontSize: '0.9rem', width: '100%'
                 }}
               />
            </div>
          </div>

          {message.text && (
            <div style={{ 
              padding: '1rem', 
              fontSize: '0.7rem', 
              textAlign: 'center',
              letterSpacing: '1px',
              background: message.type === 'error' ? 'rgba(255,68,68,0.1)' : 'rgba(74,222,128,0.1)',
              color: message.type === 'error' ? '#ff4444' : '#4ade80',
              border: `1px solid ${message.type === 'error' ? 'rgba(255,68,68,0.2)' : 'rgba(74,222,128,0.2)'}`
            }}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem', padding: '1.2rem' }}
          >
            {loading ? 'AUTENTICANDO...' : 'CADASTRAR CONTA'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.6rem', color: '#444', letterSpacing: '1px' }}>
          AO CLICAR EM CADASTRAR, VOCÊ ACEITA OS TERMOS DE SERVIÇO DO IKARUS ELITE.
        </p>
      </div>
    </div>
  )
}
