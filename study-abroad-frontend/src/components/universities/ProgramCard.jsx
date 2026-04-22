import { LockKeyhole, Timer } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Tooltip from '../ui/Tooltip'
import { formatCurrency, getCountryFlag } from '../../utils/formatters'
import { useAuthStore } from '../../store/authStore'

export default function ProgramCard({ program, onApply }) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated)
  return (
    <Card glow className="stack">
      <div><h3 className="section-title" style={{ fontSize: '1.45rem', margin: 0 }}>{program.name}</h3><p className="muted">{getCountryFlag(program.country || program.university?.country)} {program.universityName || program.university?.name}</p></div>
      <div className="row"><Badge variant="info">{program.field || 'General'}</Badge><Badge variant="neutral">{program.degree || program.degreeType || 'Masters'}</Badge></div>
      <strong className="mono gold" style={{ fontSize: '1.45rem' }}>{formatCurrency(program.tuition || program.annualTuition)}</strong>
      <div className="row tiny"><Timer size={16} /> {program.duration || 24} months <LockKeyhole size={16} /> IELTS {program.ieltsMin || program.minIelts || 6.5}</div>
      <div className="row" style={{ flexWrap: 'wrap' }}>{(program.intakes || program.intakeMonths || ['September']).map((m) => <Badge key={m} size="sm" variant="warning">{m}</Badge>)}</div>
      <Tooltip label={isAuthed ? 'Apply to this program' : 'Login required to apply'}><Button disabled={!isAuthed} onClick={() => onApply?.(program)}>Apply</Button></Tooltip>
    </Card>
  )
}
