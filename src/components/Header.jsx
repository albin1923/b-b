import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Mail } from 'lucide-react'
import './Header.css'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/attractions', label: 'Nearby' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* Top Contact Bar */}
      <div className={`top-bar ${scrolled || !isHomePage ? 'hidden' : ''}`}>
        <div className="container top-bar-content">
          <a href="tel:+914682341100" className="top-bar-item">
            <Phone size={14} />
            <span>+91 468 2341100</span>
          </a>
          <a href="mailto:contact@bandbkonni.com" className="top-bar-item">
            <Mail size={14} />
            <span>contact@bandbkonni.com</span>
          </a>
        </div>
      </div>

      <header className={`header ${scrolled || !isHomePage ? 'scrolled' : ''}`}>
        <nav className="nav container">
          <Link to="/" className="nav-logo">
            <div className="logo-text">
              <span className="logo-main">B&B</span>
              <span className="logo-sub">APARTMENTS</span>
            </div>
          </Link>

          <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.to} className="nav-item">
                <Link 
                  to={link.to} 
                  className={`nav-link ${location.pathname === link.to ? 'active' : ''}`} 
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link to="/contact" className="nav-cta">Book Now</Link>

          <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>
    </>
  )
}
