import clsx from 'clsx'
import { STATUS_COLORS } from '../../utils/constants'

export default function Badge({ variant = 'neutral', size = 'md', children }) {
  const mapped = STATUS_COLORS[children] || variant
  return <span className={clsx('badge', `badge-${mapped}`, size !== 'md' && `badge-${size}`)}>{children}</span>
}
