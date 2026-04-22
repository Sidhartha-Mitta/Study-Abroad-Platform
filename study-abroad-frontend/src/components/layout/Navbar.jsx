import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion as fm } from 'framer-motion'
import { Compass, Globe2, LogOut, Menu, User, X, FileText, SlidersHorizontal } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'
import ThemeToggle from '../ui/ThemeToggle'
import Avatar from '../ui/Avatar'

const links = [
  ['Discover', '/universities'], ['Programs', '/programs'], ['Recommendations', '/recommendations'], ['Applications', '/applications'],
]

export default function Navbar() {
  const MotionDiv = fm.div
  const MotionNav = fm.nav
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  
  const isStaff = user?.role === 'admin' || user?.role === 'counselor'
  const navLinks = isStaff ? [
    ['Dashboard', '/dashboard'], ['Users', '/users'], ['Universities', '/universities'], ['Programs', '/programs']
  ] : [
    ['Dashboard', '/dashboard'], ['Discover', '/universities'], ['Programs', '/programs'], ['Recommendations', '/recommendations'], ['Applications', '/applications']
  ]

  const doLogout = () => { logout(); navigate('/') }
  const nav = navLinks.map(([label, path]) => <NavLink key={path} className="nav-link" to={path} onClick={() => setOpen(false)}>{label}</NavLink>)
  
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo"><Globe2 className="gold" /> StudyAbroad</Link>
        <nav className="nav-links">{nav}</nav>
        <div className="row">
          <ThemeToggle />
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setMenu((v) => !v)} aria-label="Open account menu"><Avatar name={user?.name} /></button>
              <AnimatePresence>{menu && <MotionDiv className="dropdown" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Link to="/profile"><User size={16} /> Profile</Link>
                {!isStaff && <Link to="/applications"><FileText size={16} /> My Applications</Link>}
                {!isStaff && <Link to="/recommendations"><SlidersHorizontal size={16} /> Preferences</Link>}
                <button onClick={doLogout}><LogOut size={16} /> Logout</button>
              </MotionDiv>}</AnimatePresence>
            </div>
          ) : <div className="row hide-mobile"><Button as="a" variant="ghost" onClick={() => navigate('/login')}>Login</Button><Button onClick={() => navigate('/register')}>Register</Button></div>}
          <Button className="hide-desktop" variant="ghost" icon={open ? X : Menu} onClick={() => setOpen((v) => !v)} aria-label="Open navigation" />
        </div>
      </div>
      <AnimatePresence>{open && <MotionNav className="mobile-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{nav}</MotionNav>}</AnimatePresence>
    </header>
  )
}
