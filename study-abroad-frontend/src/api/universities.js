import api from './axios'

export const universityAPI = {
  getAll: (params) => api.get('/universities', { params }),
  create: (data) => api.post('/universities', data),
  getById: (id) => api.get(`/universities/${id}`),
  getPrograms: (params) => api.get('/universities/programs/all', { params }),
  createProgram: (id, data) => api.post(`/universities/${id}/programs`, data),
}
