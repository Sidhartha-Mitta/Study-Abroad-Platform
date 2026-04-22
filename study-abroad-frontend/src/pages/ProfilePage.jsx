import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Layout from '../components/layout/Layout'
import Avatar from '../components/ui/Avatar'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import StatCard from '../components/ui/StatCard'
import { COUNTRIES, FIELDS_OF_STUDY, INTAKE_MONTHS } from '../utils/constants'
import { useAuthStore } from '../store/authStore'
import { applicationAPI } from '../api/applications'
import { asArray, formatDate } from '../utils/formatters'
import { CheckCircle2, Clock, FileText } from 'lucide-react'

const schema = z.object({ name: z.string().min(1), email: z.string().email(), country: z.string().optional(), budget: z.coerce.number().optional(), field: z.string().optional(), intake: z.string().optional(), ielts: z.coerce.number().min(0).max(9).optional() })

export default function ProfilePage() {
  const { user, updatePreferences, logout } = useAuthStore()
  const navigate = useNavigate()
  const apps = asArray(useQuery({ queryKey: ['applications'], queryFn: applicationAPI.getAll, staleTime: 300000, retry: 1 }).data)
  const prefs = user?.preferences || {}
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { name: user?.name || '', email: user?.email || '', ...prefs } })
  const save = async (values) => {
    const data = { ...values }
    delete data.name
    delete data.email
    await updatePreferences(data)
    toast.success('Preferences saved')
  }
  return <Layout showSidebar><div className="page-wide stack"><h1 className="page-title">Profile</h1><div className="grid grid-2"><Card glow className="stack" style={{ textAlign: 'center' }}><div style={{ display: 'grid', placeItems: 'center' }}><Avatar name={user?.name} /></div><h2 className="section-title" style={{ fontSize: '1.8rem', margin: 0 }}>{user?.name || 'Student'}</h2><p className="muted">{user?.email}</p><p className="tiny">Member since {formatDate(user?.createdAt || new Date())}</p><div className="grid grid-3"><StatCard icon={FileText} label="Applications" value={apps.length} /><StatCard icon={CheckCircle2} label="Accepted" value={apps.filter((a) => a.status === 'Accepted').length} /><StatCard icon={Clock} label="Pending" value={apps.filter((a) => ['Applied', 'Reviewed'].includes(a.status)).length} /></div></Card><form className="card stack" onSubmit={handleSubmit(save)}><h2>Study Preferences</h2><Input label="Name" register={register('name')} error={errors.name?.message} /><Input label="Email" readOnly register={register('email')} error={errors.email?.message} /><Select label="Preferred Country" options={COUNTRIES} register={register('country')} /><Input label="Budget" type="number" register={register('budget')} /><Select label="Field of Study" options={FIELDS_OF_STUDY} register={register('field')} /><Select label="Intake" options={INTAKE_MONTHS} register={register('intake')} /><Input label="IELTS" type="number" step="0.5" register={register('ielts')} /><Button>Save</Button></form></div><Card><h2>Danger Zone</h2><Button variant="danger" onClick={() => { logout(); navigate('/') }}>Logout</Button></Card></div></Layout>
}
