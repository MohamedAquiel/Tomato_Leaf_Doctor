const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: '1rem',
  },
  label: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#1b4332',
    marginBottom: '0.38rem',
    fontFamily: 'Poppins, sans-serif',
  },
  input: {
    width: '100%',
    padding: '0.62rem 0.85rem',
    fontSize: '0.93rem',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: '#d1d5db',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: '#1a1a1a',
    fontFamily: 'Poppins, sans-serif',
    transition: 'border-color 0.18s, box-shadow 0.18s',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  errorText: {
    fontSize: '0.8rem',
    color: '#dc3545',
    marginTop: '0.3rem',
    fontWeight: '500',
    fontFamily: 'Poppins, sans-serif',
  },
}

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
}) => {
  const inputStyle = {
    ...styles.input,
    ...(error ? styles.inputError : {}),
    ...(disabled ? styles.inputDisabled : {}),
  }

  return (
    <div style={styles.wrapper}>
      {label && (
        <label htmlFor={name} style={styles.label}>
          {label}
          {required && <span style={{ color: '#dc3545', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={inputStyle}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = '#2d6a4f'
            e.target.style.boxShadow = '0 0 0 3px rgba(45, 106, 79, 0.15)'
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#dc3545' : '#d1d5db'
          e.target.style.boxShadow = 'none'
        }}
      />
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  )
}

export default Input
