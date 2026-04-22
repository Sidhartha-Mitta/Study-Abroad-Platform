import { useState } from 'react'
import clsx from 'clsx'

export default function Input({ label, error, icon: Icon, register, className, ...props }) {
  const [filled, setFilled] = useState(Boolean(props.defaultValue || props.value))
  return (
    <label className="field">
      {label && <span className={clsx('label', filled && 'gold')}>{label}</span>}
      {Icon && <Icon className="field-icon" size={18} aria-hidden="true" />}
      <input className={clsx('input', Icon && 'with-icon', className)} onBlur={(e) => setFilled(Boolean(e.target.value))} onFocus={() => setFilled(true)} {...register} {...props} />
      {error && <span className="error">{error}</span>}
    </label>
  )
}
