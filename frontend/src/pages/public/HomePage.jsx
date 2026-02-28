import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const styles = {
  page: { backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: 'inherit' },
  hero: { backgroundColor: '#f0f7f4', padding: '5rem 1.5rem 4rem', textAlign: 'center' },
  heroBadge: {
    display: 'inline-block', backgroundColor: '#d8f3dc', color: '#2d6a4f',
    fontSize: '0.82rem', fontWeight: '700', letterSpacing: '0.6px',
    textTransform: 'uppercase', borderRadius: '999px', padding: '0.3rem 0.9rem', marginBottom: '1.25rem',
  },
  heroHeading: {
    fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', color: '#1b4332',
    margin: '0 auto 1rem', maxWidth: '680px', lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '1.05rem', color: '#495057', maxWidth: '520px',
    margin: '0 auto 2rem', lineHeight: '1.65',
  },
  heroGreeting: {
    display: 'inline-block', backgroundColor: '#2d6a4f', color: '#ffffff',
    fontSize: '0.9rem', fontWeight: '600', borderRadius: '8px',
    padding: '0.45rem 1rem', marginBottom: '1.5rem',
  },
  heroActions: { display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.7rem 1.5rem', backgroundColor: '#2d6a4f', color: '#fff',
    border: '2px solid #2d6a4f', borderRadius: '8px', fontWeight: '700',
    fontSize: '0.97rem', cursor: 'pointer', textDecoration: 'none', transition: 'opacity 0.2s',
  },
  btnOutline: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.7rem 1.5rem', backgroundColor: 'transparent', color: '#2d6a4f',
    border: '2px solid #2d6a4f', borderRadius: '8px', fontWeight: '700',
    fontSize: '0.97rem', cursor: 'pointer', textDecoration: 'none', transition: 'opacity 0.2s',
  },
  features: { padding: '4.5rem 1.5rem', maxWidth: '1000px', margin: '0 auto' },
  featuresHeading: { textAlign: 'center', fontSize: '1.6rem', fontWeight: '700', color: '#1b4332', marginBottom: '0.5rem' },
  featuresSubtitle: { textAlign: 'center', color: '#6c757d', fontSize: '0.97rem', marginBottom: '2.75rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' },
  card: {
    backgroundColor: '#ffffff', border: '1.5px solid #e9ecef', borderRadius: '12px',
    padding: '2rem 1.5rem', textAlign: 'center',
    boxShadow: '0 2px 12px rgba(45, 106, 79, 0.07)',
  },
  iconWrap: {
    width: '56px', height: '56px', backgroundColor: '#d8f3dc', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.1rem',
  },
  cardTitle: { fontSize: '1.08rem', fontWeight: '700', color: '#1b4332', margin: '0 0 0.5rem' },
  cardDesc: { fontSize: '0.9rem', color: '#6c757d', lineHeight: '1.6', margin: 0 },
  howSection: { backgroundColor: '#f0f7f4', padding: '4rem 1.5rem' },
  howInner: { maxWidth: '860px', margin: '0 auto' },
  howHeading: { textAlign: 'center', fontSize: '1.6rem', fontWeight: '700', color: '#1b4332', marginBottom: '2.5rem' },
  steps: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' },
  step: { textAlign: 'center' },
  stepNum: {
    width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#2d6a4f',
    color: '#fff', fontSize: '1.25rem', fontWeight: '800',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
  },
  stepTitle: { fontSize: '1rem', fontWeight: '700', color: '#1b4332', marginBottom: '0.4rem' },
  stepDesc: { fontSize: '0.88rem', color: '#6b7280', lineHeight: '1.55' },
  diseaseSection: { padding: '4rem 1.5rem', maxWidth: '1000px', margin: '0 auto' },
  diseaseHeading: { textAlign: 'center', fontSize: '1.6rem', fontWeight: '700', color: '#1b4332', marginBottom: '0.5rem' },
  diseaseSub: { textAlign: 'center', color: '#6c757d', fontSize: '0.93rem', marginBottom: '2rem' },
  diseasePills: { display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' },
  pill: {
    backgroundColor: '#f0f7f4', border: '1px solid #b7dfc9', color: '#1b4332',
    borderRadius: '999px', padding: '0.35rem 0.9rem', fontSize: '0.83rem', fontWeight: '600',
  },
  cta: { backgroundColor: '#2d6a4f', padding: '3.5rem 1.5rem', textAlign: 'center' },
  ctaHeading: { fontSize: '1.6rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.75rem' },
  ctaSubtitle: { color: '#b7e4c7', fontSize: '0.97rem', margin: '0 0 1.75rem' },
  btnOutlineWhite: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.7rem 1.5rem', backgroundColor: 'transparent', color: '#fff',
    border: '2px solid #fff', borderRadius: '8px', fontWeight: '700',
    fontSize: '0.97rem', cursor: 'pointer', textDecoration: 'none',
  },
}

