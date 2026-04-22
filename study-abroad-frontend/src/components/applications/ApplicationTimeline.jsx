import { formatDate } from '../../utils/formatters'

export default function ApplicationTimeline({ history = [] }) {
  const items = [...history].reverse()
  return <div className="timeline">{items.map((h, i) => <div className="timeline-item" key={`${h.status}-${i}`}><span className="timeline-dot" /><strong>{h.status}</strong><p className="tiny">{formatDate(h.date || h.createdAt)} {h.note ? `· ${h.note}` : ''}</p></div>)}</div>
}
