import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import Footer from './Footer'

const LeafIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px', flexShrink: 0 }}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-5 8"
      fill="#a8d5b5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.82 21.34C5 17 7 13 12 11" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const BellIcon = ({ count }) => (
  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d8f3dc" strokeWidth="2" strokeLinecap="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
    {count > 0 && (
      <span style={{
        position: 'absolute', top: '-6px', right: '-7px',
        background: '#ef4444', color: '#fff', borderRadius: '999px',
        fontSize: '0.6rem', fontWeight: '800', minWidth: '16px', height: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
        lineHeight: 1, fontFamily: 'Poppins, sans-serif',
      }}>{count > 9 ? '9+' : count}</span>
    )}
  </div>
)

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d8f3dc" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
)

const Spinner = () => (
  <span style={{
    display: 'inline-block', width: '13px', height: '13px', marginRight: '5px',
    borderWidth: '2px', borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.35)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0,
  }} />
)

const N = {
  navbar: {
    backgroundColor: '#2d6a4f', padding: '0 1.5rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '62px', boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  brand: {
    color: '#fff', textDecoration: 'none', fontSize: '1.15rem',
    fontWeight: '800', display: 'flex', alignItems: 'center',
    letterSpacing: '0.2px', flexShrink: 0, fontFamily: 'Poppins, sans-serif',
    transition: 'opacity 0.2s',
  },
  navLinks: {
    display: 'flex', alignItems: 'center', gap: '0.1rem',
    listStyle: 'none', margin: 0, padding: 0, flexWrap: 'nowrap',
  },
  navLink: {
    color: '#d8f3dc', textDecoration: 'none', fontSize: '0.87rem',
    fontWeight: '500', padding: '0.32rem 0.65rem', borderRadius: '6px',
    transition: 'color 0.18s, background 0.18s, transform 0.15s',
    whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif', display: 'block',
  },
  navLinkActive: { color: '#fff', background: 'rgba(255,255,255,0.18)', fontWeight: '600' },
  iconLink: {
    color: '#d8f3dc', textDecoration: 'none', padding: '0.32rem 0.55rem',
    borderRadius: '6px', display: 'flex', alignItems: 'center',
    transition: 'background 0.18s, transform 0.15s',
  },
  logoutBtn: {
    background: 'transparent', borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#d8f3dc',
    color: '#d8f3dc', fontSize: '0.87rem', fontWeight: '600',
    padding: '0.32rem 0.95rem', borderRadius: '6px', cursor: 'pointer',
    transition: 'background 0.18s, color 0.18s, transform 0.15s, box-shadow 0.18s',
    whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif',
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
  },
  registerBtn: {
    background: '#fff', color: '#2d6a4f', fontWeight: '700',
    padding: '0.32rem 0.9rem', borderRadius: '6px',
    transition: 'transform 0.18s, box-shadow 0.18s, background 0.18s',
    textDecoration: 'none', fontSize: '0.87rem',
    whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif', display: 'block',
  },
  main: { backgroundColor: '#ffffff', minHeight: 'calc(100vh - 62px)' },
  divider: { width: '1px', height: '20px', background: 'rgba(255,255,255,0.22)', margin: '0 0.25rem', flexShrink: 0 },
}

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login')
    } finally {
      setLoggingOut(false)
    }
  }

  const ls = (path, exact = false) => {
    const active = exact
      ? location.pathname === path
      : location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
    return { ...N.navLink, ...(active ? N.navLinkActive : {}) }
  }

  const ils = (path) => ({
    ...N.iconLink,
    ...(location.pathname === path ? { background: 'rgba(255,255,255,0.18)' } : {}),
  })

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .nav-a:hover { color: #fff !important; background: rgba(255,255,255,0.12) !important; transform: translateY(-1px); }
        .logout-btn:hover { background: rgba(255,255,255,0.15) !important; color: #fff !important; transform: translateY(-1px); box-shadow: 0 3px 10px rgba(0,0,0,0.15); }
        .logout-btn:active { transform: scale(0.97) !important; }
        .icon-link:hover { background: rgba(255,255,255,0.15) !important; transform: translateY(-1px); }
        .register-btn:hover { background: #f0f7f4 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .brand-link:hover { opacity: 0.88; }
      `}</style>

      <nav style={N.navbar}>
        {}
        <Link to="/" style={N.brand} className="brand-link">
          <LeafIcon />
          Tomato Leaf Doctor
        </Link>

        <ul style={N.navLinks}>

          {}
          <li><Link to="/" style={ls('/', true)} className="nav-a">Home</Link></li>
          <li><Link to="/predict" style={ls('/predict')} className="nav-a">Predict</Link></li>

          {}
          {user && (
            <>
              <li><Link to="/history" style={ls('/history')} className="nav-a">History</Link></li>
              <li><Link to="/compare" style={ls('/compare')} className="nav-a">Compare</Link></li>
              <li><Link to="/education" style={ls('/education')} className="nav-a">Education</Link></li>
              <li><Link to="/about" style={ls('/about')} className="nav-a">About</Link></li>
              <li><Link to="/contact" style={ls('/contact')} className="nav-a">Contact</Link></li>
              <li style={N.divider} />
              <li><Link to="/profile" style={ls('/profile')} className="nav-a">Profile</Link></li>
              {user.role === 'admin' && (
                <li><Link to="/admin" style={ls('/admin')} className="nav-a">Admin</Link></li>
              )}
              <li style={N.divider} />
              {}
              <li>
                <Link to="/notifications" style={ils('/notifications')} className="icon-link" title="Notifications">
                  <BellIcon count={unreadCount} />
                </Link>
              </li>
              {}
              <li>
                <Link to="/settings" style={ils('/settings')} className="icon-link" title="Settings">
                  <SettingsIcon />
                </Link>
              </li>
              {}
              <li>
                <button
                  style={{ ...N.logoutBtn, opacity: loggingOut ? 0.7 : 1 }}
                  className="logout-btn"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut && <Spinner />}
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </li>
            </>
          )}

          {}
          {!user && (
            <>
              <li><Link to="/education" style={ls('/education')} className="nav-a">Education</Link></li>
              <li><Link to="/about" style={ls('/about')} className="nav-a">About</Link></li>
              <li><Link to="/contact" style={ls('/contact')} className="nav-a">Contact</Link></li>
              <li style={N.divider} />
              <li><Link to="/login" style={ls('/login')} className="nav-a">Login</Link></li>
              <li><Link to="/register" style={N.registerBtn} className="register-btn">Register</Link></li>
            </>
          )}

        </ul>
      </nav>

      <main style={N.main}>
        {children}
      </main>

      <Footer />
    </>
  )
}

export default Layout
