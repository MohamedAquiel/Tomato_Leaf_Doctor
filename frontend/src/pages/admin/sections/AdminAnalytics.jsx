import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { getDashboardStats } from '../../../api/users';

const AdminAnalytics = () => {
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
          setError('Failed to load analytics data');
        }
      } catch (err) {
        setError('Error fetching analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getSeverityColor = (diseaseKey) => {
    const criticalDiseases = ['Tomato___Late_Blight', 'Tomato___Early_Blight'];
    const highDiseases = ['Tomato___Bacterial_Spot', 'Tomato___Septoria_Leaf_Spot'];
    const mediumDiseases = ['Tomato___Leaf_Mold', 'Tomato___Spider_Mites Two-spotted_spider_mite', 'Tomato___Target_Spot'];
    const virusDiseases = ['Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus'];

    if (criticalDiseases.includes(diseaseKey)) return '#ef5350';
    if (highDiseases.includes(diseaseKey)) return '#ff9800';
    if (mediumDiseases.includes(diseaseKey)) return '#2196f3';
    if (virusDiseases.includes(diseaseKey)) return '#f44336';
    if (diseaseKey === 'Tomato___Healthy') return '#52b788';
    return '#999999';
  };

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
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1b4332', marginBottom: '8px' }}>Analytics</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
          <Skeleton height="300px" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1b4332', marginBottom: '8px' }}>Analytics</h1>
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
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1b4332', marginBottom: '8px' }}>Analytics</h1>
          <p style={{ color: '#999' }}>No data available</p>
        </div>
      </AdminLayout>
    );
  }

  const totalHealthy = stats.predictionsByDisease.find(d => d.diseaseKey === 'Tomato___Healthy')?.count || 0;
  const totalDiseased = stats.totalPredictions - totalHealthy;
  const healthyPercent = stats.totalPredictions > 0 ? ((totalHealthy / stats.totalPredictions) * 100).toFixed(1) : 0;
  const diseasedPercent = stats.totalPredictions > 0 ? ((totalDiseased / stats.totalPredictions) * 100).toFixed(1) : 0;

  const topDiseases = stats.predictionsByDisease
    .filter(d => d.diseaseKey !== 'Tomato___Healthy')
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const StatBox = ({ label, value, percentage, color = '#2d6a4f' }) => (
    <div
      style={{
        backgroundColor: '#f0f7f4',
        border: '1px solid #d1e7dd',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color, marginBottom: '8px' }}>{value}</div>
      {percentage !== undefined && <div style={{ fontSize: '12px', color: '#999' }}>{percentage}% of total</div>}
    </div>
  );

  return (
    <AdminLayout>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      <div style={{ padding: '24px' }}>
        {}
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1b4332', marginBottom: '32px' }}>Analytics</h1>

        {}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b4332', marginBottom: '16px' }}>Health Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <StatBox label="Total Healthy Predictions" value={totalHealthy} percentage={healthyPercent} color="#52b788" />
            <StatBox label="Total Diseased Predictions" value={totalDiseased} percentage={diseasedPercent} color="#ef5350" />
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
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b4332', marginBottom: '20px' }}>Disease Distribution</h2>
          {stats.predictionsByDisease && stats.predictionsByDisease.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {stats.predictionsByDisease.map((disease, idx) => {
                const maxCount = Math.max(...stats.predictionsByDisease.map(d => d.count));
                const barWidth = maxCount > 0 ? (disease.count / maxCount) * 100 : 0;
                const barColor = getSeverityColor(disease.diseaseKey);

                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1b4332' }}>{disease.displayName}</span>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {disease.count} predictions - Avg confidence: {(disease.avgConfidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: '24px',
                        backgroundColor: '#e8f5e9',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${barWidth}%`,
                          backgroundColor: barColor,
                          borderRadius: '4px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No disease data available</p>
          )}
        </div>

        {}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b4332', marginBottom: '16px' }}>User Activity</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <StatBox label="Total Users" value={stats.totalUsers} />
            <StatBox label="Active Users (30d)" value={stats.activeUsers} percentage={(stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0)} />
            <StatBox
              label="Guest Predictions"
              value={stats.guestPredictions}
              percentage={(stats.totalPredictions > 0 ? ((stats.guestPredictions / stats.totalPredictions) * 100).toFixed(1) : 0)}
            />
          </div>
        </div>

        {}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b4332', marginBottom: '16px' }}>Top 3 Most Common Diseases</h2>
          {topDiseases.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {topDiseases.map((disease, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#f0f7f4',
                    border: `2px solid ${getSeverityColor(disease.diseaseKey)}`,
                    borderRadius: '8px',
                    padding: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      backgroundColor: getSeverityColor(disease.diseaseKey),
                    }}
                  />
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#1b4332',
                      marginBottom: '12px',
                      marginTop: '4px',
                    }}
                  >
                    #{idx + 1}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1b4332', marginBottom: '8px' }}>
                    {disease.displayName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                    <strong>Count:</strong> {disease.count}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <strong>Avg Confidence:</strong> {(disease.avgConfidence * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No disease data available</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
