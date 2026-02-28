import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { getAllUsers, deleteUser, updateUser } from '../../../api/users';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchUsers = useCallback(async (searchQuery = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers({ page, limit: 20, search: searchQuery });
      setUsers(response.data || []);
      setTotalUsers(response.total || 0);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError('Error loading users: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers(searchTerm);
  }, [page, fetchUsers]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => {
      fetchUsers(value);
    }, 350));
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      setUpdating(userId);
      await updateUser(userId, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      setError('Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    if (!window.confirm(`${newStatus ? 'Activate' : 'Deactivate'} this user?`)) return;
    try {
      setUpdating(userId);
      await updateUser(userId, { isActive: newStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: newStatus } : u));
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user permanently? This cannot be undone.')) return;
    try {
      setDeleting(userId);
      await deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      setTotalUsers(prev => prev - 1);
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const SkeletonRow = () => (
    <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
      {Array(7).fill(null).map((_, i) => (
        <td key={i} style={{ padding: '12px' }}>
          <div style={{ height: '16px', backgroundColor: '#e0e0e0', width: '80%' }} />
        </td>
      ))}
    </tr>
  );

  const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4h12M6.5 7v5M9.5 7v5M3 4l1 10c0 0.5 0.5 1 1 1h6c0.5 0 1-0.5 1-1l1-10" />
      <path d="M6 2h4M5 4h6" />
    </svg>
  );

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600', color: '#1b4332' }}>
            User Management
          </h1>
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: '#e8f5e9',
              borderRadius: '3px',
              color: '#2e7d32',
              fontWeight: '500'
            }}>
              {totalUsers} total users
            </span>
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '24px',
            backgroundColor: '#ffebee',
            border: '1px solid #ef5350',
            borderRadius: '4px',
            color: '#c62828'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '8px 12px',
              border: '1px solid #d0d0d0',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f7f4', borderBottom: '2px solid #2d6a4f' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332', width: '100px' }}>Role</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332', width: '100px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332', width: '120px' }}>Joined</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332', width: '80px' }}>Predictions</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#1b4332', width: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(null).map((_, i) => <SkeletonRow key={i} />)
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#999' }}>
                    {searchTerm ? 'No users match your search' : 'No users yet'}
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#1b4332' }}>
                      {user.name}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: user.role === 'admin' ? '#ffd54f' : '#81d4fa',
                        color: user.role === 'admin' ? '#f57f17' : '#01579b'
                      }}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: user.isActive ? '#c8e6c9' : '#e0e0e0',
                        color: user.isActive ? '#2e7d32' : '#666'
                      }}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#1b4332' }}>
                      {user.predictionCount || 0}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleRoleToggle(user._id, user.role)}
                          disabled={updating === user._id}
                          style={{
                            padding: '4px 8px',
                            border: '1px solid #2d6a4f',
                            borderRadius: '3px',
                            backgroundColor: 'white',
                            color: '#2d6a4f',
                            cursor: updating === user._id ? 'not-allowed' : 'pointer',
                            opacity: updating === user._id ? 0.5 : 1,
                            fontSize: '11px',
                            fontWeight: '500',
                            whiteSpace: 'nowrap'
                          }}
                          title={user.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                        >
                          {user.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                        <button
                          onClick={() => handleStatusToggle(user._id, user.isActive)}
                          disabled={updating === user._id}
                          style={{
                            padding: '4px 8px',
                            border: '1px solid #f57c00',
                            borderRadius: '3px',
                            backgroundColor: 'white',
                            color: '#f57c00',
                            cursor: updating === user._id ? 'not-allowed' : 'pointer',
                            opacity: updating === user._id ? 0.5 : 1,
                            fontSize: '11px',
                            fontWeight: '500',
                            whiteSpace: 'nowrap'
                          }}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deleting === user._id}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#d32f2f',
                            cursor: deleting === user._id ? 'not-allowed' : 'pointer',
                            opacity: deleting === user._id ? 0.5 : 1,
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Delete user"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            style={{
              padding: '8px 16px',
              border: '1px solid #2d6a4f',
              borderRadius: '4px',
              backgroundColor: page === 1 ? '#f0f7f4' : 'white',
              color: '#2d6a4f',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
             Previous
          </button>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#1b4332' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            style={{
              padding: '8px 16px',
              border: '1px solid #2d6a4f',
              borderRadius: '4px',
              backgroundColor: page === totalPages ? '#f0f7f4' : 'white',
              color: '#2d6a4f',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Next 
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
