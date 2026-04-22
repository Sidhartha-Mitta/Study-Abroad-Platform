import { COUNTRIES } from '../../utils/constants'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function UniversityFilters({ filters, setFilters, total, clear }) {
  const toggle = (country) => {
    const countries = filters.countries.includes(country) ? filters.countries.filter((c) => c !== country) : [...filters.countries, country]
    setFilters({ ...filters, countries })
  }
  return (
    <aside className="card filters-panel stack">
      <div><h2 className="section-title" style={{ fontSize: '1.5rem', margin: 0 }}>Filter Results</h2><p className="tiny">Showing {total} universities</p></div>
      <div className="stack">{COUNTRIES.slice(0, 8).map((c) => <label key={c.value} className="row"><input type="checkbox" checked={filters.countries.includes(c.value)} onChange={() => toggle(c.value)} /> {c.label}</label>)}</div>
      <div className="grid grid-2"><Input label="Min rank" type="number" value={filters.minRank} onChange={(e) => setFilters({ ...filters, minRank: e.target.value })} /><Input label="Max rank" type="number" value={filters.maxRank} onChange={(e) => setFilters({ ...filters, maxRank: e.target.value })} /></div>
      <Button variant="ghost" onClick={clear}>Clear all filters</Button>
    </aside>
  )
}
