import { CheckCircle2, CircleDot, Clock, XCircle } from 'lucide-react'
import Badge from '../ui/Badge'

const icons = { Applied: CircleDot, Reviewed: Clock, Accepted: CheckCircle2, Rejected: XCircle, Withdrawn: CircleDot }

export default function StatusBadge({ status = 'Applied', size }) {
  const Icon = icons[status] || CircleDot
  return <Badge size={size}><Icon size={14} /> {status}</Badge>
}
