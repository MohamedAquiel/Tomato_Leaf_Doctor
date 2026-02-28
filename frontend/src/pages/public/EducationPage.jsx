import { useState } from 'react'
import { Link } from 'react-router-dom'
const DISEASES = [
  {
    key: 'Tomato___Bacterial_Spot',
    display_name: 'Bacterial Spot',
    scientific_name: 'Xanthomonas campestris pv. vesicatoria',
    severity: 'High',
    is_healthy: false,
    description: 'Bacterial Spot is a serious disease caused by the bacterium Xanthomonas campestris pv. vesicatoria, affecting both leaves and fruits of tomato plants. It thrives in warm, wet conditions and spreads rapidly through rain splash, contaminated tools, and infected seeds.',
    symptoms: ['Small, water-soaked spots on leaves that turn brown with yellow halos','Lesions on fruit appear as raised, scab-like spots that may crack','Leaf spots coalesce causing large necrotic areas and defoliation','Dark, greasy-looking spots on stems and petioles','Premature leaf drop leading to sunscald on exposed fruits'],
    immediate_actions: ['Remove and destroy all infected plant material immediately','Avoid working in the field when plants are wet to prevent spread','Disinfect all tools with 10% bleach solution or 70% alcohol between uses','Apply copper-based bactericide as soon as symptoms are noticed'],
    chemical_treatment: ['Apply copper hydroxide (e.g., Kocide 3000) at 1.25-2.0 lb/acre every 7-10 days','Use copper oxychloride sprays during wet weather conditions','Combine copper bactericides with mancozeb for improved efficacy'],
    organic_treatment: ['Spray copper-based organic formulations every 5-7 days','Apply Bacillus subtilis-based biocontrol agents (e.g., Serenade) as a preventative','Use neem oil sprays to reduce bacterial populations on leaf surfaces'],
    prevention: ['Use certified disease-free or hot-water-treated seeds','Practice crop rotation of at least 2-3 years with non-solanaceous crops','Use drip irrigation instead of overhead watering to keep foliage dry','Plant resistant or tolerant tomato varieties when available'],
    recovery_time: '3-5 weeks with consistent copper treatment and favorable dry conditions',
  },
  {
    key: 'Tomato___Early_Blight',
    display_name: 'Early Blight',
    scientific_name: 'Alternaria solani',
    severity: 'Medium',
    is_healthy: false,
    description: 'Early Blight is a very common fungal disease of tomatoes caused by Alternaria solani, typically appearing on older, lower leaves first. It is favored by warm temperatures (24-29C), high humidity, and alternating wet and dry periods.',
    symptoms: ["Dark brown to black lesions with distinctive concentric rings forming a 'bull's-eye' pattern",'Lesions are initially small (3-4 mm) and appear on older, lower leaves first','Yellow chlorotic halo surrounding individual lesions','Affected leaves turn yellow, wither, and drop prematurely'],
    immediate_actions: ['Remove and dispose of heavily infected lower leaves immediately','Apply a fungicide (chlorothalonil or mancozeb) as soon as symptoms are detected','Mulch around the base of plants to prevent soil splash onto lower leaves'],
    chemical_treatment: ['Apply chlorothalonil (e.g., Bravo 720) at 1.5 pt/acre every 7-10 days','Use mancozeb-based fungicides on a 7-day spray schedule','Apply azoxystrobin or pyraclostrobin for systemic protection'],
    organic_treatment: ['Apply copper-based fungicides every 7 days','Use Bacillus subtilis biocontrol sprays preventatively','Spray neem oil (azadirachtin) solution every 7-14 days'],
    prevention: ['Practice crop rotation of at least 3 years','Use disease-resistant tomato varieties where available','Water at the base of plants using drip irrigation'],
    recovery_time: '2-3 weeks with proper treatment and dry weather conditions',
  },
  {
    key: 'Tomato___Late_Blight',
    display_name: 'Late Blight',
    scientific_name: 'Phytophthora infestans',
    severity: 'Critical',
    is_healthy: false,
    description: 'Late Blight is one of the most devastating diseases of tomatoes and potatoes, caused by Phytophthora infestans. It spreads extremely rapidly under cool, wet conditions and can destroy an entire crop within days if untreated.',
    symptoms: ['Large, irregularly shaped, water-soaked lesions on leaves that rapidly turn brown-black','White, cottony sporulation visible on the underside of leaves in humid conditions','Dark brown, greasy lesions on stems that cause plant collapse','Brown, firm, greasy rot on fruit that extends deep into the flesh'],
    immediate_actions: ['Remove and destroy all infected plants immediately -- do not compost','Apply a protectant fungicide immediately across the field','Avoid overhead irrigation and minimize leaf wetness'],
    chemical_treatment: ['Apply mancozeb as a protectant at 5-7 day intervals','Use metalaxyl + mancozeb for curative action','Apply cymoxanil + mancozeb for both protective and curative activity'],
    organic_treatment: ['Apply copper-based sprays every 5-7 days','Use Bacillus amyloliquefaciens-based biocontrol as a preventive','Apply phosphorous acid to boost plant systemic resistance'],
    prevention: ['Plant certified disease-free transplants and use resistant varieties','Avoid overhead irrigation; use drip irrigation','Monitor weather and apply fungicides prophylactically before high-risk periods'],
    recovery_time: 'Disease progression can be halted in 1-2 weeks but severely infected plants may not recover',
  },
  {
    key: 'Tomato___Leaf_Mold',
    display_name: 'Leaf Mold',
    scientific_name: 'Passalora fulva',
    severity: 'Medium',
    is_healthy: false,
    description: 'Leaf Mold is a fungal disease that primarily affects tomatoes grown in humid, enclosed environments such as greenhouses. It thrives at relative humidity above 85% and temperatures between 22-25C.',
    symptoms: ['Pale greenish-yellow spots on the upper surface of leaves','Olive-green to brown velvety mold growth on the underside of leaves','Infected leaves curl, wither, and drop prematurely','In severe cases, blossoms and fruit can also be affected'],
    immediate_actions: ['Immediately reduce greenhouse humidity by improving ventilation','Remove and dispose of heavily infected leaves','Apply a fungicide spray to slow disease spread'],
    chemical_treatment: ['Apply chlorothalonil every 7-10 days as a protectant','Use azoxystrobin or trifloxystrobin for systemic control','Apply difenoconazole or tebuconazole for curative action'],
    organic_treatment: ['Apply copper-based fungicides every 7 days','Use potassium bicarbonate sprays to create an alkaline leaf surface','Apply neem oil (1-2% solution) every 7-14 days'],
    prevention: ['Maintain relative humidity below 85% through ventilation','Use resistant tomato varieties','Avoid overhead watering; use drip irrigation'],
    recovery_time: '2-4 weeks with improved environmental control and fungicide treatment',
  },
  {
    key: 'Tomato___Septoria_Leaf_Spot',
    display_name: 'Septoria Leaf Spot',
    scientific_name: 'Septoria lycopersici',
    severity: 'Medium',
    is_healthy: false,
    description: 'Septoria Leaf Spot is one of the most destructive fungal diseases of tomato foliage. It commonly appears after the first fruit set and spreads rapidly during warm, wet weather, progressing from lower leaves upward.',
    symptoms: ['Numerous small, circular spots (3-6 mm) with dark brown margins and grey-white centers','Tiny dark pycnidia visible in the center of spots','Yellowing of surrounding leaf tissue leading to leaf death and drop','Severe defoliation leaving plants with only a few leaves at the top'],
    immediate_actions: ['Remove and destroy heavily infected lower leaves immediately','Apply a fungicide at the first sign of disease','Apply organic mulch around plants to prevent soil splash'],
    chemical_treatment: ['Apply chlorothalonil every 7-10 days as a protectant fungicide','Use mancozeb on a weekly schedule during wet weather','Apply azoxystrobin or pyraclostrobin for systemic activity'],
    organic_treatment: ['Apply copper sulfate or copper hydroxide sprays every 7 days','Use Bacillus subtilis-based biocontrol as a preventive spray','Apply neem oil solution (2%) every 7-10 days'],
    prevention: ['Practice a 3-year crop rotation','Remove all plant debris at end of season','Use drip irrigation and avoid wetting foliage'],
    recovery_time: '3-4 weeks with consistent fungicide applications and dry weather',
  },
  {
    key: 'Tomato___Spider_Mites Two-spotted_spider_mite',
    display_name: 'Spider Mites',
    scientific_name: 'Tetranychus urticae',
    severity: 'Medium',
    is_healthy: false,
    description: 'The Two-Spotted Spider Mite is a tiny arachnid pest that feeds on plant cells by piercing leaf tissue. Populations explode rapidly in hot, dry conditions and can cause severe damage within days, producing visible webbing.',
    symptoms: ['Fine stippling or bronzing on the upper leaf surface due to cell damage','Yellowing, browning, and premature drop of leaves in severe infestations','Fine silky webbing visible on the undersides of leaves','Tiny moving dots visible on the underside of leaves (the mites themselves)'],
    immediate_actions: ['Spray plants forcefully with a strong jet of water to dislodge mites','Apply a miticide or insecticidal soap spray immediately','Remove heavily infested leaves and dispose of them'],
    chemical_treatment: ['Apply abamectin as an effective miticide','Use bifenazate for rapid knockdown of mite populations','Apply spiromesifen which affects both adults and eggs'],
    organic_treatment: ['Apply insecticidal soap spray directly on mites','Use neem oil (2%) every 5-7 days to disrupt mite life cycle','Release predatory mites as biological control'],
    prevention: ['Monitor plants regularly, especially undersides of leaves','Maintain adequate soil moisture and avoid drought stress','Avoid excessive use of broad-spectrum insecticides that kill natural predators'],
    recovery_time: '1-3 weeks with effective miticide treatment and improved plant care',
  },
  {
    key: 'Tomato___Target_Spot',
    display_name: 'Target Spot',
    scientific_name: 'Corynespora cassiicola',
    severity: 'Medium',
    is_healthy: false,
    description: 'Target Spot is a fungal disease that affects tomato leaves, stems, and fruit. It is particularly problematic in tropical and subtropical regions with warm temperatures and high humidity, causing defoliation and fruit blemishes.',
    symptoms: ['Circular to irregular brown lesions with concentric ring patterns','Lesions may have a yellow halo and can enlarge to 1 cm or more','Dark brown, sunken spots on fruit','Leaf spots coalesce under heavy infection leading to defoliation'],
    immediate_actions: ['Remove and destroy infected leaves and plant debris immediately','Apply a broad-spectrum fungicide promptly','Improve ventilation and reduce canopy humidity by pruning lower leaves'],
    chemical_treatment: ['Apply azoxystrobin every 7-14 days for systemic protection','Use chlorothalonil as a protective spray every 7 days','Apply fluxapyroxad + pyraclostrobin for broad-spectrum control'],
    organic_treatment: ['Apply copper-based fungicides every 7 days as a protectant','Use Bacillus subtilis biocontrol sprays preventatively','Apply neem oil (2%) every 7-10 days'],
    prevention: ['Practice crop rotation of at least 2-3 years','Plant in well-drained soils','Stake plants and remove lower leaves to improve air circulation'],
    recovery_time: '3-4 weeks with proper fungicide management and favorable dry conditions',
  },
  {
    key: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    display_name: 'Yellow Leaf Curl Virus',
    scientific_name: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    severity: 'Critical',
    is_healthy: false,
    description: 'TYLCV is a devastating viral disease transmitted exclusively by the silverleaf whitefly (Bemisia tabaci). Plants infected early may suffer near-total yield loss, and there is no cure once a plant is infected.',
    symptoms: ['Upward and inward curling of young leaves giving a spoon-like appearance','Yellowing of leaf margins and interveinal areas on young leaves','Stunted plant growth with shortened internodes','Reduced flower set and flower drop leading to severely diminished fruit production'],
    immediate_actions: ['Remove and destroy infected plants immediately to reduce the virus reservoir','Apply insecticides to control whitefly populations','Install reflective mulches and yellow sticky traps to deter whiteflies'],
    chemical_treatment: ['Apply imidacloprid as a soil drench or foliar spray to control whiteflies','Use thiamethoxam or acetamiprid for systemic whitefly control','Apply spirotetramat for control of whitefly nymphs and adults'],
    organic_treatment: ['Apply insecticidal soap or neem oil sprays every 5-7 days','Use reflective silver or aluminum mulches to repel whiteflies','Release Encarsia formosa (parasitic wasp) for biological control'],
    prevention: ['Plant TYLCV-resistant or tolerant tomato varieties','Use insect-proof nets in seedling nurseries','Control whitefly populations aggressively before and after transplanting'],
    recovery_time: 'No recovery -- infected plants should be removed; prevent spread by controlling whitefly vectors',
  },
  {
    key: 'Tomato___Tomato_mosaic_virus',
    display_name: 'Mosaic Virus',
    scientific_name: 'Tomato Mosaic Virus (ToMV)',
    severity: 'High',
    is_healthy: false,
    description: 'Tomato Mosaic Virus is a highly stable plant virus that spreads primarily through mechanical contact -- via contaminated hands, tools, and plant debris. The virus can survive for years in dried plant material, making it extremely difficult to eradicate.',
    symptoms: ['Mosaic pattern of light and dark green patches on leaves','Leaf distortion, curling, and blistering','Stunted plant growth and reduced vigor','Fruit may show internal browning or uneven ripening'],
    immediate_actions: ['Remove and destroy confirmed infected plants immediately','Wash hands thoroughly with soap and water before and after handling plants','Disinfect all tools with 10% trisodium phosphate solution'],
    chemical_treatment: ['No effective chemical cures exist for viral infections in plants','Focus management on prevention and sanitation rather than chemical control','Apply insecticides only if secondary insect pests are also present'],
    organic_treatment: ['Apply diluted skim milk spray to tools and hands to inactivate the virus','Use neem oil or insecticidal soap to control any secondary insect pests','Remove infected plant material and deep-bury or burn rather than composting'],
    prevention: ['Use certified virus-free seeds','Plant resistant tomato varieties carrying Tm-2 or Tm-2 resistance genes','Practice strict hygiene -- wash hands and disinfect tools between plants'],
    recovery_time: 'No recovery for infected plants; remove them and protect remaining healthy plants',
  },
  {
    key: 'Tomato___Healthy',
    display_name: 'Healthy Plant',
    scientific_name: null,
    severity: 'None',
    is_healthy: true,
    description: 'Your tomato plant appears healthy with no visible signs of disease, pest damage, or nutritional deficiency. Healthy tomato plants have vibrant, deep green foliage, sturdy stems, and active growth.',
    symptoms: ['Vibrant, deep green leaves without spots, lesions, or discoloration','Sturdy stems with good turgor and upright posture','Active growth with normal internode spacing','Abundant, healthy flower and fruit set'],
    immediate_actions: ['Continue regular monitoring at least twice a week','Maintain consistent watering, fertilization, and staking routines','Remove any yellowing lower leaves as a standard sanitation practice'],
    chemical_treatment: ['No chemical treatment needed for healthy plants','Consider preventative copper fungicides if disease pressure in the area is high'],
    organic_treatment: ['Apply a balanced organic fertilizer to support continued vigorous growth','Use compost tea as a foliar spray to boost plant immunity','Apply neem oil preventatively every 2-3 weeks'],
    prevention: ['Water consistently at the base of plants using drip irrigation','Mulch around the base to conserve moisture and prevent soil splash','Practice crop rotation annually','Maintain proper plant nutrition with regular soil testing'],
    recovery_time: 'N/A -- plant is healthy; focus on maintaining current conditions',
  },
]

