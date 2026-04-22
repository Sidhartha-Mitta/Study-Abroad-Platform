import { useMemo, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { motion as fm } from 'framer-motion'
import Layout from '../components/layout/Layout'
import ProgramCard from '../components/universities/ProgramCard'
import Select from '../components/ui/Select'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import { universityAPI } from '../api/universities'
import { asArray, formatCurrency } from '../utils/formatters'
import { DEGREE_TYPES, FIELDS_OF_STUDY, INTAKE_MONTHS } from '../utils/constants'
import { mockPrograms } from '../utils/mockData'

export default function ProgramsPage() {
  const [filters, setFilters] = useState({ field: '', degree: '', maxTuition: 50000, ielts: 0, intake: '' })
  const q = useQuery({ queryKey: ['programs', filters], queryFn: () => universityAPI.getPrograms(filters), staleTime: 300000, placeholderData: keepPreviousData, retry: 1 })
  let programs = asArray(q.data)
  if (q.isError && !programs.length) programs = mockPrograms
  const filtered = useMemo(() => programs.filter((p) => (!filters.field || p.field === filters.field) && (!filters.degree || (p.degree || p.degreeType) === filters.degree) && Number(p.tuition || 0) <= Number(filters.maxTuition) && Number(p.ieltsMin || 0) >= Number(filters.ielts) && (!filters.intake || (p.intakes || []).includes(filters.intake))), [programs, filters])
  const MotionGrid = fm.div
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } } }
  
  return <Layout><div className="page-wide filters-shell"><aside className="card filters-panel stack"><div><h2 className="section-title" style={{ fontSize: '1.5rem', margin: 0 }}>Filter Results</h2><p className="tiny">Showing {filtered.length} programs</p></div><Select label="Field of study" options={FIELDS_OF_STUDY} value={filters.field} onChange={(e) => setFilters({ ...filters, field: e.target.value })} /><Select label="Degree type" options={DEGREE_TYPES} value={filters.degree} onChange={(e) => setFilters({ ...filters, degree: e.target.value })} /><label className="field"><span className="label">Max tuition: <span className="gold mono">{formatCurrency(filters.maxTuition).replace(' / year', '')}</span></span><input type="range" min="5000" max="60000" step="1000" value={filters.maxTuition} onChange={(e) => setFilters({ ...filters, maxTuition: e.target.value })} /></label><label className="field"><span className="label">Min IELTS: <span className="gold mono">{filters.ielts}</span></span><input type="range" min="0" max="9" step="0.5" value={filters.ielts} onChange={(e) => setFilters({ ...filters, ielts: e.target.value })} /></label><Select label="Intake month" options={INTAKE_MONTHS} value={filters.intake} onChange={(e) => setFilters({ ...filters, intake: e.target.value })} /><Button variant="ghost" onClick={() => setFilters({ field: '', degree: '', maxTuition: 50000, ielts: 0, intake: '' })}>Clear all filters</Button></aside><section className="stack"><header><h1 className="page-title">Explore Programs</h1><span className="skeleton" style={{ width: '11rem', height: 3, background: 'var(--accent-gold)' }} /></header>{q.isLoading ? <div className="grid grid-2"><Skeleton height="14rem" /><Skeleton height="14rem" /></div> : filtered.length ? <MotionGrid variants={containerVariants} initial="hidden" animate="show" className="grid grid-2">{filtered.map((p) => <fm.div key={p.id || p._id} variants={itemVariants}><ProgramCard program={p} /></fm.div>)}</MotionGrid> : <EmptyState title="No programs found" description="Try increasing tuition or clearing field filters." />}</section></div></Layout>
}
