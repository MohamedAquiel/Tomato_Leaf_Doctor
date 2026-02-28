import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyPredictions, deletePrediction, updateNotes } from '../../api/predictions'
import TreatmentModal from '../../components/TreatmentModal'

const styles = {
  page: { minHeight: 'calc(100vh - 60px)', background: '#f8faf8', padding: '2rem 1rem' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#2d6a4f' },
  countBadge: { background: '#d1fae5', color: '#065f46', borderRadius: '999px', padding: '0.25rem 0.85rem', fontSize: '0.85rem', fontWeight: '700' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' },
  skeletonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' },
  skeletonCard: { background: '#e5e7eb', borderRadius: '12px', height: '290px', animation: 'pulse 1.4s ease-in-out infinite' },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  thumbnail: { width: '100%', height: '170px', objectFit: 'cover' },
  thumbnailPlaceholder: { width: '100%', height: '170px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.85rem' },
  cardBody: { padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  cardTitle: { fontSize: '1rem', fontWeight: '700', color: '#1a1a1a', margin: 0 },
  badgeRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  badgeHealthy: { background: '#d1fae5', color: '#065f46', borderRadius: '999px', padding: '0.15rem 0.65rem', fontSize: '0.75rem', fontWeight: '700' },
  badgeDiseased: { background: '#fee2e2', color: '#b91c1c', borderRadius: '999px', padding: '0.15rem 0.65rem', fontSize: '0.75rem', fontWeight: '700' },
  confidenceBadge: { background: '#f3f4f6', color: '#374151', borderRadius: '999px', padding: '0.15rem 0.65rem', fontSize: '0.75rem', fontWeight: '600' },
  dateText: { fontSize: '0.8rem', color: '#9ca3af' },
  cardActions: { display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' },
  actionBtn: { flex: 1, padding: '0.4rem 0.5rem', background: '#f0f7f4', color: '#2d6a4f', border: '1px solid #b7dfc9', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' },
  deleteBtn: { padding: '0.4rem 0.75rem', background: '#fff0f0', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' },
  solutionBox: { background: '#f0f7f4', border: '1px solid #b7dfc9', borderRadius: '6px', padding: '0.65rem 0.85rem', fontSize: '0.82rem', color: '#1b4332', lineHeight: '1.6', marginTop: '0.35rem' },
  notesArea: { width: '100%', minHeight: '70px', border: '1.5px solid #d1d5db', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.83rem', resize: 'vertical', fontFamily: 'inherit', outline: 'none', marginTop: '0.4rem', boxSizing: 'border-box' },
  saveNoteBtn: { padding: '0.35rem 0.85rem', background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.35rem' },
  emptyWrap: { textAlign: 'center', padding: '4rem 1rem', color: '#6b7280' },
  emptyTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#374151', marginTop: '1rem', marginBottom: '0.5rem' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' },
  pageBtn: { padding: '0.5rem 1.25rem', background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' },
  pageBtnDisabled: { background: '#d1d5db', color: '#9ca3af', cursor: 'not-allowed' },
  pageInfo: { fontSize: '0.9rem', color: '#6b7280' },
  errorBox: { background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.92rem' },
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

const EmptyState = () => (
  <div style={styles.emptyWrap}>
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#b7dfc9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" />
    </svg>
    <p style={styles.emptyTitle}>No predictions yet</p>
    <p>Upload a tomato leaf image to get your first diagnosis.</p>
    <Link to="/predict" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.6rem 1.25rem', background: '#2d6a4f', color: '#fff', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem' }}>
      Start Diagnosis
    </Link>
  </div>
)

const HistoryPage = () => {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [modalData, setModalData] = useState(null)
  const [showNotes, setShowNotes] = useState({})
  const [notes, setNotes] = useState({})
  const [savingNotes, setSavingNotes] = useState({})
  const [deleting, setDeleting] = useState({})
  const limit = 12

  const fetchPredictions = async (p = 1) => {
    setLoading(true); setError('')
    try {
      const res = await getMyPredictions({ page: p, limit })
      setPredictions(Array.isArray(res.data) ? res.data : [])
      setTotalPages(res.pages || 1)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load predictions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPredictions(page) }, [page])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prediction? This cannot be undone.')) return
    setDeleting((p) => ({ ...p, [id]: true }))
    try {
      await deletePrediction(id)
      setPredictions((p) => p.filter((x) => (x._id || x.id) !== id))
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed.')
    } finally {
      setDeleting((p) => ({ ...p, [id]: false }))
    }
  }

  const handleSaveNotes = async (id) => {
    setSavingNotes((p) => ({ ...p, [id]: true }))
    try {
      await updateNotes(id, notes[id] || '')
      setShowNotes((p) => ({ ...p, [id]: false }))
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to save notes.')
    } finally {
      setSavingNotes((p) => ({ ...p, [id]: false }))
    }
  }

  const getImageSrc = (url) => {
    if (!url) return null
    if (url.startsWith('http') || url.startsWith('/')) return url
    return `/uploads/${url}`
  }

  return (
    <div style={styles.page}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Predictions</h1>
          {!loading && predictions.length > 0 && (
            <span style={styles.countBadge}>{predictions.length} result{predictions.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {}
        {modalData && (
          <TreatmentModal
            solution={modalData.solution}
            diseaseName={modalData.diseaseName}
            onClose={() => setModalData(null)}
          />
        )}

        {error && <div style={styles.errorBox}>{error}</div>}

        {loading ? (
          <div style={styles.skeletonGrid}>
            {Array.from({ length: 6 }).map((_, i) => <div key={i} style={styles.skeletonCard} />)}
          </div>
        ) : predictions.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div style={styles.grid}>
              {predictions.map((pred) => {
                const id = pred._id || pred.id
                const isHealthy = pred.isHealthy ?? pred.disease?.isHealthy ?? false
                const displayName = pred.displayName || pred.disease?.displayName || pred.diseaseKey || 'Unknown'
                const confidence = pred.confidence ?? pred.disease?.confidence ?? 0
                const solution = pred.solution || pred.disease?.solution || ''
                const imgSrc = getImageSrc(pred.imageUrl)

                return (
                  <div key={id} style={styles.card}>
                    {imgSrc
                      ? <img src={imgSrc} alt={displayName} style={styles.thumbnail} onError={(e) => { e.target.style.display = 'none' }} />
                      : <div style={styles.thumbnailPlaceholder}>No image</div>
                    }
                    <div style={styles.cardBody}>
                      <p style={styles.cardTitle}>{displayName}</p>
                      <div style={styles.badgeRow}>
                        <span style={isHealthy ? styles.badgeHealthy : styles.badgeDiseased}>
                          {isHealthy ? '[OK] Healthy' : '[!] Diseased'}
                        </span>
                        <span style={styles.confidenceBadge}>{typeof confidence === 'number' ? confidence.toFixed(1) : confidence}%</span>
                      </div>
                      <p style={styles.dateText}>{formatDate(pred.createdAt)}</p>

                      <div style={styles.cardActions}>
                        {solution && (
                          <button style={styles.actionBtn} onClick={() => setModalData({ solution, diseaseName: displayName })}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            Treatment
                          </button>
                        )}
                        <button style={styles.actionBtn} onClick={() => { setShowNotes((p) => ({ ...p, [id]: !p[id] })); if (!notes[id]) setNotes((p) => ({ ...p, [id]: pred.notes || '' })) }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          Notes
                        </button>
                        <button style={{ ...styles.deleteBtn, opacity: deleting[id] ? 0.6 : 1 }} onClick={() => handleDelete(id)} disabled={deleting[id]}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
                          {deleting[id] ? '...' : 'Delete'}
                        </button>
                      </div>

                      {showNotes[id] && (
                        <div>
                          <textarea
                            style={styles.notesArea}
                            placeholder="Add notes about this diagnosis..."
                            value={notes[id] || ''}
                            onChange={(e) => setNotes((p) => ({ ...p, [id]: e.target.value }))}
                            onFocus={(e) => (e.target.style.borderColor = '#2d6a4f')}
                            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                          />
                          <button style={{ ...styles.saveNoteBtn, opacity: savingNotes[id] ? 0.6 : 1 }}
                            onClick={() => handleSaveNotes(id)} disabled={savingNotes[id]}>
                            {savingNotes[id] ? 'Saving...' : 'Save Note'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button style={{ ...styles.pageBtn, ...(page <= 1 ? styles.pageBtnDisabled : {}) }}
                  onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}> Prev</button>
                <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
                <button style={{ ...styles.pageBtn, ...(page >= totalPages ? styles.pageBtnDisabled : {}) }}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default HistoryPage
