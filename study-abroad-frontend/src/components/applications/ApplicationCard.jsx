import { useState } from 'react'
import { AnimatePresence, motion as fm } from 'framer-motion'
import { History, Pencil } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import StatusBadge from './StatusBadge'
import ApplicationTimeline from './ApplicationTimeline'
import { formatCurrency, formatDate } from '../../utils/formatters'

export default function ApplicationCard({ application, onUpdate }) {
  const MotionDiv = fm.div
  const [open, setOpen] = useState(false)
  const program = application.program || {}
  const university = application.university || {}
  return (
    <Card glow onClick={() => setOpen((v) => !v)}>
      <div className="grid grid-3" style={{ alignItems: 'center' }}>
        <div><h3 className="section-title" style={{ fontSize: '1.35rem', margin: 0 }}>{university.name || application.universityName} {application.user?.name && <span className="mono gold" style={{fontSize: '1rem'}}>({application.user.name})</span>}</h3><p className="muted">{program.name || application.programName}</p></div>
        <div className="tiny">{program.field || application.field} · {program.degree || application.degree}<br /><span className="mono gold">{formatCurrency(program.tuition || application.tuition)}</span></div>
        <div className="row between"><StatusBadge status={application.status} /><span className="tiny">{formatDate(application.createdAt || application.appliedAt)}</span></div>
      </div>
      <AnimatePresence>{open && <MotionDiv initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
        <div className="stack" style={{ marginTop: '1rem' }}><div className="row"><Button size="sm" icon={Pencil} onClick={(e) => { e.stopPropagation(); onUpdate(application) }}>Update Status</Button><Button size="sm" variant="secondary" icon={History}>View History</Button></div><ApplicationTimeline history={application.history || [{ status: application.status, date: application.createdAt }]} /></div>
      </MotionDiv>}</AnimatePresence>
    </Card>
  )
}
