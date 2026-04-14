const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const request = async (method, endpoint, data = null) => {
  const headers = {
    'Content-Type': 'application/json',
  }

  const config = {
    method,
    headers,
  }

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  let json = {}
  try {
    json = await response.json()
  } catch {
    json = {}
  }

  if (!response.ok) {
    throw new Error(json.message || json.error || 'Something went wrong')
  }

  return json
}

export const authAPI = {
  teacherRegister: (data) => request('POST', '/auth/teacher/register', data),
  teacherLogin: (data) => request('POST', '/auth/teacher/login', data),
  parentRegister: (data) => request('POST', '/auth/parent/register', data),
  parentLogin: (data) => request('POST', '/auth/parent/login', data),
  studentLogin: (data) => request('POST', '/student-auth/login', data),
}

export const classesAPI = {
  create: (data) => request('POST', '/classes', data),
  getByTeacher: (teacherId) => request('GET', `/classes/teacher/${teacherId}`),
  getById: (id) => request('GET', `/classes/${id}`),
  update: (id, data) => request('PATCH', `/classes/${id}`, data),
  delete: (id) => request('DELETE', `/classes/${id}`),
}

export const sessionsAPI = {
  start: (data) => request('POST', '/sessions/start', data),
  end: (id) => request('POST', `/sessions/${id}/end`),
  getActive: (classId) => request('GET', `/sessions/active/${classId}`),
  getById: (id) => request('GET', `/sessions/${id}`),
}

export const eventsAPI = {
  buttonPress: (data) => request('POST', '/events/button-press', data),
  getBySession: (sessionId) => request('GET', `/events/session/${sessionId}`),
}

export const parentAPI = {
  getChildren: (parentId) => request('GET', `/parent/children/${parentId}`),
  addChild: (data) => request('POST', '/parent/children', data),
  getDailySummary: (studentId, date) =>
    request('GET', `/parent/daily-summary/${studentId}${date ? `?date=${date}` : ''}`),
}

export const studentAPI = {
  getProfile: (studentId) => request('GET', `/student-auth/profile/${studentId}`),
  getByClass: (classId) => request('GET', `/students/class/${classId}`),
  joinClass: (studentId, data) => request('POST', `/students/${studentId}/join-class`, data),
  getClassroom: (studentId) => request('GET', `/students/${studentId}/classroom`),
}

export default {
  auth: authAPI,
  classes: classesAPI,
  sessions: sessionsAPI,
  events: eventsAPI,
  parent: parentAPI,
  student: studentAPI,
}