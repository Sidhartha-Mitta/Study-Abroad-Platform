import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion as fm } from 'framer-motion'
import toast from 'react-hot-toast'
import { Check, ArrowLeft } from 'lucide-react'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { universityAPI } from '../api/universities'
import { DEGREE_TYPES, FIELDS_OF_STUDY, INTAKE_MONTHS } from '../utils/constants'

export default function AdminAddProgramPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [formData, setFormData] = useState({
    name: '',
    fieldOfStudy: '',
    degree: '',
    duration: '',
    tuition: '',
    currency: 'USD',
    ieltsMin: '',
    intakeMonths: []
  })

  const createMutation = useMutation({
    mutationFn: (data) => universityAPI.createProgram(id, data),
    onSuccess: () => {
      toast.success('Deployed Academic Program successfully!')
      qc.invalidateQueries({ queryKey: ['university', id] })
      qc.invalidateQueries({ queryKey: ['programs'] })
      navigate(`/universities/${id}`)
    },
    onError: (e) => {
      toast.error('Failed to assign program: ' + String(e?.response?.data?.message || e.message))
    }
  })

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleIntakeToggle = (month) => {
    setFormData((p) => {
      const ints = p.intakeMonths.includes(month)
        ? p.intakeMonths.filter((m) => m !== month)
        : [...p.intakeMonths, month]
      return { ...p, intakeMonths: ints }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.fieldOfStudy || !formData.degree || !formData.tuition) {
      toast.error('Name, Field of Study, Degree type, and Tuition are required parameters.')
      return
    }
    createMutation.mutate({
      ...formData,
      tuition: Number(formData.tuition),
      duration: formData.duration ? Number(formData.duration) : undefined,
      ieltsMin: formData.ieltsMin ? Number(formData.ieltsMin) : undefined
    })
  }

  const v = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }

  return (
    <Layout>
      <div className="page stack">
        <header>
          <fm.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(`/universities/${id}`)} style={{ marginBottom: '1rem', padding: 0 }}>
              Back to University
            </Button>
          </fm.div>
          <h1 className="page-title">Instantiate Program</h1>
          <p className="muted">Bind new core academics and tuition schemas to this university.</p>
        </header>

        <fm.div variants={v} initial="hidden" animate="show">
          <Card>
            <form className="stack" onSubmit={handleSubmit}>
              <div className="field-grid">
                <fm.div variants={item}>
                  <Input
                    label="Program Title"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Master of Data Science"
                    required
                  />
                </fm.div>

                <fm.div variants={item}>
                  <Select
                    label="Field of Study"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    options={[{ label: 'Select Discipline', value: '' }, ...FIELDS_OF_STUDY]}
                    required
                  />
                </fm.div>

                <fm.div variants={item}>
                  <Select
                    label="Degree Hierarchy"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    options={[{ label: 'Select Tier', value: '' }, ...DEGREE_TYPES]}
                    required
                  />
                </fm.div>

                <fm.div variants={item}>
                  <Input
                    label="Tuition (Per Annum)"
                    name="tuition"
                    type="number"
                    value={formData.tuition}
                    onChange={handleChange}
                    placeholder="e.g. 24000"
                    required
                  />
                </fm.div>

                <fm.div variants={item}>
                  <Input
                    label="Duration (Years)"
                    name="duration"
                    type="number"
                    step="0.5"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                  />
                </fm.div>

                <fm.div variants={item}>
                  <Input
                    label="Minimum IELTS Bound"
                    name="ieltsMin"
                    type="number"
                    step="0.5"
                    value={formData.ieltsMin}
                    onChange={handleChange}
                    placeholder="e.g. 6.5"
                  />
                </fm.div>
              </div>

              <fm.div variants={item}>
                <label className="field">
                  <span className="label" style={{ marginBottom: '0.5rem' }}>Select Available Intake Windows</span>
                  <div className="row" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                    {INTAKE_MONTHS.map((m) => {
                      const active = formData.intakeMonths.includes(m.value)
                      return (
                        <div key={m.value} onClick={() => handleIntakeToggle(m.value)} className={`badge ${active ? 'badge-primary gold' : 'badge-neutral'}`} style={{ cursor: 'pointer', border: active ? '1px solid var(--accent-gold)' : '' }}>
                          {m.label}
                        </div>
                      )
                    })}
                  </div>
                </label>
              </fm.div>

              <div className="row" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <Button type="submit" loading={createMutation.isPending} icon={Check}>
                  Deploy Academic Program
                </Button>
              </div>
            </form>
          </Card>
        </fm.div>
      </div>
    </Layout>
  )
}
