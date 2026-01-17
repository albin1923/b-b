import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight, Download, Building2, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import './Hero.css'

const slides = [
  {
    image: 'https://www.bandbkonni.com/images/wlcm-img.jpg',
    title: 'Fully Furnished & Semi Furnished',
    subtitle: 'Apartments',
    description: 'A modern building with 13000 Sq.ft area, designed with all modern finishes for commercial and residential purposes.'
  },
  {
    image: 'https://www.bandbkonni.com/images/nar-by1.jpg',
    title: 'Save The Wild Nature!',
    subtitle: 'Near By Attractions',
    description: 'Konni - an attractive tourist destination with Elephant cradle, Adavi Bowl boating & more.'
  },
  {
    image: 'https://www.bandbkonni.com/images/unit-1.jpg',
    title: 'Premium Comfort',
    subtitle: 'Modern Living',
    description: 'Experience modern amenities and traditional Kerala hospitality in our fully equipped apartments.'
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="hero" id="home">
      {/* Background Slides */}
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="hero-image"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="hero-overlay"></div>
          </div>
        ))}
      </div>

      {/* Slider Controls */}
      <button className="slider-btn slider-prev" onClick={prevSlide} aria-label="Previous slide">
        <ChevronLeft size={24} />
      </button>
      <button className="slider-btn slider-next" onClick={nextSlide} aria-label="Next slide">
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-badge">
          <MapPin size={14} />
          <span>Konni, Pathanamthitta, Kerala</span>
        </div>

        <p className="hero-subtitle">
          {slides[currentSlide].subtitle}
        </p>

        <h1 className="hero-title">
          {slides[currentSlide].title}
        </h1>

        <p className="hero-description">
          {slides[currentSlide].description}
        </p>

        <div className="hero-actions">
          <Link to="/rooms" className="btn btn-accent">
            <span>Explore Rooms</span>
            <ArrowRight size={16} />
          </Link>
          <a 
            href="https://www.bandbkonni.com/pdf/Brochure-B-n-B.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <Download size={16} />
            <span>Brochure</span>
          </a>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="hero-stats-bar">
        <div className="hero-stats">
          <div className="stat">
            <Building2 className="stat-icon" />
            <div>
              <span className="stat-number">13,000</span>
              <span className="stat-label">Sq.ft Area</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <Users className="stat-icon" />
            <div>
              <span className="stat-number">50+</span>
              <span className="stat-label">Guests</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <Star className="stat-icon" />
            <div>
              <span className="stat-number">7+</span>
              <span className="stat-label">Years</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
