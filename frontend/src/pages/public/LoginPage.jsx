import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'

const styles = {
  page: {
    minHeight: 'calc(100vh - 60px)', backgroundColor: '#f0f7f4',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem',
  },
  card: {
    backgroundColor: '#ffffff', borderRadius: '14px',
    boxShadow: '0 4px 24px rgba(45, 106, 79, 0.12)',
    padding: '2.5rem 2rem', width: '100%', maxWidth: '420px',
  },
  logoWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' },
  logoIcon: {
    width: '48px', height: '48px', backgroundColor: '#2d6a4f',
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: '1.65rem', fontWeight: '700', color: '#1b4332', textAlign: 'center', margin: '0 0 0.4rem' },
  subtitle: { fontSize: '0.92rem', color: '#6c757d', textAlign: 'center', margin: '0 0 1.75rem' },
  alert: {
    backgroundColor: '#fff5f5', border: '1px solid #fca5a5', borderRadius: '8px',
    color: '#b91c1c', fontSize: '0.88rem', padding: '0.75rem 1rem', marginBottom: '1.25rem',
    display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
  },
  form: { display: 'flex', flexDirection: 'column' },
  footer: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6c757d' },
  link: { color: '#2d6a4f', fontWeight: '600', textDecoration: 'none' },
  divider: { textAlign: 'center', margin: '1rem 0', color: '#9ca3af', fontSize: '0.82rem' },
  guestNote: {
    background: '#f0f7f4', border: '1px solid #b7dfc9', borderRadius: '8px',
    padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#1b4332', marginBottom: '1rem',
  },
}

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const from = location.state?.from?.pathname || '/predict'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!validateEmail(form.email)) e.email = 'Enter a valid email address.'
    if (!form.password) e.password = 'Password is required.'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const ve = validate()
    if (Object.keys(ve).length) { setErrors(ve); return }
    setLoading(true)
    try {
      await auth.login({ email: form.email, password: form.password })
      navigate(from, { replace: true })
    } catch (err) {
      setApiError(err?.response?.data?.message || err?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-5 8" fill="#ffffff" />
              <path d="M3.82 21.34C5 17 7 13 12 11" stroke="#a8d5b5" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to your TomatoAI account</p>

        {apiError && (
          <div style={styles.alert} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {apiError}
          </div>
        )}

        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <Input label="Email Address" name="email" type="email" value={form.email}
            onChange={handleChange} placeholder="you@example.com" error={errors.email} required />
          <Input label="Password" name="password" type="password" value={form.password}
            onChange={handleChange} placeholder="Min. 6 characters" error={errors.password} required />
          <Button type="submit" loading={loading} disabled={loading} variant="primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div style={styles.divider}>or</div>

        <div style={styles.guestNote}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          You can also <Link to="/predict" style={styles.link}>predict without an account</Link> -- results won't be saved.
        </div>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one free</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
