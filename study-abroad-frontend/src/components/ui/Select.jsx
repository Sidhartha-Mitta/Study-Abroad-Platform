import { ChevronDown } from 'lucide-react'

export default function Select({ label, error, options = [], register, placeholder = 'Select', ...props }) {
  return (
    <label className="field">
      {label && <span className="label">{label}</span>}
      <span className="select-wrap">
        <select className="select" {...register} {...props}>
          {options.map((option) => <option key={option.value ?? option} value={option.value ?? option}>{option.label ?? option}</option>)}
        </select>
        <ChevronDown size={18} aria-hidden="true" />
      </span>
      {error && <span className="error">{error}</span>}
    </label>
  )
}
