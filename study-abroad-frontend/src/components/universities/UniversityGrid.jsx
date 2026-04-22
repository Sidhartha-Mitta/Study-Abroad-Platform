import UniversityCard from './UniversityCard'
import { motion as fm } from 'framer-motion'

export default function UniversityGrid({ universities = [], view = 'grid' }) {
  const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } } }
  return <div className={`grid ${view === 'grid' ? 'grid-3' : ''}`}>{universities.map((u) => <fm.div key={u._id || u.id || u.name} variants={itemVariants}><UniversityCard university={u} compact={view === 'list'} /></fm.div>)}</div>
}
