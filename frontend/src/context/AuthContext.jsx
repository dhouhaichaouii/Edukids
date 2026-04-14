import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const safeJSON = (str) => {
  if (!str || str === 'undefined' || str === 'null') return null
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

export const extractUserId = (obj) =>
  obj?._id || obj?.id || obj?.userId || obj?.user?._id || obj?.user?.id || null

const pickUserByRole = (raw, role) => {
  if (!raw || typeof raw !== 'object') return null

  if (role === 'student') {
    return (
      raw.student || raw.data?.student || raw.user || raw.data?.user || raw.data || raw
    )
  }

  if (role === 'teacher') {
    return (
      raw.teacher || raw.data?.teacher || raw.user || raw.data?.user || raw.data || raw
    )
  }

  if (role === 'parent') {
    return (
      raw.parent || raw.data?.parent || raw.user || raw.data?.user || raw.data || raw
    )
  }

  return raw.user || raw.data?.user || raw.data || raw
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = safeJSON(localStorage.getItem('ek_user'))
    const storedRole = localStorage.getItem('ek_role') || null

    if (storedUser && storedRole && extractUserId(storedUser)) {
      setUser(storedUser)
      setRole(storedRole)
    } else {
      localStorage.removeItem('ek_user')
      localStorage.removeItem('ek_role')
    }

    setLoading(false)
  }, [])

  const login = (userData, userRole) => {
    if (!userData || !userRole) {
      console.error('AuthContext.login() — missing userData or userRole', {
        userData,
        userRole,
      })
      return false
    }

    const normalized = pickUserByRole(userData, userRole)

    console.log('LOGIN role =', userRole)
    console.log('LOGIN raw =', userData)
    console.log('LOGIN normalized =', normalized)

    if (!extractUserId(normalized)) {
      console.error('AuthContext.login() — cannot find _id/id in userData.', {
        raw: userData,
        normalized,
        userRole,
      })
      return false
    }

    setUser(normalized)
    setRole(userRole)

    localStorage.setItem('ek_user', JSON.stringify(normalized))
    localStorage.setItem('ek_role', userRole)

    return true
  }

  const logout = () => {
    setUser(null)
    setRole(null)

    localStorage.removeItem('ek_user')
    localStorage.removeItem('ek_role')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext