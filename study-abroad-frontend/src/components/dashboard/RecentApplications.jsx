import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import EmptyState from '../ui/EmptyState'
import StatusBadge from '../applications/StatusBadge'
import { formatDate } from '../../utils/formatters'

export default function RecentApplications({ applications = [] }) {
  if (!applications.length) return <EmptyState icon={Compass} title="No applications yet" description="Start with a university or program that feels right." action={{ label: 'Discover Universities', onClick: () => location.assign('/universities') }} />
  return <div className="card stack"><div className="row between"><h2>Recent Applications</h2><Link className="gold" to="/applications">View all</Link></div>{applications.slice(0, 3).map((a) => <div className="row between" key={a._id || a.id}><span>{a.university?.name || a.universityName}<br /><small className="tiny">{a.program?.name || a.programName}</small></span><StatusBadge status={a.status} /><span className="tiny">{formatDate(a.createdAt || a.appliedAt)}</span></div>)}</div>
}
