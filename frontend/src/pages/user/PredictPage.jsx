import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { createPrediction } from '../../api/predictions'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import SolutionPanel from '../../components/SolutionPanel'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const styles = {
  page: { minHeight: 'calc(100vh - 60px)', background: '#f8faf8', padding: '2rem 1rem' },
  container: { maxWidth: '700px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#2d6a4f', marginBottom: '0.4rem' },
  subtitle: { color: '#6b7280', fontSize: '0.97rem' },
  guestBanner: {
    background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '8px',
    padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.88rem',
    color: '#78350f', display: 'flex', alignItems: 'center', gap: '0.5rem',
  },
  uploadBox: {
    borderWidth: '2.5px', borderStyle: 'dashed', borderColor: '#2d6a4f',
    borderRadius: '14px', padding: '2.5rem 1.5rem',
    textAlign: 'center', cursor: 'pointer', background: '#f0f7f4',
    transition: 'background 0.2s, border-color 0.2s', marginBottom: '1.25rem',
  },
  uploadBoxActive: { background: '#d8f0e6', borderColor: '#1b4332' },
  uploadText: { color: '#2d6a4f', fontWeight: '600', fontSize: '1rem', margin: '0.75rem 0 0.25rem' },
  uploadHint: { color: '#9ca3af', fontSize: '0.82rem' },
  previewWrapper: { marginBottom: '1.25rem', textAlign: 'center' },
  previewImg: { maxWidth: '100%', maxHeight: '320px', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.12)', marginBottom: '0.5rem' },
  fileMeta: { fontSize: '0.85rem', color: '#6b7280' },
  errorBox: {
    background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c',
    borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1rem',
    fontSize: '0.92rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
  },
  analyzeBtn: {
    display: 'block', width: '100%', padding: '0.9rem', background: '#2d6a4f',
    color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.05rem',
    fontWeight: '700', cursor: 'pointer', marginBottom: '1rem', transition: 'opacity 0.2s',
  },
  analyzeBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  resetBtn: {
    display: 'block', width: '100%', padding: '0.75rem', background: 'transparent',
    color: '#2d6a4f', border: '2px solid #2d6a4f', borderRadius: '8px',
    fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.75rem',
  },
  spinnerWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' },
  resultCard: {
    background: '#fff', borderRadius: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
    padding: '1.75rem', marginTop: '1.5rem',
  },
  resultImage: { width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1.25rem' },
  diseaseName: { fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.75rem' },
  badgeRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' },
  badgeHealthy: { display: 'inline-block', background: '#d1fae5', color: '#065f46', borderRadius: '999px', padding: '0.3rem 0.9rem', fontSize: '0.83rem', fontWeight: '700' },
  badgeDiseased: { display: 'inline-block', background: '#fee2e2', color: '#b91c1c', borderRadius: '999px', padding: '0.3rem 0.9rem', fontSize: '0.83rem', fontWeight: '700' },
  confidenceLabel: { fontSize: '0.88rem', color: '#6b7280', marginBottom: '0.35rem' },
  progressBar: { background: '#e5e7eb', borderRadius: '999px', height: '10px', overflow: 'hidden', marginBottom: '1.25rem' },
  solutionTitle: { fontWeight: '700', marginBottom: '0.4rem', color: '#2d6a4f', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' },
  saveNote: {
    marginTop: '1rem', padding: '0.75rem 1rem', background: '#fffbeb',
    border: '1px solid #fde68a', borderRadius: '8px', fontSize: '0.85rem', color: '#78350f',
  },
}

const Spinner = () => (
  <div style={styles.spinnerWrap}>
    <svg width="48" height="48" viewBox="0 0 48 48" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="24" cy="24" r="20" fill="none" stroke="#2d6a4f" strokeWidth="4" strokeDasharray="90 30" strokeLinecap="round" />
    </svg>
    <p style={{ color: '#2d6a4f', fontWeight: '600', margin: 0 }}>Analyzing your leaf...</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

const PredictPage = () => {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (selected) => {
    setError(''); setResult(null)
    if (!selected) return
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError('Unsupported file type. Please upload a JPEG, PNG, or WebP image.')
      return
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum allowed size is 5 MB.')
      return
    }
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleInputChange = (e) => { handleFile(e.target.files[0]); e.target.value = '' }
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true); setError(''); setResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await createPrediction(formData)
      const prediction = res.data || res

      setResult(prediction)
      if (user) {
        const name = prediction?.displayName || 'Unknown'
        const healthy = prediction?.isHealthy
        addNotification(
          healthy ? 'success' : 'warning',
          healthy ? 'Plant is Healthy!' : 'Disease Detected',
          healthy
            ? `Your tomato leaf appears healthy. No treatment needed.`
            : `${name} detected with ${prediction?.confidence?.toFixed?.(1) ?? '--'}% confidence. Check the treatment recommendations.`
        )
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => { setFile(null); setPreview(null); setResult(null); setError('') }
  const formatSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`
  const isHealthy = result?.isHealthy ?? result?.disease?.isHealthy ?? false
  const displayName = result?.displayName || result?.disease?.displayName || result?.diseaseKey || 'Unknown'
  const confidence = result?.confidence ?? result?.disease?.confidence ?? 0
  const solution = result?.solution || result?.disease?.solution || ''
  const imageUrl = result?.imageUrl || ''

  return (
    <div style={styles.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Tomato Leaf Diagnosis</h1>
          <p style={styles.subtitle}>Upload a clear photo of a tomato leaf to detect diseases instantly.</p>
        </div>

        {!user && (
          <div style={styles.guestBanner}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            You are not signed in. Results won&apos;t be saved.{' '}
            <Link to="/login" style={{ color: '#78350f', fontWeight: '700', textDecoration: 'underline' }}>Sign in</Link>{' '}
            to keep your prediction history.
          </div>
        )}

        {!result && (
          <>
            <div
              style={{ ...styles.uploadBox, ...(dragging ? styles.uploadBoxActive : {}) }}
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
              role="button" tabIndex={0} aria-label="Upload leaf image"
              onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            >
              <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: 'none' }} onChange={handleInputChange} />
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
              </svg>
              <p style={styles.uploadText}>{dragging ? 'Drop the image here' : 'Drag & drop a leaf image or click to browse'}</p>
              <p style={styles.uploadHint}>JPEG  PNG  WebP &nbsp;&nbsp; max 5 MB</p>
            </div>

            {preview && (
              <div style={styles.previewWrapper}>
                <img src={preview} alt="Preview" style={styles.previewImg} />
                <p style={styles.fileMeta}>{file?.name} &nbsp;&nbsp; {formatSize(file?.size)}</p>
              </div>
            )}

            {error && (
              <div style={styles.errorBox}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {loading ? <Spinner /> : (
              <button
                style={{ ...styles.analyzeBtn, ...(!file || loading ? styles.analyzeBtnDisabled : {}) }}
                onClick={handleAnalyze} disabled={!file || loading}
              >
                Analyze Leaf
              </button>
            )}
          </>
        )}

        {result && (
          <div style={styles.resultCard}>
            {imageUrl ? (
              <img src={imageUrl.startsWith('/') ? imageUrl : `/uploads/${imageUrl}`}
                alt="Analyzed leaf" style={styles.resultImage}
                onError={(e) => { e.target.style.display = 'none' }} />
            ) : preview && (
              <img src={preview} alt="Analyzed leaf" style={styles.resultImage} />
            )}

            <h2 style={styles.diseaseName}>{displayName}</h2>

            <div style={styles.badgeRow}>
              {isHealthy
                ? <span style={styles.badgeHealthy}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '3px' }}><polyline points="20 6 9 17 4 12" /></svg>
                    Healthy
                  </span>
                : <span style={styles.badgeDiseased}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ verticalAlign: 'middle', marginRight: '3px' }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    Disease Detected
                  </span>
              }
            </div>

            {}
            <p style={styles.confidenceLabel}>
              Confidence: <strong>{typeof confidence === 'number' ? confidence.toFixed(1) : confidence}%</strong>
            </p>
            <div style={styles.progressBar}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, typeof confidence === 'number' ? confidence : 0)}%`,
                background: isHealthy ? '#2d6a4f' : '#dc2626',
                borderRadius: '999px', transition: 'width 0.7s ease',
              }} />
            </div>

            {solution && <SolutionPanel solution={solution} />}

            {user ? (
              <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#f0f7f4', border: '1px solid #b7dfc9', borderRadius: '8px', fontSize: '0.88rem', color: '#2d6a4f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ verticalAlign: 'middle', marginRight: '5px' }}><polyline points="20 6 9 17 4 12"/></svg>
                  Result saved to your history.
                </span>
                <Link to="/history" style={{ color: '#2d6a4f', fontWeight: '700', textDecoration: 'underline' }}>View History </Link>
              </div>
            ) : (
              <div style={styles.saveNote}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ verticalAlign: 'middle', marginRight: '5px' }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                This result was not saved.{' '}
                <Link to="/register" style={{ color: '#92400e', fontWeight: '700' }}>Create an account</Link>{' '}
                to save your prediction history.
              </div>
            )}

            <button style={styles.resetBtn} onClick={handleReset}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
              Try Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PredictPage
