import { useEffect, useState } from 'react'
import Card from './Card'

export default function StatCard({ icon: Icon, label, value = 0, trend }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const target = Number(value) || 0
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / 800)
      setCount(Math.round(target * progress))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value])
  return (
    <Card glow>
      <div className="row between">
        <span className="empty-icon" style={{ width: '3rem', height: '3rem' }}>{Icon && <Icon size={22} />}</span>
        {trend && <span className="tiny gold">{trend}</span>}
      </div>
      <strong className="mono" style={{ display: 'block', fontSize: '2rem', marginTop: '1rem' }}>{count}</strong>
      <span className="muted">{label}</span>
    </Card>
  )
}
