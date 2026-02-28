import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { getAllPredictions, deletePrediction } from '../../../api/predictions';

const AdminPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllPredictions({ page, limit: 15 });
      if (response.success) {
        setPredictions(response.data || []);
        setTotalPages(response.pages || 1);
      } else {
        setError('Failed to fetch predictions');
      }
    } catch (err) {
      setError('Error loading predictions: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const filteredPredictions = predictions.filter(pred => {
    const matchesSearch = pred.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'healthy' ? pred.isHealthy :
      filter === 'diseased' ? !pred.isHealthy :
      filter === 'guest' ? pred.isGuest : true;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prediction? This cannot be undone.')) return;
    try {
      setDeleting(id);
      await deletePrediction(id);
      setPredictions(predictions.filter(p => p._id !== id));
    } catch (err) {
      setError('Failed to delete prediction');
    } finally {
      setDeleting(null);
    }
  };

  const SkeletonRow = () => (
    <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
      <td style={{ padding: '12px', width: '60px' }}>
        <div style={{ width: '50px', height: '50px', backgroundColor: '#e0e0e0', borderRadius: '4px' }} />
      </td>
      <td style={{ padding: '12px' }}>
        <div style={{ height: '16px', backgroundColor: '#e0e0e0', width: '80%' }} />
      </td>
      <td style={{ padding: '12px' }}>
        <div style={{ height: '16px', backgroundColor: '#e0e0e0', width: '100%' }} />
      </td>
      <td style={{ padding: '12px' }}>
        <div style={{ height: '16px', backgroundColor: '#e0e0e0', width: '60%' }} />
      </td>
      <td style={{ padding: '12px' }}>
        <div style={{ height: '16px', backgroundColor: '#e0e0e0', width: '70%' }} />
      </td>
      <td style={{ padding: '12px' }}>
        <div style={{ height: '16px', backgroundColor: '#e0e0e0', width: '80%' }} />
      </td>
      <td style={{ padding: '12px' }}>
        <div style={{ height: '16px', backgroundColor: '#e0e0e0', width: '100%' }} />
      </td>
      <td style={{ padding: '12px' }}>
        <div style={{ height: '16px', backgroundColor: '#e0e0e0', width: '60%' }} />
      </td>
    </tr>
  );

  const DeleteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4h12M6.5 7v5M9.5 7v5M3 4l1 10c0 0.5 0.5 1 1 1h6c0.5 0 1-0.5 1-1l1-10" />
      <path d="M6 2h4M5 4h6" />
    </svg>
  );

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <h1 style={{ margin: '0 0 24px 0', fontSize: '28px', fontWeight: '600', color: '#1b4332' }}>
          Predictions Review
        </h1>

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

        <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by display name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '8px 12px',
              border: '1px solid #d0d0d0',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'healthy', 'diseased', 'guest'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: filter === f ? '#2d6a4f' : '#f0f7f4',
                  color: filter === f ? 'white' : '#2d6a4f',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f7f4', borderBottom: '2px solid #2d6a4f' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332', width: '60px' }}>Image</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332' }}>Disease</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332' }}>User</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332', width: '140px' }}>Confidence</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332', width: '80px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332', width: '80px' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#1b4332', width: '120px' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#1b4332', width: '50px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(null).map((_, i) => <SkeletonRow key={i} />)
              ) : filteredPredictions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: '#999' }}>
                    {searchTerm || filter !== 'all' ? 'No predictions match your filters' : 'No predictions yet'}
                  </td>
                </tr>
              ) : (
                filteredPredictions.map(pred => (
                  <tr key={pred._id} style={{ borderBottom: '1px solid #e0e0e0', hover: { backgroundColor: '#fafafa' } }}>
                    <td style={{ padding: '12px' }}>
                      {pred.imageUrl ? (
                        <img
                          src={pred.imageUrl}
                          alt="prediction"
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <div style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: '#f0f7f4',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#999'
                        }}>
                          --
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#1b4332' }}>
                      {pred.diseaseKey || 'Unknown'}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      <div>{pred.isGuest ? 'Guest' : pred.user?.name || 'Unknown'}</div>
                      {!pred.isGuest && <div style={{ fontSize: '12px', color: '#666' }}>{pred.user?.email}</div>}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                        {(pred.confidence * 100).toFixed(1)}%
                      </div>
                      <div style={{
                        width: '100px',
                        height: '4px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${pred.confidence * 100}%`,
                          backgroundColor: pred.confidence > 0.8 ? '#d32f2f' : pred.confidence > 0.6 ? '#f57c00' : '#2d6a4f',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: pred.isHealthy ? '#c8e6c9' : '#ffcdd2',
                        color: pred.isHealthy ? '#2e7d32' : '#c62828'
                      }}>
                        {pred.isHealthy ? 'Healthy' : 'Diseased'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {pred.isGuest && (
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '3px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: '#fff3e0',
                          color: '#e65100'
                        }}>
                          Guest
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>
                      {new Date(pred.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(pred._id)}
                        disabled={deleting === pred._id}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#d32f2f',
                          cursor: deleting === pred._id ? 'not-allowed' : 'pointer',
                          opacity: deleting === pred._id ? 0.5 : 1,
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </button>
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

export default AdminPredictions;
