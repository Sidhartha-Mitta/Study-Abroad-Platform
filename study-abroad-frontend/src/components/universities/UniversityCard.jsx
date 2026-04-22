import { Heart, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { getCountryFlag } from '../../utils/formatters'

export default function UniversityCard({ university, compact = false }) {
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()
  const id = university._id || university.id
  return (
    <Card glow className={compact ? 'row between' : 'stack'}>
      <div className="row between">
        <span className="badge badge-neutral">{getCountryFlag(university.country)} {university.country || 'Global'}</span>
        <button className="btn btn-ghost btn-sm" onClick={() => setSaved((v) => !v)} aria-label="Save university"><Heart size={18} fill={saved ? 'currentColor' : 'none'} className={saved ? 'gold' : ''} /></button>
      </div>
      <div><h3 className="section-title" style={{ fontSize: '1.55rem', margin: 0 }}>{university.name}</h3><p className="muted row"><MapPin size={16} /> {university.city || 'International campus'}</p></div>
      <div className="row between"><Badge variant="warning">#{university.ranking || 'N/A'} in World</Badge><span className="tiny">{university.programCount || university.programs?.length || 0} programs</span></div>
      <Button variant="secondary" onClick={() => navigate(`/universities/${id}`)}>View Details</Button>
    </Card>
  )
}
