import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return <Layout><main className="hero" style={{ minHeight: 'calc(100vh - 4.5rem)' }}><div className="stars" /><div className="hero-content"><h1 className="gold">404</h1><h2 className="section-title">Page not found</h2><p>The route you followed has drifted out of orbit.</p><Link to="/"><Button style={{ marginTop: '1rem' }}>Go Home</Button></Link></div></main></Layout>
}
