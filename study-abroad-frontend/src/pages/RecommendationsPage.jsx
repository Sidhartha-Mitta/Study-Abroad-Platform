import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Layout from '../components/layout/Layout'
import PreferencesForm from '../components/recommendations/PreferencesForm'
import RecommendationCard from '../components/recommendations/RecommendationCard'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import { recommendationAPI } from '../api/recommendations'
import { useAuthStore } from '../store/authStore'
import { asArray } from '../utils/formatters'
import { mockRecommendations } from '../utils/mockData'

export default function RecommendationsPage() {
  const [results, setResults] = useState([])
  const [sort, setSort] = useState('Best Match')
  const updatePreferences = useAuthStore((s) => s.updatePreferences)
  const mutation = useMutation({ mutationFn: recommendationAPI.get, onSuccess: (data) => setResults(asArray(data)), onError: () => { toast.error('Backend unavailable, showing sample matches'); setResults(mockRecommendations) } })
  const submit = async ({ save, ...prefs }) => { if (save) await updatePreferences(prefs); mutation.mutate(prefs) }
  const sorted = useMemo(() => [...results].sort((a, b) => sort === 'Lowest Tuition' ? (a.program?.tuition || a.tuition) - (b.program?.tuition || b.tuition) : sort === 'Top Ranked' ? (a.university?.ranking || 999) - (b.university?.ranking || 999) : (b.score || b.matchScore || 0) - (a.score || a.matchScore || 0)), [results, sort])
  return <Layout showSidebar><div className="page-wide filters-shell" style={{ gridTemplateColumns: 'minmax(18rem, 25rem) 1fr' }}><PreferencesForm onSubmit={submit} loading={mutation.isPending} /><section className="stack"><div className="row between"><h1 className="page-title">Recommendations</h1><div className="tabs">{['Best Match', 'Lowest Tuition', 'Top Ranked'].map((s) => <button key={s} className={`tab ${sort === s ? 'active' : ''}`} onClick={() => setSort(s)}>{s}</button>)}</div></div>{mutation.isPending ? <><Skeleton height="11rem" /><Skeleton height="11rem" /><Skeleton height="11rem" /></> : sorted.length ? sorted.map((item, i) => <RecommendationCard key={i} item={item} rank={i + 1} />) : <EmptyState title="Your matches are waiting" description="Fill the preference form to generate tailored programs." />}</section></div></Layout>
}
