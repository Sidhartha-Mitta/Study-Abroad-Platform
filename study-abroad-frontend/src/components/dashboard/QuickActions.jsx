import { ArrowRight, Compass, FileText, GraduationCap, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'

const actions = [['Discover Universities', '/universities', Compass, 'Search trusted global institutions.'], ['Get Recommendations', '/recommendations', Sparkles, 'Match programs to your goals.'], ['Browse Programs', '/programs', GraduationCap, 'Compare tuition, intakes, and IELTS needs.'], ['My Applications', '/applications', FileText, 'Track every status change.']]

export default function QuickActions() {
  const navigate = useNavigate()
  return <div className="grid grid-2">{actions.map(([title, path, Icon, desc]) => { const ActionIcon = Icon; return <Card key={path} glow onClick={() => navigate(path)}><div className="row between"><ActionIcon className="gold" /><ArrowRight /></div><h3>{title}</h3><p className="muted">{desc}</p></Card> })}</div>
}
