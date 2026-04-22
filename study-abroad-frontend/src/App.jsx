import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion as fm } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Spinner from './components/ui/Spinner'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import UniversitiesPage from './pages/UniversitiesPage'
import UniversityDetailPage from './pages/UniversityDetailPage'
import ProgramsPage from './pages/ProgramsPage'
import RecommendationsPage from './pages/RecommendationsPage'
import ApplicationsPage from './pages/ApplicationsPage'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import ProfilePage from './pages/ProfilePage'
import AdminAddUniversityPage from './pages/AdminAddUniversityPage'
import AdminAddProgramPage from './pages/AdminAddProgramPage'
import NotFoundPage from './pages/NotFoundPage'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } })
const MotionDiv = fm.div
const Page = ({ children }) => <MotionDiv initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: 'easeOut' }}>{children}</MotionDiv>

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()
  if (isLoading) return <div className="hero"><Spinner /></div>
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

function PublicOnlyRoute({ children }) {
  return useAuthStore((s) => s.isAuthenticated) ? <Navigate to="/dashboard" replace /> : children
}

function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()
  if (isLoading) return <div className="hero"><Spinner /></div>
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function AnimatedRoutes() {
  const location = useLocation()
  return <AnimatePresence mode="wait"><Routes location={location} key={location.pathname}>
    <Route path="/" element={<Page><LandingPage /></Page>} />
    <Route path="/login" element={<PublicOnlyRoute><Page><LoginPage /></Page></PublicOnlyRoute>} />
    <Route path="/register" element={<PublicOnlyRoute><Page><RegisterPage /></Page></PublicOnlyRoute>} />
    <Route path="/dashboard" element={<PrivateRoute><Page><DashboardPage /></Page></PrivateRoute>} />
    <Route path="/universities" element={<Page><UniversitiesPage /></Page>} />
    <Route path="/universities/:id" element={<Page><UniversityDetailPage /></Page>} />
    <Route path="/programs" element={<Page><ProgramsPage /></Page>} />
    <Route path="/recommendations" element={<Page><RecommendationsPage /></Page>} />
    <Route path="/applications" element={<PrivateRoute><Page><ApplicationsPage /></Page></PrivateRoute>} />
    <Route path="/applications/:id" element={<PrivateRoute><Page><ApplicationDetailPage /></Page></PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute><Page><ProfilePage /></Page></PrivateRoute>} />
    <Route path="/admin/universities/new" element={<AdminRoute><Page><AdminAddUniversityPage /></Page></AdminRoute>} />
    <Route path="/admin/universities/:id/programs/new" element={<AdminRoute><Page><AdminAddProgramPage /></Page></AdminRoute>} />
    <Route path="*" element={<Page><NotFoundPage /></Page>} />
  </Routes></AnimatePresence>
}

export default function App() {
  const initTheme = useThemeStore((s) => s.initTheme)
  const loadUser = useAuthStore((s) => s.loadUser)
  useEffect(() => { initTheme(); loadUser() }, [initTheme, loadUser])
  return <QueryClientProvider client={queryClient}><BrowserRouter><ScrollToTop /><AnimatedRoutes /><Toaster position="bottom-right" toastOptions={{ success: { style: { background: 'var(--accent-gold)', color: 'var(--bg-primary)' } }, error: { style: { background: 'var(--accent-coral)', color: 'var(--text-primary)' } }, style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' } }} /></BrowserRouter></QueryClientProvider>
}
