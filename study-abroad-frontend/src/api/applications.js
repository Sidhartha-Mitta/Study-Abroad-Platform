import api from './axios'

export const applicationAPI = {
  apply: (data) => api.post('/applications', data),
  getAll: () => api.get('/applications'),
  getAllAdmin: () => api.get('/applications/all'),
  getById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
  getHistory: (id) => api.get(`/applications/${id}/history`),
}
