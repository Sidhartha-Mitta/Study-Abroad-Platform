import clsx from 'clsx'
import { motion as fm } from 'framer-motion'
import Spinner from './Spinner'

export default function Button({ variant = 'primary', size = 'md', loading, disabled, icon: Icon, children, className, ...props }) {
  return (
    <fm.button 
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      className={clsx('btn', `btn-${variant}`, size !== 'md' && `btn-${size}`, loading && 'loading', className)} 
      disabled={disabled || loading} 
      {...props}
    >
      {loading ? <Spinner /> : Icon ? <Icon size={18} aria-hidden="true" /> : null}
      {children}
    </fm.button>
  )
}
