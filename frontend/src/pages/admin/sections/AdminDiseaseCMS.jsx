import React, { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';

const DISEASES = [
  {
    key: 'bacterial_spot',
    display_name: 'Bacterial Spot',
    scientific_name: 'Xanthomonas species',
    severity: 'High',
    description: 'Bacterial spot is a common disease affecting tomato leaves, causing small, dark, oily-looking lesions.',
    symptoms: ['Small dark spots with yellow halos on leaves', 'Lesions may have a water-soaked appearance', 'Spots can coalesce and cause leaf yellowing', 'Defoliation in severe cases'],
    immediate_actions: ['Remove infected leaves immediately', 'Isolate affected plants', 'Avoid overhead watering', 'Sterilize tools between plants'],
    chemical_treatment: ['Copper-based fungicides (e.g., Bordeaux mixture)', 'Streptomycin antibiotics (Agrimycin)', 'Fixed copper spray applied weekly'],
    organic_treatment: ['Neem oil spray', 'Sulfur-based treatments', 'Bacillus subtilis bioagent', 'Potassium bicarbonate'],
    prevention: ['Use disease-resistant varieties', 'Ensure good air circulation', 'Water at soil level only', 'Practice crop rotation (3+ year gap)', 'Sanitize equipment regularly'],
    recovery_time: '14-21 days with treatment'
  },
  {
    key: 'early_blight',
    display_name: 'Early Blight',
    scientific_name: 'Alternaria solani',
    severity: 'High',
    description: 'Early blight causes distinctive concentric ring lesions on tomato leaves, starting from lower foliage.',
    symptoms: ['Brown spots with concentric rings (target pattern)', 'Spots start on lower leaves and move upward', 'Yellow halo around lesions', 'Premature leaf drop'],
    immediate_actions: ['Remove affected lower leaves (bottom 12 inches)', 'Improve air circulation', 'Mulch to prevent soil splash', 'Reduce leaf wetness duration'],
    chemical_treatment: ['Mancozeb fungicide', 'Chlorothalonil', 'Copper fungicides', 'Daconil spray schedule'],
    organic_treatment: ['Sulfur dust or spray', 'Neem oil', 'Bacillus subtilis', 'Potassium bicarbonate'],
    prevention: ['Remove lower leaves proactively', 'Space plants properly', 'Use drip irrigation', 'Apply mulch layer', 'Crop rotation (2+ years)'],
    recovery_time: '7-14 days for visible improvement'
  },
  {
    key: 'late_blight',
    display_name: 'Late Blight',
    scientific_name: 'Phytophthora infestans',
    severity: 'Critical',
    description: 'Late blight is a severe disease causing rapid leaf and fruit decay, particularly in cool, wet conditions.',
    symptoms: ['Water-soaked lesions with white mold on leaf undersides', 'Lesions spread rapidly in cool, wet weather', 'Fruit rot develops', 'Complete defoliation possible within days'],
    immediate_actions: ['Remove all infected leaves and stems immediately', 'Destroy infected plant material', 'Increase air circulation', 'Avoid wetting foliage'],
    chemical_treatment: ['Metalaxyl fungicide', 'Mefenoxam-based products', 'Copper-mancozeb combination', 'Ridomil Gold'],
    organic_treatment: ['Copper sulfate', 'Sulfur spray', 'Bacillus subtilis', 'Fixed copper products'],
    prevention: ['Plant resistant varieties', 'Ensure excellent drainage', 'Space plants for air flow', 'Water only at soil level', 'Remove volunteer plants'],
    recovery_time: '10-21 days (may require replanting)'
  },
  {
    key: 'leaf_mold',
    display_name: 'Leaf Mold',
    scientific_name: 'Fulvia fulva (Cladosporium fulvum)',
    severity: 'Medium',
    description: 'Leaf mold thrives in humid conditions, causing fuzzy mold growth on leaf undersides.',
    symptoms: ['Pale yellow spots on upper leaf surface', 'Gray-green fuzzy mold on undersides', 'Spots merge and leaves turn brown', 'Defoliation in humid conditions'],
    immediate_actions: ['Improve ventilation immediately', 'Remove lower infected leaves', 'Reduce humidity', 'Avoid overhead watering'],
    chemical_treatment: ['Sulfur dust or spray', 'Chlorothalonil fungicide', 'Mancozeb', 'Triadimefon'],
    organic_treatment: ['Sulfur spray', 'Neem oil', 'Potassium bicarbonate', 'Bacillus subtilis'],
    prevention: ['Maintain 50-60% humidity', 'Ensure good air circulation', 'Space plants adequately', 'Water early in morning', 'Avoid leaf wetting'],
    recovery_time: '7-10 days with humidity control'
  },
  {
    key: 'septoria_leaf_spot',
    display_name: 'Septoria Leaf Spot',
    scientific_name: 'Septoria lycopersici',
    severity: 'Medium',
    description: 'Septoria leaf spot causes small, circular lesions with dark margins and gray centers with black spore-bearing structures.',
    symptoms: ['Small circular brown spots with dark borders', 'Gray centers with dark specks (pycnidia)', 'Spots on lower leaves first', 'Progressive upward spread'],
    immediate_actions: ['Remove infected leaves', 'Improve air circulation', 'Sanitize pruning tools', 'Avoid wetting foliage'],
    chemical_treatment: ['Chlorothalonil', 'Mancozeb', 'Copper fungicides', 'Daconil weekly'],
    organic_treatment: ['Sulfur spray', 'Neem oil', 'Bacillus subtilis', 'Potassium bicarbonate'],
    prevention: ['Remove lower leaves', 'Mulch soil', 'Water at base only', 'Space for air flow', '2-3 year crop rotation'],
    recovery_time: '10-14 days'
  },
  {
    key: 'powdery_mildew',
    display_name: 'Powdery Mildew',
    scientific_name: 'Oidiopsis taurica',
    severity: 'Medium',
    description: 'Powdery mildew covers leaves with white powdery coating, reducing photosynthesis.',
    symptoms: ['White powder on leaves (upper and lower surfaces)', 'Affected leaves appear dusty', 'Leaf curling and yellowing', 'Stunted growth'],
    immediate_actions: ['Remove heavily infected leaves', 'Improve air circulation', 'Reduce humidity', 'Prune lower foliage'],
    chemical_treatment: ['Sulfur dust or spray', 'Potassium bicarbonate (Milstop)', 'Neem oil', 'Triforine'],
    organic_treatment: ['Sulfur spray (prevent fungal spread)', 'Neem oil', 'Baking soda spray', 'Milk spray solution'],
    prevention: ['Avoid high humidity', 'Space plants well', 'Morning watering only', 'Avoid nitrogen excess', 'Remove infected leaves early'],
    recovery_time: '5-10 days'
  },
  {
    key: 'fusarium_wilt',
    display_name: 'Fusarium Wilt',
    scientific_name: 'Fusarium oxysporum f.sp. lycopersici',
    severity: 'Critical',
    description: 'Fusarium wilt is a vascular disease causing wilting and yellowing. It persists in soil for years.',
    symptoms: ['Wilting on one side of plant initially', 'Yellowing of lower leaves', 'Brown vascular discoloration in stem', 'Plant death within weeks'],
    immediate_actions: ['Remove infected plant entirely', 'Do not compost affected material', 'Dispose in sealed bags', 'Sterilize soil if possible'],
    chemical_treatment: ['Thiophanate-methyl (Topsin M)', 'Carbendazim', 'No cure once established', 'Soil solarization'],
    organic_treatment: ['Trichoderma bioagent', 'Bacillus subtilis', 'Mycorrhizal fungi inoculation', 'Resistant rootstock grafting'],
    prevention: ['Use resistant varieties (VF rated)', 'Practice strict crop rotation (5+ years)', 'Avoid infected soil', 'Sterilize tools and equipment', 'Use disease-free transplants'],
    recovery_time: 'Cannot be cured (plant removal required)'
  },
  {
    key: 'verticillium_wilt',
    display_name: 'Verticillium Wilt',
    scientific_name: 'Verticillium dahliae',
    severity: 'Critical',
    description: 'Verticillium wilt is a soil-borne vascular disease causing gradual wilting and yellowing.',
    symptoms: ['Wilting of lower leaves initially', 'V-shaped yellow lesions on leaflets', 'Brown vascular streaks in stem', 'Plant yellowing and death'],
    immediate_actions: ['Remove affected plants completely', 'Do not compost material', 'Sanitize soil thoroughly', 'Sterilize equipment'],
    chemical_treatment: ['Difficult to control chemically', 'Soil solarization recommended', 'Fungicide prevention (carbendazim)', 'May require soil replacement'],
    organic_treatment: ['Solarization of soil', 'Trichoderma application', 'Compost amendments', 'Resistant variety planting'],
    prevention: ['Rotate crops 4+ years', 'Use resistant varieties', 'Avoid infected soil', 'Clean equipment thoroughly', 'Improve soil drainage'],
    recovery_time: 'Cannot be cured (replanting required)'
  },
  {
    key: 'target_spot',
    display_name: 'Target Spot',
    scientific_name: 'Corynespora cassiicola',
    severity: 'Medium',
    description: 'Target spot creates distinctive concentric ring patterns on leaves and fruits in warm, humid conditions.',
    symptoms: ['Brown circular lesions with concentric rings', 'Yellow halo around lesions', 'Spots appear on fruit and leaves', 'Defoliation in severe cases'],
    immediate_actions: ['Remove infected leaves', 'Improve air circulation', 'Reduce humidity', 'Avoid overhead watering'],
    chemical_treatment: ['Mancozeb fungicide', 'Chlorothalonil', 'Copper-based sprays', 'Daconil applications'],
    organic_treatment: ['Sulfur dust', 'Neem oil', 'Bacillus subtilis', 'Potassium bicarbonate'],
    prevention: ['Space plants properly', 'Mulch to prevent soil splash', 'Water at base only', 'Remove lower leaves', 'Crop rotation (2 years)'],
    recovery_time: '10-14 days'
  },
  {
    key: 'healthy',
    display_name: 'Healthy Leaf',
    scientific_name: 'No pathogen detected',
    severity: 'None',
    description: 'The tomato plant is healthy with no visible signs of disease. Maintain good cultural practices.',
    symptoms: ['Green vibrant foliage', 'No spots or lesions', 'Normal leaf shape and size', 'Vigorous growth'],
    immediate_actions: ['Continue current care routine', 'Monitor regularly', 'Maintain good practices', 'Keep records of conditions'],
    chemical_treatment: ['No treatment necessary', 'Continue preventive spray schedule if applicable', 'Monitor for early signs', 'Preventive care only'],
    organic_treatment: ['Continue organic practices', 'No intervention needed', 'Maintain hygiene', 'Regular inspections'],
    prevention: ['Continue crop rotation', 'Maintain air circulation', 'Water properly', 'Monitor regularly', 'Keep records'],
    recovery_time: 'N/A - maintain health'
  }
];

const AdminDiseaseCMS = () => {
  const [diseases, setDiseases] = useState(DISEASES);
  const [selectedKey, setSelectedKey] = useState('bacterial_spot');
  const [editData, setEditData] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');

  const selected = diseases.find(d => d.key === selectedKey);

  const handleSelectDisease = (key) => {
    setSelectedKey(key);
    setSaveMessage('');
    const disease = diseases.find(d => d.key === key);
    setEditData({
      description: disease.description,
      symptoms: disease.symptoms.join('\n'),
      immediate_actions: disease.immediate_actions.join('\n'),
      chemical_treatment: disease.chemical_treatment.join('\n'),
      organic_treatment: disease.organic_treatment.join('\n'),
      prevention: disease.prevention.join('\n'),
      recovery_time: disease.recovery_time
    });
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setDiseases(diseases.map(d => {
      if (d.key === selectedKey) {
        return {
          ...d,
          description: editData.description,
          symptoms: editData.symptoms.split('\n').filter(s => s.trim()),
          immediate_actions: editData.immediate_actions.split('\n').filter(s => s.trim()),
          chemical_treatment: editData.chemical_treatment.split('\n').filter(s => s.trim()),
          organic_treatment: editData.organic_treatment.split('\n').filter(s => s.trim()),
          prevention: editData.prevention.split('\n').filter(s => s.trim()),
          recovery_time: editData.recovery_time
        };
      }
      return d;
    }));
    setSaveMessage('[OK] Changes saved to browser memory');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return { bg: '#ffcdd2', text: '#b71c1c' };
      case 'High': return { bg: '#ffe0b2', text: '#e65100' };
      case 'Medium': return { bg: '#bbdefb', text: '#01579b' };
      case 'None': return { bg: '#c8e6c9', text: '#2e7d32' };
      default: return { bg: '#e0e0e0', text: '#666' };
    }
  };

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="13 2 6 11 2 7" />
    </svg>
  );

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600', color: '#1b4332' }}>
          Disease & Solutions CMS
        </h1>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
          View and edit the treatment solutions for each disease class. Changes are stored in browser only (backend file editing requires server access).
        </p>

        {saveMessage && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            backgroundColor: '#c8e6c9',
            border: '1px solid #2e7d32',
            borderRadius: '4px',
            color: '#2e7d32',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckIcon /> {saveMessage}
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px', minHeight: '600px' }}>
          {}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {diseases.map(disease => {
                const severityColor = getSeverityColor(disease.severity);
                return (
                  <button
                    key={disease.key}
                    onClick={() => handleSelectDisease(disease.key)}
                    style={{
                      padding: '12px',
                      border: selectedKey === disease.key ? '2px solid #2d6a4f' : '1px solid #d0d0d0',
                      borderRadius: '4px',
                      backgroundColor: selectedKey === disease.key ? '#f0f7f4' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1b4332', marginBottom: '4px' }}>
                      {disease.display_name}
                    </div>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 6px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: '500',
                      backgroundColor: severityColor.bg,
                      color: severityColor.text
                    }}>
                      {disease.severity}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {}
          {selected && editData && (
            <div style={{ flex: 1, maxWidth: '800px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600', color: '#1b4332' }}>
                    {selected.display_name}
                  </h2>
                  <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>
                    {selected.scientific_name}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1b4332', marginBottom: '8px' }}>
                      Description
                    </label>
                    <textarea
                      value={editData.description}
                      onChange={(e) => handleEditChange('description', e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '8px',
                        border: '1px solid #d0d0d0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1b4332', marginBottom: '8px' }}>
                      Symptoms (one per line)
                    </label>
                    <textarea
                      value={editData.symptoms}
                      onChange={(e) => handleEditChange('symptoms', e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '8px',
                        border: '1px solid #d0d0d0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1b4332', marginBottom: '8px' }}>
                      Immediate Actions (one per line)
                    </label>
                    <textarea
                      value={editData.immediate_actions}
                      onChange={(e) => handleEditChange('immediate_actions', e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '8px',
                        border: '1px solid #d0d0d0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1b4332', marginBottom: '8px' }}>
                      Chemical Treatment (one per line)
                    </label>
                    <textarea
                      value={editData.chemical_treatment}
                      onChange={(e) => handleEditChange('chemical_treatment', e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '8px',
                        border: '1px solid #d0d0d0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1b4332', marginBottom: '8px' }}>
                      Organic Treatment (one per line)
                    </label>
                    <textarea
                      value={editData.organic_treatment}
                      onChange={(e) => handleEditChange('organic_treatment', e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '8px',
                        border: '1px solid #d0d0d0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1b4332', marginBottom: '8px' }}>
                      Prevention (one per line)
                    </label>
                    <textarea
                      value={editData.prevention}
                      onChange={(e) => handleEditChange('prevention', e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '8px',
                        border: '1px solid #d0d0d0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1b4332', marginBottom: '8px' }}>
                      Recovery Time
                    </label>
                    <input
                      type="text"
                      value={editData.recovery_time}
                      onChange={(e) => handleEditChange('recovery_time', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #d0d0d0',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ paddingTop: '12px' }}>
                    <button
                      onClick={handleSave}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#2d6a4f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#1b4332'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#2d6a4f'}
                    >
                      Save Changes
                    </button>
                  </div>

                  <div style={{
                    padding: '12px',
                    backgroundColor: '#e3f2fd',
                    borderLeft: '4px solid #1976d2',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#01579b',
                    marginTop: '12px'
                  }}>
                    <strong>Note:</strong> To persist changes permanently, update solutions.json in the ml_service directory.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDiseaseCMS;
