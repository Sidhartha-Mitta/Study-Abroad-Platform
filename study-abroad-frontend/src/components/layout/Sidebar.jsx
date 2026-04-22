import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BookOpen, ChevronLeft, Compass, FileText, GraduationCap, LayoutDashboard, SlidersHorizontal, User } from 'lucide-react'
import Button from '../ui/Button'
import Tooltip from '../ui/Tooltip'

const links = [
  ['Dashboard', '/dashboard', LayoutDashboard], ['Discover Universities', '/universities', Compass], ['Programs', '/programs', GraduationCap], ['Get Recommendations', '/recommendations', SlidersHorizontal], ['My Applications', '/applications', FileText], ['Profile', '/profile', User],
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="stack" style={{ minHeight: '100%' }}>
        <div className="side-link"><BookOpen size={20} /><span className={collapsed ? 'hide-mobile' : ''}>{!collapsed && 'Study Console'}</span></div>
        <nav>{links.map(([label, path, Icon]) => { const SideIcon = Icon; return (
          <Tooltip key={path} label={label}><NavLink className="side-link" to={path}><SideIcon size={20} /><span style={{ display: collapsed ? 'none' : 'inline' }}>{label}</span></NavLink></Tooltip>
        ) })}</nav>
        <Button style={{ marginTop: 'auto', width: '100%' }} variant="ghost" icon={ChevronLeft} onClick={() => setCollapsed((v) => !v)} aria-label="Collapse sidebar">{collapsed ? '' : 'Collapse'}</Button>
      </div>
    </aside>
  )
}
