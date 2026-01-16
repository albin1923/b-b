import { MapPin, Phone, Mail } from 'lucide-react'
import './Footer.css'

const quickLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About Us' },
  { href: '#rooms', label: 'Rooms' },
  { href: '#facilities', label: 'Facilities' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#home" className="footer-logo">
              <img 
                src="https://www.bandbkonni.com/images/ftr-lgo.jpg" 
                alt="B&B Apartments" 
                className="footer-logo-img"
              />
            </a>
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
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links">
            <h4>Our Services</h4>
            <ul>
              <li><a href="#rooms">1 BHK Apartments</a></li>
              <li><a href="#rooms">2 BHK Apartments</a></li>
              <li><a href="#rooms">Conference Hall</a></li>
              <li><a href="#facilities">Group Bookings</a></li>
              <li><a href="#attractions">Tour Assistance</a></li>
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
            <a href="#">B&B Group</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
