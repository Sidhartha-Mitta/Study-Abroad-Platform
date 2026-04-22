import { Bookmark, CheckCircle2, Clock, FileText } from 'lucide-react'
import StatCard from '../ui/StatCard'

export default function StatsRow({ applications = [] }) {
  const count = (s) => applications.filter((a) => a.status === s).length
  return <div className="grid grid-4"><StatCard icon={FileText} label="Total Applications" value={applications.length} /><StatCard icon={CheckCircle2} label="Accepted" value={count('Accepted')} trend="↑ ready" /><StatCard icon={Clock} label="Pending Review" value={count('Applied') + count('Reviewed')} /><StatCard icon={Bookmark} label="Saved Universities" value={Number(localStorage.getItem('saved_universities') || 0)} /></div>
}
