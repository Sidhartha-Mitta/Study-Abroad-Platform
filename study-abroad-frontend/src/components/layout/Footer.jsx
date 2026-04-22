import { CircleUserRound, Globe2, MessageCircle, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="stats-band">
      <div className="page grid grid-3">
        <div><Link to="/" className="logo"><Globe2 className="gold" /> StudyAbroad</Link><p className="muted">A quieter, smarter way to find your international path.</p></div>
        <div className="stack"><strong>Quick links</strong><Link to="/universities">Universities</Link><Link to="/programs">Programs</Link><Link to="/recommendations">Recommendations</Link></div>
        <div className="stack"><strong>Social</strong><div className="row"><Share2 /><MessageCircle /><CircleUserRound /></div></div>
      </div>
      <p className="tiny" style={{ textAlign: 'center' }}>© {new Date().getFullYear()} StudyAbroad. All rights reserved.</p>
    </footer>
  )
}
