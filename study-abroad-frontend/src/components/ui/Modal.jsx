import { useEffect, useRef } from 'react'
import { motion as fm, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Button from './Button'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const MotionDiv = fm.div
  const ref = useRef(null)
  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    setTimeout(() => ref.current?.querySelector('button, input, select, textarea, a')?.focus(), 0)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])
  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv className="modal-backdrop" onMouseDown={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <MotionDiv ref={ref} role="dialog" aria-modal="true" aria-label={title} className={`modal modal-${size}`} onMouseDown={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="row between" style={{ marginBottom: '1rem' }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem', margin: 0 }}>{title}</h2>
              <Button variant="ghost" size="sm" icon={X} onClick={onClose} aria-label="Close modal" />
            </div>
            {children}
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  )
}
