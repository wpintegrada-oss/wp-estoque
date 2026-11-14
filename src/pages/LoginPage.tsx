import { useState, type FormEvent } from 'react'
import { Boxes, LockKeyhole, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email, password)
    } catch (cause) {
      const code = cause && typeof cause === 'object' && 'code' in cause ? String(cause.code) : ''
      if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
        setError('E-mail ou senha incorretos.')
      } else if (code.includes('too-many-requests')) {
        setError('Muitas tentativas. Aguarde alguns minutos e tente novamente.')
      } else {
        setError('Não foi possível entrar. Confira os dados e tente novamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="auth-screen">
    <section className="auth-card">
      <div className="auth-brand"><span className="auth-brand-icon"><Boxes size={25}/></span><div><strong>WP ESTOQUE</strong><small>GESTÃO INTELIGENTE</small></div></div>
      <span className="eyebrow">ÁREA RESTRITA</span>
      <h1>Entrar na sua conta</h1>
      <p className="auth-description">Acesse o estoque do Restaurante Frango e Churrasco.</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="field">E-mail<div className="auth-input"><Mail size={17}/><input type="email" required autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} placeholder="seu@email.com"/></div></label>
        <label className="field">Senha<div className="auth-input"><LockKeyhole size={17}/><input type="password" required autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Sua senha"/></div></label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button auth-submit" type="submit" disabled={submitting}>{submitting ? 'Entrando...' : 'Entrar'}</button>
      </form>
      <p className="auth-footnote">Acesso protegido pelo Firebase Authentication.</p>
    </section>
  </main>
}
