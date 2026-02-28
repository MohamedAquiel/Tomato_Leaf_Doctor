import { useState, useEffect, useCallback } from 'react'
import { getDashboardStats, getAllUsers, deleteUser, updateUser } from '../../api/users'

const styles = {
  page: { minHeight: 'calc(100vh - 60px)', background: '#f8faf8', padding: '2rem 1rem' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#2d6a4f', marginBottom: '1.75rem' },
  sectionTitle: { fontSize: '1.05rem', fontWeight: '700', color: '#2d6a4f', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #d1fae5' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  statCard: { background: '#fff', border: '1px solid #d1fae5', borderRadius: '12px', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  statValue: { fontSize: '2rem', fontWeight: '800', color: '#2d6a4f', lineHeight: 1.1 },
  statLabel: { fontSize: '0.78rem', color: '#6b7280', marginTop: '0.3rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', padding: '1.5rem', marginBottom: '1.75rem', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' },
  th: { textAlign: 'left', padding: '0.65rem 0.85rem', background: '#f0f7f4', color: '#2d6a4f', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' },
  td: { padding: '0.75rem 0.85rem', borderBottom: '1px solid #f3f4f6', color: '#374151', verticalAlign: 'middle' },
  tdMuted: { color: '#9ca3af', fontSize: '0.82rem' },
  badgeHealthy: { background: '#d1fae5', color: '#065f46', borderRadius: '999px', padding: '0.15rem 0.65rem', fontSize: '0.75rem', fontWeight: '700' },
  badgeDiseased: { background: '#fee2e2', color: '#b91c1c', borderRadius: '999px', padding: '0.15rem 0.65rem', fontSize: '0.75rem', fontWeight: '700' },
  badgeAdmin: { background: '#fef3c7', color: '#92400e', borderRadius: '999px', padding: '0.15rem 0.65rem', fontSize: '0.75rem', fontWeight: '700' },
  badgeUser: { background: '#dbeafe', color: '#1e40af', borderRadius: '999px', padding: '0.15rem 0.65rem', fontSize: '0.75rem', fontWeight: '700' },
  badgeActive: { background: '#d1fae5', color: '#065f46', borderRadius: '999px', padding: '0.15rem 0.65rem', fontSize: '0.75rem', fontWeight: '700' },
  badgeInactive: { background: '#f3f4f6', color: '#6b7280', borderRadius: '999px', padding: '0.15rem 0.65rem', fontSize: '0.75rem', fontWeight: '700' },
  deleteBtn: { padding: '0.35rem 0.75rem', background: '#fff0f0', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' },
  promoteBtn: { padding: '0.35rem 0.75rem', background: '#f0f7f4', color: '#2d6a4f', border: '1px solid #b7dfc9', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.4rem' },
  searchRow: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' },
  searchInput: { padding: '0.6rem 0.9rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', flex: '1 1 260px', outline: 'none', color: '#1a1a1a' },
  errorBox: { background: '#fff0f0', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1rem', fontSize: '0.92rem' },
  skeletonRow: { height: '42px', background: '#e5e7eb', borderRadius: '6px', marginBottom: '0.5rem', animation: 'pulse 1.4s ease-in-out infinite' },
  emptyRow: { textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '0.9rem' },
  progressBar: { background: '#e5e7eb', borderRadius: '999px', height: '6px', overflow: 'hidden', width: '72px', display: 'inline-block', verticalAlign: 'middle', marginLeft: '0.5rem' },
  actionCell: { display: 'flex', gap: '0.35rem', flexWrap: 'wrap' },
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--'

const StatCard = ({ label, value, icon }) => (
  <div style={styles.statCard}>
    <div style={styles.statValue}>{value ?? '--'}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
)

const AdminPage = () => {
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState('')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState({})
  const [promoting, setPromoting] = useState({})

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats()
        setStats(res.data || res.stats || res)
      } catch (err) {
        setStatsError(err?.response?.data?.message || 'Failed to load statistics.')
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const fetchUsers = useCallback(async (q = '') => {
    setUsersLoading(true); setUsersError('')
    try {
      const res = await getAllUsers(q ? { search: q } : {})
      setUsers(res.data || res.users || (Array.isArray(res) ? res : []))
    } catch (err) {
      setUsersError(err?.response?.data?.message || 'Failed to load users.')
    } finally {
      setUsersLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(search), 350)
    return () => clearTimeout(t)
  }, [search, fetchUsers])

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? All their data will be removed. This cannot be undone.')) return
    setDeleting((p) => ({ ...p, [id]: true }))
    try {
      await deleteUser(id)
      setUsers((p) => p.filter((u) => (u._id || u.id) !== id))
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed.')
    } finally {
      setDeleting((p) => ({ ...p, [id]: false }))
    }
  }

  const handleToggleRole = async (user) => {
    const id = user._id || user.id
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    if (!window.confirm(`Change ${user.name || user.email} role to "${newRole}"?`)) return
    setPromoting((p) => ({ ...p, [id]: true }))
    try {
      await updateUser(id, { role: newRole })
      setUsers((p) => p.map((u) => (u._id || u.id) === id ? { ...u, role: newRole } : u))
    } catch (err) {
      alert(err?.response?.data?.message || 'Role update failed.')
    } finally {
      setPromoting((p) => ({ ...p, [id]: false }))
    }
  }

  const predsByDisease = stats?.predictionsByDisease || stats?.byDisease || []
  const recentPredictions = stats?.recentPredictions || stats?.recent || []

  return (
    <div style={styles.page}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard</h1>

        {statsError && <div style={styles.errorBox}>{statsError}</div>}

        {}
        <div style={styles.statsRow}>
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ ...styles.statCard, background: '#e5e7eb', animation: 'pulse 1.4s ease-in-out infinite', height: '90px' }} />
            ))
          ) : (
            <>
              <StatCard label="Total Users" value={stats?.totalUsers} />
              <StatCard label="Total Predictions" value={stats?.totalPredictions} />
              <StatCard label="Guest Predictions" value={stats?.guestPredictions} />
              <StatCard label="Active Users (30d)" value={stats?.activeUsers} />
            </>
          )}
        </div>

        {}
        {!statsLoading && predsByDisease.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Disease Breakdown</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Disease</th>
                  <th style={styles.th}>Count</th>
                  <th style={styles.th}>Avg. Confidence</th>
                </tr>
              </thead>
              <tbody>
                {predsByDisease.map((row, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{row.diseaseKey || row.disease || '--'}</td>
                    <td style={styles.td}>{row.count ?? '--'}</td>
                    <td style={styles.td}>
                      {row.avgConfidence != null ? `${Number(row.avgConfidence).toFixed(1)}%` : '--'}
                      {row.avgConfidence != null && (
                        <span style={styles.progressBar}>
                          <span style={{ display: 'block', height: '100%', width: `${Math.min(100, row.avgConfidence)}%`, background: '#2d6a4f', borderRadius: '999px' }} />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {}
        {!statsLoading && recentPredictions.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Recent Predictions</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Disease</th>
                  <th style={styles.th}>Confidence</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPredictions.map((pred, i) => {
                  const isHealthy = pred.isHealthy ?? pred.disease?.isHealthy ?? false
                  const displayName = pred.displayName || pred.disease?.displayName || pred.diseaseKey || '--'
                  const confidence = pred.confidence ?? null
                  const userName = pred.user?.name || pred.userName || 'Guest'
                  const userEmail = pred.user?.email || pred.userEmail || ''
                  return (
                    <tr key={i}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '600' }}>{userName}</div>
                        {userEmail && <div style={styles.tdMuted}>{userEmail}</div>}
                      </td>
                      <td style={styles.td}>{displayName}</td>
                      <td style={styles.td}>{confidence != null ? `${Number(confidence).toFixed(1)}%` : '--'}</td>
                      <td style={styles.td}>
                        <span style={isHealthy ? styles.badgeHealthy : styles.badgeDiseased}>
                          {isHealthy ? '[OK] Healthy' : '[!] Diseased'}
                        </span>
                      </td>
                      <td style={{ ...styles.td, ...styles.tdMuted }}>{formatDate(pred.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>User Management</h2>
          <div style={styles.searchRow}>
            <input
              style={styles.searchInput} type="text"
              placeholder="Search by name or email..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = '#2d6a4f')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{users.length} user{users.length !== 1 ? 's' : ''}</span>
          </div>

          {usersError && <div style={styles.errorBox}>{usersError}</div>}

          {usersLoading ? (
            <div>{Array.from({ length: 5 }).map((_, i) => <div key={i} style={styles.skeletonRow} />)}</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} style={styles.emptyRow}>No users found.</td></tr>
                ) : (
                  users.map((user) => {
                    const id = user._id || user.id
                    const isActive = user.isActive !== false && user.active !== false
                    return (
                      <tr key={id}>
                        <td style={styles.td}>{user.name || '--'}</td>
                        <td style={styles.td}>{user.email || '--'}</td>
                        <td style={styles.td}>
                          <span style={user.role === 'admin' ? styles.badgeAdmin : styles.badgeUser}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={isActive ? styles.badgeActive : styles.badgeInactive}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ ...styles.td, ...styles.tdMuted }}>{formatDate(user.createdAt)}</td>
                        <td style={styles.td}>
                          <div style={styles.actionCell}>
                            <button
                              style={{ ...styles.promoteBtn, opacity: promoting[id] ? 0.6 : 1 }}
                              onClick={() => handleToggleRole(user)} disabled={promoting[id]}
                              title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
                              </svg>
                              {promoting[id] ? '...' : user.role === 'admin' ? 'Demote' : 'Promote'}
                            </button>
                            <button
                              style={{ ...styles.deleteBtn, opacity: deleting[id] ? 0.6 : 1 }}
                              onClick={() => handleDeleteUser(id)} disabled={deleting[id]}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                              </svg>
                              {deleting[id] ? '...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
