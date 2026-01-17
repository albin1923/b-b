import { Link } from 'react-router-dom'
import { Home, ShieldCheck, Leaf, MapPin, ArrowRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useAnimations'
import './About.css'

const features = [
  { icon: Home, title: 'Home-like Comfort', desc: 'Fully equipped kitchens & living spaces' },
  { icon: ShieldCheck, title: '24/7 Security', desc: 'Round the clock safety & assistance' },
  { icon: Leaf, title: 'Eco-Friendly', desc: 'Solar energy & rainwater harvesting' },
  { icon: MapPin, title: 'Prime Location', desc: 'Gateway to pilgrim & tourist spots' },
]

export default function About() {
  const [sectionRef, isVisible] = useScrollReveal(0.1)

  return (
    <section className="about section" id="about" ref={sectionRef}>
      <div className="container">
        <div className={`about-grid ${isVisible ? 'visible' : ''}`}>
          <div className="about-images reveal-left">
            <div className="about-img-main">
              <img 
                src="https://www.bandbkonni.com/images/unit-1.jpg" 
                alt="B&B Apartments Interior"
                loading="lazy"
              />
              <div className="about-experience">
                <span className="exp-number">7+</span>
                <span className="exp-text">Years of<br/>Excellence</span>
              </div>
            </div>
            <div className="about-img-secondary">
              <img 
                src="https://www.bandbkonni.com/images/unit-2.jpg" 
                alt="B&B Apartments Room"
                loading="lazy"
              />
            </div>
            <div className="about-decoration"></div>
          </div>

          <div className="about-content reveal-right">
            <span className="section-tag">Welcome to B&B</span>
            <h2 className="section-title">
              A Modern Haven in <span className="text-gradient">God's Own Country</span>
            </h2>

            <p className="about-text">
              B & B Tower and B & B Apartments is a modern building with an area of 13000 Sq.ft, 
              for both commercial and residential purposes. It is designed and built with all modern finishes 
              and includes basement parking, apartment reception, mini conference hall, roof top garden.
            </p>

            <p className="about-text">
              We offer fully furnished and semi furnished accommodation with kitchen facilities 
              on daily and monthly basis for tourists, visitors, business persons, and pilgrims to Kerala.
            </p>

            <div className="about-features stagger-children">
              {features.map((feature, index) => (
                <div className="feature" key={index}>
                  <div className="feature-icon">
                    <feature.icon size={22} />
                  </div>
                  <div className="feature-text">
                    <h4>{feature.title}</h4>
                    <p>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/facilities" className="btn btn-primary">
              <span>Discover More</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
