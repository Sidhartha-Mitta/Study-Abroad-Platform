export default function Avatar({ name = 'Student' }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'SA'
  return <span className="avatar" aria-label={`${name} avatar`}>{initials}</span>
}
