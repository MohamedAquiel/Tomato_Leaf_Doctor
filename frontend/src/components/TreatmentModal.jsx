import { useEffect, useState } from 'react'
import SolutionPanel from './SolutionPanel'

const TreatmentModal = ({ solution, diseaseName, onClose }) => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes modalSpinIn {
          0%   { opacity: 0; transform: scale(0.85) rotate(-4deg); }
          60%  { opacity: 1; transform: scale(1.03) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div
        data-testid="modal-overlay"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
          animation: 'overlayFadeIn 0.2s ease both',
        }}
      >
        {}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '88vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            animation: 'modalSpinIn 0.38s cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        >
          {}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5ede9',
            position: 'sticky', top: 0, background: '#fff', zIndex: 1, borderRadius: '16px 16px 0 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: '#d8f3dc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1b4332', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                  Treatment Plan
                </h2>
                {diseaseName && (
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                    {diseaseName}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '34px', height: '34px', borderRadius: '8px',
                background: '#f3f4f6', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
              title="Close (Esc)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {}
          <div style={{ padding: '1.25rem 1.5rem 1.75rem' }}>
            {loading ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '3rem 1rem', gap: '1rem',
              }}>
                <div style={{
                  width: '40px', height: '40px',
                  borderWidth: '3.5px', borderStyle: 'solid',
                  borderColor: 'rgba(45,106,79,0.15)', borderTopColor: '#2d6a4f',
                  borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                }} />
                <p style={{ color: '#6b7280', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', margin: 0 }}>
                  Loading treatment plan...
                </p>
              </div>
            ) : (
              <SolutionPanel solution={solution} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default TreatmentModal
