import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { getDashboardStats } from '../../../api/users';
import axios from '../../../api/axios';

const AdminSystemSettings = () => {
  const [stats, setStats] = useState(null);
  const [mlStatus, setMlStatus] = useState('checking');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await getDashboardStats();
        setStats(dashboardData);
      } catch (err) {
        setError('Failed to load system statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    checkMLService();
  }, []);

  const checkMLService = async () => {
    try {
      setMlStatus('checking');
      const response = await axios.get('http://localhost:8000/health', { timeout: 5000 });
      if (response.status === 200) {
        setMlStatus('connected');
      }
    } catch (err) {
      setMlStatus('offline');
    }
  };

  const maskURI = (uri) => {
    if (!uri) return '***';
    return uri.substring(0, 20) + '***';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const SettingField = ({ label, value }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1b4332', marginBottom: '6px' }}>
        {label}
      </label>
      <div style={{
        padding: '10px 12px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#666',
        fontFamily: 'monospace',
        wordBreak: 'break-all'
      }}>
        {value || '--'}
      </div>
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1b4332' }}>
        {title}
      </h2>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {children}
      </div>
    </div>
  );

  const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="7" />
      <line x1="8" y1="5" x2="8" y2="8" />
      <line x1="8" y1="10" x2="8.01" y2="10" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="8" r="7" fill="#2e7d32" />
      <polyline points="11 6 7 10 5 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const OfflineIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="8" r="7" fill="#d32f2f" />
      <line x1="6" y1="6" x2="10" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="6" x2="6" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  const LoadingIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8" cy="8" r="7" opacity="0.3" />
      <circle cx="8" cy="8" r="7" opacity="0" strokeDasharray="10" strokeDashoffset="0" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { stroke-dashoffset: -20; } }`}</style>
    </svg>
  );

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <h1 style={{ margin: '0 0 24px 0', fontSize: '28px', fontWeight: '600', color: '#1b4332' }}>
          System Settings
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

        {}
        <Section title="Backend Configuration">
          <SettingField label="Port" value="5000" />
          <SettingField label="Node Environment" value={process.env.NODE_ENV || 'production'} />
          <SettingField label="MongoDB URI" value={maskURI(process.env.REACT_APP_MONGODB_URI)} />
          <SettingField label="JWT Expiration" value="7 days" />
          <SettingField label="Upload Path" value="/uploads/predictions" />
          <SettingField label="Max File Size" value="10 MB" />
          <SettingField label="ML Service URL" value="http://localhost:8000" />
        </Section>

        {}
        <Section title="ML Service Status">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            {mlStatus === 'checking' && <LoadingIcon />}
            {mlStatus === 'connected' && <CheckIcon />}
            {mlStatus === 'offline' && <OfflineIcon />}
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: mlStatus === 'connected' ? '#2e7d32' : mlStatus === 'offline' ? '#d32f2f' : '#666'
            }}>
              {mlStatus === 'checking' ? 'Checking...' : mlStatus === 'connected' ? 'Connected' : 'Offline'}
            </span>
          </div>
          <button
            onClick={checkMLService}
            disabled={mlStatus === 'checking'}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2d6a4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: mlStatus === 'checking' ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              opacity: mlStatus === 'checking' ? 0.6 : 1
            }}
            onMouseOver={(e) => !mlStatus === 'checking' && (e.target.style.backgroundColor = '#1b4332')}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2d6a4f'}
          >
            Check ML Service
          </button>
          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#e3f2fd',
            borderLeft: '4px solid #1976d2',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#01579b'
          }}>
            <strong>ML Service:</strong> Runs on http://localhost:8000/health
          </div>
        </Section>

        {}
        <Section title="Upload Statistics">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              Loading statistics...
            </div>
          ) : (
            <>
              <SettingField
                label="Total Predictions"
                value={stats?.totalPredictions || 0}
              />
              <SettingField
                label="Estimated Disk Usage"
                value={`${((stats?.totalPredictions || 0) * 0.3).toFixed(2)} MB`}
              />
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#f0f7f4',
                borderLeft: '4px solid #2d6a4f',
                borderRadius: '4px',
                fontSize: '13px',
                color: '#1b4332',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start'
              }}>
                <InfoIcon />
                <span><strong>Note:</strong> Each prediction stores one image. Estimated disk usage: {((stats?.totalPredictions || 0) * 0.3).toFixed(2)} MB</span>
              </div>
            </>
          )}
        </Section>

        {}
        <Section title="System Info">
          <SettingField
            label="Current Date & Time"
            value={new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZoneName: 'short'
            })}
          />
          <SettingField
            label="User Agent"
            value={navigator.userAgent}
          />
          <SettingField
            label="Application Version"
            value="1.0.0"
          />
        </Section>
      </div>
    </AdminLayout>
  );
};

export default AdminSystemSettings;
