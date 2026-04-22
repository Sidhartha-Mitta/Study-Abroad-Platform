import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion as fm } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Globe2, Lock, Mail, User } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'

const schema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(8), confirmPassword: z.string(), adminSecret: z.string().optional() }).refine((d) => d.password === d.confirmPassword, { path: ['confirmPassword'], message: 'Passwords must match' })

export default function RegisterPage() {
  const navigate = useNavigate()
  const registerUser = useAuthStore((s) => s.register)
  const loading = useAuthStore((s) => s.isLoading)
  const [isStaff, setIsStaff] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const password = watch('password') || ''
  const strength = useMemo(() => [password.length >= 8, /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length, [password])
  const onSubmit = async (values) => { const data = { ...values }; delete data.confirmPassword; const res = await registerUser(data); res.success ? (toast.success('Account created'), navigate('/dashboard')) : toast.error(res.message) }
  const v = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }
  return <main className="auth"><fm.section variants={v} initial="hidden" animate="show" className="auth-panel stack"><fm.div variants={item}><Link to="/" className="logo"><Globe2 className="gold" /> StudyAbroad</Link></fm.div><fm.div variants={item}><h1 className="page-title">Create account</h1><p className="muted">Your global journey begins with a strong foundation.</p></fm.div><fm.form variants={v} className="stack" onSubmit={handleSubmit(onSubmit)}><fm.div variants={item}><Input label="Name" icon={User} register={register('name')} error={errors.name?.message} /></fm.div><fm.div variants={item}><Input label="Email" icon={Mail} register={register('email')} error={errors.email?.message} /></fm.div><fm.div variants={item}><Input label="Password" type="password" icon={Lock} register={register('password')} error={errors.password?.message} /></fm.div><fm.div variants={item} className="row">{[1, 2, 3, 4].map((n) => <span key={n} className="progress" style={{ flex: 1 }}><span className="progress-fill" style={{ width: n <= strength ? '100%' : '0%' }} /></span>)}</fm.div><fm.div variants={item}><Input label="Confirm Password" type="password" icon={Lock} register={register('confirmPassword')} error={errors.confirmPassword?.message} /></fm.div><fm.div variants={item}><label className="row" style={{ cursor: 'pointer' }}><input type="checkbox" checked={isStaff} onChange={() => setIsStaff(!isStaff)} /> Register as Staff/Admin</label></fm.div>{isStaff && <fm.div variants={item}><Input label="Admin Secret" type="password" icon={Lock} register={register('adminSecret')} error={errors.adminSecret?.message} placeholder="Required to grant admin permissions" /></fm.div>}<fm.div variants={item}><Button loading={loading} style={{ width: '100%' }}>Register</Button></fm.div></fm.form><fm.p variants={item} className="muted">Already have an account? <Link className="gold" to="/login">Login</Link></fm.p></fm.section><aside className="auth-art"><fm.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }} className="shape" style={{ width: 300, height: 300, top: '20%', right: '-10%', borderRadius: '30%', border: '2px solid var(--accent-gold)', opacity: 0.2 }} /><div className="card glass" style={{ position: 'absolute', bottom: '15%', left: '15%', right: '15%' }}><p>“The world is shaped by those who step out of their comfort zone in pursuit of knowledge.”</p><strong className="gold">Global Initiative</strong></div></aside></main>
}
