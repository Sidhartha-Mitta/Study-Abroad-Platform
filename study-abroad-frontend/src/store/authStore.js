import { create } from 'zustand'
import { authAPI } from '../api/auth'

const initial = { user: null, token: null, isAuthenticated: false, isLoading: false }
const normalizeAuth = (res) => ({
  token: res?.token || res?.data?.token || res?.accessToken,
  user: res?.user || res?.data?.user || res?.data || null,
})

export const useAuthStore = create((set, get) => ({
  ...initial,
  login: async (credentials) => {
    set({ isLoading: true })
    try {
      const { token, user } = normalizeAuth(await authAPI.login(credentials))
      if (token) localStorage.setItem('sa_token', token)
      set({ token, user, isAuthenticated: Boolean(token), isLoading: false })
      return { success: true }
    } catch (message) {
      set({ isLoading: false })
      return { success: false, message: String(message) }
    }
  },
  register: async (data) => {
    set({ isLoading: true })
    try {
      const { token, user } = normalizeAuth(await authAPI.register(data))
      if (token) localStorage.setItem('sa_token', token)
      set({ token, user, isAuthenticated: Boolean(token), isLoading: false })
      return { success: true }
    } catch (message) {
      set({ isLoading: false })
      return { success: false, message: String(message) }
    }
  },
  logout: () => {
    localStorage.removeItem('sa_token')
    set(initial)
  },
  loadUser: async () => {
    const token = localStorage.getItem('sa_token')
    if (!token) return set({ ...initial, isLoading: false })
    set({ token, isLoading: true })
    try {
      const res = await authAPI.getProfile()
      set({ user: res?.user || res?.data || res, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('sa_token')
      set({ ...initial, isLoading: false })
    }
  },
  updatePreferences: async (data) => {
    const res = await authAPI.updatePreferences(data)
    const user = res?.user || { ...get().user, preferences: data }
    set({ user })
    return user
  },
}))

useAuthStore.getState().loadUser()
