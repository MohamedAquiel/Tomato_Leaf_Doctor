import { Link, useLocation } from 'react-router-dom'

const NAV = [
  { path: '/admin', label: 'Dashboard', exact: true, icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { path: '/admin/analytics', label: 'Analytics', icon: 'M18 20V10M12 20V4M6 20v-6' },
  { path: '/admin/model', label: 'Model Monitoring', icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18' },
  { path: '/admin/predictions', label: 'Predictions Review', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { path: '/admin/users', label: 'Users', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
  { path: '/admin/cms', label: 'Disease / Solutions', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { path: '/admin/settings', label: 'System Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

const S = {
  wrap: { display: 'flex', minHeight: 'calc(100vh - 60px)', background: '#f8faf8' },
  sidebar: { width: '220px', background: '#fff', borderRight: '1px solid #e5ede9', padding: '1.5rem 0', flexShrink: 0, position: 'sticky', top: '60px', height: 'calc(100vh - 60px)', overflowY: 'auto' },
  sideLabel: { fontSize: '0.7rem', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.7px', padding: '0 1.25rem', marginBottom: '0.5rem', marginTop: '0.5rem' },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: '500', color: '#374151', textDecoration: 'none', borderRadius: '0', transition: 'background 0.15s, color 0.15s', borderLeft: '3px solid transparent' },
  navItemActive: { background: '#f0f7f4', color: '#2d6a4f', fontWeight: '700', borderLeftColor: '#2d6a4f' },
  content: { flex: 1, padding: '2rem 1.5rem', minWidth: 0 },
}

const AdminLayout = ({ children }) => {
  const location = useLocation()
  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname === path

  return (
    <div style={S.wrap}>
      <aside style={S.sidebar}>
        <p style={S.sideLabel}>Admin Panel</p>
        {NAV.map(({ path, label, icon, exact }) => (
          <Link
            key={path}
            to={path}
            style={isActive(path, exact) ? { ...S.navItem, ...S.navItemActive } : S.navItem}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d={icon} />
            </svg>
            {label}
          </Link>
        ))}
      </aside>
      <div style={S.content}>{children}</div>
    </div>
  )
}

export default AdminLayout
