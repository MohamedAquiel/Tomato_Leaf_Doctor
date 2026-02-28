import { Link } from 'react-router-dom'

const styles = {
  page: {
    minHeight: 'calc(100vh - 60px)', backgroundColor: '#f0f7f4',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem 1.5rem', textAlign: 'center',
  },
  inner: { maxWidth: '480px' },
  code: { fontSize: '6rem', fontWeight: '800', color: '#2d6a4f', lineHeight: 1, margin: '0 0 0.5rem' },
  title: { fontSize: '1.5rem', fontWeight: '700', color: '#1b4332', margin: '0 0 0.75rem' },
  desc: { color: '#6b7280', fontSize: '0.97rem', margin: '0 0 2rem', lineHeight: '1.6' },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.7rem 1.5rem', backgroundColor: '#2d6a4f', color: '#fff',
    border: '2px solid #2d6a4f', borderRadius: '8px', fontWeight: '700',
    fontSize: '0.97rem', textDecoration: 'none',
  },
}

const NotFoundPage = () => (
  <div style={styles.page}>
    <div style={styles.inner}>
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 1.5rem', display: 'block' }}>
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-5 8" fill="#b7dfc9" />
        <path d="M3.82 21.34C5 17 7 13 12 11" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div style={styles.code}>404</div>
      <h1 style={styles.title}>Page Not Found</h1>
      <p style={styles.desc}>
        The page you are looking for does not exist or has been moved.
        Let&apos;s get you back on track.
      </p>
      <Link to="/" style={styles.btnPrimary}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Back to Home
      </Link>
    </div>
  </div>
)

export default NotFoundPage
