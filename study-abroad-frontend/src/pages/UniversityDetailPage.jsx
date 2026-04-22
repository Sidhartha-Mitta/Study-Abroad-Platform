import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ExternalLink, Sparkles } from 'lucide-react'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import ProgramCard from '../components/universities/ProgramCard'
import { universityAPI } from '../api/universities'
import { applicationAPI } from '../api/applications'
import { useAuthStore } from '../store/authStore'
import { asArray, getCountryFlag } from '../utils/formatters'
import { mockPrograms, mockUniversities } from '../utils/mockData'

export default function UniversityDetailPage() {
  const { id } = useParams()
  const [tab, setTab] = useState('Overview')
  const [selected, setSelected] = useState(null)
  const uniQ = useQuery({ queryKey: ['university', id], queryFn: () => universityAPI.getById(id), staleTime: 300000, retry: 1 })
  const progQ = useQuery({ queryKey: ['programs', id], queryFn: () => universityAPI.getPrograms({ universityId: id }), staleTime: 300000, retry: 1 })
  const uni = uniQ.data?.data || uniQ.data || mockUniversities.find((u) => u.id === id) || mockUniversities[0]
  const programs = useMemo(() => asArray(progQ.data).filter((p) => !id || p.universityId === id || p.university?._id === id), [progQ.data, id])
  const fallbackPrograms = programs.length ? programs : mockPrograms.filter((p) => p.universityId === uni.id)
  const { user } = useAuthStore()
  const isStaff = user?.role === 'admin'
  const apply = useMutation({ mutationFn: (program) => applicationAPI.apply({ universityId: id, programId: program.id || program._id }), onSuccess: () => toast.success('Application created'), onError: (e) => toast.error(String(e)) })
  return <Layout showSidebar><div className="page-wide stack">{uniQ.isLoading ? <Skeleton height="16rem" /> : <section className="cta-band"><h1 className="page-title" style={{ color: 'inherit' }}>{uni.name}</h1><p>{getCountryFlag(uni.country)} {uni.city}, {uni.country} · <a href={uni.website || '#'}><ExternalLink size={16} /> website</a></p><p className="mono">#{uni.ranking || 'N/A'} in World</p><div className="row"><Link to="/recommendations"><Button variant="ghost" icon={Sparkles}>Get Recommendations</Button></Link>{isStaff && <Link to={`/admin/universities/${id}/programs/new`}><Button variant="secondary" icon={Sparkles}>Bind Program</Button></Link>}</div></section>}<div className="tabs">{['Overview', 'Programs', 'Apply'].map((t) => <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}</div>{tab === 'Overview' && <div className="grid grid-4"><Card><strong>Country</strong><p>{uni.country}</p></Card><Card><strong>City</strong><p>{uni.city}</p></Card><Card><strong>Programs</strong><p>{fallbackPrograms.length}</p></Card><Card><strong>Ranking</strong><p>#{uni.ranking}</p></Card><Card className="grid" style={{ gridColumn: '1 / -1' }}><h2>About</h2><p className="muted">{uni.about || `${uni.name} blends rigorous academics with practical international support, making it a strong option for ambitious students building a global future.`}</p></Card></div>}{tab !== 'Overview' && (progQ.isLoading ? <div className="grid grid-2"><Skeleton height="14rem" /><Skeleton height="14rem" /></div> : fallbackPrograms.length ? <div className="grid grid-2">{fallbackPrograms.map((p) => <ProgramCard key={p.id || p._id} program={p} onApply={setSelected} />)}</div> : <EmptyState title="No programs listed" description="This university has not published program data yet." />)}<Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Confirm Application"><p className="muted">Apply to {selected?.name} at {uni.name}?</p><div className="row between" style={{ marginTop: '1rem' }}><Button variant="ghost" onClick={() => setSelected(null)}>Cancel</Button><Button loading={apply.isPending} onClick={() => apply.mutate(selected)}>Apply Now</Button></div></Modal></div></Layout>
}
