// src/App.jsx

import { Routes, Route, Navigate, Link, Outlet } from 'react-router-dom'
import { useEffect, Component } from 'react'

// ── Pages existantes ────────────────────────────────────────────
import RoleSelectPage      from './pages/RoleSelectPage'
import TeacherRegisterPage from './pages/teacher/TeacherRegisterPage'
import TeacherLoginPage    from './pages/teacher/TeacherLoginPage'
import TeacherDashboard    from './pages/teacher/TeacherDashboard'
import BuddyPage           from './pages/student/BuddyPage'

// ── Student app ─────────────────────────────────────────────────
import { StudentProvider, useStudent } from './context/Studentcontext'
import ClassroomsPage from './pages/student/Classroomspage'
import ClassroomPage  from './pages/student/Classroompage'
import CoursePage     from './pages/student/Coursepage'
import ChatbotFAB     from './components/student/Chatbotfab'
import StudentHeader  from './components/student/Header'

// ── Error Boundary — affiche l'erreur au lieu de rediriger ──────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('🔴 StudentRoot crash:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
          fontFamily: 'monospace', padding: 32, background: '#FFF9F4'
        }}>
          <h2 style={{ color: '#EF4444' }}>💥 Erreur dans StudentRoot</h2>
          <pre style={{
            background: '#FEE2E2', padding: 20, borderRadius: 12,
            fontSize: 13, maxWidth: 700, overflow: 'auto', color: '#7F1D1D'
          }}>
            {this.state.error?.toString()}
          </pre>
          <Link to="/" style={{ color: '#7C3AED', fontWeight: 700 }}>← Retour à l'accueil</Link>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Layout partagé — rendu UNE SEULE FOIS pour tout /student/* ──
const StudentLayout = () => {
  const { student, theme } = useStudent()

  useEffect(() => {
    const link = document.createElement('link')
    link.rel  = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900' +
      '&family=Lexend:wght@300;400;500;600;700' +
      '&family=Lexend+Deca:wght@400;500;600;700' +
      '&family=Fredoka+One' +
      '&family=Atkinson+Hyperlegible:wght@400;700&display=swap'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  return (
    <div
      className="app-root"
      data-condition={student.condition}
      data-animations={theme?.animations ? 'true' : 'false'}
    >
      <StudentHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <ChatbotFAB />
    </div>
  )
}

// ── Wrapper : monte le Provider UNE SEULE FOIS ──────────────────
const StudentRoot = () => (
  <ErrorBoundary>
    <StudentProvider>
      <StudentLayout />
    </StudentProvider>
  </ErrorBoundary>
)

// ── App principale ──────────────────────────────────────────────
const App = () => {
  return (
    <Routes>

      {/* ── Home / Role Select ──────────────────────────────── */}
      <Route path="/"            element={<RoleSelectPage />} />
      <Route path="/role-select" element={<RoleSelectPage />} />

      {/* ── Teacher ─────────────────────────────────────────── */}
      <Route path="/teacher/register"  element={<TeacherRegisterPage />} />
      <Route path="/teacher/login"     element={<TeacherLoginPage />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher/session"   element={<Placeholder title="Live Session"   color="#4ECDC4" backTo="/teacher/dashboard" backLabel="← Dashboard teacher" />} />
      <Route path="/teacher/students"  element={<Placeholder title="Mes élèves"     color="#9B8EFF" backTo="/teacher/dashboard" backLabel="← Dashboard teacher" />} />
      <Route path="/teacher/stats"     element={<Placeholder title="Statistiques"   color="#9B8EFF" backTo="/teacher/dashboard" backLabel="← Dashboard teacher" />} />
      <Route path="/teacher/planning"  element={<Placeholder title="Planning"       color="#FFB347" backTo="/teacher/dashboard" backLabel="← Dashboard teacher" />} />
      <Route path="/teacher/messages"  element={<Placeholder title="Messages"       color="#FF6B6B" backTo="/teacher/dashboard" backLabel="← Dashboard teacher" />} />

      {/* ── Parent ──────────────────────────────────────────── */}
      <Route path="/parent/login"     element={<Placeholder title="Parent Login"     color="#FF6B6B" />} />
      <Route path="/parent/register"  element={<Placeholder title="Parent Register"  color="#FF6B6B" />} />
      <Route path="/parent/dashboard" element={<Placeholder title="Parent Dashboard" color="#FF6B6B" />} />

      {/* ── Student — pages hors layout ─────────────────────── */}
      <Route path="/student/login" element={<Placeholder title="Student Login" color="#4ECDC4" />} />
      <Route path="/student/buddy" element={<BuddyPage />} />

      {/* ── Student — pages dans le layout partagé ──────────── */}
      <Route path="/student" element={<StudentRoot />}>
        <Route index element={<Navigate to="classrooms" replace />} />
        <Route path="classrooms"    element={<ClassroomsPage />} />
        <Route path="classroom/:id" element={<ClassroomPage />} />
        <Route path="course/:id"    element={<CoursePage />} />
        <Route path="dashboard"     element={<Navigate to="classrooms" replace />} />
      </Route>

      {/* ── Fallback ────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

// ── Placeholder ─────────────────────────────────────────────────
const Placeholder = ({ title, color, backTo = '/', backLabel = "← Retour à l'accueil" }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #FFF9F4 0%, #F8F7FF 100%)', gap: 20, fontFamily: "'Nunito', sans-serif", padding: 24, textAlign: 'center' }}>
    <div style={{ width: 80, height: 80, borderRadius: 24, background: color, opacity: 0.2 }} />
    <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.8rem', color, fontWeight: 800, margin: 0 }}>{title}</h2>
    <p style={{ color: '#9E99B8', fontWeight: 600, margin: 0 }}>Page en cours de construction — prochaine étape !</p>
    <Link to={backTo} style={{ marginTop: 12, padding: '11px 28px', borderRadius: 9999, background: color, color: '#fff', fontWeight: 700, fontSize: '0.90rem', textDecoration: 'none' }}>{backLabel}</Link>
  </div>
)

export default App