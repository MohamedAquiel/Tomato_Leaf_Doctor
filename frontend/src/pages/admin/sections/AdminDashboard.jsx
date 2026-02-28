import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { getDashboardStats } from '../../../api/users';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        if (response.success) {
          setStats(response.data);
        } else {
          setError('Failed to load dashboard stats');
        }
      } catch (err) {
        setError('Error fetching dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };
  const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const CheckCircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );

  const TrendIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  const StatCard = ({ title, value, icon: Icon, subtitle }) => (
    <div
      style={{
        backgroundColor: '#f0f7f4',
        border: '1px solid #d1e7dd',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon />
      </div>
      <div>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1b4332' }}>{value}</div>
        {subtitle && <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{subtitle}</div>}
      </div>
    </div>
  );

  const Skeleton = ({ height = '60px' }) => (
    <div
      style={{
        backgroundColor: '#e8f5e9',
        height,
        borderRadius: '8px',
        animation: 'pulse 2s infinite',
      }}
    />
  );

  if (loading) {
    return (
      <AdminLayout>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1b4332', marginBottom: '8px' }}>Dashboard</h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>{getCurrentDate()}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
          <Skeleton height="200px" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1b4332', marginBottom: '8px' }}>Dashboard</h1>
          <div
            style={{
              backgroundColor: '#ffebee',
              border: '1px solid #ef5350',
              borderRadius: '8px',
              padding: '16px',
              color: '#c62828',
            }}
          >
            {error}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1b4332', marginBottom: '8px' }}>Dashboard</h1>
          <p style={{ color: '#999' }}>No data available</p>
        </div>
      </AdminLayout>
    );
  }

  const totalDiseasedPredictions = stats.totalPredictions - (stats.totalPredictions - stats.predictionsByDisease.reduce((sum, d) => sum + (d.diseaseKey === 'Tomato___Healthy' ? 0 : d.count), 0));

  return (
    <AdminLayout>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      <div style={{ padding: '24px' }}>
        {}
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1b4332', marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>{getCurrentDate()}</p>

        {}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <StatCard title="Total Users" value={stats.totalUsers} icon={UserIcon} />
          <StatCard title="Total Predictions" value={stats.totalPredictions} icon={CheckCircleIcon} />
          <StatCard title="Guest Predictions" value={stats.guestPredictions} icon={TrendIcon} />
          <StatCard title="Active Users (30d)" value={stats.activeUsers} icon={ClockIcon} />
        </div>

        {}
        <div
          style={{
            backgroundColor: '#f0f7f4',
            border: '1px solid #d1e7dd',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1b4332', marginBottom: '16px' }}>Registered vs Guest</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: '40px',
                  backgroundColor: '#2d6a4f',
                  borderRadius: '4px',
                  marginBottom: '8px',
                }}
              />
              <div style={{ fontSize: '14px', color: '#1b4332', fontWeight: '500' }}>Registered</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2d6a4f' }}>{stats.registeredPredictions}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: '40px',
                  backgroundColor: '#52b788',
                  borderRadius: '4px',
                  marginBottom: '8px',
                }}
              />
              <div style={{ fontSize: '14px', color: '#1b4332', fontWeight: '500' }}>Guest</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52b788' }}>{stats.guestPredictions}</div>
            </div>
          </div>
        </div>

        {}
        <div
          style={{
            backgroundColor: '#f0f7f4',
            border: '1px solid #d1e7dd',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '32px',
            overflowX: 'auto',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1b4332', marginBottom: '16px' }}>Recent Predictions</h2>
          {stats.recentPredictions && stats.recentPredictions.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #d1e7dd' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#1b4332', fontWeight: '600', fontSize: '14px' }}>User</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#1b4332', fontWeight: '600', fontSize: '14px' }}>Disease</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#1b4332', fontWeight: '600', fontSize: '14px' }}>Confidence</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#1b4332', fontWeight: '600', fontSize: '14px' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#1b4332', fontWeight: '600', fontSize: '14px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPredictions.slice(0, 10).map((pred, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e8f5e9' }}>
                    <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                      {pred.isGuest ? 'Guest' : pred.user?.name || 'Unknown'}
                    </td>
                    <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>{pred.displayName}</td>
                    <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>{(pred.confidence * 100).toFixed(1)}%</td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: pred.isHealthy ? '#e8f5e9' : '#ffebee',
                          color: pred.isHealthy ? '#1b4332' : '#c62828',
                        }}
                      >
                        {pred.isHealthy ? 'Healthy' : 'Diseased'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#666', fontSize: '14px' }}>
                      {new Date(pred.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No recent predictions</p>
          )}
        </div>

        {}
        <div
          style={{
            backgroundColor: '#f0f7f4',
            border: '1px solid #d1e7dd',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1b4332', marginBottom: '16px' }}>Disease Breakdown</h2>
          {stats.predictionsByDisease && stats.predictionsByDisease.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #d1e7dd' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#1b4332', fontWeight: '600', fontSize: '14px' }}>Disease</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#1b4332', fontWeight: '600', fontSize: '14px' }}>Count</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#1b4332', fontWeight: '600', fontSize: '14px' }}>Avg Confidence</th>
                </tr>
              </thead>
              <tbody>
                {stats.predictionsByDisease.map((disease, idx) => {
                  const maxCount = Math.max(...stats.predictionsByDisease.map(d => d.count));
                  const progressWidth = (disease.count / maxCount) * 100;
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #e8f5e9' }}>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>{disease.displayName}</td>
                      <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>{disease.count}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              flex: 1,
                              height: '8px',
                              backgroundColor: '#e8f5e9',
                              borderRadius: '4px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${progressWidth}%`,
                                backgroundColor: '#2d6a4f',
                                borderRadius: '4px',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '12px', color: '#666', minWidth: '50px' }}>
                            {(disease.avgConfidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No disease data</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
