import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
}

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

const RegisterPage = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
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
    if (!form.name.trim()) e.name = 'Name is required.'
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!validateEmail(form.email)) e.email = 'Enter a valid email address.'
    if (!form.password) e.password = 'Password is required.'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.'
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.'
    else if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const ve = validate()
    if (Object.keys(ve).length) { setErrors(ve); return }
    setLoading(true)
    try {
      await auth.register({ name: form.name.trim(), email: form.email, password: form.password })
      navigate('/predict')
    } catch (err) {
      setApiError(err?.response?.data?.message || err?.message || 'Registration failed. Please try again.')
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
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join TomatoAI and start protecting your plants</p>

        {apiError && (
          <div style={styles.alert} role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {apiError}
          </div>
        )}

        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <Input label="Full Name" name="name" type="text" value={form.name}
            onChange={handleChange} placeholder="John Doe" error={errors.name} required />
          <Input label="Email Address" name="email" type="email" value={form.email}
            onChange={handleChange} placeholder="you@example.com" error={errors.email} required />
          <Input label="Password" name="password" type="password" value={form.password}
            onChange={handleChange} placeholder="Min. 6 characters" error={errors.password} required />
          <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword}
            onChange={handleChange} placeholder="Re-enter your password" error={errors.confirmPassword} required />
          <Button type="submit" loading={loading} disabled={loading} variant="primary" style={{ marginTop: '0.5rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
