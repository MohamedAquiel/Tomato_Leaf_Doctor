import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { updateProfile } from '../../api/users'

const S = {
  page: { minHeight: 'calc(100vh - 60px)', background: '#f8faf8', padding: '2rem 1rem' },
  container: { maxWidth: '680px', margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#2d6a4f', margin: '0 0 1.75rem' },
  card: { background: '#fff', borderRadius: '14px', boxShadow: '0 2px 14px rgba(0,0,0,0.08)', padding: '1.75rem', marginBottom: '1.5rem' },
  sectionTitle: { fontSize: '1.05rem', fontWeight: '700', color: '#2d6a4f', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '2px solid #d1fae5' },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid #f3f4f6' },
  rowLast: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0' },
  rowLeft: { flex: 1 },
  rowLabel: { fontSize: '0.95rem', fontWeight: '600', color: '#1a1a1a', margin: '0 0 0.15rem' },
  rowDesc: { fontSize: '0.82rem', color: '#6b7280', margin: 0 },
  toggle: { position: 'relative', width: '44px', height: '24px', flexShrink: 0 },
  toggleInput: { opacity: 0, width: 0, height: 0, position: 'absolute' },
  select: { padding: '0.45rem 0.75rem', border: '1.5px solid #d1d5db', borderRadius: '7px', fontSize: '0.88rem', color: '#1a1a1a', background: '#fff', outline: 'none', cursor: 'pointer' },
  saveBtn: { padding: '0.7rem 1.75rem', background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', marginTop: '1rem' },
  saveBtnDisabled: { opacity: 0.55, cursor: 'not-allowed' },
  successBox: { background: '#d1fae5', border: '1px solid #6ee7b7', color: '#065f46', borderRadius: '8px', padding: '0.7rem 1rem', fontSize: '0.88rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  dangerBtn: { padding: '0.65rem 1.5rem', background: '#fff0f0', color: '#b91c1c', border: '1.5px solid #fca5a5', borderRadius: '8px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer' },
  infoBox: { background: '#f0f7f4', border: '1px solid #b7dfc9', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#2d6a4f', marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' },
  input: { width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '0.95rem', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' },
}

const Toggle = ({ checked, onChange }) => {
  const track = { display: 'block', width: '44px', height: '24px', borderRadius: '999px', background: checked ? '#2d6a4f' : '#d1d5db', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }
  const thumb = { position: 'absolute', top: '3px', left: checked ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }
  return (
    <div style={track} onClick={onChange} role="switch" aria-checked={checked} tabIndex={0} onKeyDown={e => e.key === 'Enter' && onChange()}>
      <div style={thumb} />
    </div>
  )
}

const THEME_KEY = 'tld_theme'
const NOTIF_PREFS_KEY = 'tld_notif_prefs'
const LANG_KEY = 'tld_lang'

const SettingsPage = () => {
  const { user } = useAuth()
  const { clearAll, addNotification } = useNotifications()

  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || 'en')
  const [notifPrefs, setNotifPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(NOTIF_PREFS_KEY) || '{}') }
    catch { return {} }
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  const prefs = {
    predictionComplete: notifPrefs.predictionComplete !== false,
    diseaseDected: notifPrefs.diseaseDected !== false,
    weeklyTip: notifPrefs.weeklyTip !== false,
    accountActivity: notifPrefs.accountActivity !== false,
  }

  const togglePref = (key) => setNotifPrefs(p => ({ ...p, [key]: !prefs[key] }))

  const handleSave = async () => {
    setSaving(true)
    localStorage.setItem(THEME_KEY, theme)
    localStorage.setItem(LANG_KEY, lang)
    localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(notifPrefs))
    await new Promise(r => setTimeout(r, 500))
    setSaving(false)
    setSuccess('Settings saved successfully.')
    addNotification('success', 'Settings Saved', 'Your preferences have been updated.')
    setTimeout(() => setSuccess(''), 3500)
  }

  const handleClearNotifs = () => {
    if (window.confirm('Clear all notifications? This cannot be undone.')) {
      clearAll()
    }
  }

  const prefRows = [
    { key: 'predictionComplete', label: 'Prediction complete', desc: 'Notify when a diagnosis finishes' },
    { key: 'diseaseDected', label: 'Disease detected', desc: 'Alert when a disease is found in your scan' },
    { key: 'weeklyTip', label: 'Weekly plant care tips', desc: 'Receive a weekly tip to keep your plants healthy' },
    { key: 'accountActivity', label: 'Account activity', desc: 'Login alerts and profile changes' },
  ]

  return (
    <div style={S.page}>
      <div style={S.container}>
        <h1 style={S.title}>Settings</h1>

        {success && (
          <div style={S.successBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            {success}
          </div>
        )}

        {}
        <div style={S.card}>
          <h2 style={S.sectionTitle}>Appearance</h2>
          <div style={S.row}>
            <div style={S.rowLeft}>
              <p style={S.rowLabel}>Theme</p>
              <p style={S.rowDesc}>Choose your preferred colour scheme</p>
            </div>
            <select style={S.select} value={theme} onChange={e => setTheme(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark (coming soon)</option>
              <option value="system">System default</option>
            </select>
          </div>
          <div style={S.rowLast}>
            <div style={S.rowLeft}>
              <p style={S.rowLabel}>Language</p>
              <p style={S.rowDesc}>Interface language</p>
            </div>
            <select style={S.select} value={lang} onChange={e => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Spanish (coming soon)</option>
              <option value="fr">French (coming soon)</option>
            </select>
          </div>
        </div>

        {}
        <div style={S.card}>
          <h2 style={S.sectionTitle}>Notification Preferences</h2>
          <div style={S.infoBox}>
            These settings control which in-app notifications you receive. They are stored locally on this device.
          </div>
          {prefRows.map(({ key, label, desc }, i) => (
            <div key={key} style={i < prefRows.length - 1 ? S.row : S.rowLast}>
              <div style={S.rowLeft}>
                <p style={S.rowLabel}>{label}</p>
                <p style={S.rowDesc}>{desc}</p>
              </div>
              <Toggle checked={prefs[key]} onChange={() => togglePref(key)} />
            </div>
          ))}
        </div>

        {}
        <div style={S.card}>
          <h2 style={S.sectionTitle}>Account Info</h2>
          <div style={S.row}>
            <div style={S.rowLeft}>
              <p style={S.rowLabel}>Email</p>
              <p style={S.rowDesc}>{user?.email || '--'}</p>
            </div>
          </div>
          <div style={S.rowLast}>
            <div style={S.rowLeft}>
              <p style={S.rowLabel}>Account Role</p>
              <p style={S.rowDesc}>{user?.role || 'user'}</p>
            </div>
          </div>
        </div>

        {}
        <div style={S.card}>
          <h2 style={{ ...S.sectionTitle, color: '#b91c1c', borderBottomColor: '#fca5a5' }}>Data Management</h2>
          <div style={S.row}>
            <div style={S.rowLeft}>
              <p style={S.rowLabel}>Clear all notifications</p>
              <p style={S.rowDesc}>Remove all notification history from this device</p>
            </div>
            <button style={S.dangerBtn} onClick={handleClearNotifs}>Clear</button>
          </div>
          <div style={S.rowLast}>
            <div style={S.rowLeft}>
              <p style={S.rowLabel}>Reset local preferences</p>
              <p style={S.rowDesc}>Reset theme, language, and notification settings to defaults</p>
            </div>
            <button style={S.dangerBtn} onClick={() => {
              localStorage.removeItem(THEME_KEY)
              localStorage.removeItem(LANG_KEY)
              localStorage.removeItem(NOTIF_PREFS_KEY)
              setTheme('light'); setLang('en'); setNotifPrefs({})
              setSuccess('Preferences reset to defaults.')
              setTimeout(() => setSuccess(''), 3500)
            }}>Reset</button>
          </div>
        </div>

        <button
          style={{ ...S.saveBtn, ...(saving ? S.saveBtnDisabled : {}) }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
