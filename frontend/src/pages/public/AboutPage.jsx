import { Link } from 'react-router-dom'

const S = {
  page: { background: '#fff', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #40916c 100%)', padding: '5rem 1.5rem 4rem', textAlign: 'center', color: '#fff' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#d8f3dc', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.7px', borderRadius: '999px', padding: '0.3rem 1rem', marginBottom: '1.25rem' },
  heroH: { fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: '800', margin: '0 0 1rem', lineHeight: 1.15 },
  heroP: { color: '#b7e4c7', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 },
  section: { maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem' },
  sectionH: { fontSize: '1.7rem', fontWeight: '700', color: '#1b4332', marginBottom: '0.5rem' },
  sectionSub: { color: '#6b7280', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 },
  divider: { height: '1px', background: '#e9ecef', margin: '0' },
  missionBox: { background: '#f0f7f4', borderRadius: '16px', padding: '2.5rem', borderLeft: '4px solid #2d6a4f', marginBottom: '2rem' },
  missionText: { fontSize: '1.08rem', color: '#2d4a3e', lineHeight: '1.8', margin: 0, fontStyle: 'italic' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '1.5rem' },
  stepCard: { background: '#fff', border: '1.5px solid #e5ede9', borderRadius: '14px', padding: '1.75rem', textAlign: 'center' },
  stepNum: { width: '44px', height: '44px', background: '#d8f3dc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.1rem', fontWeight: '800', color: '#2d6a4f' },
  stepTitle: { fontSize: '1rem', fontWeight: '700', color: '#1b4332', marginBottom: '0.5rem' },
  stepText: { fontSize: '0.87rem', color: '#6b7280', lineHeight: '1.65', margin: 0 },
  techGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1rem' },
  techCard: { background: '#f8faf9', border: '1.5px solid #e5ede9', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' },
  techLabel: { fontSize: '0.78rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' },
  techValue: { fontSize: '0.97rem', fontWeight: '700', color: '#1b4332' },
  teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '1.25rem' },
  teamCard: { background: '#fff', border: '1.5px solid #e5ede9', borderRadius: '14px', padding: '1.75rem', textAlign: 'center' },
  avatar: { width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg,#2d6a4f,#40916c)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.3rem', fontWeight: '800' },
  teamName: { fontSize: '1rem', fontWeight: '700', color: '#1b4332', margin: '0 0 0.2rem' },
  teamRole: { fontSize: '0.82rem', color: '#6b7280', margin: 0 },
  statsBand: { background: '#2d6a4f', padding: '3.5rem 1.5rem' },
  statsInner: { maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '2rem', textAlign: 'center' },
  statNum: { fontSize: '2.2rem', fontWeight: '800', color: '#fff', margin: '0 0 0.3rem' },
  statLbl: { fontSize: '0.88rem', color: '#b7e4c7', fontWeight: '500' },
  ctaSection: { background: '#f0f7f4', padding: '4rem 1.5rem', textAlign: 'center' },
  ctaH: { fontSize: '1.6rem', fontWeight: '700', color: '#1b4332', marginBottom: '0.6rem' },
  ctaP: { color: '#6b7280', fontSize: '0.95rem', marginBottom: '1.75rem' },
  ctaBtnRow: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: '#2d6a4f', color: '#fff', borderRadius: '9px', fontWeight: '700', fontSize: '0.97rem', textDecoration: 'none', border: 'none', cursor: 'pointer' },
  btnSecondary: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: '#fff', color: '#2d6a4f', borderRadius: '9px', fontWeight: '700', fontSize: '0.97rem', textDecoration: 'none', border: '2px solid #2d6a4f', cursor: 'pointer' },
}

const TECH_STACK = [
  { label: 'Frontend', value: 'React + Vite' },
  { label: 'Backend', value: 'Node.js + Express' },
  { label: 'Database', value: 'MongoDB' },
  { label: 'ML Framework', value: 'TensorFlow / Keras' },
  { label: 'Model Type', value: 'CNN (Custom)' },
  { label: 'Image Input', value: '128 x 128 px' },
  { label: 'Disease Classes', value: '10 Classes' },
  { label: 'ML Service', value: 'FastAPI (Python)' },
]

const STEPS = [
  { n: '1', title: 'Upload a Photo', text: 'Take a clear photo of the affected tomato leaf and upload it through the prediction tool.' },
  { n: '2', title: 'AI Analyses It', text: 'Our CNN model processes the image in milliseconds and identifies the disease with a confidence score.' },
  { n: '3', title: 'Get Your Diagnosis', text: 'Receive a detailed result with disease name, confidence level, and treatment recommendations.' },
  { n: '4', title: 'Take Action', text: 'Follow the organic or chemical treatment guide and monitor your plant\'s recovery.' },
]

const TEAM = [
  { name: 'ML Engineer', role: 'CNN Model Development & Training', initial: 'ML' },
  { name: 'Backend Dev', role: 'REST API & Database Architecture', initial: 'BE' },
  { name: 'Frontend Dev', role: 'React UI & User Experience', initial: 'FE' },
  { name: 'Agronomist', role: 'Disease Knowledge & Solutions', initial: 'AG' },
]

const AboutPage = () => (
  <div style={S.page}>
    {}
    <section style={S.hero}>
      <div style={S.heroBadge}>About Us</div>
      <h1 style={S.heroH}>Protecting Tomato Crops<br />with Artificial Intelligence</h1>
      <p style={S.heroP}>
        Tomato Leaf Doctor is an open-source AI-powered platform that helps farmers, researchers,
        and gardeners detect and treat tomato diseases instantly -- at zero cost.
      </p>
    </section>

    {}
    <section style={S.section}>
      <h2 style={S.sectionH}>Our Mission</h2>
      <p style={S.sectionSub}>Why we built this, and what drives us forward.</p>
      <div style={S.missionBox}>
        <p style={S.missionText}>
          "Tomato is one of the world's most consumed vegetables, yet crop losses from fungal, bacterial,
          and viral diseases cause billions in economic damage annually -- especially for smallholder farmers
          who lack access to agricultural experts. We built Tomato Leaf Doctor to put the power of AI-based
          disease detection directly into every farmer's hands, for free."
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.25rem' }}>
        {[
          { title: 'Accessibility First', text: 'No agricultural degree needed. Upload a photo and get a diagnosis in seconds -- works on any device.' },
          { title: 'Science-Backed', text: 'Treatment recommendations are sourced from peer-reviewed agricultural research and expert agronomists.' },
          { title: 'Open & Free', text: 'Basic prediction is free for everyone, registered or not. No paywalls for essential disease information.' },
        ].map(c => (
          <div key={c.title} style={{ background: '#f8faf9', border: '1.5px solid #e5ede9', borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2d6a4f', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1b4332', marginBottom: '0.4rem' }}>{c.title}</h3>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', lineHeight: '1.65', margin: 0 }}>{c.text}</p>
          </div>
        ))}
      </div>
    </section>

    <div style={S.divider} />

    {}
    <section style={S.section}>
      <h2 style={S.sectionH}>How It Works</h2>
      <p style={S.sectionSub}>Four simple steps from photo to treatment plan.</p>
      <div style={S.stepsGrid}>
        {STEPS.map(s => (
          <div key={s.n} style={S.stepCard}>
            <div style={S.stepNum}>{s.n}</div>
            <h3 style={S.stepTitle}>{s.title}</h3>
            <p style={S.stepText}>{s.text}</p>
          </div>
        ))}
      </div>
    </section>

    <div style={S.divider} />

    {}
    <section style={S.statsBand}>
      <div style={S.statsInner}>
        {[
          { n: '10', l: 'Disease Classes Detected' },
          { n: '128px', l: 'Model Input Resolution' },
          { n: 'CNN', l: 'Deep Learning Architecture' },
          { n: '< 2s', l: 'Average Inference Time' },
        ].map(s => (
          <div key={s.l}>
            <div style={S.statNum}>{s.n}</div>
            <div style={S.statLbl}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>

    {}
    <section style={S.section}>
      <h2 style={S.sectionH}>Technology Stack</h2>
      <p style={S.sectionSub}>Built with modern, battle-tested technologies from frontend to ML inference.</p>
      <div style={S.techGrid}>
        {TECH_STACK.map(t => (
          <div key={t.label} style={S.techCard}>
            <p style={S.techLabel}>{t.label}</p>
            <p style={S.techValue}>{t.value}</p>
          </div>
        ))}
      </div>
    </section>

    <div style={S.divider} />

    {}
    <section style={S.section}>
      <h2 style={S.sectionH}>The Team</h2>
      <p style={S.sectionSub}>A multidisciplinary team of engineers and agricultural scientists.</p>
      <div style={S.teamGrid}>
        {TEAM.map(t => (
          <div key={t.name} style={S.teamCard}>
            <div style={S.avatar}>{t.initial}</div>
            <p style={S.teamName}>{t.name}</p>
            <p style={S.teamRole}>{t.role}</p>
          </div>
        ))}
      </div>
    </section>

    {}
    <section style={S.ctaSection}>
      <h2 style={S.ctaH}>Ready to diagnose your plants?</h2>
      <p style={S.ctaP}>Upload a leaf photo and get an AI diagnosis in under 2 seconds -- completely free.</p>
      <div style={S.ctaBtnRow}>
        <Link to="/predict" style={S.btnPrimary}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Start Free Diagnosis
        </Link>
        <Link to="/contact" style={S.btnSecondary}>Contact Us</Link>
      </div>
    </section>
  </div>
)

export default AboutPage
