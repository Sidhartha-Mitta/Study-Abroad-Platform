import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion as fm } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Code2, Eye, Globe2, Lock, Mail } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import { useAuthStore } from '../store/authStore'

const schema = z.object({ email: z.string().email(), password: z.string().min(6) })

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const onSubmit = async (data) => { const res = await login(data); res.success ? (toast.success('Welcome back'), navigate('/dashboard')) : toast.error(res.message) }
  const v = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }
  return <main className="auth"><fm.section variants={v} initial="hidden" animate="show" className="auth-panel stack"><fm.div variants={item}><Link to="/" className="logo"><Globe2 className="gold" /> StudyAbroad</Link></fm.div><fm.div variants={item}><h1 className="page-title">Welcome back</h1><p className="muted">Sign in to manage your global trajectory.</p></fm.div><fm.form variants={v} className="stack" onSubmit={handleSubmit(onSubmit)}><fm.div variants={item}><Input label="Email" icon={Mail} register={register('email')} error={errors.email?.message} /></fm.div><fm.div variants={item} className="row" style={{ alignItems: 'end' }}><Input label="Password" type={show ? 'text' : 'password'} icon={Lock} register={register('password')} error={errors.password?.message} /><Button type="button" variant="ghost" icon={Eye} onClick={() => setShow((v) => !v)} aria-label="Show password" /></fm.div><fm.div variants={item}><Link className="tiny gold" to="#">Forgot password?</Link></fm.div><fm.div variants={item}><Button loading={isLoading} style={{ width: '100%' }}>Login</Button></fm.div></fm.form><fm.div variants={item} className="row"><span className="skeleton" style={{ height: 1 }} /><span className="tiny">or continue with</span><span className="skeleton" style={{ height: 1 }} /></fm.div><fm.div variants={item} className="grid grid-2"><Button variant="secondary">Google</Button><Button variant="secondary" icon={Code2}>GitHub</Button></fm.div><fm.p variants={item} className="muted">New here? <Link className="gold" to="/register">Create an account</Link></fm.p></fm.section><aside className="auth-art"><fm.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 45, ease: 'linear' }} className="shape" style={{ width: 400, height: 400, top: '10%', left: '-15%', borderRadius: '40%', border: '4px solid var(--accent-teal)', opacity: 0.15 }} /><CardQuote /></aside></main>
}

function CardQuote() { return <div className="card glass" style={{ position: 'absolute', bottom: '15%', left: '15%', right: '15%' }}><p>“The absolute best way to manage university applications effortlessly. The interface maps my potential precisely.”</p><strong className="gold">Ivy Review</strong></div> }
