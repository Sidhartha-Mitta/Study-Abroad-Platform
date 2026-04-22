import { Compass } from 'lucide-react'
import Button from './Button'

export default function EmptyState({ icon: Icon = Compass, title, description, action }) {
  const EmptyIcon = Icon
  return (
    <div className="empty card">
      <div>
        <span className="empty-icon"><EmptyIcon size={34} aria-hidden="true" /></span>
        <h2 className="section-title" style={{ fontSize: '1.8rem', marginTop: '1rem' }}>{title}</h2>
        <p className="muted">{description}</p>
        {action && <Button style={{ marginTop: '1rem' }} onClick={action.onClick} icon={action.icon}>{action.label}</Button>}
      </div>
    </div>
  )
}
