import { useState } from 'react'

const lessons = [
  {
    id: 1,
    title: 'Addition Adventures',
    desc: 'Learn to add numbers up to 100',
    icon: '🔢',
    color: '#E8F0FF',
    iconBg: '#5B7FE8',
  },
  {
    id: 2,
    title: 'The Solar System',
    desc: 'Explore planets in our solar system',
    icon: '🔭',
    color: '#E8F6F0',
    iconBg: '#4ABFA0',
  },
  {
    id: 3,
    title: 'Multiplication Magic',
    desc: 'Introduction to multiplication tables',
    icon: '🔢',
    color: '#E8F0FF',
    iconBg: '#5B7FE8',
  },
]

const NAV_ITEMS = [
  {
    id: 'home', label: 'Home',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#4B6FE8' : 'none'} stroke={active ? '#4B6FE8' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'quiz', label: 'Quiz',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#4B6FE8' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    id: 'buddy', label: 'Buddy',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#4B6FE8' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: 'badges', label: 'Badges',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#4B6FE8' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
]

export default function StudentDashboard() {
  const [activeNav, setActiveNav] = useState('home')
  const level = 5
  const xp = 68 // percent

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .lesson-card:hover { transform: translateX(3px); box-shadow: 0 4px 20px rgba(0,0,0,0.09) !important; }
        .nav-btn:hover { opacity: 0.85; }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        {/* wave bottom */}
        <div style={s.headerWave} />

        <div style={s.headerInner}>
          {/* Left: avatar + greeting */}
          <div style={s.headerLeft}>
            <div style={s.avatar}>
              {/* Bunny SVG */}
              <svg width="44" height="44" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="40" fill="white" opacity="0.2"/>
                {/* ears */}
                <ellipse cx="27" cy="18" rx="7" ry="14" fill="white"/>
                <ellipse cx="53" cy="18" rx="7" ry="14" fill="white"/>
                <ellipse cx="27" cy="18" rx="4" ry="10" fill="#FFB3C6"/>
                <ellipse cx="53" cy="18" rx="4" ry="10" fill="#FFB3C6"/>
                {/* head */}
                <circle cx="40" cy="44" r="22" fill="white"/>
                {/* eyes */}
                <circle cx="33" cy="40" r="3" fill="#333"/>
                <circle cx="47" cy="40" r="3" fill="#333"/>
                <circle cx="34" cy="39" r="1" fill="white"/>
                <circle cx="48" cy="39" r="1" fill="white"/>
                {/* cheeks */}
                <circle cx="28" cy="46" r="4" fill="#FFB3C6" opacity="0.6"/>
                <circle cx="52" cy="46" r="4" fill="#FFB3C6" opacity="0.6"/>
                {/* nose + mouth */}
                <ellipse cx="40" cy="47" rx="2" ry="1.5" fill="#FFB3C6"/>
                <path d="M37 50 Q40 53 43 50" stroke="#999" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={s.greeting}>
              <span style={s.greetTop}>Hey there! 👋</span>
              <span style={s.greetName}>Luna Martinez</span>
            </div>
          </div>

          {/* Right: level + XP */}
          <div style={s.levelWrap}>
            <span style={s.levelLabel}>Level {level}</span>
            <div style={s.xpBarBg}>
              <div style={{ ...s.xpBarFill, width: `${xp}%` }} />
            </div>
          </div>

          {/* Logout */}
          <button style={s.logoutBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={s.body}>

        {/* Class card */}
        <div style={s.classCard}>
          <div style={s.classIconWrap}>
            <span style={{ fontSize: 32 }}>🏫</span>
          </div>
          <div>
            <div style={s.className}>Sunshine Class</div>
            <div style={s.classInfo}>3rd Grade • 3 lessons available</div>
          </div>
        </div>

        {/* My Lessons */}
        <div style={s.sectionHeader}>
          <span style={{ fontSize: 20 }}>📖</span>
          <span style={s.sectionTitle}>My Lessons</span>
        </div>

        <div style={s.lessonList}>
          {lessons.map((lesson, i) => (
            <div
              key={lesson.id}
              className="lesson-card"
              style={{ ...s.lessonCard, animationDelay: `${i * 80}ms` }}
            >
              <div style={{ ...s.lessonIcon, background: lesson.color }}>
                <span style={{ fontSize: 22 }}>{lesson.icon}</span>
              </div>
              <div style={s.lessonText}>
                <div style={s.lessonTitle}>{lesson.title}</div>
                <div style={s.lessonDesc}>{lesson.desc}</div>
              </div>
              <div style={s.lessonChevron}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C0C8D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={s.navbar}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className="nav-btn"
            style={s.navBtn}
            onClick={() => setActiveNav(item.id)}
          >
            {item.icon(activeNav === item.id)}
            <span style={{ ...s.navLabel, color: activeNav === item.id ? '#4B6FE8' : '#9CA3AF' }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

const s = {
  root: {
    fontFamily: "'Nunito', sans-serif",
    maxWidth: 430,
    margin: '0 auto',
    minHeight: '100vh',
    background: '#FDF8EE',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    padding: '20px 20px 48px',
    position: 'relative',
    flexShrink: 0,
    animation: 'slideDown 0.4s ease',
  },
  headerWave: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 32,
    background: '#FDF8EE',
    borderTopLeftRadius: '50% 100%',
    borderTopRightRadius: '50% 100%',
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    border: '2.5px solid rgba(255,255,255,0.5)',
  },
  greeting: {
    display: 'flex',
    flexDirection: 'column',
  },
  greetTop: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 600,
  },
  greetName: {
    fontSize: 20,
    fontWeight: 900,
    color: 'white',
    letterSpacing: '-0.3px',
  },
  levelWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 5,
    flexShrink: 0,
  },
  levelLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: 'white',
  },
  xpBarBg: {
    width: 80,
    height: 8,
    borderRadius: 99,
    background: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 99,
    background: '#FACC15',
    transition: 'width 0.5s ease',
  },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 20px 100px',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  classCard: {
    background: 'white',
    borderRadius: 18,
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    animation: 'fadeUp 0.35s ease both',
  },
  classIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 14,
    background: '#FFF3E0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  className: {
    fontSize: 17,
    fontWeight: 800,
    color: '#1E293B',
  },
  classInfo: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: 600,
    marginTop: 2,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#1E293B',
  },
  lessonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  lessonCard: {
    background: 'white',
    borderRadius: 18,
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
    animation: 'fadeUp 0.4s ease both',
  },
  lessonIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  lessonText: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: '#1E293B',
  },
  lessonDesc: {
    fontSize: 12.5,
    color: '#94A3B8',
    fontWeight: 600,
    marginTop: 2,
  },
  lessonChevron: {
    flexShrink: 0,
  },
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 430,
    background: 'white',
    borderTop: '1px solid #F1F5F9',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0 16px',
    zIndex: 100,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
  },
  navBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 16px',
    borderRadius: 12,
    transition: 'opacity 0.15s',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: 700,
  },
}
