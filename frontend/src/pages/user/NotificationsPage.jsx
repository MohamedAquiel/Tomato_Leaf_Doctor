import { useState } from 'react'
import { useNotifications } from '../../context/NotificationContext'

const TYPE_STYLES = {
  success: { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46', icon: 'M20 6L9 17l-5-5' },
  warning: { bg: '#fef9c3', border: '#fde68a', text: '#78350f', icon: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' },
  error:   { bg: '#fee2e2', border: '#fca5a5', text: '#b91c1c', icon: 'M18 6L6 18M6 6l12 12' },
  info:    { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a8a', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
}

const S = {
  page: { minHeight: 'calc(100vh - 60px)', background: '#f8faf8', padding: '2rem 1rem' },
  container: { maxWidth: '740px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#2d6a4f', margin: 0 },
  headerRight: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  actionBtn: { padding: '0.45rem 1rem', borderRadius: '7px', border: '1.5px solid #d1d5db', background: '#fff', color: '#374151', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' },
  clearBtn: { padding: '0.45rem 1rem', borderRadius: '7px', border: '1.5px solid #fca5a5', background: '#fff0f0', color: '#b91c1c', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' },
  emptyWrap: { textAlign: 'center', padding: '4rem 1rem' },
  emptyTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#374151', marginTop: '1rem', marginBottom: '0.5rem' },
  emptyText: { color: '#6b7280', fontSize: '0.9rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  notifCard: { borderRadius: '12px', padding: '1rem 1.25rem', borderWidth: '1px', borderStyle: 'solid', display: 'flex', alignItems: 'flex-start', gap: '0.85rem', cursor: 'pointer', transition: 'box-shadow 0.15s' },
  notifContent: { flex: 1 },
  notifTitle: { fontWeight: '700', fontSize: '0.95rem', margin: '0 0 0.2rem' },
  notifMessage: { fontSize: '0.87rem', margin: '0 0 0.4rem', lineHeight: '1.55' },
  notifTime: { fontSize: '0.77rem', opacity: 0.65 },
  unreadDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#2d6a4f', flexShrink: 0, marginTop: '6px' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', borderRadius: '4px', flexShrink: 0, opacity: 0.6 },
  unreadBadge: { background: '#2d6a4f', color: '#fff', borderRadius: '999px', padding: '0.1rem 0.6rem', fontSize: '0.75rem', fontWeight: '700' },
  filterRow: { display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' },
  filterBtn: { padding: '0.3rem 0.85rem', borderRadius: '999px', border: '1.5px solid #d1d5db', background: '#fff', color: '#374151', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' },
  filterBtnActive: { background: '#2d6a4f', color: '#fff', borderColor: '#2d6a4f' },
}

const FILTERS = ['All', 'Unread', 'success', 'warning', 'error', 'info']

const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const NotificationsPage = () => {
  const { notifications, unreadCount, markRead, markAllRead, remove, clearAll } = useNotifications()
  const [filter, setFilter] = useState('All')

  const filtered = notifications.filter(n => {
    if (filter === 'All') return true
    if (filter === 'Unread') return !n.read
    return n.type === filter
  })

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={S.title}>Notifications</h1>
            {unreadCount > 0 && <span style={S.unreadBadge}>{unreadCount} new</span>}
          </div>
          <div style={S.headerRight}>
            {unreadCount > 0 && <button style={S.actionBtn} onClick={markAllRead}>Mark all read</button>}
            {notifications.length > 0 && <button style={S.clearBtn} onClick={() => { if (window.confirm('Clear all notifications?')) clearAll() }}>Clear all</button>}
          </div>
        </div>

        {notifications.length > 0 && (
          <div style={S.filterRow}>
            {FILTERS.map(f => (
              <button key={f} style={filter === f ? { ...S.filterBtn, ...S.filterBtnActive } : S.filterBtn} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={S.emptyWrap}>
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#b7dfc9" strokeWidth="1.2" strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <p style={S.emptyTitle}>{filter === 'All' ? "You're all caught up!" : `No ${filter} notifications`}</p>
            <p style={S.emptyText}>{filter === 'All' ? 'Notifications about your predictions and account activity will appear here.' : 'Try a different filter.'}</p>
          </div>
        ) : (
          <div style={S.list}>
            {filtered.map(n => {
              const ts = TYPE_STYLES[n.type] || TYPE_STYLES.info
              return (
                <div
                  key={n.id}
                  style={{ ...S.notifCard, background: n.read ? '#fff' : ts.bg, borderColor: n.read ? '#e5e7eb' : ts.border, boxShadow: n.read ? 'none' : '0 2px 8px rgba(0,0,0,0.06)' }}
                  onClick={() => markRead(n.id)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ts.text} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <path d={ts.icon} />
                  </svg>
                  <div style={S.notifContent}>
                    <p style={{ ...S.notifTitle, color: ts.text }}>{n.title}</p>
                    <p style={{ ...S.notifMessage, color: n.read ? '#4b5563' : ts.text }}>{n.message}</p>
                    <span style={{ ...S.notifTime, color: ts.text }}>{timeAgo(n.createdAt)}</span>
                  </div>
                  {!n.read && <div style={S.unreadDot} />}
                  <button style={S.deleteBtn} onClick={e => { e.stopPropagation(); remove(n.id) }} title="Dismiss">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
