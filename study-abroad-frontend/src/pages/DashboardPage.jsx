import { useQuery } from '@tanstack/react-query'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Link } from 'react-router-dom'
import { motion as fm } from 'framer-motion'
import { Building2, Users, BookOpen, Plus } from 'lucide-react'
import Layout from '../components/layout/Layout'
import WelcomeBanner from '../components/dashboard/WelcomeBanner'
import StatsRow from '../components/dashboard/StatsRow'
import QuickActions from '../components/dashboard/QuickActions'
import RecentApplications from '../components/dashboard/RecentApplications'
import RecommendationCard from '../components/recommendations/RecommendationCard'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import { applicationAPI } from '../api/applications'
import { recommendationAPI } from '../api/recommendations'
import { universityAPI } from '../api/universities'
import { useAuthStore } from '../store/authStore'
import { asArray } from '../utils/formatters'

const colors = ['var(--accent-gold)', 'var(--accent-teal)', 'var(--accent-coral)', 'var(--warning)', 'var(--neutral)']

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const isStaff = user?.role === 'admin' || user?.role === 'counselor'
  const recs = useQuery({ queryKey: ['recommendations', user?.preferences], queryFn: () => recommendationAPI.get(user?.preferences || {}), staleTime: 300000, retry: 1, enabled: Boolean(user) && !isStaff })
  const apps = useQuery({ queryKey: ['applications'], queryFn: applicationAPI.getAll, staleTime: 300000, retry: 1, enabled: !isStaff })
  const unis = useQuery({ queryKey: ['universities'], queryFn: () => universityAPI.getAll({}), staleTime: 300000, retry: 1, enabled: isStaff })

  const applications = asArray(apps.data)
  const recommendations = asArray(recs.data)
  const universities = asArray(unis.data)
  const chart = !isStaff ? ['Applied', 'Reviewed', 'Accepted', 'Rejected', 'Withdrawn'].map((name) => ({ name, value: applications.filter((a) => a.status === name).length })).filter((x) => x.value) : []

  const v = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } } }

  if (isStaff) {
    return <Layout><div className="page-wide stack"><WelcomeBanner user={user} />
      <fm.div variants={v} initial="hidden" animate="show" className="grid grid-3">
        <fm.div variants={item} className="card glow stack">
          <div className="row" style={{ gap: '0.5rem' }}><Users size={20} className="gold" /><h2 style={{ margin: 0 }}>User Directory</h2></div>
          <p className="muted">Manage all platform accounts and roles.</p>
          <Link to="/users" className="btn btn-secondary">Manage Users</Link>
        </fm.div>
        <fm.div variants={item} className="card glow stack">
          <div className="row" style={{ gap: '0.5rem' }}><Building2 size={20} className="gold" /><h2 style={{ margin: 0 }}>Institutions</h2></div>
          <p className="muted">Register and maintain verified universities.</p>
          <Link to="/admin/universities/new" className="btn btn-primary"><Plus size={14} style={{ marginRight: 4 }} />Add University</Link>
          <Link to="/universities" className="btn btn-ghost">Browse All ({universities.length})</Link>
        </fm.div>
        <fm.div variants={item} className="card glow stack">
          <div className="row" style={{ gap: '0.5rem' }}><BookOpen size={20} className="gold" /><h2 style={{ margin: 0 }}>Academic Programs</h2></div>
          <p className="muted">Select a university below to add programs:</p>
          {unis.isLoading ? <Skeleton height="5rem" /> : universities.length === 0 ? <p className="tiny muted">No universities yet — add one first.</p> : <div className="stack" style={{ gap: '0.5rem' }}>{universities.slice(0, 4).map((u) => <Link key={u._id} to={`/admin/universities/${u._id}/programs/new`} className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}><Plus size={12} /> {u.name}</Link>)}{universities.length > 4 && <Link to="/universities" className="tiny gold">+{universities.length - 4} more universities</Link>}</div>}
        </fm.div>
      </fm.div>
    </div></Layout>
  }

  return <Layout><div className="page-wide stack"><WelcomeBanner user={user} />{apps.isLoading ? <Skeleton height="9rem" /> : <StatsRow applications={applications} />}<QuickActions /><div className="grid grid-2"><RecentApplications applications={applications} /><div className="card stack"><div className="row between"><h2>Recommended For You</h2><Link className="gold" to="/recommendations">See all</Link></div>{recs.isLoading ? <Skeleton height="10rem" /> : recommendations.length ? recommendations.slice(0, 3).map((r, i) => <RecommendationCard key={i} item={r} rank={i + 1} />) : <EmptyState title="No recommendations yet" description="Fill preferences to unlock matches." />}</div></div><div className="card"><h2>Application Progress</h2>{chart.length ? <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={chart} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>{chart.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer> : <EmptyState title="Nothing to chart yet" description="Your progress chart appears after applications are created." />}</div></div></Layout>
}
