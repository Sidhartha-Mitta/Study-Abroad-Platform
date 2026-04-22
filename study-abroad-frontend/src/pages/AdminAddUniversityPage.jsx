import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion as fm } from 'framer-motion'
import toast from 'react-hot-toast'
import { Plus, ArrowLeft, Building2 } from 'lucide-react'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { universityAPI } from '../api/universities'
import { COUNTRIES } from '../utils/constants'

export default function AdminAddUniversityPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [formData, setFormData] = useState({
    name: '', country: '', city: '', ranking: '', description: '', applicationDeadline: ''
  })

  const createMutation = useMutation({
    mutationFn: (data) => universityAPI.create(data),
    onSuccess: (res) => {
      toast.success('University created! Now add its programs.')
      qc.invalidateQueries({ queryKey: ['universities'] })
      const newId = res?.data?._id || res?.data?.data?._id
      if (newId) navigate(`/admin/universities/${newId}/programs/new`)
      else navigate('/universities')
    },
    onError: (e) => toast.error('Failed: ' + String(e?.response?.data?.message || e.message))
  })

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.country || !formData.city) {
      toast.error('Name, Country, and City are required')
      return
    }
    createMutation.mutate({ ...formData, ranking: Number(formData.ranking) || undefined })
  }

  const v = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } } }
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

  return (
    <Layout>
      <fm.div variants={v} initial="hidden" animate="show" className="page stack">
        <fm.header variants={item}>
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/universities')} style={{ marginBottom: '1rem', padding: 0 }}>
            Back to Universities
          </Button>
          <div className="row" style={{ gap: '0.75rem', alignItems: 'center' }}>
            <Building2 size={28} className="gold" />
            <div>
              <h1 className="page-title" style={{ margin: 0 }}>Add New University</h1>
              <p className="muted" style={{ margin: 0 }}>Create the institution, then bind its academic programs.</p>
            </div>
          </div>
        </fm.header>

        <fm.div variants={item}>
          <Card>
            <form className="stack" onSubmit={handleSubmit}>
              <div className="field-grid">
                <Input label="University Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. University of Oxford" required />
                <Select label="Country" name="country" value={formData.country} onChange={handleChange} options={[{ label: 'Select Country', value: '' }, ...COUNTRIES]} required />
                <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Oxford" required />
                <Input label="Global Ranking" name="ranking" type="number" value={formData.ranking} onChange={handleChange} placeholder="e.g. 1" />
                <label className="field">
                  <span className="label">Application Deadline</span>
                  <input type="date" className="input" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} />
                </label>
              </div>
              <label className="field">
                <span className="label">Description</span>
                <textarea name="description" value={formData.description} onChange={handleChange} className="textarea" rows="4" placeholder="A brief overview of this institution..." />
              </label>
              <div className="row" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <Button type="button" variant="ghost" onClick={() => navigate('/universities')}>Cancel</Button>
                <Button type="submit" loading={createMutation.isPending} icon={Plus}>
                  Create & Add Programs →
                </Button>
              </div>
            </form>
          </Card>
        </fm.div>
      </fm.div>
    </Layout>
  )
}
