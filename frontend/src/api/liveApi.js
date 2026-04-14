const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const req = async (method, endpoint, data = null) => {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData

  const options = {
    method,
    headers: {},
  }

  if (!isFormData) {
    options.headers['Content-Type'] = 'application/json'
  }

  if (data) {
    options.body = isFormData ? data : JSON.stringify(data)
  }

  const res = await fetch(`${BASE}${endpoint}`, options)

  let json = {}
  try {
    json = await res.json()
  } catch {
    json = {}
  }

  if (!res.ok) {
    throw new Error(json.message || 'Erreur réseau')
  }

  return json
}

export const liveAPI = {
  startOrGet: (body) => req('POST', '/sessions/start', body),
  getSessionById: (sessionId) => req('GET', `/sessions/${sessionId}`),
  getActiveByClass: (classId) => req('GET', `/sessions/active/${classId}`),
  endSession: (sessionId) => req('POST', `/sessions/${sessionId}/end`),
  getSnapshot: (sessionId) => req('GET', `/teacher/live/session/${sessionId}/snapshot`),
}

export const materialsAPI = {
  get: (classId, subject, teacherId = '') => {
    const p = new URLSearchParams({
      classId,
      ...(subject ? { subject } : {}),
      ...(teacherId ? { teacherId } : {}),
    })
    return req('GET', `/materials?${p.toString()}`)
  },

  add: (formData) => req('POST', '/materials', formData),

  remove: (id) => req('DELETE', `/materials/${id}`),
}

export const studentsAPI = {
  getByClass: (classId) => req('GET', `/students/class/${classId}`),
}