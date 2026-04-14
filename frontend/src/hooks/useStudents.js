import { useState, useEffect } from 'react'
import { parentAPI }           from '../api/client'
import { useAuth }             from '../context/AuthContext'

export function useStudents() {
  const { user }   = useAuth()
  const parentId   = user?.id

  const [children, setChildren] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    if (parentId) fetchChildren()
    else { setLoading(false); setError('Not authenticated') }
  }, [parentId])

  const fetchChildren = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await parentAPI.getChildren(parentId)
      // backend retourne { success, count, data: [...] }
      setChildren(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addChild = async (formData) => {
    // backend attend parentId dans le body
    const res = await parentAPI.addChild({
      ...formData,
      parentId,
    })
    // backend retourne { success, data: { student, accessInfo: { studentCode, pin } } }
    setChildren(prev => [res.data.student, ...prev])
    return res.data   // on retourne accessInfo aussi pour afficher le PIN
  }

  return { children, loading, error, addChild, refetch: fetchChildren }
}