const DISEASE_CLASSES = [
  'Bacterial Spot', 'Early Blight', 'Late Blight', 'Leaf Mold',
  'Septoria Leaf Spot', 'Spider Mites', 'Target Spot',
  'Yellow Leaf Curl Virus', 'Mosaic Virus', 'Healthy',
]

const features = [
  {
    title: 'AI Powered Detection',
    description: 'Deep learning CNN model trained on thousands of real tomato leaf images for accurate disease identification.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#2d6a4f" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#2d6a4f" opacity="0.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#2d6a4f" opacity="0.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#2d6a4f" opacity="0.7" />
        <circle cx="12" cy="12" r="2.5" fill="#2d6a4f" />
      </svg>
    ),
  },
  {
    title: '10 Disease Classes',
    description: 'Detects 9 distinct tomato diseases plus healthy classification with confidence scoring.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-5 8" fill="#2d6a4f" />
        <path d="M3.82 21.34C5 17 7 13 12 11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Instant Results',
    description: 'Upload a photo and receive a diagnosis in seconds, complete with treatment recommendations.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#2d6a4f" strokeWidth="2" />
        <path d="M12 7v5l3 3" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Prediction History',
    description: 'All your past diagnoses saved in one place. Track your crop health over time with ease.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#2d6a4f" strokeWidth="2" />
        <path d="M3 9h18M9 21V9" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

const HomePage = () => {
  const { user } = useAuth()
  return (
    <div style={styles.page}>
      {}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>AI-Powered Plant Health</div>
        {user && <div style={styles.heroGreeting}>Welcome back, {user.name || user.email}!</div>}
        <h1 style={styles.heroHeading}>Diagnose Your Tomato Leaves Instantly</h1>
        <p style={styles.heroSubtitle}>
          Upload a photo of your tomato plant and our AI model will identify diseases in seconds --
          so you can act fast and save your harvest.
        </p>
        <div style={styles.heroActions}>
          <Link to="/predict" style={styles.btnPrimary}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Start Diagnosis
          </Link>
          {!user && (
            <Link to="/register" style={styles.btnOutline}>
              Create Free Account
            </Link>
          )}
          {user && (
            <Link to="/history" style={styles.btnOutline}>
              View My History
            </Link>
          )}
        </div>
      </section>

      {}
      <section style={styles.features}>
        <h2 style={styles.featuresHeading}>Why TomatoAI?</h2>
        <p style={styles.featuresSubtitle}>Everything you need to keep your tomato plants healthy</p>
        <div style={styles.grid}>
          {features.map((f) => (
            <div key={f.title} style={styles.card}>
              <div style={styles.iconWrap}>{f.icon}</div>
              <h3 style={styles.cardTitle}>{f.title}</h3>
              <p style={styles.cardDesc}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {}
      <section style={styles.howSection}>
        <div style={styles.howInner}>
          <h2 style={styles.howHeading}>How It Works</h2>
          <div style={styles.steps}>
            {[
              { n: '1', title: 'Upload a Photo', desc: 'Take a clear photo of your tomato leaf and upload it to the app.' },
              { n: '2', title: 'AI Analysis', desc: 'Our CNN model analyses the image and identifies any disease patterns.' },
              { n: '3', title: 'Get Results', desc: 'Receive an instant diagnosis with confidence score and treatment advice.' },
              { n: '4', title: 'Take Action', desc: 'Follow the recommended treatment to protect your crop and save your harvest.' },
            ].map((s) => (
              <div key={s.n} style={styles.step}>
                <div style={styles.stepNum}>{s.n}</div>
                <h3 style={styles.stepTitle}>{s.title}</h3>
                <p style={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section style={styles.diseaseSection}>
        <h2 style={styles.diseaseHeading}>Detectable Conditions</h2>
        <p style={styles.diseaseSub}>Our model can identify the following tomato leaf conditions</p>
        <div style={styles.diseasePills}>
          {DISEASE_CLASSES.map((d) => (
            <span key={d} style={d === 'Healthy' ? { ...styles.pill, backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' } : styles.pill}>
              {d}
            </span>
          ))}
        </div>
      </section>

      {}
      {!user && (
        <section style={styles.cta}>
          <h2 style={styles.ctaHeading}>Ready to protect your harvest?</h2>
          <p style={styles.ctaSubtitle}>Create a free account and start diagnosing your tomato plants today.</p>
          <Link to="/register" style={styles.btnOutlineWhite}>Get Started for Free</Link>
        </section>
      )}
    </div>
  )
}

export default HomePage
