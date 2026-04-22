import { create } from 'zustand'

const applyTheme = (theme) => {
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', theme)
}

export const useThemeStore = create((set, get) => ({
  theme: 'dark',
  initTheme: () => {
    const theme = localStorage.getItem('sa_theme') || 'dark'
    applyTheme(theme)
    set({ theme })
  },
  toggleTheme: () => {
    const theme = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('sa_theme', theme)
    applyTheme(theme)
    set({ theme })
  },
}))

useThemeStore.getState().initTheme()
