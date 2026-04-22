import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import StatusBadge from '../components/applications/StatusBadge'
import StatusUpdateModal from '../components/applications/StatusUpdateModal'
import ApplicationTimeline from '../components/applications/ApplicationTimeline'
import { applicationAPI } from '../api/applications'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const [modal, setModal] = useState(false)
  const qc = useQueryClient()
  const q = useQuery({ queryKey: ['application', id], queryFn: () => applicationAPI.getById(id), staleTime: 0, retry: 1 })
  const app = q.data?.data || q.data
  const program = app?.program || {}
  const update = useMutation({ mutationFn: (data) => applicationAPI.updateStatus(id, data), onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['application', id] }); qc.invalidateQueries({ queryKey: ['applications'] }); setModal(false) }, onError: (e) => toast.error(e?.response?.data?.message || String(e)) })
  return <Layout><div className="page stack">{q.isLoading ? <Skeleton height="18rem" /> : app ? <><Card glow><div className="row between"><div><h1 className="page-title">{app.university?.name || app.universityName}</h1><p className="muted">{program.name || app.programName}</p></div><StatusBadge status={app.status} size="lg" /></div><Button style={{ marginTop: '1rem' }} onClick={() => setModal(true)}>Update Status</Button></Card><div className="grid grid-2"><Card><h2>Program Details</h2><p>Field: {program.fieldOfStudy || program.field || app.field}</p><p>Degree: {program.degree || app.degree}</p><p>Tuition: <span className="mono gold">{formatCurrency(program.tuition || app.tuition)}</span></p><p>Applied: {formatDate(app.createdAt || app.appliedAt)}</p></Card><Card><h2>Status History</h2><ApplicationTimeline history={app.history || [{ status: app.status, date: app.createdAt }]} /></Card></div><StatusUpdateModal isOpen={modal} application={app} onClose={() => setModal(false)} onConfirm={(data) => update.mutate(data)} loading={update.isPending} /></> : <EmptyState title="Application not found" description="This application could not be loaded." />}</div></Layout>
}
