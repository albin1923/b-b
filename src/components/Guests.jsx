'use client'

import { Users, Briefcase, Heart, Globe } from 'lucide-react'
import { useScrollReveal } from '../hooks/useAnimations'
import './Guests.css'

const guests = [
  {
    icon: Heart,
    title: 'Pilgrims',
    description: 'Gateway to Sabarimala and other sacred temples',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Users,
    title: 'Families',
    description: 'Perfect for family gatherings and celebrations',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Briefcase,
    title: 'Business',
    description: 'Ideal for corporate stays and meetings',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Globe,
    title: 'NRIs',
    description: 'A home away from home in Kerala',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
  },
]

export default function Guests() {
  const [sectionRef, sectionVisible] = useScrollReveal()

  return (
    <section className="guests section" ref={sectionRef}>
      <div className="container">
        <div className={`section-header ${sectionVisible ? 'reveal visible' : 'reveal'}`}>
          <span className="section-tag">Who We Serve</span>
          <h2 className="section-title" style={{ color: 'white' }}>
            Perfect For <span className="text-gradient">Everyone</span>
          </h2>
        </div>

        <div className={`guests-grid ${sectionVisible ? 'stagger-children visible' : 'stagger-children'}`}>
          {guests.map((guest, index) => (
            <div className="guest-card" key={index}>
              <div className="guest-image">
                <img src={guest.image} alt={guest.title} loading="lazy" />
              </div>
              <div className="guest-overlay"></div>
              <div className="guest-content">
                <div className="guest-icon">
                  <guest.icon size={24} />
                </div>
                <h3>{guest.title}</h3>
                <p>{guest.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
