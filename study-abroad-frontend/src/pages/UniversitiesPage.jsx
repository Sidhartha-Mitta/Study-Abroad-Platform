import { useEffect, useMemo, useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Grid2X2, List, Search } from 'lucide-react'
import { motion as fm } from 'framer-motion'
import Layout from '../components/layout/Layout'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import UniversityFilters from '../components/universities/UniversityFilters'
import UniversityGrid from '../components/universities/UniversityGrid'
import { universityAPI } from '../api/universities'
import { asArray } from '../utils/formatters'
import { mockUniversities } from '../utils/mockData'
import { useDebounce } from '../hooks/useDebounce'
import { usePagination } from '../hooks/usePagination'

export default function UniversitiesPage() {
  const [params] = useState(new URLSearchParams(location.search))
  const [search, setSearch] = useState(params.get('q') || '')
  const [view, setView] = useState('grid')
  const [sort, setSort] = useState('rankingAsc')
  const [filters, setFilters] = useState({ countries: params.getAll('country'), minRank: params.get('minRank') || '', maxRank: params.get('maxRank') || '' })
  const q = useDebounce(search)
  const query = useQuery({ queryKey: ['universities', q, filters, sort], queryFn: () => universityAPI.getAll({ q, sort, ...filters, country: filters.countries }), staleTime: 300000, placeholderData: keepPreviousData, retry: 1 })
  let data = asArray(query.data)
  const usingMock = query.isError && !data.length
  if (usingMock) data = mockUniversities
  const filtered = useMemo(() => data.filter((u) => (!q || u.name.toLowerCase().includes(q.toLowerCase())) && (!filters.countries.length || filters.countries.includes(u.country)) && (!filters.minRank || u.ranking >= Number(filters.minRank)) && (!filters.maxRank || u.ranking <= Number(filters.maxRank))).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'rankingDesc' ? b.ranking - a.ranking : a.ranking - b.ranking), [data, q, filters, sort])
  const page = usePagination(filtered.length, 6)
  const visible = filtered.slice((page.currentPage - 1) * 6, page.currentPage * 6)
  useEffect(() => { const next = new URLSearchParams(); if (q) next.set('q', q); filters.countries.forEach((c) => next.append('country', c)); if (filters.minRank) next.set('minRank', filters.minRank); if (filters.maxRank) next.set('maxRank', filters.maxRank); history.replaceState(null, '', `?${next.toString()}`) }, [q, filters])
  const MotionGrid = fm.div
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } } }

  return <Layout><div className="page-wide filters-shell"><UniversityFilters filters={filters} setFilters={setFilters} total={filtered.length} clear={() => setFilters({ countries: [], minRank: '', maxRank: '' })} /><section className="stack"><div><h1 className="page-title">Discover Universities</h1>{usingMock && <p className="tiny">Backend unavailable, showing curated sample data.</p>}</div><div className="toolbar"><Input icon={Search} placeholder="Search university name" value={search} onChange={(e) => setSearch(e.target.value)} /><Select value={sort} onChange={(e) => setSort(e.target.value)} options={[{ value: 'rankingAsc', label: 'Ranking ↑' }, { value: 'rankingDesc', label: 'Ranking ↓' }, { value: 'name', label: 'Name A-Z' }]} /><div className="row"><Button variant={view === 'grid' ? 'primary' : 'ghost'} icon={Grid2X2} onClick={() => setView('grid')} aria-label="Grid view" /><Button variant={view === 'list' ? 'primary' : 'ghost'} icon={List} onClick={() => setView('list')} aria-label="List view" /></div></div>{query.isLoading ? <div className="grid grid-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} height="15rem" />)}</div> : visible.length ? <MotionGrid variants={containerVariants} initial="hidden" animate="show"><UniversityGrid universities={visible} view={view} /></MotionGrid> : <EmptyState title="No universities found" description="Try widening your country or ranking filters." />}<div className="pagination"><Button variant="ghost" disabled={!page.hasPrev} onClick={page.prevPage}>Prev</Button>{page.pageNumbers.map((n) => <Button key={n} size="sm" variant={n === page.currentPage ? 'primary' : 'ghost'} onClick={() => { page.goToPage(n); scrollTo(0, 0) }}>{n}</Button>)}<Button variant="ghost" disabled={!page.hasNext} onClick={page.nextPage}>Next</Button><span className="tiny">Page {page.currentPage} of {page.totalPages} · {filtered.length} total results</span></div></section></div></Layout>
}
