import clsx from 'clsx'
import { motion as fm } from 'framer-motion'

export default function Card({ children, hover = true, glow = false, className, ...props }) {
  return (
    <fm.div 
      whileHover={hover ? { y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } } : {}}
      className={clsx('card', hover && 'hover', glow && 'glow', className)} 
      {...props}
    >
      {children}
    </fm.div>
  )
}
