import { MapPin, ArrowRight, Download, Building2, Users, Star } from 'lucide-react'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <img 
          src="https://www.bandbkonni.com/images/wlcm-img.jpg" 
          alt="B&B Apartments Building" 
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content container">
        <div className="hero-badge animate-fadeInUp">
          <MapPin size={16} />
          <span>Konni, Pathanamthitta, Kerala</span>
        </div>

        <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          Experience Kerala's
          <span className="hero-title-accent"> Finest Hospitality</span>
        </h1>

        <p className="hero-description animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          Fully furnished & semi-furnished apartments with 13,000 Sq.ft of modern luxury. 
          Your perfect gateway to Sabarimala and Kerala's most captivating destinations.
        </p>

        <div className="hero-actions animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <a href="#rooms" className="btn btn-accent">
            <span>Explore Rooms</span>
            <ArrowRight size={18} />
          </a>
          <a 
            href="https://www.bandbkonni.com/pdf/Brochure-B-n-B.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <Download size={18} />
            <span>Brochure</span>
          </a>
        </div>

        <div className="hero-stats animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <div className="stat">
            <Building2 size={24} className="stat-icon" />
            <div>
              <span className="stat-number">13,000</span>
              <span className="stat-label">Sq.ft Area</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <Users size={24} className="stat-icon" />
            <div>
              <span className="stat-number">50+</span>
              <span className="stat-label">Guest Capacity</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <Star size={24} className="stat-icon" />
            <div>
              <span className="stat-number">7+</span>
              <span className="stat-label">Years Excellence</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </div>
    </section>
  )
}
