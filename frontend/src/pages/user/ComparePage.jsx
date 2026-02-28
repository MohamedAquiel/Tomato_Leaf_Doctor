import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyPredictions } from '../../api/predictions'
import SolutionPanel from '../../components/SolutionPanel'

const S = {
  page: { minHeight: 'calc(100vh - 60px)', background: '#f8faf8', padding: '2rem 1rem' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  header: { marginBottom: '2rem' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#2d6a4f', margin: '0 0 0.35rem' },
  subtitle: { color: '#6b7280', fontSize: '0.95rem', margin: 0 },
  selectRow: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'start', marginBottom: '2rem' },
  panel: { background: '#fff', borderRadius: '14px', boxShadow: '0 2px 14px rgba(0,0,0,0.08)', padding: '1.5rem' },
  panelTitle: { fontSize: '0.8rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' },
  select: { width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '0.92rem', color: '#1a1a1a', background: '#fff', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' },
  vsCircle: { width: '44px', height: '44px', borderRadius: '50%', background: '#2d6a4f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem', flexShrink: 0, marginTop: '2rem', justifySelf: 'center' },
  compareGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  resultCard: { background: '#fff', borderRadius: '14px', boxShadow: '0 2px 14px rgba(0,0,0,0.08)', overflow: 'hidden' },
  thumb: { width: '100%', height: '200px', objectFit: 'cover' },
  thumbPlaceholder: { width: '100%', height: '200px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: '1.25rem' },
  diseaseName: { fontSize: '1.15rem', fontWeight: '700', color: '#1a1a1a', margin: '0 0 0.65rem' },
  badgeRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' },
  badgeHealthy: { background: '#d1fae5', color: '#065f46', borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.78rem', fontWeight: '700' },
  badgeDiseased: { background: '#fee2e2', color: '#b91c1c', borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.78rem', fontWeight: '700' },
  metaRow: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' },
  metaItem: { display: 'flex', justifyContent: 'space-between', fontSize: '0.87rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.4rem' },
  metaLabel: { color: '#6b7280', fontWeight: '600' },
  metaValue: { color: '#1a1a1a', fontWeight: '500', textAlign: 'right' },
  progressWrap: { marginBottom: '1rem' },
  progressLabel: { fontSize: '0.82rem', color: '#6b7280', marginBottom: '0.3rem' },
  progressBar: { background: '#e5e7eb', borderRadius: '999px', height: '8px', overflow: 'hidden' },
  diffBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '700' },
  sectionLabel: { fontSize: '0.88rem', fontWeight: '700', color: '#2d6a4f', margin: '1.25rem 0 0.6rem', textTransform: 'uppercase', letterSpacing: '0.4px' },
  emptyWrap: { textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' },
  errorBox: { background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.92rem' },
  emptyBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#9ca3af', fontSize: '0.88rem', gap: '0.5rem', background: '#f8faf8', borderRadius: '10px', border: '2px dashed #d1d5db' },
  summaryBar: { background: '#fff', borderRadius: '14px', boxShadow: '0 2px 14px rgba(0,0,0,0.08)', padding: '1.5rem', marginBottom: '2rem' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' },
  summaryItem: { textAlign: 'center', padding: '0.75rem', borderRadius: '10px', background: '#f8faf8' },
  summaryVal: { fontSize: '1.3rem', fontWeight: '800', color: '#2d6a4f' },
  summaryLbl: { fontSize: '0.78rem', color: '#6b7280', marginTop: '0.2rem' },
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--'

const getImageSrc = (url) => {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('/')) return url
  return `/uploads/${url}`
}

const PredCard = ({ pred, label }) => {
  if (!pred) return (
    <div style={S.resultCard}>
      <div style={S.emptyBox}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>
        Select a prediction above
      </div>
    </div>
  )
  const isHealthy = pred.isHealthy ?? pred.disease?.isHealthy ?? false
  const displayName = pred.displayName || pred.disease?.displayName || pred.diseaseKey || 'Unknown'
  const confidence = pred.confidence ?? pred.disease?.confidence ?? 0
  const solution = pred.solution || pred.disease?.solution || null
  const imgSrc = getImageSrc(pred.imageUrl)
  return (
    <div style={S.resultCard}>
      {imgSrc
        ? <img src={imgSrc} alt={displayName} style={S.thumb} onError={e => e.target.style.display='none'} />
        : <div style={S.thumbPlaceholder}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
      }
      <div style={S.cardBody}>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>{label}</div>
        <h3 style={S.diseaseName}>{displayName}</h3>
        <div style={S.badgeRow}>
          <span style={isHealthy ? S.badgeHealthy : S.badgeDiseased}>{isHealthy ? '[OK] Healthy' : '[!] Disease Detected'}</span>
        </div>
        <div style={S.metaRow}>
          <div style={S.metaItem}><span style={S.metaLabel}>Date</span><span style={S.metaValue}>{formatDate(pred.createdAt)}</span></div>
          <div style={S.metaItem}><span style={S.metaLabel}>Status</span><span style={S.metaValue}>{isHealthy ? 'Healthy' : 'Diseased'}</span></div>
        </div>
        <div style={S.progressWrap}>
          <p style={S.progressLabel}>Confidence: <strong>{typeof confidence === 'number' ? confidence.toFixed(1) : confidence}%</strong></p>
          <div style={S.progressBar}>
            <div style={{ height: '100%', width: `${Math.min(100, Number(confidence) || 0)}%`, background: isHealthy ? '#2d6a4f' : '#dc2626', borderRadius: '999px', transition: 'width 0.6s ease' }} />
          </div>
        </div>
        {solution && <SolutionPanel solution={solution} compact />}
      </div>
    </div>
  )
}

const ComparePage = () => {
  const [allPredictions, setAllPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [leftId, setLeftId] = useState('')
  const [rightId, setRightId] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyPredictions({ page: 1, limit: 100 })
        const data = res.data || res
        setAllPredictions(data.predictions || data.data || (Array.isArray(data) ? data : []))
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load predictions.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const left = allPredictions.find(p => (p._id || p.id) === leftId) || null
  const right = allPredictions.find(p => (p._id || p.id) === rightId) || null

  const leftConf = left ? (left.confidence ?? left.disease?.confidence ?? 0) : null
  const rightConf = right ? (right.confidence ?? right.disease?.confidence ?? 0) : null
  const confDiff = leftConf !== null && rightConf !== null ? Math.abs(leftConf - rightConf).toFixed(1) : null
  const leftHealthy = left ? (left.isHealthy ?? left.disease?.isHealthy ?? false) : null
  const rightHealthy = right ? (right.isHealthy ?? right.disease?.isHealthy ?? false) : null

  const options = allPredictions.map(p => ({
    id: p._id || p.id,
    label: `${p.displayName || p.disease?.displayName || p.diseaseKey || 'Unknown'} -- ${formatDate(p.createdAt)}`,
  }))

  if (loading) return (
    <div style={S.page}>
      <div style={S.container}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        <div style={{ background: '#e5e7eb', borderRadius: '12px', height: '300px', animation: 'pulse 1.4s ease-in-out infinite' }} />
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <h1 style={S.title}>Compare Predictions</h1>
          <p style={S.subtitle}>Select two predictions from your history to compare results side by side.</p>
        </div>

        {error && <div style={S.errorBox}>{error}</div>}

        {allPredictions.length < 2 ? (
          <div style={S.emptyWrap}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#b7dfc9" strokeWidth="1.2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>
            <p style={{ fontWeight: '700', color: '#374151', fontSize: '1.1rem', marginTop: '1rem' }}>Not enough predictions to compare</p>
            <p>You need at least 2 predictions. <Link to="/predict" style={{ color: '#2d6a4f', fontWeight: '700' }}>Get a diagnosis</Link></p>
          </div>
        ) : (
          <>
            {}
            <div style={S.selectRow}>
              <div>
                <p style={S.panelTitle}>Prediction A</p>
                <select style={S.select} value={leftId} onChange={e => setLeftId(e.target.value)}>
                  <option value="">-- Select prediction --</option>
                  {options.filter(o => o.id !== rightId).map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
              </div>
              <div style={S.vsCircle}>VS</div>
              <div>
                <p style={S.panelTitle}>Prediction B</p>
                <select style={S.select} value={rightId} onChange={e => setRightId(e.target.value)}>
                  <option value="">-- Select prediction --</option>
                  {options.filter(o => o.id !== leftId).map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {}
            {left && right && (
              <div style={S.summaryBar}>
                <div style={S.summaryGrid}>
                  <div style={S.summaryItem}>
                    <div style={S.summaryVal}>{confDiff}%</div>
                    <div style={S.summaryLbl}>Confidence Difference</div>
                  </div>
                  <div style={S.summaryItem}>
                    <div style={{ ...S.summaryVal, color: leftHealthy === rightHealthy ? '#2d6a4f' : '#dc2626' }}>
                      {leftHealthy === rightHealthy ? 'Same' : 'Different'}
                    </div>
                    <div style={S.summaryLbl}>Health Status</div>
                  </div>
                  <div style={S.summaryItem}>
                    <div style={{ ...S.summaryVal, color: Number(leftConf) > Number(rightConf) ? '#2d6a4f' : '#6b7280' }}>A {Number(leftConf) >= Number(rightConf) ? '>' : '<'} B</div>
                    <div style={S.summaryLbl}>Higher Confidence</div>
                  </div>
                  <div style={S.summaryItem}>
                    <div style={{ ...S.summaryVal, fontSize: '0.95rem' }}>
                      {(left.displayName || left.disease?.displayName || left.diseaseKey || '') === (right.displayName || right.disease?.displayName || right.diseaseKey || '') ? 'Same Disease' : 'Different Disease'}
                    </div>
                    <div style={S.summaryLbl}>Diagnosis Match</div>
                  </div>
                </div>
              </div>
            )}

            {}
            <div style={S.compareGrid}>
              <PredCard pred={left} label="Prediction A" />
              <PredCard pred={right} label="Prediction B" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ComparePage
