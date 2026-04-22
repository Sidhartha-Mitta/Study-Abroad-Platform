import { useState } from 'react'
import Modal from '../ui/Modal'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { VALID_TRANSITIONS } from '../../utils/constants'
import { useAuthStore } from '../../store/authStore'

export default function StatusUpdateModal({ application, isOpen, onClose, onConfirm, loading }) {
  const user = useAuthStore((s) => s.user)
  const isStaff = user?.role === 'admin' || user?.role === 'counselor'
  const current = application?.status || 'Applied'
  const [status, setStatus] = useState('')
  const [note, setNote] = useState('')

  // Reset on open
  const allTransitions = VALID_TRANSITIONS[current] || []
  const allowed = isStaff ? allTransitions : allTransitions.filter((s) => s === 'Withdrawn')

  const statusColors = { Applied: '#6366F1', Reviewed: '#F59E0B', Accepted: '#10B981', Rejected: '#EF4444', Withdrawn: '#94A3B8' }

  return (
    <Modal isOpen={isOpen} onClose={() => { setStatus(''); setNote(''); onClose() }} title="Update Application Status">
      <div className="stack">
        <div style={{ background: 'var(--bg-elevated)', borderRadius: '0.8rem', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: statusColors[current], display: 'inline-block', flexShrink: 0 }} />
          <span className="muted" style={{ fontSize: '0.9rem' }}>Current status: <strong style={{ color: 'var(--text-primary)' }}>{current}</strong></span>
        </div>

        {allowed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {current === 'Withdrawn' ? '⟳ You may re-apply from the university page.' : `No further transitions available from "${current}".`}
          </div>
        ) : (
          <>
            {!isStaff && <p className="tiny muted">As a student, you can only withdraw your application.</p>}
            <Select
              label="Move to status"
              options={[{ label: 'Select next status...', value: '' }, ...allowed.map((s) => ({ value: s, label: s }))]}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
            <label className="field">
              <span className="label">Note (optional)</span>
              <textarea className="textarea" rows="3" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note about this status change..." />
            </label>
          </>
        )}

        <div className="row between">
          <Button variant="ghost" onClick={() => { setStatus(''); setNote(''); onClose() }}>Cancel</Button>
          {allowed.length > 0 && <Button loading={loading} disabled={!status} onClick={() => { onConfirm({ status, note }); setStatus(''); setNote('') }}>Confirm Update</Button>}
        </div>
      </div>
    </Modal>
  )
}
