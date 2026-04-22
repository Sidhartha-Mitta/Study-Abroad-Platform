import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Compass } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { COUNTRIES, FIELDS_OF_STUDY, INTAKE_MONTHS } from '../../utils/constants'
import { useAuthStore } from '../../store/authStore'

const schema = z.object({ country: z.string().optional(), budget: z.coerce.number().min(0), field: z.string().min(1), intake: z.string().optional(), ielts: z.coerce.number().min(0).max(9), save: z.boolean().optional() })

export default function PreferencesForm({ onSubmit, loading }) {
  const user = useAuthStore((s) => s.user)
  const prefs = user?.preferences || {}
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { country: prefs.country || '', budget: prefs.budget || 35000, field: prefs.field || '', intake: prefs.intake || 'September', ielts: prefs.ielts || 6.5, save: false } })
  return (
    <form className="card stack" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="section-title" style={{ fontSize: '1.7rem', margin: 0 }}>Tell us about yourself</h2>
      <Select label="Preferred Country" options={COUNTRIES} register={register('country')} />
      <Input label="Budget / Max Tuition" type="number" register={register('budget')} error={errors.budget?.message} />
      <Select label="Field of Study" options={FIELDS_OF_STUDY} register={register('field')} error={errors.field?.message} />
      <Select label="Preferred Intake Month" options={INTAKE_MONTHS} register={register('intake')} />
      <label className="field"><span className="label">IELTS Score: <span className="gold mono">{watch('ielts')}</span></span><input type="range" min="0" max="9" step="0.5" {...register('ielts')} /></label>
      {user && <label className="row"><input type="checkbox" {...register('save')} /> Save Preferences</label>}
      <Button icon={Compass} loading={loading} style={{ width: '100%' }}>Find My Programs</Button>
    </form>
  )
}
