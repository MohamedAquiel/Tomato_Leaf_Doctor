
const styles = {
  wrap: {
    background: '#f0f7f4', border: '1px solid #b7dfc9', borderRadius: '10px',
    padding: '1.25rem 1.4rem', color: '#1b4332', fontSize: '0.93rem', lineHeight: '1.7',
    marginTop: '0.75rem',
  },
  header: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' },
  headerTitle: { fontWeight: '700', fontSize: '1rem', color: '#2d6a4f', margin: 0 },
  severityBadge: (sev) => ({
    display: 'inline-block', borderRadius: '999px', padding: '0.15rem 0.75rem',
    fontSize: '0.75rem', fontWeight: '700',
    background: sev === 'High' ? '#fee2e2' : sev === 'Medium' ? '#fef3c7' : '#d1fae5',
    color: sev === 'High' ? '#b91c1c' : sev === 'Medium' ? '#92400e' : '#065f46',
  }),
  description: { marginBottom: '1rem', color: '#374151', lineHeight: '1.7', margin: '0 0 1rem 0' },
  section: { marginBottom: '0.9rem' },
  sectionTitle: {
    fontWeight: '700', fontSize: '0.82rem', textTransform: 'uppercase',
    letterSpacing: '0.05em', color: '#2d6a4f', marginBottom: '0.35rem',
    display: 'flex', alignItems: 'center', gap: '0.4rem',
  },
  list: { margin: '0', paddingLeft: '1.25rem' },
  listItem: { marginBottom: '0.25rem', color: '#374151' },
  divider: { border: 'none', borderTop: '1px solid #b7dfc9', margin: '0.75rem 0' },
  recovery: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px',
    padding: '0.5rem 0.75rem', fontSize: '0.83rem', color: '#92400e', marginTop: '0.5rem',
  },
}

const Section = ({ icon, title, items }) => {
  if (!items || items.length === 0) return null
  return (
    <div style={styles.section}>
      <p style={styles.sectionTitle}>
        {icon}
        {title}
      </p>
      <ul style={styles.list}>
        {items.map((item, i) => (
          <li key={i} style={styles.listItem}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

const SolutionPanel = ({ solution, compact = false }) => {
  if (!solution) return null
  if (typeof solution === 'string') {
    return <div style={styles.wrap}><p style={{ margin: 0 }}>{solution}</p></div>
  }
  const {
    display_name, scientific_name, severity, description,
    symptoms, immediate_actions, chemical_treatment,
    organic_treatment, prevention, recovery_time,
  } = solution

  if (compact) {
    return (
      <div style={{ ...styles.wrap, padding: '0.9rem 1rem', fontSize: '0.84rem' }}>
        {severity && <span style={styles.severityBadge(severity)}>{severity} Severity</span>}
        {description && <p style={{ ...styles.description, marginTop: '0.5rem', fontSize: '0.84rem' }}>{description}</p>}
        <Section
          icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>}
          title="Immediate Actions"
          items={immediate_actions}
        />
      </div>
    )
  }

  return (
    <div style={styles.wrap}>
      {}
      <div style={styles.header}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p style={styles.headerTitle}>
          {display_name || 'Treatment Plan'}
          {scientific_name && <span style={{ fontWeight: '400', fontSize: '0.82rem', color: '#6b7280', fontStyle: 'italic', marginLeft: '0.4rem' }}>({scientific_name})</span>}
        </p>
        {severity && <span style={styles.severityBadge(severity)}>{severity} Severity</span>}
      </div>

      {}
      {description && <p style={styles.description}>{description}</p>}

      <hr style={styles.divider} />

      {}
      <Section
        icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
        title="Symptoms"
        items={symptoms}
      />

      {}
      <Section
        icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
        title="Immediate Actions"
        items={immediate_actions}
      />

      <hr style={styles.divider} />

      {}
      <Section
        icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>}
        title="Chemical Treatment"
        items={chemical_treatment}
      />

      {}
      <Section
        icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22V12M12 12C12 12 7 9 7 4a5 5 0 0110 0c0 5-5 8-5 8z" /></svg>}
        title="Organic Treatment"
        items={organic_treatment}
      />

      <hr style={styles.divider} />

      {}
      <Section
        icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
        title="Prevention"
        items={prevention}
      />

      {}
      {recovery_time && (
        <div style={styles.recovery}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <span><strong>Recovery Time:</strong> {recovery_time}</span>
        </div>
      )}
    </div>
  )
}

export default SolutionPanel
