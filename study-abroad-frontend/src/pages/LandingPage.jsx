import { Link } from 'react-router-dom'
import { ChevronDown, Compass, GraduationCap, Sparkles, Star } from 'lucide-react'
import { motion as fm } from 'framer-motion'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'

const destinations = [['🇺🇸', 'USA', '140 universities', '$42k avg tuition'], ['🇬🇧', 'UK', '88 universities', '$34k avg tuition'], ['🇨🇦', 'Canada', '72 universities', '$27k avg tuition'], ['🇦🇺', 'Australia', '63 universities', '$31k avg tuition'], ['🇩🇪', 'Germany', '54 universities', '$12k avg tuition'], ['🇳🇱', 'Netherlands', '39 universities', '$18k avg tuition']]

export default function LandingPage() {
  const MotionDiv = fm.div
  return (
    <Layout footer>
      <section className="hero"><div className="stars" /><Card className="float-card float-one glass"><strong className="mono gold">500+</strong><p className="tiny">Universities mapped</p></Card><Card className="float-card float-two glass"><strong className="mono gold">95%</strong><p className="tiny">Success guidance</p></Card><Card className="float-card float-three glass"><strong className="mono gold">50+</strong><p className="tiny">Countries covered</p></Card>
        <MotionDiv className="hero-content" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}><h1>{'Your Journey\nBegins Here'}</h1><p>Discover universities, compare programs, and turn your study-abroad plan into a clear, trackable path under one polished roof.</p><div className="row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}><Link to="/universities"><Button icon={Compass} size="lg">Explore Universities</Button></Link><Link to="/recommendations"><Button icon={Sparkles} variant="secondary" size="lg">Get Recommendations</Button></Link></div></MotionDiv><ChevronDown className="scroll-indicator" /></section>
      <section className="stats-band"><div className="page grid grid-4"><StatCard icon={GraduationCap} label="Universities" value={500} /><StatCard icon={Compass} label="Countries" value={50} /><StatCard icon={Sparkles} label="Students" value={10000} /><StatCard icon={Star} label="Success Rate" value={95} /></div></section>
      <section className="page stack"><h2 className="section-title">How It Works</h2><div className="grid grid-3">{[['1', 'Share your goals'], ['2', 'Compare smart matches'], ['3', 'Track applications']].map(([n, t], i) => <Card key={n} glow style={{ animationDelay: `${i * 50}ms` }}><span className="empty-icon">{n}</span><h3>{t}</h3><p className="muted">A guided workflow keeps choices elegant, practical, and moving.</p></Card>)}</div></section>
      <section className="page stack"><h2 className="section-title">Popular Study Destinations</h2><div className="destinations">{destinations.map((d) => <Card key={d[1]} glow className="destination-card"><strong style={{ fontSize: '2rem' }}>{d[0]}</strong><h3>{d[1]}</h3><p className="muted">{d[2]} · {d[3]}</p></Card>)}</div></section>
      <section className="page grid grid-3">{['Maya Chen', 'Aarav Mehta', 'Sofia Grant'].map((name) => <Card key={name} className="quote-card" glow><span className="avatar">{name.split(' ').map((p) => p[0]).join('')}</span><p>“Study abroad changed my life. The platform made every next step feel calm and possible.”</p><strong>{name}</strong><p className="tiny">Admitted student · ★★★★★</p></Card>)}</section>
      <section className="page"><div className="cta-band row between" style={{ flexWrap: 'wrap' }}><div><h2 className="section-title" style={{ color: 'inherit' }}>Ready to chart your path?</h2><p>Start free and build your shortlist tonight.</p></div><Link to="/register"><Button variant="ghost">Get Started Free</Button></Link></div></section>
    </Layout>
  )
}
