import { useEffect, useState } from 'react'

export default function ProgressBar({ value = 0, label, animated = true }) {
  const [width, setWidth] = useState(animated ? 0 : value)
  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(Math.max(0, Math.min(100, value))))
    return () => cancelAnimationFrame(id)
  }, [value])
  return (
    <div className="stack" style={{ gap: '0.35rem' }}>
      {label && <div className="row between tiny"><span>{label}</span><span className="mono gold">{Math.round(value)}%</span></div>}
      <div className="progress"><div className="progress-fill" style={{ width: `${width}%` }} /></div>
    </div>
  )
}
