import { useState } from 'react'

const S = {
  page: { background: '#fff', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #40916c 100%)', padding: '4rem 1.5rem 3.5rem', textAlign: 'center', color: '#fff' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#d8f3dc', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.7px', borderRadius: '999px', padding: '0.3rem 1rem', marginBottom: '1.25rem' },
  heroH: { fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: '800', margin: '0 0 0.75rem', lineHeight: 1.2 },
  heroP: { color: '#b7e4c7', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 },
  body: { maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', alignItems: 'start' },
  infoH: { fontSize: '1.3rem', fontWeight: '700', color: '#1b4332', marginBottom: '0.4rem' },
  infoP: { color: '#6b7280', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '2rem' },
  contactCard: { background: '#f8faf9', border: '1.5px solid #e5ede9', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' },
  contactIcon: { width: '40px', height: '40px', background: '#d8f3dc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  contactLabel: { fontSize: '0.78rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 0.2rem' },
  contactValue: { fontSize: '0.95rem', fontWeight: '600', color: '#1b4332', margin: '0' },
  contactSub: { fontSize: '0.82rem', color: '#6b7280', margin: '0.1rem 0 0' },
  faqH: { fontSize: '1.1rem', fontWeight: '700', color: '#1b4332', marginTop: '2rem', marginBottom: '1rem' },
  faqItem: { borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem', marginBottom: '1rem' },
  faqQ: { fontSize: '0.93rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem' },
  faqA: { fontSize: '0.87rem', color: '#6b7280', lineHeight: '1.6', margin: 0 },
  formCard: { background: '#fff', border: '1.5px solid #e5ede9', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
  formH: { fontSize: '1.3rem', fontWeight: '700', color: '#1b4332', marginBottom: '0.35rem' },
  formSub: { color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' },
  fieldGroup: { marginBottom: '1.1rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.7rem 0.9rem', borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#d1d5db', borderRadius: '8px', fontSize: '0.93rem', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  inputErr: { borderColor: '#f87171' },
  inputFocus: { borderColor: '#2d6a4f' },
  textarea: { width: '100%', padding: '0.7rem 0.9rem', borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#d1d5db', borderRadius: '8px', fontSize: '0.93rem', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '130px', fontFamily: 'inherit', transition: 'border-color 0.2s' },
  select: { width: '100%', padding: '0.7rem 0.9rem', borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#d1d5db', borderRadius: '8px', fontSize: '0.93rem', color: '#1a1a1a', outline: 'none', background: '#fff', boxSizing: 'border-box', cursor: 'pointer' },
  errText: { fontSize: '0.8rem', color: '#dc2626', marginTop: '0.3rem', display: 'block' },
  submitBtn: { width: '100%', padding: '0.85rem', background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s', marginTop: '0.5rem' },
  submitBtnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  successBox: { background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '2rem', textAlign: 'center' },
  successTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#065f46', marginBottom: '0.5rem' },
  successText: { color: '#047857', fontSize: '0.92rem', margin: 0 },
  charCount: { fontSize: '0.78rem', color: '#9ca3af', textAlign: 'right', marginTop: '0.3rem' },
}

const SUBJECTS = ['General Inquiry', 'Bug Report', 'Feature Request', 'Disease Accuracy Issue', 'Account Support', 'Partnership / Research', 'Other']

const FAQS = [
  { q: 'How accurate is the disease detection?', a: 'Our CNN model achieves high accuracy on the 10 supported tomato disease classes. Accuracy varies with image quality -- clear, well-lit photos of individual leaves produce the best results.' },
  { q: 'Is the prediction service free?', a: 'Yes. Basic prediction is completely free for all users, including guests. Registered accounts get additional features like prediction history and comparisons.' },
  { q: 'What image formats are supported?', a: 'JPG, JPEG, and PNG are supported. Files must be under 5 MB. For best results, use a clear close-up photo of a single leaf in good lighting.' },
  { q: 'How long does a prediction take?', a: 'Typically under 2 seconds when the ML service is running. The model processes images at 128x128 resolution using a CNN architecture.' },
]

const validate = (form) => {
  const errs = {}
  if (!form.name.trim()) errs.name = 'Name is required'
  if (!form.email.trim()) errs.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address'
  if (!form.subject) errs.subject = 'Please select a subject'
  if (!form.message.trim()) errs.message = 'Message is required'
  else if (form.message.trim().length < 20) errs.message = 'Message must be at least 20 characters'
  return errs
}

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value })
      setErrors(p => ({ ...p, [name]: errs[name] }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(p => ({ ...p, [name]: true }))
    setFocusedField('')
    const errs = validate(form)
    setErrors(p => ({ ...p, [name]: errs[name] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, subject: true, message: true })
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setSubmitted(true)
  }

  const inputStyle = (field) => ({
    ...S.input,
    ...(errors[field] && touched[field] ? S.inputErr : {}),
    ...(focusedField === field ? S.inputFocus : {}),
  })

  return (
    <div style={S.page}>
      {}
      <section style={S.hero}>
        <div style={S.heroBadge}>Get In Touch</div>
        <h1 style={S.heroH}>Contact Us</h1>
        <p style={S.heroP}>Have a question, spotted an inaccuracy, or want to collaborate? We'd love to hear from you.</p>
      </section>

      <div style={S.body}>
        <div style={S.grid}>
          {}
          <div>
            <h2 style={S.infoH}>We're here to help</h2>
            <p style={S.infoP}>Whether you're a farmer, researcher, developer, or just curious - reach out and we'll respond within 1-2 business days.</p>

            {[
              {
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                label: 'Email', value: 'support@tomatoleafdoctor.ai', sub: 'We reply within 1-2 business days'
              },
              {
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                label: 'Response Time', value: '1-2 Business Days', sub: 'Mon-Fri, 9am-5pm'
              },
              {
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                label: 'Location', value: 'Remote -- Worldwide', sub: 'Serving farmers globally'
              },
            ].map(c => (
              <div key={c.label} style={S.contactCard}>
                <div style={S.contactIcon}>{c.icon}</div>
                <div>
                  <p style={S.contactLabel}>{c.label}</p>
                  <p style={S.contactValue}>{c.value}</p>
                  <p style={S.contactSub}>{c.sub}</p>
                </div>
              </div>
            ))}

            <h3 style={S.faqH}>Frequently Asked Questions</h3>
            {FAQS.map(f => (
              <div key={f.q} style={S.faqItem}>
                <p style={S.faqQ}>{f.q}</p>
                <p style={S.faqA}>{f.a}</p>
              </div>
            ))}
          </div>

          {}
          <div>
            <div style={S.formCard}>
              {submitted ? (
                <div style={S.successBox}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="1.8" strokeLinecap="round" style={{ margin: '0 auto 1rem', display: 'block' }}>
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <p style={S.successTitle}>Message Sent!</p>
                  <p style={S.successText}>Thank you for reaching out, <strong>{form.name}</strong>. We'll get back to you at <strong>{form.email}</strong> within 1-2 business days.</p>
                </div>
              ) : (
                <>
                  <h2 style={S.formH}>Send us a Message</h2>
                  <p style={S.formSub}>Fill in the form and we'll get back to you as soon as possible.</p>
                  <form onSubmit={handleSubmit} noValidate>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={S.fieldGroup}>
                        <label style={S.label}>Full Name <span style={{ color: '#dc2626' }}>*</span></label>
                        <input name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} onFocus={() => setFocusedField('name')} style={inputStyle('name')} placeholder="John Doe" />
                        {errors.name && touched.name && <span style={S.errText}>{errors.name}</span>}
                      </div>
                      <div style={S.fieldGroup}>
                        <label style={S.label}>Email Address <span style={{ color: '#dc2626' }}>*</span></label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} onFocus={() => setFocusedField('email')} style={inputStyle('email')} placeholder="john@email.com" />
                        {errors.email && touched.email && <span style={S.errText}>{errors.email}</span>}
                      </div>
                    </div>
                    <div style={S.fieldGroup}>
                      <label style={S.label}>Subject <span style={{ color: '#dc2626' }}>*</span></label>
                      <select name="subject" value={form.subject} onChange={handleChange} onBlur={handleBlur} style={{ ...S.select, ...(errors.subject && touched.subject ? { borderColor: '#f87171' } : {}), ...(focusedField === 'subject' ? { borderColor: '#2d6a4f' } : {}) }} onFocus={() => setFocusedField('subject')}>
                        <option value="">-- Select a subject --</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.subject && touched.subject && <span style={S.errText}>{errors.subject}</span>}
                    </div>
                    <div style={S.fieldGroup}>
                      <label style={S.label}>Message <span style={{ color: '#dc2626' }}>*</span></label>
                      <textarea name="message" value={form.message} onChange={handleChange} onBlur={handleBlur} onFocus={() => setFocusedField('message')} style={{ ...S.textarea, ...(errors.message && touched.message ? { borderColor: '#f87171' } : {}), ...(focusedField === 'message' ? { borderColor: '#2d6a4f' } : {}) }} placeholder="Describe your question or issue in detail..." maxLength={1000} />
                      <div style={S.charCount}>{form.message.length}/1000</div>
                      {errors.message && touched.message && <span style={S.errText}>{errors.message}</span>}
                    </div>
                    <button type="submit" style={{ ...S.submitBtn, ...(submitting ? S.submitBtnDisabled : {}) }} disabled={submitting}>
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
