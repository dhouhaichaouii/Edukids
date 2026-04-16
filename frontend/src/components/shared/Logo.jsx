const Logo = ({ size = 'md', showTagline = false }) => {
  const sizeMap = {
    sm: { logo: '1.8rem', tag: '0.78rem', gap: 3, icon: 52 },
    md: { logo: '2.5rem', tag: '0.92rem', gap: 4, icon: 72 },
    lg: { logo: '3.3rem', tag: '1.05rem', gap: 5, icon: 95 },
    xl: { logo: '4.2rem', tag: '1.18rem', gap: 6, icon: 120 },
  }
  const s = sizeMap[size] || sizeMap.md

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      <img
        src="/logo.png"
        alt="EduKids Logo"
        style={{
          width: s.icon,
          height: s.icon,
          objectFit: 'contain',
          borderRadius: '8px',
          flexShrink: 0,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: s.logo,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FF6B6B 0%, #9B8EFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          EduKids
        </span>

        {showTagline && (
          <span
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: s.tag,
              fontWeight: 600,
              color: '#9E99B8',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginTop: 4,
            }}
          >
            Learn · Grow · Shine
          </span>
        )}
      </div>
    </div>
  )
}

export default Logo