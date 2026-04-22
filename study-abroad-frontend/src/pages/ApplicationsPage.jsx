import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Compass } from 'lucide-react'
import Layout from '../components/layout/Layout'
import ApplicationCard from '../components/applications/ApplicationCard'
import StatusUpdateModal from '../components/applications/StatusUpdateModal'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import { applicationAPI } from '../api/applications'
import { useAuthStore } from '../store/authStore'
import { asArray } from '../utils/formatters'
import { STATUSES } from '../utils/constants'

export default function ApplicationsPage() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const user = useAuthStore((s) => s.user)
  const isStaff = user?.role === 'admin' || user?.role === 'counselor'
  const qc = useQueryClient()
  const q = useQuery({ queryKey: ['applications', isStaff], queryFn: isStaff ? applicationAPI.getAllAdmin : applicationAPI.getAll, staleTime: 0, placeholderData: keepPreviousData, retry: 1 })
  const applications = asArray(q.data)
  const visible = useMemo(() => filter === 'All' ? applications : applications.filter((a) => a.status === filter), [applications, filter])
  const update = useMutation({ mutationFn: (data) => applicationAPI.updateStatus(selected._id || selected.id, data), onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['applications'] }); qc.refetchQueries({ queryKey: ['applications', isStaff] }); setSelected(null) }, onError: (e) => toast.error(e?.response?.data?.message || String(e)) })
  return <Layout><div className="page-wide stack"><div className="row between"><h1 className="page-title">{isStaff ? 'All Applications' : 'My Applications'}</h1><Badge variant="warning" size="lg">{applications.length} total</Badge></div><div className="tabs">{['All', ...STATUSES].map((s) => <button key={s} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s} <span className="badge badge-sm badge-neutral">{s === 'All' ? applications.length : applications.filter((a) => a.status === s).length}</span></button>)}</div>{q.isLoading ? <><Skeleton height="8rem" /><Skeleton height="8rem" /></> : visible.length ? visible.map((a) => <ApplicationCard key={a._id || a.id} application={a} onUpdate={setSelected} />) : <EmptyState icon={Compass} title="No applications yet" description="Explore universities and apply when a program feels right." action={{ label: 'Discover Universities', onClick: () => location.assign('/universities') }} />}<StatusUpdateModal isOpen={Boolean(selected)} application={selected} onClose={() => setSelected(null)} onConfirm={(data) => update.mutate(data)} loading={update.isPending} /></div></Layout>
}
