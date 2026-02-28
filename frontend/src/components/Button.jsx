const variantStyles = {
  primary: {
    backgroundColor: '#2d6a4f',
    color: '#ffffff',
    borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#2d6a4f',
  },
  danger: {
    backgroundColor: '#dc3545',
    color: '#ffffff',
    borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#dc3545',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#2d6a4f',
    borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#2d6a4f',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#2d6a4f',
    borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#b7dfc9',
  },
}

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
  padding: '0.65rem 1.5rem',
  fontSize: '0.95rem',
  fontWeight: '700',
  borderRadius: '8px',
  cursor: 'pointer',
  outline: 'none',
  letterSpacing: '0.2px',
  fontFamily: 'Poppins, sans-serif',
  transition: 'transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, opacity 0.18s ease',
  width: '100%',
}

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'primary',
  style: extraStyle = {},
}) => {
  const isDisabled = disabled || loading

  const btnStyle = {
    ...baseStyle,
    ...(variantStyles[variant] || variantStyles.primary),
    opacity: isDisabled ? 0.65 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    ...extraStyle,
  }

  const handleMouseEnter = (e) => {
    if (!isDisabled) {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.13)'
    }
  }

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = 'none'
  }

  const handleMouseDown = (e) => {
    if (!isDisabled) {
      e.currentTarget.style.transform = 'scale(0.97)'
      e.currentTarget.style.boxShadow = 'none'
    }
  }

  const handleMouseUp = (e) => {
    if (!isDisabled) {
      e.currentTarget.style.transform = 'translateY(-2px)'
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={btnStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {loading && (
        <span
          style={{
            display: 'inline-block',
            width: '15px',
            height: '15px',
            borderWidth: '2.5px',
            borderStyle: 'solid',
            borderColor: variant === 'primary' || variant === 'danger'
              ? 'rgba(255,255,255,0.35)'
              : 'rgba(45,106,79,0.25)',
            borderTopColor: variant === 'primary' || variant === 'danger'
              ? '#ffffff'
              : '#2d6a4f',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            flexShrink: 0,
          }}
        />
      )}
      {children}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </button>
  )
}

export default Button
