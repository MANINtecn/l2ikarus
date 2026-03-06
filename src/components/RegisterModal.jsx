import { useState } from 'react'
import './RegisterModal.css'

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
        setMessage({ type: 'success', text: 'Conta criada com sucesso! Seja bem-vindo ao Ikarus.' })
        setTimeout(() => {
          onClose()
          setFormData({ login: '', email: '', password: '', confirmPassword: '' })
          setMessage({ type: '', text: '' })
        }, 3000)
      } else {
        setMessage({ type: 'error', text: data.message || 'Erro ao criar conta.' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro de conexão com o servidor.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <h2 className="cinzel">CRIAR CONTA</h2>
          <p>Junte-se ao universo de Ikarus Arise</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label>Login</label>
            <input 
              type="text" 
              required 
              value={formData.login}
              onChange={e => setFormData({...formData, login: e.target.value})}
              placeholder="Digite seu login"
            />
          </div>

          <div className="input-group">
            <label>E-mail</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>

          <div className="input-group">
            <label>Confirmar Senha</label>
            <input 
              type="password" 
              required 
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="••••••••"
            />
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn-primary register-btn" disabled={loading}>
            {loading ? 'PROCESSANDO...' : 'CADASTRAR AGORA'}
          </button>
        </form>

        <div className="modal-footer">
          <p>Ao se cadastrar, você concorda com nossos termos de uso.</p>
        </div>
      </div>
    </div>
  )
}
