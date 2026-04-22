import api from './axios'

export const recommendationAPI = {
  get: (data) => api.post('/recommendations', data),
}
