import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children, footer = false }) {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="layout-main">
        <main className="content">{children}</main>
      </div>
      {footer && <Footer />}
    </div>
  )
}
