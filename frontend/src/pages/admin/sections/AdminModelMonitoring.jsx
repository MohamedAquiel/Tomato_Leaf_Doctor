import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { getDashboardStats } from '../../../api/users';

const CLASS_LABELS = [
  'Tomato___Bacterial_Spot',
  'Tomato___Early_Blight',
  'Tomato___Late_Blight',
  'Tomato___Leaf_Mold',
  'Tomato___Septoria_Leaf_Spot',
  'Tomato___Spider_Mites Two-spotted_spider_mite',
  'Tomato___Target_Spot',
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'Tomato___Tomato_mosaic_virus',
  'Tomato___Healthy',
];

const CLASS_DISPLAY_NAMES = {
  'Tomato___Bacterial_Spot': 'Bacterial Spot',
  'Tomato___Early_Blight': 'Early Blight',
  'Tomato___Late_Blight': 'Late Blight',
  'Tomato___Leaf_Mold': 'Leaf Mold',
  'Tomato___Septoria_Leaf_Spot': 'Septoria Leaf Spot',
  'Tomato___Spider_Mites Two-spotted_spider_mite': 'Spider Mites (Two-spotted)',
  'Tomato___Target_Spot': 'Target Spot',
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': 'TYLCV',
  'Tomato___Tomato_mosaic_virus': 'Tomato Mosaic Virus',
  'Tomato___Healthy': 'Healthy',
};

const AdminModelMonitoring = () => {
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
          setError('Failed to load model monitoring data');
        }
      } catch (err) {
        setError('Error fetching model data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#52b788" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  const AlertIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff9800" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );

  if (loading) {
    return (
      <AdminLayout>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1b4332', marginBottom: '8px' }}>Model Monitoring</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <Skeleton />
            <Skeleton />
          </div>
          <Skeleton height="400px" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1b4332', marginBottom: '8px' }}>Model Monitoring</h1>
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
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1b4332', marginBottom: '8px' }}>Model Monitoring</h1>
          <p style={{ color: '#999' }}>No data available</p>
        </div>
      </AdminLayout>
    );
  }
  const classPerformanceData = CLASS_LABELS.map(classLabel => {
    const diseaseData = stats.predictionsByDisease.find(d => d.diseaseKey === classLabel);
    return {
      classLabel,
      displayName: CLASS_DISPLAY_NAMES[classLabel],
      count: diseaseData?.count || 0,
      avgConfidence: diseaseData?.avgConfidence || 0,
    };
  });

  const uniqueDiseaseCount = stats.predictionsByDisease.filter(d => d.count > 0).length;
  const modelHealthy = stats.totalPredictions > 0;

  return (
    <AdminLayout>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      <div style={{ padding: '24px' }}>
        {}
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1b4332', marginBottom: '32px' }}>Model Monitoring</h1>

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
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1b4332', marginBottom: '16px' }}>Model Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Model Name
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1b4332' }}>Best Improved CNN</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Architecture
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1b4332' }}>Convolutional Neural Network</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Input Size
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1b4332' }}>128x128 px</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Classes
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1b4332' }}>10</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Framework
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1b4332' }}>TensorFlow / Keras</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Model File
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1b4332' }}>best_improved_cnn.h5</div>
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
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1b4332', marginBottom: '16px' }}>Model Health</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div
              style={{
                backgroundColor: 'white',
                border: `1px solid ${modelHealthy ? '#d1e7dd' : '#fff3cd'}`,
                borderRadius: '6px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {modelHealthy ? <CheckIcon /> : <AlertIcon />}
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Status</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: modelHealthy ? '#52b788' : '#ff9800' }}>
                  {modelHealthy ? 'Operational' : 'No Predictions'}
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: 'white',
                border: '1px solid #d1e7dd',
                borderRadius: '6px',
                padding: '16px',
              }}
            >
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Predictions Processed</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1b4332' }}>{stats.totalPredictions}</div>
            </div>
            <div
              style={{
                backgroundColor: 'white',
                border: '1px solid #d1e7dd',
                borderRadius: '6px',
                padding: '16px',
              }}
            >
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Unique Diseases Detected</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1b4332' }}>{uniqueDiseaseCount}</div>
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
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1b4332', marginBottom: '20px' }}>Class Performance</h2>
          {classPerformanceData.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {classPerformanceData.map((classData, idx) => {
                const maxCount = Math.max(...classPerformanceData.map(d => d.count));
                const barWidth = maxCount > 0 ? (classData.count / maxCount) * 100 : 0;

                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1b4332', minWidth: '200px' }}>
                        {classData.displayName}
                      </span>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#666', minWidth: '80px', textAlign: 'right' }}>
                          Count: {classData.count}
                        </span>
                        <span style={{ fontSize: '12px', color: '#666', minWidth: '100px', textAlign: 'right' }}>
                          Avg Conf: {(classData.avgConfidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: '20px',
                        backgroundColor: '#e8f5e9',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${barWidth}%`,
                          backgroundColor: '#2d6a4f',
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
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No class performance data available</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminModelMonitoring;
