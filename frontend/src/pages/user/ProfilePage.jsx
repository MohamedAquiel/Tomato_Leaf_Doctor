import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from '../../api/users'
import { updatePassword } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'

const styles = {
  page: { minHeight: 'calc(100vh - 60px)', background: '#f8faf8', padding: '2rem 1rem' },
  container: { maxWidth: '640px', margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#2d6a4f', marginBottom: '1.75rem' },
  card: { background: '#fff', borderRadius: '14px', boxShadow: '0 2px 14px rgba(0,0,0,0.08)', padding: '1.75rem', marginBottom: '1.5rem' },
  sectionTitle: { fontSize: '1.05rem', fontWeight: '700', color: '#2d6a4f', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '2px solid #d1fae5' },
  avatarRow: { display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' },
  avatar: { width: '72px', height: '72px', borderRadius: '50%', background: '#2d6a4f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: '700', flexShrink: 0, textTransform: 'uppercase' },
  avatarName: { fontSize: '1.1rem', fontWeight: '700', color: '#1a1a1a' },
  avatarEmail: { fontSize: '0.88rem', color: '#6b7280', marginTop: '0.15rem' },
  roleBadge: { display: 'inline-block', background: '#dbeafe', color: '#1e40af', borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' },
  roleBadgeAdmin: { background: '#fef3c7', color: '#92400e' },
  statsRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' },
  statBox: { flex: '1 1 130px', background: '#f0f7f4', border: '1px solid #b7dfc9', borderRadius: '8px', padding: '0.85rem 1rem', textAlign: 'center' },
  statValue: { fontSize: '1.4rem', fontWeight: '800', color: '#2d6a4f' },
  statLabel: { fontSize: '0.78rem', color: '#6b7280', marginTop: '0.15rem' },
  fieldGroup: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' },
  input: { width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '0.95rem', color: '#1a1a1a', background: '#fff', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' },
  inputReadonly: { background: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed' },
  fieldError: { color: '#b91c1c', fontSize: '0.78rem', marginTop: '0.25rem' },
  saveBtn: { padding: '0.75rem 1.75rem', background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.97rem', fontWeight: '700', cursor: 'pointer', transition: 'opacity 0.2s' },
  saveBtnDisabled: { opacity: 0.55, cursor: 'not-allowed' },
  successBox: { background: '#d1fae5', border: '1px solid #6ee7b7', color: '#065f46', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  errorBox: { background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--'

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)
const WarnIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
)

const ProfilePage = () => {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile()
        const u = res.data || res.user || res
        setProfile(u)
        setName(u.name || '')
      } catch {
        setProfileError('Failed to load profile.')
      } finally {
        setProfileLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSaveProfile = async () => {
    if (!name.trim() || name.trim().length < 2) {
      setProfileError('Name must be at least 2 characters.')
      return
    }
    setProfileError(''); setProfileSuccess(''); setProfileSaving(true)
    try {
      const res = await updateProfile({ name: name.trim() })
      const updated = res.data || res.user || res
      setProfile(updated)
      setName(updated.name || name)
      setProfileSuccess('Profile updated successfully.')
      setTimeout(() => setProfileSuccess(''), 4000)
    } catch (err) {
      setProfileError(err?.response?.data?.message || 'Failed to update profile.')
    } finally {
      setProfileSaving(false)
    }
  }

  const validatePw = () => {
    const e = {}
    if (!pwForm.currentPassword) e.currentPassword = 'Current password is required.'
    if (!pwForm.newPassword) e.newPassword = 'New password is required.'
    else if (pwForm.newPassword.length < 6) e.newPassword = 'Must be at least 6 characters.'
    if (!pwForm.confirmNewPassword) e.confirmNewPassword = 'Please confirm your new password.'
    else if (pwForm.confirmNewPassword !== pwForm.newPassword) e.confirmNewPassword = 'Passwords do not match.'
    return e
  }

  const handleChangePassword = async () => {
    setPwError(''); setPwSuccess('')
    const e = validatePw()
    if (Object.keys(e).length) { setPwErrors(e); return }
    setPwErrors({}); setPwSaving(true)
    try {
      await updatePassword(pwForm)
      setPwSuccess('Password changed successfully.')
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
      setTimeout(() => setPwSuccess(''), 4000)
    } catch (err) {
      setPwError(err?.response?.data?.message || 'Failed to change password.')
    } finally {
      setPwSaving(false)
    }
  }

  const handlePwChange = (e) => {
    const { name, value } = e.target
    setPwForm((p) => ({ ...p, [name]: value }))
    if (pwErrors[name]) setPwErrors((p) => ({ ...p, [name]: '' }))
  }

  const focusStyle = (e) => { e.target.style.borderColor = '#2d6a4f' }
  const blurStyle = (e) => { e.target.style.borderColor = '#d1d5db' }

  if (profileLoading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
          <div style={{ ...styles.card, height: '220px', background: '#e5e7eb', animation: 'pulse 1.4s ease-in-out infinite' }} />
        </div>
      </div>
    )
  }

  const initial = (profile?.name || profile?.email || '?').charAt(0)
  const isAdmin = profile?.role === 'admin'

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Profile</h1>

        {}
        <div style={styles.card}>
          <div style={styles.avatarRow}>
            <div style={styles.avatar}>{initial}</div>
            <div style={{ flex: 1 }}>
              <p style={styles.avatarName}>{profile?.name || '--'}</p>
              <p style={styles.avatarEmail}>{profile?.email || '--'}</p>
            </div>
            <span style={{ ...styles.roleBadge, ...(isAdmin ? styles.roleBadgeAdmin : {}) }}>
              {profile?.role || 'user'}
            </span>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{profile?.predictionCount ?? '--'}</div>
              <div style={styles.statLabel}>Predictions</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{formatDate(profile?.lastLogin)}</div>
              <div style={styles.statLabel}>Last Login</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{formatDate(profile?.createdAt)}</div>
              <div style={styles.statLabel}>Member Since</div>
            </div>
          </div>
        </div>

        {}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Edit Profile</h2>
          {profileSuccess && <div style={styles.successBox}><CheckIcon />{profileSuccess}</div>}
          {profileError && <div style={styles.errorBox}><WarnIcon />{profileError}</div>}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name *</label>
            <input style={styles.input} type="text" value={name}
              onChange={(e) => { setName(e.target.value); setProfileError('') }}
              placeholder="Your name" onFocus={focusStyle} onBlur={blurStyle} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input style={{ ...styles.input, ...styles.inputReadonly }} type="email"
              value={profile?.email || ''} readOnly tabIndex={-1} />
          </div>
          <button style={{ ...styles.saveBtn, ...(profileSaving ? styles.saveBtnDisabled : {}) }}
            onClick={handleSaveProfile} disabled={profileSaving}>
            {profileSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Change Password</h2>
          {pwSuccess && <div style={styles.successBox}><CheckIcon />{pwSuccess}</div>}
          {pwError && <div style={styles.errorBox}><WarnIcon />{pwError}</div>}
          {[
            { label: 'Current Password', name: 'currentPassword', placeholder: 'Enter current password' },
            { label: 'New Password', name: 'newPassword', placeholder: 'At least 6 characters' },
            { label: 'Confirm New Password', name: 'confirmNewPassword', placeholder: 'Re-enter new password' },
          ].map(({ label, name, placeholder }) => (
            <div key={name} style={styles.fieldGroup}>
              <label style={styles.label}>{label} *</label>
              <input
                style={{ ...styles.input, ...(pwErrors[name] ? { borderColor: '#dc2626' } : {}) }}
                type="password" name={name} value={pwForm[name]}
                onChange={handlePwChange} placeholder={placeholder}
                onFocus={focusStyle} onBlur={blurStyle}
              />
              {pwErrors[name] && <p style={styles.fieldError}>{pwErrors[name]}</p>}
            </div>
          ))}
          <button style={{ ...styles.saveBtn, ...(pwSaving ? styles.saveBtnDisabled : {}) }}
            onClick={handleChangePassword} disabled={pwSaving}>
            {pwSaving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
