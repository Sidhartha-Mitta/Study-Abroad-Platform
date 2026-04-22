export default function WelcomeBanner({ user }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  return <section className="cta-band"><h1 className="section-title" style={{ color: 'inherit' }}>{greeting}, {user?.name || 'Explorer'}</h1><p>Here's your study abroad overview.</p></section>
}
