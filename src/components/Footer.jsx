import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import './Footer.css'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img 
                src="https://www.bandbkonni.com/images/ftr-lgo.jpg" 
                alt="B&B Apartments" 
                className="footer-logo-img"
              />
            </Link>
            <p>
              Experience the best of Kerala hospitality at B&B Apartments. 
              Your home away from home in the heart of Konni.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/bnbkonni" target="_blank" rel="noopener noreferrer">
                <img src="https://www.bandbkonni.com/images/fb-lgo.jpg" alt="Facebook" />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links">
            <h4>Our Services</h4>
            <ul>
              <li><Link to="/rooms">1 BHK Apartments</Link></li>
              <li><Link to="/rooms">2 BHK Apartments</Link></li>
              <li><Link to="/rooms">Conference Hall</Link></li>
              <li><Link to="/facilities">Group Bookings</Link></li>
              <li><Link to="/attractions">Tour Assistance</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Info</h4>
            <ul>
              <li>
                <MapPin size={18} />
                <span>B&B Tower, Konni P.O,<br/>Pathanamthitta, Kerala - 689691</span>
              </li>
              <li>
                <Phone size={18} />
                <a href="tel:+918289880005">+91 82898 80005</a>
              </li>
              <li>
                <Mail size={18} />
                <a href="mailto:bandbkonni@gmail.com">bandbkonni@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} B&B Apartments. All rights reserved.</p>
          <div className="footer-badges">
            <span>Part of</span>
            <Link to="/">B&B Group</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
