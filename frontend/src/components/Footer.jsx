import { Link } from 'react-router-dom'

const S = {
  footer: {
    background: '#1b4332',
    color: '#b7e4c7',
    padding: '2.5rem 1.5rem 1.5rem',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  top: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  brand: {
    flex: '1 1 220px',
  },
  brandName: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#fff',
    fontWeight: '800',
    fontSize: '1.1rem',
    textDecoration: 'none',
    marginBottom: '0.65rem',
  },
  brandDesc: {
    fontSize: '0.85rem',
    color: '#74c69d',
    lineHeight: '1.65',
    margin: 0,
    maxWidth: '240px',
  },
  colGroup: {
    flex: '1 1 130px',
  },
  colTitle: {
    fontSize: '0.75rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
    color: '#74c69d',
    marginBottom: '0.85rem',
  },
  colLink: {
    display: 'block',
    color: '#b7e4c7',
    textDecoration: 'none',
    fontSize: '0.87rem',
    marginBottom: '0.5rem',
    transition: 'color 0.15s',
  },
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
    margin: '0 0 1.25rem',
  },
  bottom: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
  },
  copy: {
    fontSize: '0.83rem',
    color: '#74c69d',
    margin: 0,
  },
  dev: {
    fontSize: '0.83rem',
    color: '#74c69d',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  devName: {
    color: '#d8f3dc',
    fontWeight: '700',
  },
}

const LeafIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-5 8"
      fill="#40916c" stroke="#d8f3dc" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
    />
    <path d="M3.82 21.34C5 17 7 13 12 11" stroke="#d8f3dc" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const HeartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#40916c" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)

const Footer = () => (
  <footer style={S.footer}>
    <div style={S.inner}>
      <div style={S.top}>
        {}
        <div style={S.brand}>
          <Link to="/" style={S.brandName}>
            <LeafIcon />
            Tomato Leaf Doctor
          </Link>
          <p style={S.brandDesc}>
            AI-powered tomato disease detection for farmers, researchers, and gardeners worldwide.
          </p>
        </div>

        {}
        <div style={S.colGroup}>
          <p style={S.colTitle}>Explore</p>
          <Link to="/" style={S.colLink}>Home</Link>
          <Link to="/predict" style={S.colLink}>Predict</Link>
          <Link to="/education" style={S.colLink}>Education</Link>
          <Link to="/about" style={S.colLink}>About</Link>
        </div>

        {}
        <div style={S.colGroup}>
          <p style={S.colTitle}>Account</p>
          <Link to="/register" style={S.colLink}>Register</Link>
          <Link to="/login" style={S.colLink}>Login</Link>
          <Link to="/history" style={S.colLink}>History</Link>
          <Link to="/compare" style={S.colLink}>Compare</Link>
        </div>

        {}
        <div style={S.colGroup}>
          <p style={S.colTitle}>Support</p>
          <Link to="/contact" style={S.colLink}>Contact Us</Link>
          <Link to="/education" style={S.colLink}>Disease Guide</Link>
          <Link to="/settings" style={S.colLink}>Settings</Link>
        </div>
      </div>

      <div style={S.divider} />

      <div style={S.bottom}>
        <p style={S.copy}>
           2026 Tomato Leaf Doctor. All rights reserved.
        </p>
        <p style={S.dev}>
          Developed with <HeartIcon /> by <span style={S.devName}>Aquiel</span>
        </p>
      </div>
    </div>
  </footer>
)

export default Footer
