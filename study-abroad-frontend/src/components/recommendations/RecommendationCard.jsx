import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import RecommendationScore from './RecommendationScore'
import { formatCurrency, getCountryFlag } from '../../utils/formatters'

export default function RecommendationCard({ item, rank = 1, onApply }) {
  const program = item.program || item
  const university = item.university || program.university || {}
  return (
    <Card glow className="row" style={{ alignItems: 'stretch' }}>
      <strong className="mono gold" style={{ fontSize: '2.5rem' }}>{rank}</strong>
      <div className="stack" style={{ flex: 1 }}>
        <div><h3 className="section-title" style={{ fontSize: '1.45rem', margin: 0 }}>{program.name}</h3><p className="muted">{getCountryFlag(university.country || program.country)} {university.name || program.universityName}</p></div>
        <div className="row"><Badge variant="neutral">{program.degree || 'Masters'}</Badge><Badge variant="info">{program.field || 'Global Studies'}</Badge></div>
        <p className="mono gold">{formatCurrency(program.tuition)} · IELTS {program.ieltsMin || 6.5}</p>
        <RecommendationScore score={item.score || item.matchScore || 6} />
        <div className="row"><Button onClick={() => onApply?.(program)}>Apply Now</Button><Link className="btn btn-ghost" to={`/universities/${university._id || university.id || program.universityId || 'unknown'}`}>View University</Link></div>
      </div>
    </Card>
  )
}