const CARE_TIPS = [
  { title: 'Watering', tip: 'Water deeply and consistently at the base of the plant. Avoid wetting foliage. Inconsistent watering leads to blossom end rot.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C6 10 4 14 4 17a8 8 0 0016 0c0-3-2-7-8-15z" fill="#2d6a4f" opacity="0.15" stroke="#2d6a4f" strokeWidth="1.8" strokeLinejoin="round"/><path d="M8 17a4 4 0 004 4" stroke="#2d6a4f" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { title: 'Sunlight', tip: 'Tomatoes need 6-8 hours of direct sunlight per day. Plant in the sunniest spot in your garden for best results.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#2d6a4f" opacity="0.2" stroke="#2d6a4f" strokeWidth="1.8"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#2d6a4f" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { title: 'Fertilizing', tip: 'Use a balanced fertilizer high in phosphorus at planting. Switch to potassium-rich fertilizer once fruiting begins.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22c-4 0-7-3-7-7 0-4 7-13 7-13s7 9 7 13c0 4-3 7-7 7z" fill="#2d6a4f" opacity="0.12" stroke="#2d6a4f" strokeWidth="1.8"/><path d="M9 17c0-2 3-5 3-5s3 3 3 5" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { title: 'Pruning', tip: 'Remove suckers that grow between the main stem and branches. This improves airflow and directs energy to fruit production.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 3l12 18M18 3L6 21" stroke="#2d6a4f" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="2" fill="#2d6a4f"/></svg> },
  { title: 'Crop Rotation', tip: 'Do not plant tomatoes in the same location more than once every 3 years. Rotate with non-solanaceous crops to reduce soilborne disease.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M1 4v6h6M23 20v-6h-6" stroke="#2d6a4f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" stroke="#2d6a4f" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { title: 'Early Detection', tip: 'Inspect plants twice weekly, checking leaf undersides. Most diseases are much easier to manage when caught early.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#2d6a4f" strokeWidth="1.8"/><path d="M21 21l-4.35-4.35" stroke="#2d6a4f" strokeWidth="1.8" strokeLinecap="round"/><path d="M11 8v6M8 11h6" stroke="#2d6a4f" strokeWidth="1.5" strokeLinecap="round"/></svg> },
]

const SEVERITY_COLORS = {
  Critical: { bg: '#fff0f0', text: '#c0392b', border: '#f5c6c6' },
  High:     { bg: '#fff8e1', text: '#b7770d', border: '#fde8a0' },
  Medium:   { bg: '#e8f4fd', text: '#1a6ea8', border: '#b8ddf5' },
  None:     { bg: '#e8f8ef', text: '#1b8a4a', border: '#a8e6be' },
}

const S = {
  page: { backgroundColor: '#fff', minHeight: '100vh' },
  hero: { background: '#f0f7f4', padding: '3.5rem 1.5rem 3rem', textAlign: 'center' },
  badge: { display:'inline-block', background:'#d8f3dc', color:'#2d6a4f', fontSize:'0.8rem', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.6px', borderRadius:'999px', padding:'0.28rem 0.85rem', marginBottom:'1rem' },
  heroH: { fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:'800', color:'#1b4332', margin:'0 0 0.75rem', lineHeight:'1.2' },
  heroP: { color:'#5a6a60', maxWidth:'560px', margin:'0 auto', lineHeight:'1.65', fontSize:'0.97rem' },
  section: { maxWidth:'1080px', margin:'0 auto', padding:'3.5rem 1.5rem' },
  sectionH: { fontSize:'1.5rem', fontWeight:'700', color:'#1b4332', marginBottom:'0.4rem' },
  sectionSub: { color:'#6c757d', fontSize:'0.93rem', marginBottom:'2rem' },
  filterRow: { display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'2rem' },
  filterBtn: { padding:'0.38rem 0.9rem', borderRadius:'999px', border:'1.5px solid #b7dfc9', background:'transparent', color:'#2d6a4f', fontWeight:'600', fontSize:'0.83rem', cursor:'pointer', transition:'all 0.15s' },
  filterBtnActive: { background:'#2d6a4f', color:'#fff', borderColor:'#2d6a4f' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' },
  card: { border:'1.5px solid #e5ede9', borderRadius:'14px', padding:'1.5rem', cursor:'pointer', transition:'box-shadow 0.18s, transform 0.18s', background:'#fff' },
  cardTop: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'0.75rem' },
  cardName: { fontSize:'1.05rem', fontWeight:'700', color:'#1b4332', margin:'0 0 0.2rem' },
  cardSci: { fontSize:'0.78rem', color:'#7a9589', fontStyle:'italic', margin:0 },
  sevBadge: { fontSize:'0.72rem', fontWeight:'700', borderRadius:'6px', padding:'0.2rem 0.55rem', whiteSpace:'nowrap', flexShrink:0 },
  cardDesc: { fontSize:'0.87rem', color:'#555', lineHeight:'1.6', margin:'0 0 1rem' },
  cardFooter: { display:'flex', alignItems:'center', justifyContent:'space-between' },
  recoveryText: { fontSize:'0.78rem', color:'#7a9589' },
  readMore: { fontSize:'0.82rem', fontWeight:'700', color:'#2d6a4f', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.3rem', background:'none', border:'none', cursor:'pointer', padding:0 },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1000, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'2rem 1rem', overflowY:'auto' },
  modal: { background:'#fff', borderRadius:'16px', width:'100%', maxWidth:'720px', padding:'2rem', position:'relative', marginTop:'1rem', marginBottom:'1rem' },
  modalClose: { position:'absolute', top:'1rem', right:'1rem', background:'#f0f7f4', border:'none', borderRadius:'8px', width:'34px', height:'34px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#2d6a4f' },
  modalH: { fontSize:'1.4rem', fontWeight:'800', color:'#1b4332', margin:'0 0 0.25rem' },
  modalSci: { fontSize:'0.85rem', color:'#7a9589', fontStyle:'italic', margin:'0 0 1rem' },
  modalDesc: { fontSize:'0.93rem', color:'#444', lineHeight:'1.7', margin:'0 0 1.25rem', padding:'1rem', background:'#f8faf9', borderRadius:'10px', borderLeft:'3px solid #2d6a4f' },
  subH: { fontSize:'0.88rem', fontWeight:'700', color:'#2d6a4f', textTransform:'uppercase', letterSpacing:'0.5px', margin:'1.25rem 0 0.6rem', display:'flex', alignItems:'center', gap:'0.5rem' },
  list: { margin:'0 0 0.5rem', paddingLeft:'1.25rem' },
  listItem: { fontSize:'0.88rem', color:'#444', lineHeight:'1.65', marginBottom:'0.3rem' },
  recoveryBox: { background:'#f0f7f4', borderRadius:'10px', padding:'0.75rem 1rem', marginTop:'1.25rem', fontSize:'0.87rem', color:'#2d6a4f', fontWeight:'600' },
  careTipGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'1.1rem' },
  tipCard: { background:'#f8faf9', border:'1.5px solid #e5ede9', borderRadius:'12px', padding:'1.25rem' },
  tipTop: { display:'flex', alignItems:'center', gap:'0.65rem', marginBottom:'0.5rem' },
  tipTitle: { fontSize:'0.97rem', fontWeight:'700', color:'#1b4332', margin:0 },
  tipText: { fontSize:'0.85rem', color:'#555', lineHeight:'1.6', margin:0 },
  ctaSection: { background:'#2d6a4f', padding:'3rem 1.5rem', textAlign:'center' },
  ctaH: { fontSize:'1.5rem', fontWeight:'700', color:'#fff', margin:'0 0 0.6rem' },
  ctaP: { color:'#b7e4c7', fontSize:'0.95rem', margin:'0 0 1.5rem' },
  ctaBtn: { display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.7rem 1.6rem', background:'#fff', color:'#2d6a4f', borderRadius:'8px', fontWeight:'700', fontSize:'0.97rem', textDecoration:'none', border:'2px solid #fff' },
  divider: { height:'1px', background:'#e9ecef', margin:'0 1.5rem' },
}

const FILTERS = ['All', 'Critical', 'High', 'Medium', 'Healthy']

const SectionList = ({ items, color }) => (
  <ul style={S.list}>
    {items.map((item, i) => (
      <li key={i} style={S.listItem}>{item}</li>
    ))}
  </ul>
)

const DiseaseModal = ({ disease, onClose }) => {
  const sev = SEVERITY_COLORS[disease.severity] || SEVERITY_COLORS.None
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <button style={S.modalClose} onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
          <div>
            <h2 style={S.modalH}>{disease.display_name}</h2>
            {disease.scientific_name && <p style={S.modalSci}>{disease.scientific_name}</p>}
          </div>
          <span style={{ ...S.sevBadge, background: sev.bg, color: sev.text, border: `1px solid ${sev.border}`, marginTop:'0.2rem' }}>{disease.severity}</span>
        </div>

        <p style={S.modalDesc}>{disease.description}</p>

        <p style={S.subH}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Symptoms
        </p>
        <SectionList items={disease.symptoms} />

        <p style={S.subH}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          Immediate Actions
        </p>
        <SectionList items={disease.immediate_actions} />

        {!disease.is_healthy && (
          <>
            <p style={S.subH}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round"><path d="M19 9l-7 4-7-4V5l7 4 7-4v4z"/><path d="M5 13l7 4 7-4"/><path d="M5 17l7 4 7-4"/></svg>
              Chemical Treatment
            </p>
            <SectionList items={disease.chemical_treatment} />

            <p style={S.subH}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Organic Treatment
            </p>
            <SectionList items={disease.organic_treatment} />
          </>
        )}

        <p style={S.subH}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9 12l2 2 4-4"/></svg>
          Prevention
        </p>
        <SectionList items={disease.prevention} />

        <div style={S.recoveryBox}>
          Recovery / Outlook: {disease.recovery_time}
        </div>
      </div>
    </div>
  )
}

const EducationPage = () => {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = DISEASES.filter(d => {
    const matchFilter = filter === 'All'
      ? true
      : filter === 'Healthy'
        ? d.is_healthy
        : d.severity === filter
    const matchSearch = d.display_name.toLowerCase().includes(search.toLowerCase()) ||
      (d.scientific_name || '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div style={S.page}>
      {}
      <section style={S.hero}>
        <div style={S.badge}>Disease Encyclopedia</div>
        <h1 style={S.heroH}>Tomato Disease Education Center</h1>
        <p style={S.heroP}>
          Learn to identify, treat, and prevent the 9 most common tomato leaf diseases.
          Backed by agricultural science ? written for every grower.
        </p>
      </section>

      {}
      <section style={S.section}>
        <h2 style={S.sectionH}>Disease Library</h2>
        <p style={S.sectionSub}>Click any card to view full symptoms, treatments, and prevention strategies</p>

        {}
        <div style={{ position:'relative', maxWidth:'400px', marginBottom:'1.25rem' }}>
          <svg style={{ position:'absolute', left:'0.85rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a9589" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            type="text"
            placeholder="Search disease or pathogen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width:'100%', padding:'0.6rem 0.85rem 0.6rem 2.5rem', borderRadius:'8px', border:'1.5px solid #d0e8db', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' }}
          />
        </div>

        {}
        <div style={S.filterRow}>
          {FILTERS.map(f => (
            <button
              key={f}
              style={filter === f ? { ...S.filterBtn, ...S.filterBtnActive } : S.filterBtn}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {}
        {filtered.length === 0 ? (
          <p style={{ color:'#6c757d', textAlign:'center', padding:'2rem' }}>No diseases match your search.</p>
        ) : (
          <div style={S.grid}>
            {filtered.map(d => {
              const sev = SEVERITY_COLORS[d.severity] || SEVERITY_COLORS.None
              return (
                <div
                  key={d.key}
                  style={S.card}
                  onClick={() => setSelected(d)}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(45,106,79,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={S.cardTop}>
                    <div>
                      <p style={S.cardName}>{d.display_name}</p>
                      {d.scientific_name && <p style={S.cardSci}>{d.scientific_name}</p>}
                    </div>
                    <span style={{ ...S.sevBadge, background: sev.bg, color: sev.text, border: `1px solid ${sev.border}` }}>
                      {d.severity}
                    </span>
                  </div>
                  <p style={S.cardDesc}>{d.description.slice(0, 140)}?</p>
                  <div style={S.cardFooter}>
                    <span style={S.recoveryText}>{d.symptoms.length} symptoms listed</span>
                    <button style={S.readMore} onClick={() => setSelected(d)}>
                      View Details
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <div style={S.divider} />

      {}
      <section style={S.section}>
        <h2 style={S.sectionH}>General Tomato Care Tips</h2>
        <p style={S.sectionSub}>Best practices to keep your plants healthy and productive all season</p>
        <div style={S.careTipGrid}>
          {CARE_TIPS.map(t => (
            <div key={t.title} style={S.tipCard}>
              <div style={S.tipTop}>
                <div style={{ width:'40px', height:'40px', background:'#d8f3dc', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{t.icon}</div>
                <h3 style={S.tipTitle}>{t.title}</h3>
              </div>
              <p style={S.tipText}>{t.tip}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={S.divider} />

      {}
      <section style={S.section}>
        <h2 style={S.sectionH}>Severity Guide</h2>
        <p style={S.sectionSub}>Understanding how we classify disease severity levels</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
          {[
            { level:'Critical', desc:'Rapid spread, potential total crop loss. Requires immediate action. (e.g. Late Blight, TYLCV)', ...SEVERITY_COLORS.Critical },
            { level:'High', desc:'Significant damage likely without prompt treatment. Can spread widely. (e.g. Bacterial Spot)', ...SEVERITY_COLORS.High },
            { level:'Medium', desc:'Manageable with timely intervention. Limited spread under good conditions. (e.g. Early Blight)', ...SEVERITY_COLORS.Medium },
            { level:'None', desc:'Plant is healthy. Focus on preventive care to maintain this status.', ...SEVERITY_COLORS.None },
          ].map(s => (
            <div key={s.level} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius:'12px', padding:'1.25rem' }}>
              <span style={{ fontWeight:'800', fontSize:'1rem', color: s.text }}>{s.level}</span>
              <p style={{ fontSize:'0.85rem', color:'#444', lineHeight:'1.6', margin:'0.5rem 0 0' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {}
      <section style={S.ctaSection}>
        <h2 style={S.ctaH}>Think your plant has a disease?</h2>
        <p style={S.ctaP}>Upload a photo and let our AI identify it instantly ? for free.</p>
        <Link to="/predict" style={S.ctaBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Start Free Diagnosis
        </Link>
      </section>

      {}
      {selected && <DiseaseModal disease={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default EducationPage
